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
import { Switch } from '@/components/ui/switch';
import {
  Plus, Edit, Trash2, Trophy, Users, Calendar, 
  Target, CheckCircle, AlertCircle, Search, 
  Filter, BarChart3, Activity, Settings
} from 'lucide-react';

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
  daily_log_type: string;
  daily_log_target: number;
  daily_log_unit: string;
  is_active: boolean;
  is_featured: boolean;
  is_group_challenge: boolean;
  max_participants?: number;
  start_date?: string;
  end_date?: string;
  created_at: string;
  updated_at: string;
}

interface ChallengeParticipation {
  id: string;
  challenge_id: string;
  user_id: string;
  current_streak: number;
  progress: number;
  is_completed: boolean;
  started_at: string;
  completed_at?: string;
  challenges: Challenge;
}

interface ChallengeManagementProps {
  user: User | null;
}

export default function ChallengeManagement({ user }: ChallengeManagementProps) {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [participations, setParticipations] = useState<ChallengeParticipation[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [stats, setStats] = useState({
    totalChallenges: 0,
    activeChallenges: 0,
    totalParticipations: 0,
    completedParticipations: 0
  });
  const { toast } = useToast();

  // Form states
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'exercicio',
    difficulty: 'medio',
    duration_days: 7,
    points_reward: 100,
    badge_icon: '🏆',
    badge_name: '',
    instructions: '',
    tips: [''],
    daily_log_type: 'boolean',
    daily_log_target: 1,
    daily_log_unit: 'dia',
    is_featured: false,
    is_group_challenge: false,
    max_participants: undefined as number | undefined
  });

  const categories = [
    { value: 'exercicio', label: 'Exercício', icon: '🏃' },
    { value: 'nutricao', label: 'Nutrição', icon: '🥗' },
    { value: 'hidratacao', label: 'Hidratação', icon: '💧' },
    { value: 'sono', label: 'Sono', icon: '😴' },
    { value: 'mindfulness', label: 'Mindfulness', icon: '🧘' },
    { value: 'jejum', label: 'Jejum', icon: '⏰' },
    { value: 'medicao', label: 'Medição', icon: '📏' }
  ];

  const difficulties = [
    { value: 'facil', label: 'Fácil', color: 'bg-green-100 text-green-800' },
    { value: 'medio', label: 'Médio', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'dificil', label: 'Difícil', color: 'bg-orange-100 text-orange-800' },
    { value: 'extremo', label: 'Extremo', color: 'bg-red-100 text-red-800' }
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      await Promise.all([loadChallenges(), loadParticipations()]);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadChallenges = async () => {
    const { data, error } = await supabase
      .from('challenges')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    setChallenges(data || []);
    
    // Calcular estatísticas
    const total = data?.length || 0;
    const active = data?.filter(c => c.is_active).length || 0;
    setStats(prev => ({ ...prev, totalChallenges: total, activeChallenges: active }));
  };

  const loadParticipations = async () => {
    const { data, error } = await supabase
      .from('challenge_participations')
      .select(`
        *,
        challenges (*)
      `)
      .order('started_at', { ascending: false });

    if (error) throw error;
    setParticipations(data || []);
    
    // Calcular estatísticas
    const total = data?.length || 0;
    const completed = data?.filter(p => p.is_completed).length || 0;
    setStats(prev => ({ ...prev, totalParticipations: total, completedParticipations: completed }));
  };

  const createChallenge = async () => {
    try {
      const challengeData = {
        ...formData,
        tips: formData.tips.filter(tip => tip.trim())
      };

      const { error } = await supabase
        .from('challenges')
        .insert(challengeData);

      if (error) throw error;

      toast({
        title: "Desafio Criado! ✅",
        description: "O desafio foi criado com sucesso"
      });

      setIsCreateModalOpen(false);
      resetForm();
      loadChallenges();
    } catch (error) {
      console.error('Error creating challenge:', error);
      toast({
        title: "Erro",
        description: "Não foi possível criar o desafio",
        variant: "destructive"
      });
    }
  };

  const updateChallenge = async () => {
    if (!selectedChallenge) return;

    try {
      const challengeData = {
        ...formData,
        tips: formData.tips.filter(tip => tip.trim())
      };

      const { error } = await supabase
        .from('challenges')
        .update(challengeData)
        .eq('id', selectedChallenge.id);

      if (error) throw error;

      toast({
        title: "Desafio Atualizado! ✅",
        description: "As alterações foram salvas com sucesso"
      });

      setIsEditModalOpen(false);
      setSelectedChallenge(null);
      resetForm();
      loadChallenges();
    } catch (error) {
      console.error('Error updating challenge:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o desafio",
        variant: "destructive"
      });
    }
  };

  const toggleChallengeStatus = async (challengeId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('challenges')
        .update({ is_active: !currentStatus })
        .eq('id', challengeId);

      if (error) throw error;

      toast({
        title: !currentStatus ? "Desafio Ativado" : "Desafio Desativado",
        description: `O desafio foi ${!currentStatus ? 'ativado' : 'desativado'} com sucesso`
      });

      loadChallenges();
    } catch (error) {
      console.error('Error toggling challenge:', error);
    }
  };

  const deleteChallenge = async (challengeId: string) => {
    try {
      const { error } = await supabase
        .from('challenges')
        .delete()
        .eq('id', challengeId);

      if (error) throw error;

      toast({
        title: "Desafio Excluído",
        description: "O desafio foi excluído permanentemente"
      });

      loadChallenges();
    } catch (error) {
      console.error('Error deleting challenge:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      category: 'exercicio',
      difficulty: 'medio',
      duration_days: 7,
      points_reward: 100,
      badge_icon: '🏆',
      badge_name: '',
      instructions: '',
      tips: [''],
      daily_log_type: 'boolean',
      daily_log_target: 1,
      daily_log_unit: 'dia',
      is_featured: false,
      is_group_challenge: false,
      max_participants: undefined
    });
  };

  const openEditModal = (challenge: Challenge) => {
    setSelectedChallenge(challenge);
    setFormData({
      title: challenge.title,
      description: challenge.description,
      category: challenge.category,
      difficulty: challenge.difficulty,
      duration_days: challenge.duration_days,
      points_reward: challenge.points_reward,
      badge_icon: challenge.badge_icon,
      badge_name: challenge.badge_name,
      instructions: challenge.instructions,
      tips: challenge.tips.length > 0 ? challenge.tips : [''],
      daily_log_type: challenge.daily_log_type,
      daily_log_target: challenge.daily_log_target,
      daily_log_unit: challenge.daily_log_unit,
      is_featured: challenge.is_featured,
      is_group_challenge: challenge.is_group_challenge,
      max_participants: challenge.max_participants
    });
    setIsEditModalOpen(true);
  };

  const addTip = () => {
    setFormData(prev => ({ ...prev, tips: [...prev.tips, ''] }));
  };

  const removeTip = (index: number) => {
    setFormData(prev => ({
      ...prev,
      tips: prev.tips.filter((_, i) => i !== index)
    }));
  };

  const updateTip = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      tips: prev.tips.map((tip, i) => i === index ? value : tip)
    }));
  };

  const getCategoryIcon = (category: string) => {
    return categories.find(c => c.value === category)?.icon || '🏆';
  };

  const getDifficultyColor = (difficulty: string) => {
    return difficulties.find(d => d.value === difficulty)?.color || 'bg-gray-100 text-gray-800';
  };

  const filteredChallenges = challenges.filter(challenge => {
    const matchesSearch = challenge.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         challenge.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || challenge.category === filterCategory;
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'active' && challenge.is_active) ||
                         (filterStatus === 'inactive' && !challenge.is_active);
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const renderModal = (isEdit: boolean) => (
    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>{isEdit ? 'Editar' : 'Criar'} Desafio</DialogTitle>
      </DialogHeader>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="title">Título</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Ex: 10.000 passos por dia"
            />
          </div>
          <div>
            <Label htmlFor="badge_name">Nome do Badge</Label>
            <Input
              id="badge_name"
              value={formData.badge_name}
              onChange={(e) => setFormData(prev => ({ ...prev, badge_name: e.target.value }))}
              placeholder="Ex: Caminhante Dedicado"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="description">Descrição</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Descreva o desafio..."
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label>Categoria</Label>
            <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.icon} {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label>Dificuldade</Label>
            <Select value={formData.difficulty} onValueChange={(value) => setFormData(prev => ({ ...prev, difficulty: value }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {difficulties.map((diff) => (
                  <SelectItem key={diff.value} value={diff.value}>
                    {diff.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="badge_icon">Emoji do Badge</Label>
            <Input
              id="badge_icon"
              value={formData.badge_icon}
              onChange={(e) => setFormData(prev => ({ ...prev, badge_icon: e.target.value }))}
              placeholder="🏆"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="duration">Duração (dias)</Label>
            <Input
              id="duration"
              type="number"
              value={formData.duration_days}
              onChange={(e) => setFormData(prev => ({ ...prev, duration_days: parseInt(e.target.value) }))}
            />
          </div>
          <div>
            <Label htmlFor="points">Pontos de Recompensa</Label>
            <Input
              id="points"
              type="number"
              value={formData.points_reward}
              onChange={(e) => setFormData(prev => ({ ...prev, points_reward: parseInt(e.target.value) }))}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="instructions">Instruções</Label>
          <Textarea
            id="instructions"
            value={formData.instructions}
            onChange={(e) => setFormData(prev => ({ ...prev, instructions: e.target.value }))}
            placeholder="Como completar o desafio..."
          />
        </div>

        <div>
          <Label>Dicas</Label>
          {formData.tips.map((tip, index) => (
            <div key={index} className="flex gap-2 mt-2">
              <Input
                value={tip}
                onChange={(e) => updateTip(index, e.target.value)}
                placeholder="Digite uma dica..."
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => removeTip(index)}
                disabled={formData.tips.length <= 1}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addTip}
            className="mt-2"
          >
            <Plus className="w-4 h-4 mr-1" />
            Adicionar Dica
          </Button>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label>Tipo de Log</Label>
            <Select value={formData.daily_log_type} onValueChange={(value) => setFormData(prev => ({ ...prev, daily_log_type: value }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="boolean">Sim/Não</SelectItem>
                <SelectItem value="quantity">Quantidade</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="target">Meta Diária</Label>
            <Input
              id="target"
              type="number"
              value={formData.daily_log_target}
              onChange={(e) => setFormData(prev => ({ ...prev, daily_log_target: parseFloat(e.target.value) }))}
            />
          </div>
          <div>
            <Label htmlFor="unit">Unidade</Label>
            <Input
              id="unit"
              value={formData.daily_log_unit}
              onChange={(e) => setFormData(prev => ({ ...prev, daily_log_unit: e.target.value }))}
              placeholder="ex: passos, litros, horas"
            />
          </div>
        </div>

        <div className="flex gap-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="featured"
              checked={formData.is_featured}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_featured: checked }))}
            />
            <Label htmlFor="featured">Destacado</Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch
              id="group"
              checked={formData.is_group_challenge}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_group_challenge: checked }))}
            />
            <Label htmlFor="group">Desafio em Grupo</Label>
          </div>
        </div>

        {formData.is_group_challenge && (
          <div>
            <Label htmlFor="max_participants">Máximo de Participantes</Label>
            <Input
              id="max_participants"
              type="number"
              value={formData.max_participants || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, max_participants: e.target.value ? parseInt(e.target.value) : undefined }))}
              placeholder="Deixe vazio para ilimitado"
            />
          </div>
        )}

        <Button onClick={isEdit ? updateChallenge : createChallenge} className="w-full">
          {isEdit ? 'Atualizar' : 'Criar'} Desafio
        </Button>
      </div>
    </DialogContent>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando gestão de desafios...</p>
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
            <h1 className="text-3xl font-bold">Gestão de Desafios</h1>
            <p className="text-muted-foreground">
              Crie e gerencie desafios de saúde para os usuários
            </p>
          </div>
          <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Novo Desafio
              </Button>
            </DialogTrigger>
            {renderModal(false)}
          </Dialog>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.totalChallenges}</div>
              <div className="text-sm text-muted-foreground">Total de Desafios</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{stats.activeChallenges}</div>
              <div className="text-sm text-muted-foreground">Desafios Ativos</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">{stats.totalParticipations}</div>
              <div className="text-sm text-muted-foreground">Participações</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">{stats.completedParticipations}</div>
              <div className="text-sm text-muted-foreground">Completados</div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="challenges" className="space-y-4">
        <TabsList>
          <TabsTrigger value="challenges">Desafios</TabsTrigger>
          <TabsTrigger value="participations">Participações</TabsTrigger>
        </TabsList>

        <TabsContent value="challenges" className="space-y-4">
          {/* Filtros */}
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder="Buscar desafios..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as categorias</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.icon} {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os status</SelectItem>
                <SelectItem value="active">Ativos</SelectItem>
                <SelectItem value="inactive">Inativos</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Lista de Desafios */}
          <div className="grid gap-4">
            {filteredChallenges.map((challenge) => (
              <Card key={challenge.id} className="transition-all hover:shadow-md">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="text-3xl">{challenge.badge_icon}</div>
                      <div className="flex-1">
                        <CardTitle className="text-xl">{challenge.title}</CardTitle>
                        <p className="text-muted-foreground text-sm mt-1">
                          {challenge.description}
                        </p>
                        <div className="flex flex-wrap gap-2 mt-2">
                          <Badge variant="outline">
                            {getCategoryIcon(challenge.category)} {challenge.category}
                          </Badge>
                          <Badge className={getDifficultyColor(challenge.difficulty)}>
                            {challenge.difficulty}
                          </Badge>
                          <Badge variant="outline">
                            <Calendar className="w-3 h-3 mr-1" />
                            {challenge.duration_days} dias
                          </Badge>
                          <Badge variant="outline">
                            <Trophy className="w-3 h-3 mr-1" />
                            {challenge.points_reward} pts
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {challenge.is_active ? (
                        <Badge className="bg-green-50 text-green-700">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Ativo
                        </Badge>
                      ) : (
                        <Badge variant="secondary">Inativo</Badge>
                      )}
                      {challenge.is_featured && (
                        <Badge className="bg-yellow-50 text-yellow-700">Destacado</Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-muted-foreground">
                      Criado em {new Date(challenge.created_at).toLocaleDateString()}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditModal(challenge)}
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Editar
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleChallengeStatus(challenge.id, challenge.is_active)}
                      >
                        {challenge.is_active ? 'Desativar' : 'Ativar'}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteChallenge(challenge.id)}
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

        <TabsContent value="participations" className="space-y-4">
          {/* Lista de Participações */}
          <div className="grid gap-4">
            {participations.map((participation) => (
              <Card key={participation.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{participation.challenges?.title}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Usuário: {participation.user_id}
                      </p>
                    </div>
                    <Badge className={participation.is_completed ? 'bg-green-50 text-green-700' : 'bg-blue-50 text-blue-700'}>
                      {participation.is_completed ? 'Completo' : 'Em progresso'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progresso:</span>
                      <span>{participation.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all"
                        style={{ width: `${participation.progress}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Iniciado: {new Date(participation.started_at).toLocaleDateString()}</span>
                      <span>Sequência: {participation.current_streak} dias</span>
                      {participation.completed_at && (
                        <span>Completo: {new Date(participation.completed_at).toLocaleDateString()}</span>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Modal de Edição */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        {renderModal(true)}
      </Dialog>
    </div>
  );
}