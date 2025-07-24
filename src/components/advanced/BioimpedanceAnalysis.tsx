import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Activity, TrendingUp, Heart, Droplets, Zap, Shield } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadialBarChart, RadialBar, PieChart, Pie, Cell } from 'recharts';

interface BioimpedanceData {
  id: string;
  user_id: string;
  measurement_id: string;
  protein_mass_kg?: number;
  mineral_mass_kg?: number;
  body_fat_distribution_android?: number;
  body_fat_distribution_gynoid?: number;
  metabolic_syndrome_risk?: string;
  cellular_health_score?: number;
  hydration_status?: string;
  muscle_quality_index?: number;
  trends_30_days?: any;
  trends_90_days?: any;
  ai_recommendations?: string[];
  health_warnings?: string[];
  created_at: string;
}

interface WeightMeasurement {
  id: string;
  peso_kg: number;
  gordura_corporal_percent?: number;
  massa_muscular_kg?: number;
  agua_corporal_percent?: number;
  osso_kg?: number;
  metabolismo_basal_kcal?: number;
  imc?: number;
  measurement_date: string;
}

export const BioimpedanceAnalysis: React.FC = () => {
  const [bioData, setBioData] = useState<BioimpedanceData[]>([]);
  const [measurements, setMeasurements] = useState<WeightMeasurement[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const { toast } = useToast();

  useEffect(() => {
    fetchBioimpedanceData();
    fetchMeasurements();
  }, []);

  const fetchBioimpedanceData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('bioimpedance_analysis')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(30);

      if (error) throw error;
      setBioData(data || []);
    } catch (error: any) {
      console.error('Erro ao buscar análise de bioimpedância:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao carregar análise de bioimpedância',
        variant: 'destructive',
      });
    }
  };

  const fetchMeasurements = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('weight_measurements')
        .select('*')
        .eq('user_id', user.id)
        .order('measurement_date', { ascending: false })
        .limit(30);

      if (error) throw error;
      setMeasurements(data || []);
    } catch (error: any) {
      console.error('Erro ao buscar medições:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateAdvancedAnalysis = async (measurementId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const measurement = measurements.find(m => m.id === measurementId);
      if (!measurement) return;

      // Cálculos avançados baseados em fórmulas científicas
      const proteinMass = measurement.massa_muscular_kg ? measurement.massa_muscular_kg * 0.2 : 0;
      const mineralMass = measurement.osso_kg || measurement.peso_kg * 0.05;
      const androidFat = measurement.gordura_corporal_percent ? measurement.gordura_corporal_percent * 0.6 : 0;
      const gynoidFat = measurement.gordura_corporal_percent ? measurement.gordura_corporal_percent * 0.4 : 0;
      
      // Score de saúde celular (baseado em múltiplos fatores)
      const cellularHealthScore = Math.min(100, Math.max(0, 
        ((measurement.agua_corporal_percent || 50) - 45) * 2 +
        ((measurement.massa_muscular_kg || 30) / measurement.peso_kg * 100 - 30) +
        (50 - (measurement.gordura_corporal_percent || 20))
      ));

      // Status de hidratação
      const hydrationStatus = measurement.agua_corporal_percent 
        ? measurement.agua_corporal_percent > 60 ? 'excelente'
          : measurement.agua_corporal_percent > 55 ? 'boa'
          : measurement.agua_corporal_percent > 50 ? 'adequada'
          : 'baixa'
        : 'indeterminada';

      // Índice de qualidade muscular
      const muscleQualityIndex = measurement.massa_muscular_kg && measurement.peso_kg
        ? (measurement.massa_muscular_kg / measurement.peso_kg) * 100
        : 0;

      // Risco de síndrome metabólica
      const metabolicRisk = measurement.imc && measurement.gordura_corporal_percent
        ? measurement.imc > 30 || measurement.gordura_corporal_percent > 35 ? 'alto'
          : measurement.imc > 25 || measurement.gordura_corporal_percent > 25 ? 'moderado'
          : 'baixo'
        : 'indeterminado';

      // Recomendações de IA
      const aiRecommendations = [
        hydrationStatus === 'baixa' ? 'Aumente a ingestão de água para melhorar a hidratação' : null,
        muscleQualityIndex < 35 ? 'Considere exercícios de força para aumentar massa muscular' : null,
        measurement.gordura_corporal_percent && measurement.gordura_corporal_percent > 30 ? 'Foque em exercícios aeróbicos para reduzir gordura corporal' : null,
        cellularHealthScore < 50 ? 'Melhore sua nutrição e descanso para saúde celular' : null
      ].filter(Boolean) as string[];

      // Avisos de saúde
      const healthWarnings = [
        metabolicRisk === 'alto' ? 'Alto risco de síndrome metabólica - consulte um médico' : null,
        measurement.agua_corporal_percent && measurement.agua_corporal_percent < 45 ? 'Desidratação severa detectada' : null
      ].filter(Boolean) as string[];

      const analysisData = {
        user_id: user.id,
        measurement_id: measurementId,
        protein_mass_kg: proteinMass,
        mineral_mass_kg: mineralMass,
        body_fat_distribution_android: androidFat,
        body_fat_distribution_gynoid: gynoidFat,
        metabolic_syndrome_risk: metabolicRisk,
        cellular_health_score: Math.round(cellularHealthScore),
        hydration_status: hydrationStatus,
        muscle_quality_index: muscleQualityIndex,
        ai_recommendations: aiRecommendations,
        health_warnings: healthWarnings
      };

      const { data, error } = await supabase
        .from('bioimpedance_analysis')
        .insert(analysisData)
        .select()
        .single();

      if (error) throw error;

      setBioData(prev => [data, ...prev]);
      toast({
        title: 'Análise Concluída!',
        description: 'Nova análise avançada de bioimpedância gerada com sucesso',
      });

    } catch (error: any) {
      console.error('Erro ao gerar análise:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao gerar análise avançada',
        variant: 'destructive',
      });
    }
  };

  const latestAnalysis = bioData[0];
  const latestMeasurement = measurements[0];

  const bodyCompositionData = latestMeasurement ? [
    { name: 'Gordura', value: latestMeasurement.gordura_corporal_percent || 0, color: '#ef4444' },
    { name: 'Músculo', value: (latestMeasurement.massa_muscular_kg || 0) / latestMeasurement.peso_kg * 100, color: '#22c55e' },
    { name: 'Água', value: latestMeasurement.agua_corporal_percent || 0, color: '#3b82f6' },
    { name: 'Osso', value: (latestMeasurement.osso_kg || 0) / latestMeasurement.peso_kg * 100, color: '#f59e0b' }
  ] : [];

  const trendsData = measurements.slice(0, 10).reverse().map((m, index) => ({
    date: new Date(m.measurement_date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
    gordura: m.gordura_corporal_percent || 0,
    musculo: m.massa_muscular_kg || 0,
    agua: m.agua_corporal_percent || 0,
    peso: m.peso_kg
  }));

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
          <h2 className="text-2xl font-bold">Análise Avançada de Bioimpedância</h2>
          <p className="text-muted-foreground">Análise científica detalhada da sua composição corporal</p>
        </div>
        {latestMeasurement && (
          <button
            onClick={() => generateAdvancedAnalysis(latestMeasurement.id)}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            Gerar Nova Análise
          </button>
        )}
      </div>

      {latestAnalysis && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Saúde Celular</CardTitle>
              <Zap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{latestAnalysis.cellular_health_score}/100</div>
              <Progress value={latestAnalysis.cellular_health_score || 0} className="mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Hidratação</CardTitle>
              <Droplets className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold capitalize">{latestAnalysis.hydration_status}</div>
              <Badge variant={
                latestAnalysis.hydration_status === 'excelente' ? 'default' :
                latestAnalysis.hydration_status === 'boa' ? 'secondary' :
                latestAnalysis.hydration_status === 'adequada' ? 'outline' : 'destructive'
              } className="mt-2">
                {latestAnalysis.hydration_status}
              </Badge>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Qualidade Muscular</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{latestAnalysis.muscle_quality_index?.toFixed(1)}%</div>
              <Progress value={latestAnalysis.muscle_quality_index || 0} className="mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Risco Metabólico</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold capitalize">{latestAnalysis.metabolic_syndrome_risk}</div>
              <Badge variant={
                latestAnalysis.metabolic_syndrome_risk === 'baixo' ? 'default' :
                latestAnalysis.metabolic_syndrome_risk === 'moderado' ? 'secondary' : 'destructive'
              } className="mt-2">
                {latestAnalysis.metabolic_syndrome_risk}
              </Badge>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="composition">Composição</TabsTrigger>
          <TabsTrigger value="trends">Tendências</TabsTrigger>
          <TabsTrigger value="insights">Insights IA</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Composição Corporal Atual</CardTitle>
                <CardDescription>Distribuição dos componentes do seu corpo</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={bodyCompositionData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={120}
                      dataKey="value"
                    >
                      {bodyCompositionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => [`${value.toFixed(1)}%`, '']} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="grid grid-cols-2 gap-2 mt-4">
                  {bodyCompositionData.map((item, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-sm">{item.name}: {item.value.toFixed(1)}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {latestAnalysis && (
              <Card>
                <CardHeader>
                  <CardTitle>Distribuição de Gordura</CardTitle>
                  <CardDescription>Análise regional da gordura corporal</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span>Gordura Android (Tronco)</span>
                        <span>{latestAnalysis.body_fat_distribution_android?.toFixed(1)}%</span>
                      </div>
                      <Progress value={(latestAnalysis.body_fat_distribution_android || 0)} />
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span>Gordura Ginóide (Quadris)</span>
                        <span>{latestAnalysis.body_fat_distribution_gynoid?.toFixed(1)}%</span>
                      </div>
                      <Progress value={(latestAnalysis.body_fat_distribution_gynoid || 0)} />
                    </div>
                    <Alert>
                      <AlertDescription>
                        Gordura android elevada está associada a maior risco cardiovascular.
                      </AlertDescription>
                    </Alert>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="composition" className="space-y-4">
          {latestAnalysis && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Massa Proteica</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{latestAnalysis.protein_mass_kg?.toFixed(1)} kg</div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Proteínas são essenciais para reparação e crescimento muscular
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Massa Mineral</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{latestAnalysis.mineral_mass_kg?.toFixed(1)} kg</div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Inclui densidade óssea e minerais corporais
                  </p>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Evolução da Composição Corporal</CardTitle>
              <CardDescription>Últimas 10 medições</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={trendsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="gordura" stroke="#ef4444" name="Gordura %" />
                  <Line type="monotone" dataKey="musculo" stroke="#22c55e" name="Músculo kg" />
                  <Line type="monotone" dataKey="agua" stroke="#3b82f6" name="Água %" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          {latestAnalysis && (
            <>
              {latestAnalysis.ai_recommendations && latestAnalysis.ai_recommendations.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <TrendingUp className="h-5 w-5" />
                      <span>Recomendações de IA</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {latestAnalysis.ai_recommendations.map((rec, index) => (
                        <Alert key={index}>
                          <AlertDescription>{rec}</AlertDescription>
                        </Alert>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {latestAnalysis.health_warnings && latestAnalysis.health_warnings.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Heart className="h-5 w-5 text-red-500" />
                      <span>Alertas de Saúde</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {latestAnalysis.health_warnings.map((warning, index) => (
                        <Alert key={index} variant="destructive">
                          <AlertDescription>{warning}</AlertDescription>
                        </Alert>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};