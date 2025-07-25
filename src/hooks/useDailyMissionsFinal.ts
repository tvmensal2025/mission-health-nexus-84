import { useState, useEffect, useCallback } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { dailyQuestionsFinal } from '@/data/daily-questions-final';
import { calculateWaterIntake, calculateSleepHours } from '@/data/daily-questions-final';
import { DailyQuestion, DailyResponse, DailyMissionSession } from '@/types/daily-missions';

interface UseDailyMissionsFinalProps {
  user: User | null;
}

export const useDailyMissionsFinal = ({ user }: UseDailyMissionsFinalProps) => {
  const [answers, setAnswers] = useState<Record<string, string | number>>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [session, setSession] = useState<DailyMissionSession | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);

  const allQuestions = dailyQuestionsFinal.sort((a, b) => a.order - b.order);
  const currentQuestion = allQuestions[currentQuestionIndex];
  const progress = (currentQuestionIndex / allQuestions.length) * 100;

  // Carregar sessão existente
  useEffect(() => {
    if (!user) return;

    const loadSession = async () => {
      const today = new Date().toISOString().split('T')[0];
      
      const { data, error } = await supabase
        .from('daily_mission_sessions')
        .select('*')
        .eq('user_id', user.id)
        .eq('date', today)
        .single();

      if (data && !error) {
        setSession({
          ...data,
          completed_sections: data.completed_sections as any[]
        });
        setIsCompleted(data.is_completed);
        
        // Carregar respostas existentes
        const { data: responses } = await supabase
          .from('daily_responses')
          .select('*')
          .eq('user_id', user.id)
          .eq('date', today);

        if (responses) {
          const answersMap: Record<string, string | number> = {};
          responses.forEach(response => {
            answersMap[response.question_id] = response.answer;
          });
          setAnswers(answersMap);
        }
      }
    };

    loadSession();
  }, [user]);

  // Salvar resposta individual
  const saveAnswer = useCallback(async (questionId: string, answer: string | number) => {
    if (!user) return;

    setIsLoading(true);
    const today = new Date().toISOString().split('T')[0];
    const question = allQuestions.find(q => q.id === questionId);
    
    if (!question) {
      setIsLoading(false);
      return;
    }

    try {
      // Salvar resposta
      const { error: responseError } = await supabase
        .from('daily_responses')
        .upsert({
          user_id: user.id,
          date: today,
          section: question.section,
          question_id: questionId,
          answer: answer.toString(),
          points_earned: question.points,
          created_at: new Date().toISOString()
        });

      if (responseError) throw responseError;

      // Salvar dados de tracking específicos
      if (question.tracking) {
        await saveTrackingData(question.tracking, answer);
      }

      console.log(`Resposta salva: ${questionId} = ${answer}`);
    } catch (error) {
      console.error('Erro ao salvar resposta:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user, allQuestions]);

  // Salvar dados de tracking específicos
  const saveTrackingData = async (trackingType: string, answer: string | number) => {
    if (!user) return;

    const today = new Date().toISOString().split('T')[0];
    
    try {
      switch (trackingType) {
        case 'water_intake':
          const waterAmount = calculateWaterIntake(answer.toString());
          await supabase
            .from('water_tracking')
            .upsert({
              user_id: user.id,
              date: today,
              amount_ml: waterAmount,
              source: 'daily_mission',
              created_at: new Date().toISOString()
            });
          break;

        case 'sleep_hours':
          const sleepHours = calculateSleepHours(answer.toString());
          await supabase
            .from('sleep_tracking')
            .upsert({
              user_id: user.id,
              date: today,
              hours: sleepHours,
              source: 'daily_mission',
              created_at: new Date().toISOString()
            });
          break;

        case 'energy_level':
        case 'stress_level':
        case 'day_rating':
          await supabase
            .from('mood_tracking')
            .upsert({
              user_id: user.id,
              date: today,
              [trackingType]: answer as number,
              source: 'daily_mission',
              created_at: new Date().toISOString()
            });
          break;

        case 'small_victory':
          // Salvar em health_diary como reflexão
          await supabase
            .from('health_diary')
            .upsert({
              user_id: user.id,
              date: today,
              notes: answer.toString(),
              mood_score: 5, // Valor padrão positivo
              created_at: new Date().toISOString()
            });
          break;
      }
    } catch (error) {
      console.error(`Erro ao salvar tracking ${trackingType}:`, error);
    }
  };

  // Completar missão
  const completeMission = useCallback(async () => {
    if (!user) return;

    setIsLoading(true);
    const today = new Date().toISOString().split('T')[0];
    const totalPoints = allQuestions.reduce((sum, q) => {
      return answers[q.id] !== undefined ? sum + q.points : sum;
    }, 0);

    try {
      // Atualizar sessão
      const { error: sessionError } = await supabase
        .from('daily_mission_sessions')
        .upsert({
          user_id: user.id,
          date: today,
          completed_sections: ['morning', 'habits', 'mindset'],
          total_points: totalPoints,
          is_completed: true,
          updated_at: new Date().toISOString()
        });

      if (sessionError) throw sessionError;

      setIsCompleted(true);
      console.log('Missão completa!', { totalPoints, answers });
    } catch (error) {
      console.error('Erro ao completar missão:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user, answers, allQuestions]);

  // Handlers para diferentes tipos de resposta
  const handleAnswer = useCallback(async (answer: string | number) => {
    setAnswers(prev => ({ ...prev, [currentQuestion.id]: answer }));
    
    // Salvar resposta
    await saveAnswer(currentQuestion.id, answer);
    
    // Avançar para próxima pergunta
    if (currentQuestionIndex < allQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // Última pergunta - completar missão
      await completeMission();
    }
  }, [currentQuestion, currentQuestionIndex, allQuestions.length, saveAnswer, completeMission]);

  const handleScaleAnswer = useCallback((value: number) => {
    handleAnswer(value);
  }, [handleAnswer]);

  const handleMultipleChoice = useCallback((option: string) => {
    handleAnswer(option);
  }, [handleAnswer]);

  const handleYesNo = useCallback((answer: boolean) => {
    handleAnswer(answer ? 'Sim' : 'Não');
  }, [handleAnswer]);

  const handleTextInput = useCallback((text: string) => {
    handleAnswer(text);
  }, [handleAnswer]);

  const handleStarRating = useCallback((rating: number) => {
    handleAnswer(rating);
  }, [handleAnswer]);

  return {
    currentQuestion,
    currentQuestionIndex,
    progress,
    answers,
    isLoading,
    isCompleted,
    session,
    handleScaleAnswer,
    handleMultipleChoice,
    handleYesNo,
    handleTextInput,
    handleStarRating,
    allQuestions
  };
}; 