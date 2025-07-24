import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  Activity, 
  Heart, 
  Footprints, 
  Flame, 
  Clock, 
  Moon, 
  Smartphone,
  RefreshCw,
  TrendingUp,
  Calendar
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, AreaChart, Area } from 'recharts';

interface GoogleFitData {
  id: string;
  user_id: string;
  steps_count?: number;
  distance_meters?: number;
  calories_burned?: number;
  active_minutes?: number;
  heart_rate_avg?: number;
  heart_rate_max?: number;
  heart_rate_resting?: number;
  sleep_duration_minutes?: number;
  sleep_quality_score?: number;
  workout_type?: string;
  workout_duration_minutes?: number;
  workout_intensity?: string;
  data_date: string;
  sync_timestamp: string;
  created_at: string;
}

// Simulador de dados do Google Fit (em produção seria via API real)
const generateMockGoogleFitData = (days: number): GoogleFitData[] => {
  const data: GoogleFitData[] = [];
  const workoutTypes = ['walking', 'running', 'cycling', 'strength', 'yoga', 'swimming'];
  const intensities = ['light', 'moderate', 'vigorous'];

  for (let i = 0; i < days; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    data.push({
      id: `mock-${i}`,
      user_id: 'current-user',
      steps_count: Math.floor(Math.random() * 8000) + 2000,
      distance_meters: Math.floor(Math.random() * 5000) + 1000,
      calories_burned: Math.floor(Math.random() * 800) + 200,
      active_minutes: Math.floor(Math.random() * 60) + 15,
      heart_rate_avg: Math.floor(Math.random() * 40) + 60,
      heart_rate_max: Math.floor(Math.random() * 50) + 150,
      heart_rate_resting: Math.floor(Math.random() * 20) + 50,
      sleep_duration_minutes: Math.floor(Math.random() * 180) + 360,
      sleep_quality_score: Math.floor(Math.random() * 40) + 60,
      workout_type: workoutTypes[Math.floor(Math.random() * workoutTypes.length)],
      workout_duration_minutes: Math.floor(Math.random() * 45) + 15,
      workout_intensity: intensities[Math.floor(Math.random() * intensities.length)],
      data_date: date.toISOString().split('T')[0],
      sync_timestamp: new Date().toISOString(),
      created_at: new Date().toISOString()
    });
  }
  
  return data.reverse();
};

export const GoogleFitIntegration: React.FC = () => {
  const [fitData, setFitData] = useState<GoogleFitData[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [connected, setConnected] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const { toast } = useToast();

  useEffect(() => {
    fetchGoogleFitData();
  }, []);

  const fetchGoogleFitData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('google_fit_data')
        .select('*')
        .eq('user_id', user.id)
        .order('data_date', { ascending: false })
        .limit(30);

      if (error) throw error;
      
      // Se não há dados, usar dados simulados para demonstração
      if (!data || data.length === 0) {
        const mockData = generateMockGoogleFitData(30);
        setFitData(mockData);
        setConnected(false);
      } else {
        setFitData(data);
        setConnected(true);
      }
    } catch (error: any) {
      console.error('Erro ao buscar dados do Google Fit:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao carregar dados do Google Fit',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const syncGoogleFitData = async () => {
    setSyncing(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Simular sincronização com Google Fit
      const newData = generateMockGoogleFitData(7);
      
      // Em produção, aqui faria a chamada real para a API do Google Fit
      for (const item of newData) {
        const { error } = await supabase
          .from('google_fit_data')
          .upsert({
            ...item,
            user_id: user.id,
            id: undefined // Remove o ID mock para gerar um novo
          });

        if (error) throw error;
      }

      await fetchGoogleFitData();
      setConnected(true);
      toast({
        title: 'Sincronização Concluída!',
        description: 'Dados do Google Fit atualizados com sucesso',
      });
    } catch (error: any) {
      console.error('Erro na sincronização:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao sincronizar com Google Fit',
        variant: 'destructive',
      });
    } finally {
      setSyncing(false);
    }
  };

  const connectGoogleFit = async () => {
    // Em produção, aqui seria feita a autenticação OAuth com Google
    toast({
      title: 'Conectando...',
      description: 'Redirecionando para autenticação do Google Fit',
    });
    
    // Simular conexão
    setTimeout(() => {
      setConnected(true);
      syncGoogleFitData();
    }, 2000);
  };

  const latestData = fitData[0];
  const weekData = fitData.slice(0, 7);

  // Cálculos de estatísticas semanais
  const weeklyStats = {
    totalSteps: weekData.reduce((sum, d) => sum + (d.steps_count || 0), 0),
    totalDistance: weekData.reduce((sum, d) => sum + (d.distance_meters || 0), 0) / 1000,
    totalCalories: weekData.reduce((sum, d) => sum + (d.calories_burned || 0), 0),
    totalActiveMinutes: weekData.reduce((sum, d) => sum + (d.active_minutes || 0), 0),
    avgHeartRate: weekData.reduce((sum, d) => sum + (d.heart_rate_avg || 0), 0) / weekData.length,
    avgSleep: weekData.reduce((sum, d) => sum + (d.sleep_duration_minutes || 0), 0) / weekData.length / 60
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
          <h2 className="text-2xl font-bold">Google Fit Integration</h2>
          <p className="text-muted-foreground">Dados de atividade e saúde sincronizados</p>
        </div>
        <div className="flex space-x-2">
          {connected ? (
            <Button 
              onClick={syncGoogleFitData} 
              disabled={syncing}
              variant="outline"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${syncing ? 'animate-spin' : ''}`} />
              {syncing ? 'Sincronizando...' : 'Sincronizar'}
            </Button>
          ) : (
            <Button onClick={connectGoogleFit}>
              <Smartphone className="h-4 w-4 mr-2" />
              Conectar Google Fit
            </Button>
          )}
        </div>
      </div>

      {!connected && (
        <Alert>
          <Smartphone className="h-4 w-4" />
          <AlertDescription>
            Conecte-se ao Google Fit para sincronizar seus dados de atividade, frequência cardíaca e sono automaticamente.
            Os dados exibidos são simulados para demonstração.
          </AlertDescription>
        </Alert>
      )}

      {latestData && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Passos Hoje</CardTitle>
              <Footprints className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{latestData.steps_count?.toLocaleString()}</div>
              <Progress value={(latestData.steps_count || 0) / 100} className="mt-2" />
              <p className="text-xs text-muted-foreground mt-2">Meta: 10.000 passos</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Calorias</CardTitle>
              <Flame className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{latestData.calories_burned}</div>
              <p className="text-xs text-muted-foreground mt-2">Queimadas hoje</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Frequência Cardíaca</CardTitle>
              <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{latestData.heart_rate_avg} bpm</div>
              <p className="text-xs text-muted-foreground mt-2">Média hoje</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sono</CardTitle>
              <Moon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{Math.floor((latestData.sleep_duration_minutes || 0) / 60)}h {(latestData.sleep_duration_minutes || 0) % 60}m</div>
              <p className="text-xs text-muted-foreground mt-2">Ontem à noite</p>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="activity">Atividade</TabsTrigger>
          <TabsTrigger value="health">Saúde</TabsTrigger>
          <TabsTrigger value="sleep">Sono</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Resumo Semanal</CardTitle>
                <CardDescription>Últimos 7 dias</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Total de Passos:</span>
                    <span className="font-semibold">{weeklyStats.totalSteps.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Distância:</span>
                    <span className="font-semibold">{weeklyStats.totalDistance.toFixed(1)} km</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Calorias:</span>
                    <span className="font-semibold">{weeklyStats.totalCalories.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Minutos Ativos:</span>
                    <span className="font-semibold">{weeklyStats.totalActiveMinutes} min</span>
                  </div>
                  <div className="flex justify-between">
                    <span>FC Média:</span>
                    <span className="font-semibold">{Math.round(weeklyStats.avgHeartRate)} bpm</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sono Médio:</span>
                    <span className="font-semibold">{weeklyStats.avgSleep.toFixed(1)} horas</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Metas e Conquistas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span>Meta Diária de Passos</span>
                      <span>{((latestData?.steps_count || 0) / 10000 * 100).toFixed(0)}%</span>
                    </div>
                    <Progress value={(latestData?.steps_count || 0) / 100} />
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-2">
                      <span>Meta de Atividade (150 min/semana)</span>
                      <span>{(weeklyStats.totalActiveMinutes / 150 * 100).toFixed(0)}%</span>
                    </div>
                    <Progress value={weeklyStats.totalActiveMinutes / 1.5} />
                  </div>

                  <div className="flex flex-wrap gap-2 mt-4">
                    {latestData?.steps_count && latestData.steps_count > 10000 && (
                      <Badge>🎯 Meta de Passos</Badge>
                    )}
                    {weeklyStats.totalActiveMinutes > 150 && (
                      <Badge>💪 Semana Ativa</Badge>
                    )}
                    {latestData?.sleep_duration_minutes && latestData.sleep_duration_minutes > 420 && (
                      <Badge>😴 Sono Saudável</Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Passos Diários</CardTitle>
                <CardDescription>Últimos 14 dias</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={fitData.slice(0, 14).reverse()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="data_date" tickFormatter={(value) => new Date(value).getDate().toString()} />
                    <YAxis />
                    <Tooltip formatter={(value: number) => [value.toLocaleString(), 'Passos']} />
                    <Bar dataKey="steps_count" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Calorias Queimadas</CardTitle>
                <CardDescription>Últimos 14 dias</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={fitData.slice(0, 14).reverse()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="data_date" tickFormatter={(value) => new Date(value).getDate().toString()} />
                    <YAxis />
                    <Tooltip formatter={(value: number) => [value, 'Calorias']} />
                    <Area type="monotone" dataKey="calories_burned" stroke="#ef4444" fill="#ef4444" fillOpacity={0.3} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="health" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Frequência Cardíaca</CardTitle>
              <CardDescription>Monitoramento dos últimos 7 dias</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={weekData.reverse()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="data_date" tickFormatter={(value) => new Date(value).getDate().toString()} />
                  <YAxis domain={['dataMin - 10', 'dataMax + 10']} />
                  <Tooltip />
                  <Line type="monotone" dataKey="heart_rate_resting" stroke="#22c55e" name="Repouso" />
                  <Line type="monotone" dataKey="heart_rate_avg" stroke="#3b82f6" name="Média" />
                  <Line type="monotone" dataKey="heart_rate_max" stroke="#ef4444" name="Máxima" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sleep" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Duração do Sono</CardTitle>
                <CardDescription>Últimos 14 dias (em horas)</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={fitData.slice(0, 14).reverse()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="data_date" tickFormatter={(value) => new Date(value).getDate().toString()} />
                    <YAxis />
                    <Tooltip formatter={(value: number) => [(value / 60).toFixed(1), 'Horas']} />
                    <Bar dataKey="sleep_duration_minutes" fill="#8b5cf6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Qualidade do Sono</CardTitle>
                <CardDescription>Score de 0-100</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={fitData.slice(0, 14).reverse()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="data_date" tickFormatter={(value) => new Date(value).getDate().toString()} />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Line type="monotone" dataKey="sleep_quality_score" stroke="#06b6d4" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};