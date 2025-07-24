import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Target, Activity, Heart, Brain, Scale, User, Mail, Printer, Info, TrendingUp, TrendingDown } from 'lucide-react';

interface BioimpedanciaData {
  // Dados pessoais
  nome: string;
  avaliadoPor: string;
  dataNascimento: string;
  peso: number;
  altura: number;
  avaliador: string;
  dataAvaliacao: string;
  dataAvaliacaoAnterior: string;
  
  // Dados da balança
  gorduraCorporal: number;
  massaGorda: number;
  aguaCorporal: number;
  aguaCorporalPercent: number;
  aguaMassaMagra: number;
  aguaIntracelular: number;
  aguaExtracelular: number;
  aguaIntracelularPercent: number;
  massaMagra: number;
  massaMagraPercent: number;
  massaMuscular: number;
  massaMuscularPercent: number;
  razaoMusculoGordura: number;
  metabolismoBasal: number;
  anguloFase: number;
  idadeCelular: number;
  imc: number;
  idade: number;
  indiceHidratacao: number;
}

const BioimpedanciaPage: React.FC = () => {
  const [dados, setDados] = useState<BioimpedanciaData | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      setLoading(true);
      
      // Dados baseados na imagem fornecida
      const dadosImagem: BioimpedanciaData = {
        // Dados pessoais
        nome: "Rafael Ferreira Dias",
        avaliadoPor: "Lilian Cristina",
        dataNascimento: "25/09/1981",
        peso: 90.1,
        altura: 163,
        avaliador: "Rafael Ferreira Dias",
        dataAvaliacao: "10/07/2025 às 09:28",
        dataAvaliacaoAnterior: "03/07/2025 às 10:07",
        
        // Gordura
        gorduraCorporal: 44.1,
        massaGorda: 39.7,
        
        // Hidratação
        aguaCorporal: 35.9,
        aguaCorporalPercent: 39.9,
        aguaMassaMagra: 71.3,
        indiceHidratacao: 3.0,
        
        // Água Intra/Extra Celular
        aguaIntracelular: 18.2,
        aguaExtracelular: 17.7,
        aguaIntracelularPercent: 50.8,
        
        // Massa Magra e Muscular
        massaMagra: 50.4,
        massaMagraPercent: 55.9,
        massaMuscular: 21.6,
        massaMuscularPercent: 24.0,
        razaoMusculoGordura: 0.5,
        
        // Peso, Altura e TMB
        imc: 33.9,
        idade: 43,
        metabolismoBasal: 1459,
        
        // Análise Celular
        anguloFase: 6.5,
        idadeCelular: 43
      };
      
      setDados(dadosImagem);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar dados de bioimpedância",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center">Carregando dados de bioimpedância...</div>
      </div>
    );
  }

  if (!dados) {
    return (
      <div className="p-6">
        <div className="text-center">Nenhum dado de bioimpedância encontrado.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-start mb-8">
          {/* Dados pessoais */}
          <div className="space-y-2">
            <div className="text-sm text-gray-400">Avaliadas: {dados.avaliadoPor}</div>
            <div className="text-sm text-gray-400">Data de nascimento: {dados.dataNascimento}</div>
            <div className="text-sm text-gray-400">Peso: {dados.peso} kg Altura: {dados.altura} cm</div>
            <div className="text-sm text-gray-400">Avaliador: {dados.avaliador}</div>
            <div className="text-sm">
              {dados.dataAvaliacao} comparado com{' '}
              <span className="text-purple-400">{dados.dataAvaliacaoAnterior}</span>
            </div>
          </div>
          
          {/* Nome central */}
          <div className="text-center">
            <div className="text-xl font-bold">{dados.nome}</div>
            <div className="flex gap-2 mt-2">
              <User className="h-4 w-4 text-gray-400" />
              <Mail className="h-4 w-4 text-gray-400" />
              <Printer className="h-4 w-4 text-gray-400" />
            </div>
          </div>
          
          {/* Logos */}
          <div className="text-right">
            <div className="text-lg font-bold text-blue-400">b.in</div>
            <div className="text-sm text-gray-400">Tera Science</div>
          </div>
        </div>

        {/* Grid principal - 2x3 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* 1. Gordura */}
          <Card className="bg-gradient-to-br from-red-900/20 to-red-800/20 border-red-500/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-red-400 text-lg">Gordura</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="text-center">
                  <div className="text-sm text-gray-400">Massa Gorda</div>
                  <div className="text-lg font-bold text-red-400">
                    {dados.massaGorda} Kg / -1,5% 
                    <TrendingDown className="inline ml-1 h-4 w-4 text-red-500" />
                  </div>
                </div>
                
                {/* Silhueta vermelha */}
                <div className="w-24 h-32 relative">
                  <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-medium text-gray-300">
                    {dados.altura} cm
                  </div>
                  <div className="absolute top-1/2 -right-8 transform -translate-y-1/2 text-xs font-medium text-gray-300">
                    99,0 cm
                  </div>
                  <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs font-medium text-gray-300">
                    {dados.peso.toFixed(1)} kg
                  </div>
                  
                  <img 
                    src="/images/silhueta svg.png" 
                    alt="Silhueta corporal"
                    className="w-full h-full object-contain"
                    style={{ filter: 'brightness(0) invert(1) sepia(1) hue-rotate(0deg) saturate(2)' }}
                  />
                </div>
              </div>
              
              <div className="text-center">
                <div className="text-sm text-gray-400">% Gordura</div>
                <div className="text-2xl font-bold text-red-400">{dados.gorduraCorporal} %</div>
              </div>
              
              {/* Progress Bar Melhorado */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Baixo</span>
                  <span className="text-gray-400">Alto</span>
                </div>
                <div className="relative">
                  <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 rounded-full"
                      style={{ width: `${dados.gorduraCorporal}%` }}
                    />
                  </div>
                  <div 
                    className="absolute top-0 w-1 h-3 bg-white rounded-full shadow-lg"
                    style={{ left: `${dados.gorduraCorporal}%` }}
                  />
                </div>
                <div className="text-center text-sm text-red-500">
                  -1,0 <TrendingDown className="inline h-3 w-3" />
                </div>
              </div>
              
              <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-700">
                <Target className="mr-2 h-4 w-4" />
                Target
              </Button>
            </CardContent>
          </Card>

          {/* 2. Hidratação */}
          <Card className="bg-gradient-to-br from-blue-900/20 to-blue-800/20 border-blue-500/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-blue-400 text-lg">Hidratação</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="text-center">
                  <div className="text-sm text-gray-400">Água Corporal Total</div>
                  <div className="text-lg font-bold text-blue-400">
                    {dados.aguaCorporal} litros / {dados.aguaCorporalPercent}%
                  </div>
                </div>
                
                {/* Silhueta verde */}
                <div className="w-24 h-32 relative">
                  <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-medium text-gray-300">
                    {dados.altura} cm
                  </div>
                  <div className="absolute top-1/2 -right-8 transform -translate-y-1/2 text-xs font-medium text-gray-300">
                    99,0 cm
                  </div>
                  <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs font-medium text-gray-300">
                    {dados.peso.toFixed(1)} kg
                  </div>
                  
                  <img 
                    src="/images/silhueta svg.png" 
                    alt="Silhueta corporal"
                    className="w-full h-full object-contain"
                    style={{ filter: 'brightness(0) invert(1) sepia(1) hue-rotate(90deg) saturate(2)' }}
                  />
                </div>
              </div>
              
              <div className="text-center">
                <div className="text-sm text-gray-400">Índice de hidratação</div>
                <div className="text-lg font-bold text-blue-400">{dados.indiceHidratacao} cm/ohms x 10</div>
              </div>
              
              {/* Progress Bar com Marcadores */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-gray-400">
                  <span>1.5</span>
                  <span>2.7</span>
                  <span>3.9</span>
                  <span>5.1</span>
                </div>
                <div className="relative">
                  <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 rounded-full" />
                  </div>
                  <div 
                    className="absolute top-0 w-1 h-3 bg-yellow-400 rounded-full shadow-lg"
                    style={{ left: `${((dados.indiceHidratacao - 1.5) / (5.1 - 1.5)) * 100}%` }}
                  />
                </div>
                <div className="text-center text-sm text-green-500">
                  +0,2 <TrendingUp className="inline h-3 w-3" />
                </div>
              </div>
              
              <div className="text-center">
                <div className="text-sm text-gray-400">Água na Massa Magra</div>
                <div className="text-lg font-bold text-blue-400">{dados.aguaMassaMagra}%</div>
              </div>
            </CardContent>
          </Card>

          {/* 3. Água Intra e Extra Celular */}
          <Card className="bg-gradient-to-br from-yellow-900/20 to-yellow-800/20 border-yellow-500/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-yellow-400 text-lg">Água Intra e Extra Celular</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="text-center">
                  <div className="text-sm text-gray-400">Intracelular</div>
                  <div className="text-lg font-bold text-yellow-400">{dados.aguaIntracelular} litros</div>
                </div>
                
                {/* Silhueta amarela */}
                <div className="w-24 h-32 relative">
                  <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-medium text-gray-300">
                    {dados.altura} cm
                  </div>
                  <div className="absolute top-1/2 -right-8 transform -translate-y-1/2 text-xs font-medium text-gray-300">
                    99,0 cm
                  </div>
                  <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs font-medium text-gray-300">
                    {dados.peso.toFixed(1)} kg
                  </div>
                  
                  <img 
                    src="/images/silhueta svg.png" 
                    alt="Silhueta corporal"
                    className="w-full h-full object-contain"
                    style={{ filter: 'brightness(0) invert(1) sepia(1) hue-rotate(45deg) saturate(2)' }}
                  />
                </div>
              </div>
              
              <div className="text-center">
                <div className="text-sm text-gray-400">Água Intracelular %</div>
                <div className="text-lg font-bold text-yellow-400">{dados.aguaIntracelularPercent}%</div>
              </div>
              
              {/* Progress Bar Melhorado */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-gray-400">
                  <span>47.4</span>
                  <span>52.5</span>
                  <span>57.7</span>
                </div>
                <div className="relative">
                  <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-red-500 via-yellow-500 to-blue-500 rounded-full" />
                  </div>
                  <div 
                    className="absolute top-0 w-1 h-3 bg-yellow-400 rounded-full shadow-lg"
                    style={{ left: `${((dados.aguaIntracelularPercent - 47.4) / (57.7 - 47.4)) * 100}%` }}
                  />
                </div>
                <div className="text-center text-sm text-red-500">
                  -0,5 <TrendingDown className="inline h-3 w-3" />
                </div>
              </div>
              
              <div className="text-center">
                <div className="text-sm text-gray-400">Extracelular</div>
                <div className="text-lg font-bold text-yellow-400">{dados.aguaExtracelular} litros</div>
              </div>
            </CardContent>
          </Card>

          {/* 4. Massa Magra e Muscular */}
          <Card className="bg-gradient-to-br from-orange-900/20 to-orange-800/20 border-orange-500/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-orange-400 text-lg">Massa Magra e Muscular</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-2 text-center text-sm">
                <div>
                  <div className="text-gray-400">Massa Magra</div>
                  <div className="font-bold text-orange-400">{dados.massaMagra} Kg / {dados.massaMagraPercent}%</div>
                </div>
                <div>
                  <div className="text-gray-400">Razão Músculo Gordura</div>
                  <div className="font-bold text-orange-400">{dados.razaoMusculoGordura} kg músculo / kg gordura</div>
                </div>
                <div>
                  <div className="text-gray-400">Massa Muscular</div>
                  <div className="font-bold text-orange-400">{dados.massaMuscular} Kg / {dados.massaMuscularPercent}%</div>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                {/* Silhueta amarela */}
                <div className="w-24 h-32 relative">
                  <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-medium text-gray-300">
                    {dados.altura} cm
                  </div>
                  <div className="absolute top-1/2 -right-8 transform -translate-y-1/2 text-xs font-medium text-gray-300">
                    99,0 cm
                  </div>
                  <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs font-medium text-gray-300">
                    {dados.peso.toFixed(1)} kg
                  </div>
                  
                  <img 
                    src="/images/silhueta svg.png" 
                    alt="Silhueta corporal"
                    className="w-full h-full object-contain"
                    style={{ filter: 'brightness(0) invert(1) sepia(1) hue-rotate(45deg) saturate(2)' }}
                  />
                </div>
                
                {/* Progress Bar Circular */}
                <div className="flex-1">
                  <div className="text-center mb-2">
                    <div className="text-lg font-bold text-green-400">{dados.razaoMusculoGordura}</div>
                    <div className="text-sm text-green-500">+0,0 <TrendingUp className="inline h-3 w-3" /></div>
                  </div>
                  <div className="relative">
                    <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 rounded-full" />
                    </div>
                    <div 
                      className="absolute top-0 w-1 h-3 bg-yellow-400 rounded-full shadow-lg"
                      style={{ left: `${(dados.razaoMusculoGordura / 2.1) * 100}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>0.2</span>
                    <span>1.4</span>
                  </div>
                </div>
              </div>
              
              <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-700">
                <Activity className="mr-2 h-4 w-4" />
                Vitality
              </Button>
            </CardContent>
          </Card>

          {/* 5. Peso, Altura e TMB */}
          <Card className="bg-gradient-to-br from-gray-900/20 to-gray-800/20 border-gray-500/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-gray-400 text-lg">Peso, Altura e TMB</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-2 text-center text-sm">
                <div>
                  <div className="text-gray-400">IMC</div>
                  <div className="font-bold text-gray-400">{dados.imc} Kg/m²</div>
                </div>
                <div>
                  <div className="text-gray-400">Idade</div>
                  <div className="font-bold text-gray-400">{dados.idade} anos</div>
                </div>
                <div>
                  <div className="text-gray-400">Taxa Metabólica Basal</div>
                  <div className="font-bold text-gray-400">{dados.metabolismoBasal} kcal/24h</div>
                </div>
              </div>
              
              <div className="flex items-center justify-center">
                <div className="relative">
                  {/* Silhueta com medidas */}
                  <svg width="120" height="200" viewBox="0 0 120 200">
                    <ellipse cx="60" cy="30" rx="20" ry="25" fill="none" stroke="#6b7280" strokeWidth="2"/>
                    <rect x="40" y="55" width="40" height="80" fill="none" stroke="#6b7280" strokeWidth="2"/>
                    <rect x="20" y="65" width="10" height="60" fill="none" stroke="#6b7280" strokeWidth="2"/>
                    <rect x="90" y="65" width="10" height="60" fill="none" stroke="#6b7280" strokeWidth="2"/>
                    <rect x="45" y="135" width="10" height="50" fill="none" stroke="#6b7280" strokeWidth="2"/>
                    <rect x="65" y="135" width="10" height="50" fill="none" stroke="#6b7280" strokeWidth="2"/>
                    
                    {/* Medidas com linhas tracejadas */}
                    <line x1="60" y1="10" x2="60" y2="20" stroke="#ef4444" strokeWidth="1" strokeDasharray="2,2"/>
                    <text x="60" y="8" textAnchor="middle" className="text-xs fill-gray-400">163 cm</text>
                    
                    <line x1="100" y1="95" x2="110" y2="95" stroke="#ef4444" strokeWidth="1" strokeDasharray="2,2"/>
                    <text x="115" y="98" className="text-xs fill-gray-400">99,0 cm</text>
                    
                    <line x1="100" y1="160" x2="110" y2="160" stroke="#ef4444" strokeWidth="1" strokeDasharray="2,2"/>
                    <text x="115" y="163" className="text-xs fill-gray-400">90,1 kg</text>
                  </svg>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button size="sm" className="flex-1 bg-red-600 hover:bg-red-700">avva</Button>
                <Button size="sm" className="flex-1 bg-blue-600 hover:bg-blue-700">Risco</Button>
                <Button size="sm" className="flex-1 bg-green-600 hover:bg-green-700">Sintomas</Button>
              </div>
            </CardContent>
          </Card>

          {/* 6. Análise Celular */}
          <Card className="bg-gradient-to-br from-green-900/20 to-green-800/20 border-green-500/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-green-400 text-lg">Análise Celular</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-2 text-center text-sm">
                <div>
                  <div className="text-gray-400">Ângulo de Fase</div>
                  <div className="font-bold text-green-400">{dados.anguloFase} graus</div>
                </div>
                <div>
                  <div className="text-gray-400">Idade</div>
                  <div className="font-bold text-green-400">{dados.idade} anos</div>
                </div>
                <div>
                  <div className="text-gray-400 flex items-center justify-center gap-1">
                    Idade Celular
                    <Info className="h-3 w-3 text-orange-400" />
                  </div>
                  <div className="font-bold text-green-400">{dados.idadeCelular} anos</div>
                </div>
              </div>
              
              {/* Progress Bar Melhorado */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-gray-400">
                  <span>4.3</span>
                  <span>6.5</span>
                  <span>8.7</span>
                </div>
                <div className="relative">
                  <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-red-500 via-yellow-500 to-blue-500 rounded-full" />
                  </div>
                  <div 
                    className="absolute top-0 w-1 h-3 bg-yellow-400 rounded-full shadow-lg"
                    style={{ left: `${((dados.anguloFase - 4.3) / (8.7 - 4.3)) * 100}%` }}
                  />
                </div>
                <div className="text-center text-sm text-red-500">
                  -0,3 <TrendingDown className="inline h-3 w-3" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BioimpedanciaPage; 