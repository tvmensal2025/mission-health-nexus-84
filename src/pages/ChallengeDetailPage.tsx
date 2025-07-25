import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Award, Calendar, Users, ArrowLeft, Trophy, CheckCircle2, 
  Clock, Info, MessageCircle, BarChart3, Camera, Upload,
  Dumbbell, Droplets, Brain, Apple, Moon, Scale, Star
} from 'lucide-react';
import Layout from '@/components/Layout';
import { useUserProfile } from '@/hooks/useUserProfile';

// Tipos de dados
interface ChallengeDetail {
  id: string;
  title: string;
  description: string;
  category: 'jejum' | 'exercicio' | 'hidratacao' | 'mindfulness' | 'nutricao' | 'sono' | 'medicao' | 'especial';
  difficulty: 'facil' | 'medio' | 'dificil' | 'extremo';
  duration_days: number;
  points_reward: number;
  badge_icon: string;
  badge_name: string;
  instructions: string;
  tips: string[];
  participants: number;
  start_date?: string;
  end_date?: string;
  is_active: boolean;
  is_featured: boolean;
  is_group_challenge: boolean;
  daily_log_type: 'boolean' | 'hours' | 'quantity' | 'photo' | 'text';
  daily_log_unit?: string;
  daily_log_target?: number;
}

interface ChallengeParticipation {
  id: string;
  challenge_id: string;
  user_id: string;
  start_date: string;
  end_date: string;
  is_completed: boolean;
  progress: number;
  current_streak: number;
  total_points_earned: number;
  completion_date?: string;
}

interface DailyLog {
  id: string;
  date: string;
  is_completed: boolean;
  value_logged?: number;
  notes?: string;
  photo_url?: string;
  points_earned: number;
}

interface GroupMember {
  id: string;
  user_id: string;
  name: string;
  avatar_url?: string;
  joined_at: string;
  progress: number;
}

interface GroupMessage {
  id: string;
  user_id: string;
  name: string;
  avatar_url?: string;
  message: string;
  created_at: string;
}

const ChallengeDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useUserProfile();
  const [activeTab, setActiveTab] = useState<string>('detalhes');
  const [logValue, setLogValue] = useState<string>('');
  const [logNotes, setLogNotes] = useState<string>('');
  const [chatMessage, setChatMessage] = useState<string>('');

  // Dados de exemplo
  const challenge: ChallengeDetail = {
    id: '1',
    title: 'Jejum 16:8 por 7 dias',
    description: '16h de jejum, 8h de alimentação por 7 dias consecutivos',
    category: 'jejum',
    difficulty: 'medio',
    duration_days: 7,
    points_reward: 200,
    badge_icon: '🕗',
    badge_name: 'Mestre do Jejum 16:8',
    instructions: 'Mantenha um jejum de 16 horas e concentre sua alimentação em uma janela de 8 horas. Registre diariamente seus horários de início e fim do jejum.',
    tips: [
      'Comece seu jejum após o jantar, por volta das 20h',
      'Beba bastante água durante o período de jejum',
      'Quebre o jejum com uma refeição leve',
      'Evite alimentos processados na janela de alimentação',
      'Monitore como se sente e ajuste conforme necessário'
    ],
    participants: 128,
    is_active: true,
    is_featured: true,
    is_group_challenge: false,
    daily_log_type: 'hours',
    daily_log_unit: 'horas',
    daily_log_target: 16
  };

  const participation: ChallengeParticipation = {
    id: 'p1',
    challenge_id: '1',
    user_id: 'u1',
    start_date: '2023-07-15',
    end_date: '2023-07-22',
    is_completed: false,
    progress: 42,
    current_streak: 3,
    total_points_earned: 90,
  };

  const dailyLogs: DailyLog[] = [
    {
      id: 'log1',
      date: '2023-07-15',
      is_completed: true,
      value_logged: 16,
      notes: 'Foi mais fácil do que esperava',
      points_earned: 30
    },
    {
      id: 'log2',
      date: '2023-07-16',
      is_completed: true,
      value_logged: 16.5,
      notes: 'Senti um pouco de fome pela manhã',
      points_earned: 30
    },
    {
      id: 'log3',
      date: '2023-07-17',
      is_completed: true,
      value_logged: 15.5,
      notes: 'Tive que encurtar um pouco hoje',
      points_earned: 30
    },
    {
      id: 'log4',
      date: new Date().toISOString().split('T')[0],
      is_completed: false,
      points_earned: 0
    }
  ];

  const groupMembers: GroupMember[] = challenge.is_group_challenge ? [
    {
      id: 'm1',
      user_id: 'u1',
      name: 'João Silva',
      avatar_url: 'https://i.pravatar.cc/150?img=1',
      joined_at: '2023-07-14',
      progress: 42
    },
    {
      id: 'm2',
      user_id: 'u2',
      name: 'Maria Oliveira',
      avatar_url: 'https://i.pravatar.cc/150?img=5',
      joined_at: '2023-07-14',
      progress: 57
    },
    {
      id: 'm3',
      user_id: 'u3',
      name: 'Pedro Santos',
      avatar_url: 'https://i.pravatar.cc/150?img=3',
      joined_at: '2023-07-15',
      progress: 28
    }
  ] : [];

  const groupMessages: GroupMessage[] = challenge.is_group_challenge ? [
    {
      id: 'msg1',
      user_id: 'u2',
      name: 'Maria Oliveira',
      avatar_url: 'https://i.pravatar.cc/150?img=5',
      message: 'Estou achando esse desafio mais fácil do que imaginava!',
      created_at: '2023-07-16T10:30:00Z'
    },
    {
      id: 'msg2',
      user_id: 'u3',
      name: 'Pedro Santos',
      avatar_url: 'https://i.pravatar.cc/150?img=3',
      message: 'Eu estou tendo dificuldade nos fins de semana. Alguma dica?',
      created_at: '2023-07-16T14:45:00Z'
    },
    {
      id: 'msg3',
      user_id: 'u1',
      name: 'João Silva',
      avatar_url: 'https://i.pravatar.cc/150?img=1',
      message: 'Tento ocupar minha mente com outras atividades quando sinto fome!',
      created_at: '2023-07-16T15:10:00Z'
    }
  ] : [];

  // Função para renderizar o ícone da categoria
  const getCategoryIcon = (category: ChallengeDetail['category']) => {
    switch (category) {
      case 'jejum': return <Calendar className="h-6 w-6 text-orange-500" />;
      case 'exercicio': return <Dumbbell className="h-6 w-6 text-green-500" />;
      case 'hidratacao': return <Droplets className="h-6 w-6 text-blue-500" />;
      case 'mindfulness': return <Brain className="h-6 w-6 text-purple-500" />;
      case 'nutricao': return <Apple className="h-6 w-6 text-red-500" />;
      case 'sono': return <Moon className="h-6 w-6 text-indigo-500" />;
      case 'medicao': return <Scale className="h-6 w-6 text-gray-500" />;
      case 'especial': return <Star className="h-6 w-6 text-yellow-500" />;
      default: return <Award className="h-6 w-6" />;
    }
  };

  // Função para renderizar o badge de dificuldade
  const getDifficultyBadge = (difficulty: ChallengeDetail['difficulty']) => {
    switch (difficulty) {
      case 'facil':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Fácil</Badge>;
      case 'medio':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Médio</Badge>;
      case 'dificil':
        return <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">Difícil</Badge>;
      case 'extremo':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Extremo</Badge>;
      default:
        return <Badge variant="outline">Desconhecido</Badge>;
    }
  };

  // Função para lidar com o registro diário
  const handleLogSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aqui você implementaria a lógica para salvar o registro diário
    console.log('Registrando:', { value: logValue, notes: logNotes });
    
    // Reset dos campos
    setLogValue('');
    setLogNotes('');
  };

  // Função para enviar mensagem no chat
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    // Aqui você implementaria a lógica para enviar a mensagem
    console.log('Enviando mensagem:', chatMessage);
    
    // Reset do campo
    setChatMessage('');
  };

  return (
    <Layout>
      <div className="container py-6">
        <Button 
          variant="ghost" 
          className="mb-6 flex items-center gap-2"
          onClick={() => navigate('/challenges')}
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar para Desafios
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Coluna Principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Cabeçalho do Desafio */}
            <Card>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    {getCategoryIcon(challenge.category)}
                    <div>
                      <CardTitle className="text-2xl">{challenge.title}</CardTitle>
                      <CardDescription>{challenge.description}</CardDescription>
                    </div>
                  </div>
                  <div className="text-4xl">{challenge.badge_icon}</div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 mb-4">
                  {getDifficultyBadge(challenge.difficulty)}
                  <Badge variant="outline" className="bg-gray-50">
                    <Calendar className="mr-1 h-3 w-3" /> {challenge.duration_days} dias
                  </Badge>
                  <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                    <Trophy className="mr-1 h-3 w-3" /> {challenge.points_reward} pts
                  </Badge>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    <Users className="mr-1 h-3 w-3" /> {challenge.participants} participantes
                  </Badge>
                </div>

                {participation && (
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span>Seu progresso</span>
                      <span className="font-medium">{participation.progress}%</span>
                    </div>
                    <Progress value={participation.progress} className="h-2" />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Dia {participation.current_streak} de {challenge.duration_days}</span>
                      <span>{participation.total_points_earned} pts ganhos</span>
                    </div>
                  </div>
                )}
              </CardContent>
              {!participation && (
                <CardFooter>
                  <Button className="w-full">Participar deste Desafio</Button>
                </CardFooter>
              )}
            </Card>

            {/* Abas de Conteúdo */}
            <Tabs defaultValue="detalhes" className="space-y-4" onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="detalhes">Detalhes</TabsTrigger>
                <TabsTrigger value="progresso">Seu Progresso</TabsTrigger>
                {challenge.is_group_challenge && (
                  <TabsTrigger value="grupo">Grupo</TabsTrigger>
                )}
              </TabsList>
              
              <TabsContent value="detalhes" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Info className="h-5 w-5" />
                      Instruções
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">{challenge.instructions}</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5" />
                      Dicas para Sucesso
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {challenge.tips.map((tip, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" />
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Trophy className="h-5 w-5" />
                      Recompensa
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                      <div className="text-4xl">{challenge.badge_icon}</div>
                      <div>
                        <h3 className="font-semibold text-lg">{challenge.badge_name}</h3>
                        <p className="text-sm text-muted-foreground">
                          Badge exclusivo + {challenge.points_reward} pontos
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="progresso" className="space-y-4">
                {participation ? (
                  <>
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Clock className="h-5 w-5" />
                          Registro de Hoje
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <form onSubmit={handleLogSubmit} className="space-y-4">
                          {challenge.daily_log_type === 'hours' && (
                            <div className="space-y-2">
                              <label className="text-sm font-medium">
                                Quantas horas você jejuou hoje?
                              </label>
                              <div className="flex items-center gap-2">
                                <Input
                                  type="number"
                                  placeholder="16"
                                  value={logValue}
                                  onChange={(e) => setLogValue(e.target.value)}
                                  className="max-w-[100px]"
                                  min="0"
                                  step="0.5"
                                  required
                                />
                                <span className="text-sm text-muted-foreground">
                                  {challenge.daily_log_unit}
                                </span>
                              </div>
                            </div>
                          )}

                          <div className="space-y-2">
                            <label className="text-sm font-medium">
                              Notas (opcional)
                            </label>
                            <Textarea
                              placeholder="Como foi sua experiência hoje?"
                              value={logNotes}
                              onChange={(e) => setLogNotes(e.target.value)}
                              className="min-h-[100px]"
                            />
                          </div>

                          <Button type="submit" className="w-full">
                            Registrar Progresso de Hoje
                          </Button>
                        </form>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <BarChart3 className="h-5 w-5" />
                          Histórico
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {dailyLogs.map((log) => (
                            <div 
                              key={log.id}
                              className={`p-3 rounded-lg border ${
                                log.is_completed 
                                  ? 'bg-green-50 border-green-200' 
                                  : 'bg-gray-50 border-gray-200'
                              }`}
                            >
                              <div className="flex justify-between items-center mb-2">
                                <div className="flex items-center gap-2">
                                  {log.is_completed ? (
                                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                                  ) : (
                                    <Clock className="h-4 w-4 text-gray-400" />
                                  )}
                                  <span className="font-medium">
                                    {new Date(log.date).toLocaleDateString('pt-BR')}
                                  </span>
                                </div>
                                {log.is_completed && (
                                  <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                                    +{log.points_earned} pts
                                  </Badge>
                                )}
                              </div>
                              
                              {log.is_completed && (
                                <>
                                  {log.value_logged !== undefined && (
                                    <div className="text-sm mb-1">
                                      <span className="font-medium">{log.value_logged}</span> {challenge.daily_log_unit}
                                    </div>
                                  )}
                                  {log.notes && (
                                    <div className="text-sm text-muted-foreground">
                                      "{log.notes}"
                                    </div>
                                  )}
                                </>
                              )}
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </>
                ) : (
                  <div className="text-center py-12">
                    <Award className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">Você ainda não está participando</h3>
                    <p className="text-muted-foreground mb-4">
                      Participe deste desafio para registrar seu progresso diário.
                    </p>
                    <Button>
                      Participar Agora
                    </Button>
                  </div>
                )}
              </TabsContent>
              
              {challenge.is_group_challenge && (
                <TabsContent value="grupo" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        Membros do Grupo
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {groupMembers.map((member) => (
                          <div key={member.id} className="flex items-center justify-between p-2 rounded-lg border">
                            <div className="flex items-center gap-3">
                              <Avatar>
                                <AvatarImage src={member.avatar_url} alt={member.name} />
                                <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <span>{member.name}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Progress value={member.progress} className="w-24 h-2" />
                              <span className="text-xs text-muted-foreground">{member.progress}%</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <MessageCircle className="h-5 w-5" />
                        Chat do Grupo
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4 mb-4 max-h-[300px] overflow-y-auto">
                        {groupMessages.map((msg) => (
                          <div key={msg.id} className="flex gap-3">
                            <Avatar>
                              <AvatarImage src={msg.avatar_url} alt={msg.name} />
                              <AvatarFallback>{msg.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-medium">{msg.name}</span>
                                <span className="text-xs text-muted-foreground">
                                  {new Date(msg.created_at).toLocaleTimeString('pt-BR', {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </span>
                              </div>
                              <p className="text-sm">{msg.message}</p>
                            </div>
                          </div>
                        ))}
                      </div>

                      <form onSubmit={handleSendMessage} className="flex gap-2">
                        <Input
                          placeholder="Digite sua mensagem..."
                          value={chatMessage}
                          onChange={(e) => setChatMessage(e.target.value)}
                          className="flex-1"
                        />
                        <Button type="submit" disabled={!chatMessage.trim()}>
                          Enviar
                        </Button>
                      </form>
                    </CardContent>
                  </Card>
                </TabsContent>
              )}
            </Tabs>
          </div>

          {/* Coluna Lateral */}
          <div className="space-y-6">
            {participation && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Seu Progresso</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="p-3 bg-orange-50 rounded-lg border border-orange-200 text-center">
                      <div className="text-2xl font-bold text-orange-700">
                        {participation.current_streak}
                      </div>
                      <div className="text-xs text-orange-600">Dias Seguidos</div>
                    </div>
                    <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200 text-center">
                      <div className="text-2xl font-bold text-yellow-700">
                        {participation.total_points_earned}
                      </div>
                      <div className="text-xs text-yellow-600">Pontos Ganhos</div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progresso Total</span>
                      <span className="font-medium">{participation.progress}%</span>
                    </div>
                    <Progress value={participation.progress} className="h-2" />
                    <div className="text-xs text-muted-foreground">
                      {Math.round(participation.progress / 100 * challenge.duration_days)} de {challenge.duration_days} dias completos
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Ranking</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[1, 2, 3].map((position) => (
                    <div key={position} className="flex items-center justify-between p-2 rounded-lg border">
                      <div className="flex items-center gap-3">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                          position === 1 ? 'bg-yellow-100 text-yellow-700' :
                          position === 2 ? 'bg-gray-100 text-gray-700' :
                          'bg-orange-100 text-orange-700'
                        }`}>
                          {position}
                        </div>
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={`https://i.pravatar.cc/150?img=${position + 10}`} />
                          <AvatarFallback>U{position}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm">Usuário {position}</span>
                      </div>
                      <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                        {100 - (position - 1) * 12}%
                      </Badge>
                    </div>
                  ))}
                </div>
                <div className="mt-3 text-center">
                  <Button variant="link" className="text-xs">
                    Ver ranking completo
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Compartilhar</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full">
                    Convidar Amigos
                  </Button>
                  <Button variant="outline" className="w-full">
                    Compartilhar Progresso
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ChallengeDetailPage; 