import React, { useState } from 'react';
import { User } from '@supabase/supabase-js';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Trophy, Star } from 'lucide-react';
import { dailyQuestionsSimple, getQuestionsBySectionSimple, getSectionTitleSimple } from '@/data/daily-questions-simple';
import { DailyQuestion } from '@/types/daily-missions';

interface DailyMissionsSimpleProps {
  user: User | null;
}

export const DailyMissionsSimple: React.FC<DailyMissionsSimpleProps> = ({ user }) => {
  const [answers, setAnswers] = useState<Record<string, string | number>>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const allQuestions = dailyQuestionsSimple.sort((a, b) => a.order - b.order);
  const currentQuestion = allQuestions[currentQuestionIndex];
  const progress = (currentQuestionIndex / allQuestions.length) * 100;
  const isCompleted = currentQuestionIndex >= allQuestions.length;

  const handleAnswer = (answer: string | number) => {
    setAnswers(prev => ({ ...prev, [currentQuestion.id]: answer }));
    
    if (currentQuestionIndex < allQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // Missão completa
      console.log('Missão completa!', answers);
    }
  };

  const handleScaleAnswer = (value: number) => {
    handleAnswer(value);
  };

  const handleMultipleChoice = (option: string) => {
    handleAnswer(option);
  };

  const handleYesNo = (answer: boolean) => {
    handleAnswer(answer ? 'Sim' : 'Não');
  };

  const renderQuestion = (question: DailyQuestion) => {
    switch (question.type) {
      case 'scale':
        return (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground mb-4">
              {question.scale?.labels.map((label, index) => (
                <div key={index} className="flex items-center gap-3 mb-2">
                  <Button
                    variant={answers[question.id] === index + 1 ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleScaleAnswer(index + 1)}
                    className="w-8 h-8 p-0"
                  >
                    {index + 1}
                  </Button>
                  <span className="text-sm">{label}</span>
                </div>
              ))}
            </p>
          </div>
        );

      case 'multiple_choice':
        return (
          <div className="space-y-3">
            {question.options?.map((option, index) => (
              <Button
                key={index}
                variant={answers[question.id] === option ? "default" : "outline"}
                className="w-full justify-start text-left h-auto py-3 px-4"
                onClick={() => handleMultipleChoice(option)}
              >
                {answers[question.id] === option && <CheckCircle className="mr-2 h-4 w-4" />}
                {option}
              </Button>
            ))}
          </div>
        );

      case 'yes_no':
        return (
          <div className="flex gap-3">
            <Button
              variant={answers[question.id] === 'Sim' ? "default" : "outline"}
              className="flex-1"
              onClick={() => handleYesNo(true)}
            >
              {answers[question.id] === 'Sim' && <CheckCircle className="mr-2 h-4 w-4" />}
              Sim
            </Button>
            <Button
              variant={answers[question.id] === 'Não' ? "default" : "outline"}
              className="flex-1"
              onClick={() => handleYesNo(false)}
            >
              {answers[question.id] === 'Não' && <CheckCircle className="mr-2 h-4 w-4" />}
              Não
            </Button>
          </div>
        );

      default:
        return null;
    }
  };

  if (isCompleted) {
    const totalPoints = allQuestions.reduce((sum, q) => {
      return answers[q.id] !== undefined ? sum + q.points : sum;
    }, 0);

    return (
      <div className="p-6 max-w-2xl mx-auto">
        <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
          <CardContent className="p-8 text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Trophy className="h-12 w-12 text-yellow-500" />
              <h2 className="text-3xl font-bold text-green-800">Missão Completa!</h2>
              <Trophy className="h-12 w-12 text-yellow-500" />
            </div>
            
            <p className="text-xl text-green-700 mb-6">
              Parabéns! Você completou todas as reflexões de hoje.
            </p>
            
            <div className="bg-white rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold mb-4">Resumo das Respostas:</h3>
              <div className="space-y-2 text-left">
                {allQuestions.map((question) => (
                  <div key={question.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <span className="text-sm">{question.question}</span>
                    <Badge variant="secondary">
                      {answers[question.id] || 'Não respondido'}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex items-center justify-center gap-2 text-2xl font-bold text-yellow-600">
              <Star className="h-8 w-8" />
              <span>{totalPoints} pontos ganhos!</span>
              <Star className="h-8 w-8" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Missão do Dia</h1>
        <p className="text-muted-foreground">
          Pergunta {currentQuestionIndex + 1} de {allQuestions.length}
        </p>
        
        <div className="mt-4">
          <Progress value={progress} className="h-2" />
        </div>
      </div>

      {/* Question Card */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              {getSectionTitleSimple(currentQuestion.section)}
            </Badge>
            <span className="flex items-center gap-1 text-yellow-600">
              <Trophy className="h-4 w-4" />
              <span className="text-sm">{currentQuestion.points} pts</span>
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <h2 className="text-xl font-semibold mb-6">{currentQuestion.question}</h2>
          {renderQuestion(currentQuestion)}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
          disabled={currentQuestionIndex === 0}
        >
          Anterior
        </Button>
        
        <div className="text-sm text-muted-foreground">
          {currentQuestionIndex + 1} / {allQuestions.length}
        </div>
      </div>
    </div>
  );
}; 