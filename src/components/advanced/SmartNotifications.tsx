import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  Bell, 
  Clock, 
  Heart, 
  Droplets, 
  Utensils, 
  Trophy, 
  Brain,
  Moon,
  Sun,
  Smartphone,
  Settings,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';

interface NotificationPreferences {
  id: string;
  user_id: string;
  enabled: boolean;
  quiet_hours_start: string;
  quiet_hours_end: string;
  weight_reminders: boolean;
  exercise_motivation: boolean;
  meal_suggestions: boolean;
  hydration_reminders: boolean;
  achievement_alerts: boolean;
  health_insights: boolean;
  max_daily_notifications: number;
  preferred_times: string[];
  learning_enabled: boolean;
  created_at: string;
  updated_at: string;
}

interface SmartNotification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: string;
  priority: string;
  category: string;
  trigger_conditions: any;
  optimal_send_time: string;
  frequency_limit: number;
  user_preferences: any;
  behavioral_data: any;
  effectiveness_score: number;
  is_active: boolean;
  sent_at?: string;
  user_interaction?: string;
  created_at: string;
  expires_at?: string;
}

export const SmartNotifications: React.FC = () => {
  const [preferences, setPreferences] = useState<NotificationPreferences | null>(null);
  const [notifications, setNotifications] = useState<SmartNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('settings');
  const { toast } = useToast();

  useEffect(() => {
    fetchPreferences();
    fetchNotifications();
    // Verificar se o navegador suporta notificações
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  const fetchPreferences = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('notification_preferences')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code === 'PGRST116') {
        // Criar preferências padrão se não existirem
        const defaultPrefs = {
          user_id: user.id,
          enabled: true,
          quiet_hours_start: '22:00',
          quiet_hours_end: '07:00',
          weight_reminders: true,
          exercise_motivation: true,
          meal_suggestions: true,
          hydration_reminders: true,
          achievement_alerts: true,
          health_insights: true,
          max_daily_notifications: 3,
          preferred_times: ['09:00', '14:00', '19:00'],
          learning_enabled: true
        };

        const { data: newPrefs, error: insertError } = await supabase
          .from('notification_preferences')
          .insert(defaultPrefs)
          .select()
          .single();

        if (insertError) throw insertError;
        setPreferences(newPrefs);
      } else if (error) {
        throw error;
      } else {
        setPreferences(data);
      }
    } catch (error: any) {
      console.error('Erro ao buscar preferências:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao carregar preferências de notificação',
        variant: 'destructive',
      });
    }
  };

  const fetchNotifications = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('smart_notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      setNotifications(data || []);
    } catch (error: any) {
      console.error('Erro ao buscar notificações:', error);
    } finally {
      setLoading(false);
    }
  };

  const updatePreferences = async (updates: Partial<NotificationPreferences>) => {
    try {
      if (!preferences) return;

      const { data, error } = await supabase
        .from('notification_preferences')
        .update(updates)
        .eq('id', preferences.id)
        .select()
        .single();

      if (error) throw error;
      setPreferences(data);
      toast({
        title: 'Preferências Atualizadas',
        description: 'Suas configurações de notificação foram salvas',
      });
    } catch (error: any) {
      console.error('Erro ao atualizar preferências:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao salvar preferências',
        variant: 'destructive',
      });
    }
  };

  const generateSmartNotification = async (type: string, customMessage?: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const notificationTypes = {
        weight_reminder: {
          title: '⚖️ Hora da Pesagem',
          message: customMessage || 'Que tal registrar seu peso hoje? Consistência é a chave do sucesso!',
          category: 'health',
          priority: 'normal',
          icon: '⚖️'
        },
        exercise_motivation: {
          title: '💪 Hora de se Mover',
          message: customMessage || 'Você está no caminho certo! Que tal uma caminhada de 10 minutos?',
          category: 'fitness',
          priority: 'normal',
          icon: '💪'
        },
        hydration: {
          title: '💧 Hidratação',
          message: customMessage || 'Lembre-se de beber água! Seu corpo agradece.',
          category: 'health',
          priority: 'normal',
          icon: '💧'
        },
        meal_suggestion: {
          title: '🥗 Sugestão de Refeição',
          message: customMessage || 'Que tal uma refeição rica em proteínas e vegetais?',
          category: 'nutrition',
          priority: 'low',
          icon: '🥗'
        },
        achievement: {
          title: '🎉 Conquista Desbloqueada',
          message: customMessage || 'Parabéns! Você atingiu uma nova meta pessoal!',
          category: 'motivation',
          priority: 'high',
          icon: '🎉'
        }
      };

      const notifConfig = notificationTypes[type as keyof typeof notificationTypes];
      if (!notifConfig) return;

      // Calcular horário otimizado baseado nas preferências
      const now = new Date();
      const optimalTime = preferences?.preferred_times?.[0] || '09:00';

      const notificationData = {
        user_id: user.id,
        title: notifConfig.title,
        message: notifConfig.message,
        type,
        priority: notifConfig.priority,
        category: notifConfig.category,
        trigger_conditions: { time_based: true, user_preference: true },
        optimal_send_time: optimalTime,
        frequency_limit: 1,
        user_preferences: { enabled: true },
        behavioral_data: { engagement_score: 0.8 },
        effectiveness_score: 0.7,
        is_active: true,
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 horas
      };

      const { data, error } = await supabase
        .from('smart_notifications')
        .insert(notificationData)
        .select()
        .single();

      if (error) throw error;

      setNotifications(prev => [data, ...prev]);

      // Mostrar notificação no navegador se permitido
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(notifConfig.title, {
          body: notifConfig.message,
          icon: '/favicon.ico',
          tag: type
        });
      }

      toast({
        title: 'Notificação Criada',
        description: 'Nova notificação inteligente foi gerada',
      });

    } catch (error: any) {
      console.error('Erro ao gerar notificação:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao criar notificação',
        variant: 'destructive',
      });
    }
  };

  const markNotificationInteraction = async (notificationId: string, interaction: string) => {
    try {
      const { error } = await supabase
        .from('smart_notifications')
        .update({ 
          user_interaction: interaction,
          sent_at: new Date().toISOString()
        })
        .eq('id', notificationId);

      if (error) throw error;

      setNotifications(prev => 
        prev.map(n => 
          n.id === notificationId 
            ? { ...n, user_interaction: interaction, sent_at: new Date().toISOString() }
            : n
        )
      );
    } catch (error: any) {
      console.error('Erro ao marcar interação:', error);
    }
  };

  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        toast({
          title: 'Notificações Ativadas',
          description: 'Você receberá notificações inteligentes personalizadas',
        });
      }
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-32 bg-muted animate-pulse rounded-lg" />
        <div className="h-64 bg-muted animate-pulse rounded-lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Notificações Inteligentes</h2>
          <p className="text-muted-foreground">Sistema adaptativos baseado no seu comportamento</p>
        </div>
        <Button onClick={requestNotificationPermission}>
          <Bell className="h-4 w-4 mr-2" />
          Ativar Notificações
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="settings">Configurações</TabsTrigger>
          <TabsTrigger value="notifications">Notificações</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="test">Teste</TabsTrigger>
        </TabsList>

        <TabsContent value="settings" className="space-y-4">
          {preferences && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Settings className="h-5 w-5" />
                    <span>Configurações Gerais</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="enabled">Notificações Ativadas</Label>
                    <Switch
                      id="enabled"
                      checked={preferences.enabled}
                      onCheckedChange={(checked) => updatePreferences({ enabled: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="learning">Aprendizado Inteligente</Label>
                    <Switch
                      id="learning"
                      checked={preferences.learning_enabled}
                      onCheckedChange={(checked) => updatePreferences({ learning_enabled: checked })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Máximo de Notificações Diárias</Label>
                    <Select
                      value={preferences.max_daily_notifications.toString()}
                      onValueChange={(value) => updatePreferences({ max_daily_notifications: parseInt(value) })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 notificação</SelectItem>
                        <SelectItem value="3">3 notificações</SelectItem>
                        <SelectItem value="5">5 notificações</SelectItem>
                        <SelectItem value="10">10 notificações</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Início do Silêncio</Label>
                      <Input
                        type="time"
                        value={preferences.quiet_hours_start}
                        onChange={(e) => updatePreferences({ quiet_hours_start: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Fim do Silêncio</Label>
                      <Input
                        type="time"
                        value={preferences.quiet_hours_end}
                        onChange={(e) => updatePreferences({ quiet_hours_end: e.target.value })}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Tipos de Notificação</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Heart className="h-4 w-4 text-red-500" />
                      <Label>Lembretes de Pesagem</Label>
                    </div>
                    <Switch
                      checked={preferences.weight_reminders}
                      onCheckedChange={(checked) => updatePreferences({ weight_reminders: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="h-4 w-4 text-green-500" />
                      <Label>Motivação para Exercícios</Label>
                    </div>
                    <Switch
                      checked={preferences.exercise_motivation}
                      onCheckedChange={(checked) => updatePreferences({ exercise_motivation: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Droplets className="h-4 w-4 text-blue-500" />
                      <Label>Lembretes de Hidratação</Label>
                    </div>
                    <Switch
                      checked={preferences.hydration_reminders}
                      onCheckedChange={(checked) => updatePreferences({ hydration_reminders: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Utensils className="h-4 w-4 text-orange-500" />
                      <Label>Sugestões de Refeição</Label>
                    </div>
                    <Switch
                      checked={preferences.meal_suggestions}
                      onCheckedChange={(checked) => updatePreferences({ meal_suggestions: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Trophy className="h-4 w-4 text-yellow-500" />
                      <Label>Alertas de Conquistas</Label>
                    </div>
                    <Switch
                      checked={preferences.achievement_alerts}
                      onCheckedChange={(checked) => updatePreferences({ achievement_alerts: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Brain className="h-4 w-4 text-purple-500" />
                      <Label>Insights de Saúde</Label>
                    </div>
                    <Switch
                      checked={preferences.health_insights}
                      onCheckedChange={(checked) => updatePreferences({ health_insights: checked })}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <div className="space-y-4">
            {notifications.length === 0 ? (
              <Card>
                <CardContent className="text-center py-8">
                  <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Nenhuma notificação ainda</p>
                  <p className="text-sm text-muted-foreground">As notificações aparecerão aqui conforme forem geradas</p>
                </CardContent>
              </Card>
            ) : (
              notifications.map((notification) => (
                <Card key={notification.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h4 className="font-semibold">{notification.title}</h4>
                          <Badge variant={
                            notification.priority === 'high' ? 'destructive' :
                            notification.priority === 'normal' ? 'default' : 'secondary'
                          }>
                            {notification.priority}
                          </Badge>
                          <Badge variant="outline">{notification.category}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{notification.message}</p>
                        <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                          <span>Criada: {new Date(notification.created_at).toLocaleDateString('pt-BR')}</span>
                          {notification.sent_at && (
                            <span>Enviada: {new Date(notification.sent_at).toLocaleDateString('pt-BR')}</span>
                          )}
                          <span>Efetividade: {(notification.effectiveness_score * 100).toFixed(0)}%</span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        {!notification.user_interaction && (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => markNotificationInteraction(notification.id, 'opened')}
                            >
                              Visualizar
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => markNotificationInteraction(notification.id, 'acted_upon')}
                            >
                              Ação
                            </Button>
                          </>
                        )}
                        {notification.user_interaction && (
                          <Badge variant="secondary">{notification.user_interaction}</Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total de Notificações</CardTitle>
                <Bell className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{notifications.length}</div>
                <p className="text-xs text-muted-foreground">Todas as notificações</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Taxa de Engajamento</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {notifications.length > 0 
                    ? Math.round((notifications.filter(n => n.user_interaction).length / notifications.length) * 100)
                    : 0}%
                </div>
                <p className="text-xs text-muted-foreground">Notificações com interação</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Efetividade Média</CardTitle>
                <Brain className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {notifications.length > 0
                    ? Math.round((notifications.reduce((sum, n) => sum + n.effectiveness_score, 0) / notifications.length) * 100)
                    : 0}%
                </div>
                <p className="text-xs text-muted-foreground">Score médio de efetividade</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Distribuição por Categoria</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {['health', 'fitness', 'nutrition', 'motivation'].map(category => {
                  const count = notifications.filter(n => n.category === category).length;
                  const percentage = notifications.length > 0 ? (count / notifications.length) * 100 : 0;
                  return (
                    <div key={category} className="flex items-center justify-between">
                      <span className="capitalize">{category}</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-32 bg-muted rounded-full h-2">
                          <div 
                            className="bg-primary rounded-full h-2 transition-all"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium">{count}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="test" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Testar Notificações</CardTitle>
              <CardDescription>Gere notificações de teste para ver como funcionam</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Button
                  onClick={() => generateSmartNotification('weight_reminder')}
                  className="flex items-center space-x-2"
                >
                  <Heart className="h-4 w-4" />
                  <span>Lembrete de Peso</span>
                </Button>

                <Button
                  onClick={() => generateSmartNotification('exercise_motivation')}
                  className="flex items-center space-x-2"
                >
                  <TrendingUp className="h-4 w-4" />
                  <span>Motivação Exercício</span>
                </Button>

                <Button
                  onClick={() => generateSmartNotification('hydration')}
                  className="flex items-center space-x-2"
                >
                  <Droplets className="h-4 w-4" />
                  <span>Hidratação</span>
                </Button>

                <Button
                  onClick={() => generateSmartNotification('meal_suggestion')}
                  className="flex items-center space-x-2"
                >
                  <Utensils className="h-4 w-4" />
                  <span>Sugestão Refeição</span>
                </Button>

                <Button
                  onClick={() => generateSmartNotification('achievement')}
                  className="flex items-center space-x-2"
                >
                  <Trophy className="h-4 w-4" />
                  <span>Conquista</span>
                </Button>

                <Button
                  onClick={() => generateSmartNotification('achievement', 'Você completou 7 dias consecutivos de pesagem! 🎯')}
                  className="flex items-center space-x-2"
                  variant="outline"
                >
                  <Trophy className="h-4 w-4" />
                  <span>Conquista Personalizada</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              As notificações de teste são criadas apenas para demonstração. 
              Em um ambiente real, elas seriam disparadas automaticamente baseadas no comportamento do usuário.
            </AlertDescription>
          </Alert>
        </TabsContent>
      </Tabs>
    </div>
  );
};