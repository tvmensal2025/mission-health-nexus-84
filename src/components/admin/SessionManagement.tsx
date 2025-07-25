import React, { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Plus, Edit, Trash2, Send, Clock, Target, 
  BookOpen, Users, CheckCircle, AlertCircle,
  Filter, Search, Calendar, FileText
} from 'lucide-react';

interface Session {
  id: string;
  title: string;
  description: string;
  type: string;
  content: any;
  target_saboteurs: string[];
  difficulty: string;
  estimated_time: number;
  materials_needed: string[];
  follow_up_questions: string[];
  created_by: string;
  created_at: string;
  updated_at: string;
  is_active: boolean;
}

interface UserSession {
  id: string;
  session_id: string;
  user_id: string;
  status: string;
  assigned_at: string;
  started_at?: string;
  completed_at?: string;
  progress: number;
  feedback?: string;
  sessions: Session;
}

interface Profile {
  user_id: string;
  full_name: string;
}

interface SessionManagementProps {
  user: User | null;
}

export default function SessionManagement({ user }: SessionManagementProps) {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [userSessions, setUserSessions] = useState<UserSession[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterDifficulty, setFilterDifficulty] = useState('all');
  const [stats, setStats] = useState({
    totalSessions: 0,
    activeSessions: 0,
    assignedSessions: 0,
    completedSessions: 0
  });
  const { toast } = useToast();

  // Form states
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'saboteur_work',
    difficulty: 'beginner',
    estimated_time: 30,
    content: '{}',
    target_saboteurs: [] as string[],
    materials_needed: [] as string[],
    follow_up_questions: [] as string[]
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      await Promise.all([
        loadSessions(),
        loadUserSessions(),
        loadProfiles()
      ]);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadSessions = async () => {
    const { data, error } = await supabase
      .from('sessions')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    setSessions(data || []);
    
    // Calcular estatísticas
    const total = data?.length || 0;
    const active = data?.filter(s => s.is_active).length || 0;
    setStats(prev => ({ ...prev, totalSessions: total, activeSessions: active }));
  };

  const loadUserSessions = async () => {
    const { data, error } = await supabase
      .from('user_sessions')
      .select(`
        *,
        sessions (*)
      `)
      .order('assigned_at', { ascending: false });

    if (error) throw error;
    setUserSessions(data || []);
    
    // Calcular estatísticas
    const assigned = data?.length || 0;
    const completed = data?.filter(us => us.status === 'completed').length || 0;
    setStats(prev => ({ ...prev, assignedSessions: assigned, completedSessions: completed }));
  };

  const loadProfiles = async () => {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('user_id, full_name')
      .order('full_name');

    if (error) throw error;
    setProfiles(data || []);
  };

  const createSession = async () => {
    try {
      const sessionData = {
        ...formData,
        content: JSON.parse(formData.content || '{}'),
        created_by: user?.id
      };

      const { error } = await supabase
        .from('sessions')
        .insert(sessionData);

      if (error) throw error;

      toast({
        title: "Sessão Criada! ✅",
        description: "A sessão foi criada com sucesso"
      });

      setIsCreateModalOpen(false);
      resetForm();
      loadSessions();
    } catch (error) {
      console.error('Error creating session:', error);
      toast({
        title: "Erro",
        description: "Não foi possível criar a sessão",
        variant: "destructive"
      });
    }
  };

  const assignSessionToUser = async (sessionId: string, userId: string) => {
    try {
      const { error } = await supabase
        .from('user_sessions')
        .insert({
          session_id: sessionId,
          user_id: userId,
          status: 'pending',
          progress: 0
        });

      if (error) throw error;

      toast({
        title: "Sessão Atribuída! 📤",
        description: "A sessão foi enviada para o usuário"
      });

      loadUserSessions();
    } catch (error) {
      console.error('Error assigning session:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atribuir a sessão",
        variant: "destructive"
      });
    }
  };

  const toggleSessionStatus = async (sessionId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('sessions')
        .update({ is_active: !currentStatus })
        .eq('id', sessionId);

      if (error) throw error;

      toast({
        title: !currentStatus ? "Sessão Ativada" : "Sessão Desativada",
        description: `A sessão foi ${!currentStatus ? 'ativada' : 'desativada'} com sucesso`
      });

      loadSessions();
    } catch (error) {
      console.error('Error toggling session:', error);
    }
  };

  const deleteSession = async (sessionId: string) => {
    try {
      const { error } = await supabase
        .from('sessions')
        .delete()
        .eq('id', sessionId);

      if (error) throw error;

      toast({
        title: "Sessão Excluída",
        description: "A sessão foi excluída permanentemente"
      });

      loadSessions();
    } catch (error) {
      console.error('Error deleting session:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      type: 'saboteur_work',
      difficulty: 'beginner',
      estimated_time: 30,
      content: '{}',
      target_saboteurs: [],
      materials_needed: [],
      follow_up_questions: []
    });
  };

  const filteredSessions = sessions.filter(session => {
    const matchesSearch = session.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         session.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDifficulty = filterDifficulty === 'all' || session.difficulty === filterDifficulty;
    return matchesSearch && matchesDifficulty;
  });

  const filteredUserSessions = userSessions.filter(userSession => {
    return filterStatus === 'all' || userSession.status === filterStatus;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-50 text-green-700';
      case 'intermediate': return 'bg-yellow-50 text-yellow-700';
      case 'advanced': return 'bg-red-50 text-red-700';
      default: return 'bg-gray-50 text-gray-700';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-50 text-yellow-700';
      case 'in_progress': return 'bg-blue-50 text-blue-700';
      case 'completed': return 'bg-green-50 text-green-700';
      default: return 'bg-gray-50 text-gray-700';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando gestão de sessões...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header e Estatísticas */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Gestão de Sessões</h1>
            <p className="text-muted-foreground">
              Crie e gerencie sessões personalizadas para usuários
            </p>
          </div>
          <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Nova Sessão
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Criar Nova Sessão</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Título</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Ex: Superando o Perfeccionismo"
                  />
                </div>
                <div>
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Descreva o objetivo da sessão..."
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="difficulty">Dificuldade</Label>
                    <Select value={formData.difficulty} onValueChange={(value) => setFormData(prev => ({ ...prev, difficulty: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="beginner">Iniciante</SelectItem>
                        <SelectItem value="intermediate">Intermediário</SelectItem>
                        <SelectItem value="advanced">Avançado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="time">Tempo Estimado (min)</Label>
                    <Input
                      id="time"
                      type="number"
                      value={formData.estimated_time}
                      onChange={(e) => setFormData(prev => ({ ...prev, estimated_time: parseInt(e.target.value) }))}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="content">Conteúdo (JSON)</Label>
                  <Textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                    placeholder='{"sections": [{"title": "Seção 1", "activities": ["Atividade 1", "Atividade 2"]}]}'
                    rows={4}
                  />
                </div>
                <Button onClick={createSession} className="w-full">
                  Criar Sessão
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.totalSessions}</div>
              <div className="text-sm text-muted-foreground">Total de Sessões</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{stats.activeSessions}</div>
              <div className="text-sm text-muted-foreground">Sessões Ativas</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">{stats.assignedSessions}</div>
              <div className="text-sm text-muted-foreground">Atribuídas</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">{stats.completedSessions}</div>
              <div className="text-sm text-muted-foreground">Completadas</div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="sessions" className="space-y-4">
        <TabsList>
          <TabsTrigger value="sessions">Sessões</TabsTrigger>
          <TabsTrigger value="assignments">Atribuições</TabsTrigger>
        </TabsList>

        <TabsContent value="sessions" className="space-y-4">
          {/* Filtros */}
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder="Buscar sessões..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>
            <Select value={filterDifficulty} onValueChange={setFilterDifficulty}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Dificuldade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as dificuldades</SelectItem>
                <SelectItem value="beginner">Iniciante</SelectItem>
                <SelectItem value="intermediate">Intermediário</SelectItem>
                <SelectItem value="advanced">Avançado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Lista de Sessões */}
          <div className="grid gap-4">
            {filteredSessions.map((session) => (
              <Card key={session.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-xl">{session.title}</CardTitle>
                      <p className="text-muted-foreground text-sm mt-1">
                        {session.description}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {session.is_active ? (
                        <Badge className="bg-green-50 text-green-700">Ativa</Badge>
                      ) : (
                        <Badge variant="secondary">Inativa</Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className={getDifficultyColor(session.difficulty)}>
                      <Target className="w-3 h-3 mr-1" />
                      {session.difficulty}
                    </Badge>
                    <Badge variant="outline">
                      <Clock className="w-3 h-3 mr-1" />
                      {session.estimated_time} min
                    </Badge>
                    <Badge variant="outline">
                      <Calendar className="w-3 h-3 mr-1" />
                      {new Date(session.created_at).toLocaleDateString()}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-muted-foreground">
                      Tipo: {session.type} • Sabotadores: {session.target_saboteurs.length}
                    </div>
                    <div className="flex gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Send className="w-4 h-4 mr-1" />
                            Atribuir
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Atribuir Sessão: {session.title}</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <p className="text-sm text-muted-foreground">
                              Selecione os usuários que receberão esta sessão:
                            </p>
                            <div className="max-h-60 overflow-y-auto space-y-2">
                              {profiles.map((profile) => (
                                <div
                                  key={profile.user_id}
                                  className="flex items-center justify-between p-2 border rounded"
                                >
                                  <span className="text-sm">{profile.full_name || 'Usuário sem nome'}</span>
                                  <Button
                                    size="sm"
                                    onClick={() => assignSessionToUser(session.id, profile.user_id)}
                                  >
                                    Atribuir
                                  </Button>
                                </div>
                              ))}
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleSessionStatus(session.id, session.is_active)}
                      >
                        {session.is_active ? 'Desativar' : 'Ativar'}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteSession(session.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="assignments" className="space-y-4">
          {/* Filtro de Status */}
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os status</SelectItem>
              <SelectItem value="pending">Pendente</SelectItem>
              <SelectItem value="in_progress">Em Progresso</SelectItem>
              <SelectItem value="completed">Completa</SelectItem>
            </SelectContent>
          </Select>

          {/* Lista de Atribuições */}
          <div className="grid gap-4">
            {filteredUserSessions.map((userSession) => (
              <Card key={userSession.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{userSession.sessions?.title}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Usuário: {userSession.user_id}
                      </p>
                    </div>
                    <Badge className={getStatusColor(userSession.status)}>
                      {userSession.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progresso:</span>
                      <span>{userSession.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all"
                        style={{ width: `${userSession.progress}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Atribuída: {new Date(userSession.assigned_at).toLocaleDateString()}</span>
                      {userSession.completed_at && (
                        <span>Completa: {new Date(userSession.completed_at).toLocaleDateString()}</span>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}