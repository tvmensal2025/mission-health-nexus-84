import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Trophy, Users, Calendar, Target, Dumbbell, 
  Droplets, Brain, Apple, Moon, Scale, Timer
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Challenge {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  duration_days: number;
  points_reward: number;
  badge_icon: string;
  badge_name: string;
  instructions: string;
  tips: string[];
  is_active: boolean;
  is_featured: boolean;
  is_group_challenge: boolean;
}

const ChallengesPage: React.FC = () => {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    fetchUser();
    fetchChallenges();
  }, []);

  const fetchUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
  };

  const fetchChallenges = async () => {
    try {
      const { data, error } = await supabase
        .from('challenges')
        .select('*')
        .eq('is_active', true)
        .order('points_reward', { ascending: false });

      if (error) throw error;
      setChallenges(data || []);
    } catch (error) {
      console.error('Erro ao carregar desafios:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os desafios",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'jejum': return <Timer className="h-5 w-5" />;
      case 'exercicio': return <Dumbbell className="h-5 w-5" />;
      case 'hidratacao': return <Droplets className="h-5 w-5" />;
      case 'mindfulness': return <Brain className="h-5 w-5" />;
      case 'nutricao': return <Apple className="h-5 w-5" />;
      case 'sono': return <Moon className="h-5 w-5" />;
      case 'medicao': return <Scale className="h-5 w-5" />;
      default: return <Target className="h-5 w-5" />;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'facil': return 'bg-green-100 text-green-800';
      case 'medio': return 'bg-yellow-100 text-yellow-800';
      case 'dificil': return 'bg-orange-100 text-orange-800';
      case 'extremo': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleChallengeClick = (challengeId: string) => {
    navigate(`/challenges/${challengeId}`);
  };

  const joinChallenge = async (challengeId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!user) {
      toast({
        title: "Login necessário",
        description: "Faça login para participar dos desafios",
        variant: "destructive"
      });
      navigate('/auth');
      return;
    }

    try {
      const { error } = await supabase
        .from('challenge_participations')
        .insert({
          challenge_id: challengeId,
          user_id: user.id
        });

      if (error) {
        if (error.code === '23505') { // Unique constraint violation
          toast({
            title: "Já participando",
            description: "Você já está participando deste desafio!",
            variant: "destructive"
          });
          return;
        }
        throw error;
      }

      toast({
        title: "Parabéns! 🎉",
        description: "Você se inscreveu no desafio!",
      });

      // Navegar para a página de detalhes
      navigate(`/challenges/${challengeId}`);
    } catch (error) {
      console.error('Erro ao entrar no desafio:', error);
      toast({
        title: "Erro",
        description: "Não foi possível entrar no desafio",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="container py-6">
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Carregando desafios...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-6">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Desafios de Saúde</h1>
        <p className="text-xl text-muted-foreground">
          Participe de desafios para melhorar sua saúde e ganhar recompensas
        </p>
      </div>
      
      {challenges.length === 0 ? (
        <div className="text-center py-12">
          <Trophy className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">Nenhum desafio disponível</h3>
          <p className="text-muted-foreground">Novos desafios serão adicionados em breve!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {challenges.map((challenge) => (
            <Card 
              key={challenge.id} 
              className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105"
              onClick={() => handleChallengeClick(challenge.id)}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getCategoryIcon(challenge.category)}
                    <div>
                      <CardTitle className="text-lg">{challenge.title}</CardTitle>
                      <Badge className={getDifficultyColor(challenge.difficulty)}>
                        {challenge.difficulty.charAt(0).toUpperCase() + challenge.difficulty.slice(1)}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-2xl">{challenge.badge_icon}</div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <CardDescription className="text-sm">
                  {challenge.description}
                </CardDescription>
                
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {challenge.duration_days} dias
                  </div>
                  <div className="flex items-center gap-1">
                    <Trophy className="h-4 w-4" />
                    {challenge.points_reward} pts
                  </div>
                </div>

                <Button 
                  className="w-full" 
                  onClick={(e) => joinChallenge(challenge.id, e)}
                >
                  Participar do Desafio
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChallengesPage;