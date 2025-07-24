import React, { useEffect, useState } from 'react';
import { 
  LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend, Tooltip
} from 'recharts';
import { 
  Heart, Activity, Droplets, Target, TrendingUp, Scale, 
  Zap, Calendar, Award, Timer, Bluetooth
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { XiaomiScaleFlow } from '@/components/XiaomiScaleFlow';
import { useWeightMeasurement } from '@/hooks/useWeightMeasurement';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';

const weeklyStats = [
  { day: 'Seg', exercicio: 45, hidratacao: 1.8, sono: 7.5 },
  { day: 'Ter', exercicio: 30, hidratacao: 2.1, sono: 8.0 },
  { day: 'Qua', exercicio: 60, hidratacao: 2.0, sono: 7.0 },
  { day: 'Qui', exercicio: 40, hidratacao: 1.9, sono: 7.5 },
  { day: 'Sex', exercicio: 50, hidratacao: 2.2, sono: 8.5 },
  { day: 'Sab', exercicio: 75, hidratacao: 2.0, sono: 9.0 },
  { day: 'Dom', exercicio: 35, hidratacao: 1.7, sono: 8.0 },
];

const chartConfig = {
  peso: { label: 'Peso', color: '#F97316' },
  meta: { label: 'Meta', color: '#10B981' },
  exercicio: { label: 'Exercício (min)', color: '#3B82F6' },
  hidratacao: { label: 'Hidratação (L)', color: '#06B6D4' },
  sono: { label: 'Sono (h)', color: '#8B5CF6' },
  };

const StatCard = ({ 
  title, 
  value, 
  unit, 
  change, 
  icon: Icon, 
  color,
  description 
}: {
  title: string;
  value: string | number;
  unit?: string;
  change?: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  description?: string;
}) => (
  <Card className="stat-card">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium text-muted-foreground">
        {title}
      </CardTitle>
      <Icon className={`h-4 w-4 ${color}`} />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold text-foreground">
        {value}
        {unit && <span className="text-base text-muted-foreground ml-1">{unit}</span>}
      </div>
      {change && (
        <p className="text-xs text-muted-foreground">
          {change}
        </p>
      )}
      {description && (
        <p className="text-xs text-muted-foreground mt-1">
          {description}
        </p>
      )}
    </CardContent>
  </Card>
);

const DashboardOverview: React.FC = () => {
  const { measurements, stats, loading } = useWeightMeasurement();
  const [weightData, setWeightData] = useState<any[]>([]);
  const [bodyComposition, setBodyComposition] = useState<any[]>([]);

  // Atualização em tempo real
  useEffect(() => {
    const channel = supabase
      .channel('weight-measurements-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'weight_measurements'
        },
        () => {
          // Recarregar dados quando houver mudanças
          window.location.reload();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Preparar dados do gráfico de peso
  useEffect(() => {
    if (measurements.length > 0) {
      const last7Days = measurements
        .slice(-7)
        .map(m => ({
          date: format(new Date(m.measurement_date || m.created_at), 'dd/MM'),
          peso: Number(m.peso_kg),
          meta: 70 // Meta fixa por enquanto
        }));
      setWeightData(last7Days);
    }
  }, [measurements]);

  // Preparar dados de composição corporal
  useEffect(() => {
    if (measurements.length > 0) {
      const latest = measurements[0];
      const composition = [
        { 
          name: 'Massa Muscular', 
          value: Number(latest.massa_muscular_kg) || 35, 
          color: '#10B981' 
        },
        { 
          name: 'Gordura', 
          value: Number(latest.gordura_corporal_percent) || 20, 
          color: '#F59E0B' 
        },
        { 
          name: 'Água', 
          value: Number(latest.agua_corporal_percent) || 45, 
          color: '#3B82F6' 
        },
      ];
      setBodyComposition(composition);
    }
  }, [measurements]);

  // Calcular mudança de peso
  const weightChange = () => {
    if (measurements.length >= 2) {
      const current = Number(measurements[0].peso_kg);
      const previous = Number(measurements[1].peso_kg);
      const change = current - previous;
      return change > 0 ? `+${change.toFixed(1)}kg` : `${change.toFixed(1)}kg`;
    }
    return "Primeiro registro";
  };

  // Calcular classificação do IMC
  const getIMCClassification = (imc: number) => {
    if (imc < 18.5) return "Abaixo do peso";
    if (imc < 25) return "Normal";
    if (imc < 30) return "Sobrepeso";
    return "Obesidade";
  };

  return (
    <div className="p-6 space-y-6 animate-fade-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Acompanhe sua jornada de saúde</p>
        </div>
        <Button className="btn-gradient">
          <Calendar className="w-4 h-4 mr-2" />
          Hoje
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Peso Atual"
          value={stats?.currentWeight || 'N/A'}
          unit="kg"
          change={weightChange()}
          icon={Scale}
          color="text-primary"
        />
        <StatCard
          title="IMC"
          value={stats?.currentIMC || 'N/A'}
          change={stats?.currentIMC ? getIMCClassification(stats.currentIMC) : "N/A"}
          icon={Target}
          color="text-success"
          description="Índice de massa corporal"
        />
        <StatCard
          title="Água Hoje"
          value="1.8"
          unit="L"
          change="Meta: 2.0L"
          icon={Droplets}
          color="text-health-hydration"
        />
        <div className="stat-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pesagem
            </CardTitle>
            <Bluetooth className="h-6 w-6 text-blue-500" />
          </CardHeader>
          <CardContent className="pt-2">
            <div className="text-center mb-3">
              <Scale className="h-12 w-12 text-primary mx-auto mb-2" />
              <p className="text-xs text-muted-foreground">Balança Xiaomi</p>
            </div>
            <XiaomiScaleFlow />
          </CardContent>
        </div>
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weight Evolution Chart */}
        <Card className="health-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              <span>Evolução do Peso</span>
            </CardTitle>
            <CardDescription>
              Últimos 7 dias - Meta: 70kg
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weightData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="date" 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                  />
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    domain={['dataMin - 1', 'dataMax + 1']}
                  />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="peso" 
                    stroke="hsl(var(--primary))"
                    strokeWidth={3}
                    dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: 'hsl(var(--primary))', strokeWidth: 2 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="meta" 
                    stroke="hsl(var(--success))"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Body Composition */}
        <Card className="health-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Zap className="w-5 h-5 text-accent" />
              <span>Composição Corporal</span>
            </CardTitle>
            <CardDescription>
              Análise atual do seu corpo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={bodyComposition}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}%`}
                  >
                    {bodyComposition.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Activity Chart */}
      <Card className="health-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Activity className="w-5 h-5 text-health-steps" />
            <span>Atividade Semanal</span>
          </CardTitle>
          <CardDescription>
            Exercício, hidratação e qualidade do sono
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyStats}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="day" 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <Tooltip />
                <Legend />
                <Bar 
                  dataKey="exercicio" 
                  fill="hsl(var(--health-steps))"
                  radius={[2, 2, 0, 0]}
                />
                <Bar 
                  dataKey="hidratacao" 
                  fill="hsl(var(--health-hydration))"
                  radius={[2, 2, 0, 0]}
                />
                <Bar 
                  dataKey="sono" 
                  fill="hsl(var(--accent))"
                  radius={[2, 2, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Daily Goals Progress */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="mission-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center space-x-2">
              <Heart className="w-4 h-4 text-health-heart" />
              <span>Exercício Diário</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>45 min</span>
                <span>Meta: 30 min</span>
              </div>
              <Progress value={150} className="h-2" />
              <p className="text-xs text-success font-medium">Meta superada! 🎉</p>
            </div>
          </CardContent>
        </Card>

        <Card className="mission-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center space-x-2">
              <Droplets className="w-4 h-4 text-health-hydration" />
              <span>Hidratação</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>1.8 L</span>
                <span>Meta: 2.0 L</span>
              </div>
              <Progress value={90} className="h-2" />
              <p className="text-xs text-muted-foreground">Falta apenas 200ml</p>
            </div>
          </CardContent>
        </Card>

        <Card className="mission-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center space-x-2">
              <Timer className="w-4 h-4 text-accent" />
              <span>Sono</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>7.5 h</span>
                <span>Meta: 8.0 h</span>
              </div>
              <Progress value={94} className="h-2" />
              <p className="text-xs text-muted-foreground">Quase na meta!</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardOverview;