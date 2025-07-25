import React from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, 
  Tooltip, Legend, Area, AreaChart
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import PersonagemCorporal3D from '@/components/PersonagemCorporal3D';
import Modelo3DControls from '@/components/Modelo3DControls';

interface BodyEvolutionChartProps {
  weightData: Array<{
    date: string;
    time: string;
    value: number;
    type: 'peso' | 'imc' | 'gordura';
  }>;
  bodyCompositionData: {
    gordura: number;
    musculo: number;
    agua: number;
    osso: number;
  };
  className?: string;
}

export const BodyEvolutionChart: React.FC<BodyEvolutionChartProps> = ({
  weightData,
  bodyCompositionData,
  className = ''
}) => {
  // Estados para controles do modelo 3D
  const [modelControls, setModelControls] = React.useState({
    rotation: { x: 0, y: 0, z: 0 },
    zoom: 1,
    position: { x: 0, y: 0 },
    autoRotate: true
  });

  // Ordenar dados do mais recente para o mais antigo
  const sortedData = [...weightData].reverse();
  
  // Calcular tendência
  const getTrendIcon = () => {
    if (sortedData.length < 2) return <Minus className="h-4 w-4 text-gray-400" />;
    const first = sortedData[0].value;
    const last = sortedData[sortedData.length - 1].value;
    if (first > last) return <TrendingUp className="h-4 w-4 text-green-500" />;
    if (first < last) return <TrendingDown className="h-4 w-4 text-red-500" />;
    return <Minus className="h-4 w-4 text-gray-400" />;
  };

  const getTrendText = () => {
    if (sortedData.length < 2) return 'Estável';
    const first = sortedData[0].value;
    const last = sortedData[sortedData.length - 1].value;
    if (first > last) return 'Aumentando';
    if (first < last) return 'Diminuindo';
    return 'Estável';
  };

  // Handlers para controles do modelo 3D
  const handleRotationChange = (rotation: { x: number; y: number; z: number }) => {
    setModelControls(prev => ({ ...prev, rotation }));
  };

  const handleZoomChange = (zoom: number) => {
    setModelControls(prev => ({ ...prev, zoom }));
  };

  const handlePositionChange = (position: { x: number; y: number }) => {
    setModelControls(prev => ({ ...prev, position }));
  };

  const handleAutoRotateToggle = (autoRotate: boolean) => {
    setModelControls(prev => ({ ...prev, autoRotate }));
  };

  return (
    <Card className={`bg-black text-white border-gray-800 ${className}`}>
      <CardHeader>
        <CardTitle className="text-yellow-400 text-center flex items-center justify-center gap-2">
          Evolução Corporal
          {getTrendIcon()}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Coluna da Esquerda - Silhueta com Composição */}
          <div className="relative">
            <div className="text-center mb-4">
              <h3 className="text-lg font-semibold text-yellow-400">Composição Corporal</h3>
              <p className="text-sm text-gray-400">Distribuição atual dos componentes</p>
            </div>
            
            {/* Modelo 3D com composição */}
            <div className="relative flex flex-col gap-4">
              {/* Controles do modelo 3D */}
              <Modelo3DControls
                onRotationChange={handleRotationChange}
                onZoomChange={handleZoomChange}
                onPositionChange={handlePositionChange}
                onAutoRotateToggle={handleAutoRotateToggle}
                className="absolute top-0 right-0 z-20 w-48"
              />
              
              <div className="relative flex justify-center items-center">
                {/* Modelo 3D Feminino com controles */}
                <div className="relative">
                  <PersonagemCorporal3D 
                    genero="feminino"
                    className="w-48 h-72"
                    controls={modelControls}
                  />
                  
                  {/* Legenda da composição sobreposta */}
                  <div className="absolute left-2 top-4 space-y-2 bg-black/70 p-3 rounded-lg backdrop-blur-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <div className="text-sm">
                        <div className="font-bold text-yellow-400">{bodyCompositionData.gordura}%</div>
                        <div className="text-xs text-gray-400">Gordura</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <div className="text-sm">
                        <div className="font-bold text-green-400">{bodyCompositionData.musculo}%</div>
                        <div className="text-xs text-gray-400">Músculo</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <div className="text-sm">
                        <div className="font-bold text-blue-400">{bodyCompositionData.agua}%</div>
                        <div className="text-xs text-gray-400">Água</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                      <div className="text-sm">
                        <div className="font-bold text-purple-400">{bodyCompositionData.osso}%</div>
                        <div className="text-xs text-gray-400">Osso</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Coluna da Direita - Gráfico de Evolução */}
          <div>
            <div className="text-center mb-4">
              <h3 className="text-lg font-semibold text-yellow-400">Evolução do Peso</h3>
              <p className="text-sm text-gray-400">Tendência temporal das medições</p>
            </div>
            
            {/* Gráfico de linha */}
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={sortedData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis 
                    dataKey="date" 
                    stroke="#9CA3AF"
                    fontSize={12}
                    tick={{ fill: '#9CA3AF' }}
                  />
                  <YAxis 
                    stroke="#9CA3AF"
                    fontSize={12}
                    tick={{ fill: '#9CA3AF' }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1F2937', 
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      color: '#F9FAFB'
                    }}
                    labelStyle={{ color: '#F9FAFB' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#F97316" 
                    fill="#F97316" 
                    fillOpacity={0.3}
                    strokeWidth={3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Informações da evolução */}
            <div className="mt-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">Peso Atual:</span>
                <span className="text-lg font-bold text-yellow-400">
                  {sortedData[0]?.value.toFixed(1)} kg
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">Tendência:</span>
                <span className="text-sm font-medium text-gray-300">
                  {getTrendText()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">Última medição:</span>
                <span className="text-sm text-gray-300">
                  {sortedData[0]?.date} às {sortedData[0]?.time}
                </span>
              </div>
            </div>

            {/* Pontos de dados destacados */}
            <div className="mt-4">
              <h4 className="text-sm font-semibold text-gray-300 mb-2">Histórico Recente</h4>
              <div className="space-y-2">
                {sortedData.slice(0, 3).map((d, i) => (
                  <div key={i} className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div 
                        className={`w-2 h-2 rounded-full ${i === 0 ? 'bg-yellow-400' : 'bg-gray-500'}`}
                      ></div>
                      <span className={`text-xs ${i === 0 ? 'text-yellow-400 font-bold' : 'text-gray-400'}`}>
                        {d.date} às {d.time}
                      </span>
                    </div>
                    <span className={`text-xs font-medium ${i === 0 ? 'text-yellow-400' : 'text-gray-400'}`}>
                      {d.value.toFixed(1)} kg
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}; 