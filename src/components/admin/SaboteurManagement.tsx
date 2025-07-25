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
import {
  Plus, Edit, Trash2, Target, Palette, 
  User as UserIcon, Brain, AlertTriangle, 
  CheckCircle, Search, Filter
} from 'lucide-react';

interface CustomSaboteur {
  id: string;
  name: string;
  description: string;
  characteristics: string[];
  impact: string;
  strategies: string[];
  color: string;
  icon: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  is_active: boolean;
}

interface SaboteurManagementProps {
  user: User | null;
}

const iconOptions = [
  { value: 'User', label: '👤 Usuário', icon: UserIcon },
  { value: 'Brain', label: '🧠 Cérebro', icon: Brain },
  { value: 'AlertTriangle', label: '⚠️ Alerta', icon: AlertTriangle },
  { value: 'Target', label: '🎯 Alvo', icon: Target }
];

const colorOptions = [
  { value: 'text-red-600', label: 'Vermelho', color: 'bg-red-100 border-red-300' },
  { value: 'text-blue-600', label: 'Azul', color: 'bg-blue-100 border-blue-300' },
  { value: 'text-green-600', label: 'Verde', color: 'bg-green-100 border-green-300' },
  { value: 'text-purple-600', label: 'Roxo', color: 'bg-purple-100 border-purple-300' },
  { value: 'text-orange-600', label: 'Laranja', color: 'bg-orange-100 border-orange-300' },
  { value: 'text-pink-600', label: 'Rosa', color: 'bg-pink-100 border-pink-300' },
  { value: 'text-indigo-600', label: 'Índigo', color: 'bg-indigo-100 border-indigo-300' },
  { value: 'text-gray-600', label: 'Cinza', color: 'bg-gray-100 border-gray-300' }
];

export default function SaboteurManagement({ user }: SaboteurManagementProps) {
  const [saboteurs, setSaboteurs] = useState<CustomSaboteur[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedSaboteur, setSelectedSaboteur] = useState<CustomSaboteur | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterActive, setFilterActive] = useState('all');
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0
  });
  const { toast } = useToast();

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    characteristics: [''],
    impact: '',
    strategies: [''],
    color: 'text-gray-600',
    icon: 'User'
  });

  useEffect(() => {
    loadSaboteurs();
  }, []);

  const loadSaboteurs = async () => {
    try {
      const { data, error } = await supabase
        .from('custom_saboteurs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setSaboteurs(data || []);
      
      // Calcular estatísticas
      const total = data?.length || 0;
      const active = data?.filter(s => s.is_active).length || 0;
      const inactive = total - active;
      setStats({ total, active, inactive });

    } catch (error) {
      console.error('Error loading saboteurs:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os sabotadores",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const createSaboteur = async () => {
    try {
      const saboteurData = {
        ...formData,
        characteristics: formData.characteristics.filter(c => c.trim()),
        strategies: formData.strategies.filter(s => s.trim()),
        created_by: user?.id
      };

      const { error } = await supabase
        .from('custom_saboteurs')
        .insert(saboteurData);

      if (error) throw error;

      toast({
        title: "Sabotador Criado! ✅",
        description: "O sabotador customizado foi criado com sucesso"
      });

      setIsCreateModalOpen(false);
      resetForm();
      loadSaboteurs();
    } catch (error) {
      console.error('Error creating saboteur:', error);
      toast({
        title: "Erro",
        description: "Não foi possível criar o sabotador",
        variant: "destructive"
      });
    }
  };

  const updateSaboteur = async () => {
    if (!selectedSaboteur) return;

    try {
      const saboteurData = {
        ...formData,
        characteristics: formData.characteristics.filter(c => c.trim()),
        strategies: formData.strategies.filter(s => s.trim())
      };

      const { error } = await supabase
        .from('custom_saboteurs')
        .update(saboteurData)
        .eq('id', selectedSaboteur.id);

      if (error) throw error;

      toast({
        title: "Sabotador Atualizado! ✅",
        description: "As alterações foram salvas com sucesso"
      });

      setIsEditModalOpen(false);
      setSelectedSaboteur(null);
      resetForm();
      loadSaboteurs();
    } catch (error) {
      console.error('Error updating saboteur:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o sabotador",
        variant: "destructive"
      });
    }
  };

  const toggleSaboteurStatus = async (saboteurId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('custom_saboteurs')
        .update({ is_active: !currentStatus })
        .eq('id', saboteurId);

      if (error) throw error;

      toast({
        title: !currentStatus ? "Sabotador Ativado" : "Sabotador Desativado",
        description: `O sabotador foi ${!currentStatus ? 'ativado' : 'desativado'} com sucesso`
      });

      loadSaboteurs();
    } catch (error) {
      console.error('Error toggling saboteur:', error);
    }
  };

  const deleteSaboteur = async (saboteurId: string) => {
    try {
      const { error } = await supabase
        .from('custom_saboteurs')
        .delete()
        .eq('id', saboteurId);

      if (error) throw error;

      toast({
        title: "Sabotador Excluído",
        description: "O sabotador foi excluído permanentemente"
      });

      loadSaboteurs();
    } catch (error) {
      console.error('Error deleting saboteur:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      characteristics: [''],
      impact: '',
      strategies: [''],
      color: 'text-gray-600',
      icon: 'User'
    });
  };

  const openEditModal = (saboteur: CustomSaboteur) => {
    setSelectedSaboteur(saboteur);
    setFormData({
      name: saboteur.name,
      description: saboteur.description,
      characteristics: saboteur.characteristics.length > 0 ? saboteur.characteristics : [''],
      impact: saboteur.impact,
      strategies: saboteur.strategies.length > 0 ? saboteur.strategies : [''],
      color: saboteur.color,
      icon: saboteur.icon
    });
    setIsEditModalOpen(true);
  };

  const addCharacteristic = () => {
    setFormData(prev => ({
      ...prev,
      characteristics: [...prev.characteristics, '']
    }));
  };

  const removeCharacteristic = (index: number) => {
    setFormData(prev => ({
      ...prev,
      characteristics: prev.characteristics.filter((_, i) => i !== index)
    }));
  };

  const updateCharacteristic = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      characteristics: prev.characteristics.map((c, i) => i === index ? value : c)
    }));
  };

  const addStrategy = () => {
    setFormData(prev => ({
      ...prev,
      strategies: [...prev.strategies, '']
    }));
  };

  const removeStrategy = (index: number) => {
    setFormData(prev => ({
      ...prev,
      strategies: prev.strategies.filter((_, i) => i !== index)
    }));
  };

  const updateStrategy = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      strategies: prev.strategies.map((s, i) => i === index ? value : s)
    }));
  };

  const filteredSaboteurs = saboteurs.filter(saboteur => {
    const matchesSearch = saboteur.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         saboteur.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterActive === 'all' || 
                         (filterActive === 'active' && saboteur.is_active) ||
                         (filterActive === 'inactive' && !saboteur.is_active);
    return matchesSearch && matchesFilter;
  });

  const renderModal = (isEdit: boolean) => (
    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>{isEdit ? 'Editar' : 'Criar'} Sabotador Customizado</DialogTitle>
      </DialogHeader>
      <div className="space-y-4">
        <div>
          <Label htmlFor="name">Nome do Sabotador</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            placeholder="Ex: O Perfeccionista Digital"
          />
        </div>
        
        <div>
          <Label htmlFor="description">Descrição</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Descreva como esse sabotador age..."
          />
        </div>

        <div>
          <Label>Características</Label>
          {formData.characteristics.map((char, index) => (
            <div key={index} className="flex gap-2 mt-2">
              <Input
                value={char}
                onChange={(e) => updateCharacteristic(index, e.target.value)}
                placeholder="Ex: Revisa posts infinitamente"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => removeCharacteristic(index)}
                disabled={formData.characteristics.length <= 1}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addCharacteristic}
            className="mt-2"
          >
            <Plus className="w-4 h-4 mr-1" />
            Adicionar Característica
          </Button>
        </div>

        <div>
          <Label htmlFor="impact">Impacto</Label>
          <Textarea
            id="impact"
            value={formData.impact}
            onChange={(e) => setFormData(prev => ({ ...prev, impact: e.target.value }))}
            placeholder="Como este sabotador prejudica a pessoa?"
          />
        </div>

        <div>
          <Label>Estratégias de Superação</Label>
          {formData.strategies.map((strategy, index) => (
            <div key={index} className="flex gap-2 mt-2">
              <Input
                value={strategy}
                onChange={(e) => updateStrategy(index, e.target.value)}
                placeholder="Ex: Poste primeiro, edite depois"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => removeStrategy(index)}
                disabled={formData.strategies.length <= 1}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addStrategy}
            className="mt-2"
          >
            <Plus className="w-4 h-4 mr-1" />
            Adicionar Estratégia
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Cor</Label>
            <Select value={formData.color} onValueChange={(value) => setFormData(prev => ({ ...prev, color: value }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {colorOptions.map((color) => (
                  <SelectItem key={color.value} value={color.value}>
                    <div className="flex items-center gap-2">
                      <div className={`w-4 h-4 rounded ${color.color}`}></div>
                      {color.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label>Ícone</Label>
            <Select value={formData.icon} onValueChange={(value) => setFormData(prev => ({ ...prev, icon: value }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {iconOptions.map((icon) => (
                  <SelectItem key={icon.value} value={icon.value}>
                    <div className="flex items-center gap-2">
                      <icon.icon className="w-4 h-4" />
                      {icon.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button 
          onClick={isEdit ? updateSaboteur : createSaboteur} 
          className="w-full"
        >
          {isEdit ? 'Atualizar' : 'Criar'} Sabotador
        </Button>
      </div>
    </DialogContent>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando sabotadores...</p>
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
            <h1 className="text-3xl font-bold">Gestão de Sabotadores</h1>
            <p className="text-muted-foreground">
              Crie sabotadores customizados para diferentes contextos
            </p>
          </div>
          <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Novo Sabotador
              </Button>
            </DialogTrigger>
            {renderModal(false)}
          </Dialog>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
              <div className="text-sm text-muted-foreground">Total</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{stats.active}</div>
              <div className="text-sm text-muted-foreground">Ativos</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-gray-600">{stats.inactive}</div>
              <div className="text-sm text-muted-foreground">Inativos</div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex gap-4">
        <div className="flex-1">
          <Input
            placeholder="Buscar sabotadores..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>
        <Select value={filterActive} onValueChange={setFilterActive}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="active">Ativos</SelectItem>
            <SelectItem value="inactive">Inativos</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Lista de Sabotadores */}
      <div className="grid gap-4">
        {filteredSaboteurs.map((saboteur) => {
          const IconComponent = iconOptions.find(icon => icon.value === saboteur.icon)?.icon || UserIcon;
          return (
            <Card key={saboteur.id} className="transition-all hover:shadow-md">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex items-start gap-3 flex-1">
                    <div className={`p-2 rounded-lg border ${saboteur.color} bg-opacity-10`}>
                      <IconComponent className={`w-5 h-5 ${saboteur.color}`} />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-xl">{saboteur.name}</CardTitle>
                      <p className="text-muted-foreground text-sm mt-1">
                        {saboteur.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {saboteur.is_active ? (
                      <Badge className="bg-green-50 text-green-700">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Ativo
                      </Badge>
                    ) : (
                      <Badge variant="secondary">Inativo</Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {/* Características */}
                  {saboteur.characteristics.length > 0 && (
                    <div>
                      <h4 className="font-medium text-sm mb-2">Características:</h4>
                      <div className="flex flex-wrap gap-1">
                        {saboteur.characteristics.slice(0, 3).map((char, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {char}
                          </Badge>
                        ))}
                        {saboteur.characteristics.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{saboteur.characteristics.length - 3} mais
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Impacto */}
                  {saboteur.impact && (
                    <div>
                      <h4 className="font-medium text-sm mb-1">Impacto:</h4>
                      <p className="text-sm text-muted-foreground">{saboteur.impact}</p>
                    </div>
                  )}

                  {/* Estratégias */}
                  {saboteur.strategies.length > 0 && (
                    <div>
                      <h4 className="font-medium text-sm mb-2">Estratégias:</h4>
                      <div className="flex flex-wrap gap-1">
                        {saboteur.strategies.slice(0, 2).map((strategy, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {strategy}
                          </Badge>
                        ))}
                        {saboteur.strategies.length > 2 && (
                          <Badge variant="secondary" className="text-xs">
                            +{saboteur.strategies.length - 2} mais
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Ações */}
                  <div className="flex justify-between items-center pt-2 border-t">
                    <div className="text-xs text-muted-foreground">
                      Criado em {new Date(saboteur.created_at).toLocaleDateString()}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditModal(saboteur)}
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Editar
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleSaboteurStatus(saboteur.id, saboteur.is_active)}
                      >
                        {saboteur.is_active ? 'Desativar' : 'Ativar'}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteSaboteur(saboteur.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Modal de Edição */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        {renderModal(true)}
      </Dialog>
    </div>
  );
}