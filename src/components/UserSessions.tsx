import React, { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import {
  Clock, CheckCircle, PlayCircle, BookOpen, 
  Target, Calendar, FileText, AlertCircle
} from 'lucide-react';

interface Session {
  id: string;
  title: string;
  description: string;
  type: string;
  difficulty: string;
  estimated_time: number;
  content: any;
  target_saboteurs: string[];
}

interface UserSession {
  id: string;
  session_id: string;
  status: string;
  assigned_at: string;
  started_at?: string;
  completed_at?: string;
  due_date?: string;
  progress: number;
  feedback?: string;
  notes?: string;
  sessions: Session;
}

interface UserSessionsProps {
  user: User | null;
}

export default function UserSessions({ user }: UserSessionsProps) {
  const [userSessions, setUserSessions] = useState<UserSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    pending: 0,
    inProgress: 0,
    completed: 0,
    total: 0
  });
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      loadUserSessions();
    }
  }, [user]);

  const loadUserSessions = async () => {
    try {
      const { data, error } = await supabase
        .from('user_sessions')
        .select(`
          *,
          sessions (
            id, title, description, type, difficulty, 
            estimated_time, content, target_saboteurs
          )
        `)
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const sessions = data || [];
      setUserSessions(sessions);

      // Calcular estatísticas
      const newStats = {
        pending: sessions.filter(s => s.status === 'pending').length,
        inProgress: sessions.filter(s => s.status === 'in_progress').length,
        completed: sessions.filter(s => s.status === 'completed').length,
        total: sessions.length
      };
      setStats(newStats);

    } catch (error) {
      console.error('Error loading user sessions:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar suas sessões",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const startSession = async (sessionId: string) => {
    try {
      const { error } = await supabase
        .from('user_sessions')
        .update({
          status: 'in_progress',
          started_at: new Date().toISOString()
        })
        .eq('id', sessionId);

      if (error) throw error;

      toast({
        title: "Sessão Iniciada! 🚀",
        description: "Você pode continuar de onde parou a qualquer momento"
      });

      loadUserSessions();
    } catch (error) {
      console.error('Error starting session:', error);
      toast({
        title: "Erro",
        description: "Não foi possível iniciar a sessão",
        variant: "destructive"
      });
    }
  };

  const updateProgress = async (sessionId: string, progress: number) => {
    try {
      const updateData: any = { progress };
      
      if (progress >= 100) {
        updateData.status = 'completed';
        updateData.completed_at = new Date().toISOString();
      }

      const { error } = await supabase
        .from('user_sessions')
        .update(updateData)
        .eq('id', sessionId);

      if (error) throw error;

      if (progress >= 100) {
        toast({
          title: "Sessão Completa! 🎉",
          description: "Parabéns! Você concluiu esta sessão"
        });
      }

      loadUserSessions();
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary" className="bg-yellow-50 text-yellow-700">
          <Clock className="w-3 h-3 mr-1" />
          Pendente
        </Badge>;
      case 'in_progress':
        return <Badge variant="secondary" className="bg-blue-50 text-blue-700">
          <PlayCircle className="w-3 h-3 mr-1" />
          Em Progresso
        </Badge>;
      case 'completed':
        return <Badge variant="secondary" className="bg-green-50 text-green-700">
          <CheckCircle className="w-3 h-3 mr-1" />
          Completa
        </Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'text-green-600';
      case 'intermediate':
        return 'text-yellow-600';
      case 'advanced':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando suas sessões...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header e Estatísticas */}
      <div className="space-y-4">
        <div>
          <h1 className="text-3xl font-bold">Suas Sessões</h1>
          <p className="text-muted-foreground">
            Acompanhe seu progresso nas sessões personalizadas
          </p>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
              <div className="text-sm text-muted-foreground">Pendentes</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.inProgress}</div>
              <div className="text-sm text-muted-foreground">Em Progresso</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
              <div className="text-sm text-muted-foreground">Completas</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold">{stats.total}</div>
              <div className="text-sm text-muted-foreground">Total</div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Lista de Sessões */}
      {userSessions.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <BookOpen className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">Nenhuma sessão disponível</h3>
            <p className="text-muted-foreground">
              Você ainda não tem sessões atribuídas. Elas aparecerão aqui quando estiverem disponíveis.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {userSessions.map((userSession) => (
            <Card key={userSession.id} className="transition-all hover:shadow-md">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-xl mb-2">
                      {userSession.sessions.title}
                    </CardTitle>
                    <p className="text-muted-foreground text-sm">
                      {userSession.sessions.description}
                    </p>
                  </div>
                  {getStatusBadge(userSession.status)}
                </div>

                <div className="flex flex-wrap gap-2 mt-2">
                  <Badge variant="outline" className={getDifficultyColor(userSession.sessions.difficulty)}>
                    <Target className="w-3 h-3 mr-1" />
                    {userSession.sessions.difficulty}
                  </Badge>
                  <Badge variant="outline">
                    <Clock className="w-3 h-3 mr-1" />
                    {userSession.sessions.estimated_time} min
                  </Badge>
                  {userSession.sessions.target_saboteurs.length > 0 && (
                    <Badge variant="outline">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      {userSession.sessions.target_saboteurs.length} sabotadores
                    </Badge>
                  )}
                </div>
              </CardHeader>

              <CardContent>
                {/* Progresso */}
                {userSession.status !== 'pending' && (
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span>Progresso</span>
                      <span>{userSession.progress}%</span>
                    </div>
                    <Progress value={userSession.progress} className="h-2" />
                  </div>
                )}

                {/* Datas */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <div>
                      <div className="font-medium">Atribuída</div>
                      <div>{new Date(userSession.assigned_at).toLocaleDateString()}</div>
                    </div>
                  </div>
                  
                  {userSession.started_at && (
                    <div className="flex items-center gap-2">
                      <PlayCircle className="w-4 h-4" />
                      <div>
                        <div className="font-medium">Iniciada</div>
                        <div>{new Date(userSession.started_at).toLocaleDateString()}</div>
                      </div>
                    </div>
                  )}
                  
                  {userSession.completed_at && (
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      <div>
                        <div className="font-medium">Completa</div>
                        <div>{new Date(userSession.completed_at).toLocaleDateString()}</div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Ações */}
                <div className="flex gap-2">
                  {userSession.status === 'pending' && (
                    <Button 
                      onClick={() => startSession(userSession.id)}
                      className="flex-1"
                    >
                      <PlayCircle className="w-4 h-4 mr-2" />
                      Iniciar Sessão
                    </Button>
                  )}
                  
                  {userSession.status === 'in_progress' && (
                    <>
                      <Button variant="outline" className="flex-1">
                        <BookOpen className="w-4 h-4 mr-2" />
                        Continuar
                      </Button>
                      {userSession.progress < 100 && (
                        <Button 
                          onClick={() => updateProgress(userSession.id, 100)}
                          variant="secondary"
                        >
                          Marcar como Completa
                        </Button>
                      )}
                    </>
                  )}
                  
                  {userSession.status === 'completed' && (
                    <Button variant="outline" className="flex-1">
                      <FileText className="w-4 h-4 mr-2" />
                      Revisar Sessão
                    </Button>
                  )}
                </div>

                {/* Feedback */}
                {userSession.feedback && (
                  <div className="mt-4 p-3 bg-muted rounded-lg">
                    <h4 className="font-medium text-sm mb-1">Feedback:</h4>
                    <p className="text-sm">{userSession.feedback}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}