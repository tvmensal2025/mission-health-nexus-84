import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface SilhuetaProps {
  altura: number;
  peso: number;
  circunferenciaAbdominal?: number;
  imc: number;
  cor?: 'red' | 'green' | 'yellow' | 'blue' | 'purple';
  titulo?: string;
}

const BioimpedanciaSilhueta: React.FC<SilhuetaProps> = ({ 
  altura, 
  peso, 
  circunferenciaAbdominal, 
  imc, 
  cor = 'blue',
  titulo = 'Silhueta Corporal'
}) => {
  const cores = {
    red: 'bg-red-400/20',
    green: 'bg-green-400/20', 
    yellow: 'bg-yellow-400/20',
    blue: 'bg-blue-400/20',
    purple: 'bg-purple-400/20'
  };

  return (
    <div className="w-48 h-64 relative flex items-center justify-center">
      {/* Container da silhueta com medidas */}
      <div className="relative w-32 h-48">
        
        {/* Medida da altura - acima da cabeça */}
        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-xs font-medium text-gray-700">
          {altura} cm
        </div>
        
        {/* Medida da circunferência - lado direito */}
        <div className="absolute top-1/2 -right-12 transform -translate-y-1/2 text-xs font-medium text-gray-700">
          {circunferenciaAbdominal ? `${circunferenciaAbdominal.toFixed(1)} cm` : '--'}
        </div>
        
        {/* Medida do peso - abaixo dos pés */}
        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs font-medium text-gray-700">
          {peso.toFixed(1)} kg
        </div>
        
        {/* Silhueta PNG transparente */}
        <img 
          src="/images/silhueta svg.png" 
          alt="Silhueta corporal"
          className={`w-full h-full object-contain ${cores[cor]}`}
          style={{
            filter: cor === 'red' ? 'brightness(0.8) sepia(1) hue-rotate(0deg) saturate(2)' :
                    cor === 'green' ? 'brightness(0.8) sepia(1) hue-rotate(90deg) saturate(2)' :
                    cor === 'yellow' ? 'brightness(0.8) sepia(1) hue-rotate(45deg) saturate(2)' :
                    cor === 'blue' ? 'brightness(0.8) sepia(1) hue-rotate(180deg) saturate(2)' :
                    cor === 'purple' ? 'brightness(0.8) sepia(1) hue-rotate(270deg) saturate(2)' :
                    'brightness(1)'
          }}
        />
      </div>
    </div>
  );
};

export default BioimpedanciaSilhueta; 