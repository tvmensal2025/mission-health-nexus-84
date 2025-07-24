import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PersonIcon, BodyCompositionIcon, HealthIndicatorIcon } from './person-icon';

export const PersonIconDemo: React.FC = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PersonIcon size="md" variant="filled" color="#F97316" />
            <span>Demonstração dos Bonecos</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Variações do PersonIcon */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Variações do Boneco Principal</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 border rounded-lg">
                <PersonIcon size="lg" variant="outline" color="#3B82F6" />
                <p className="text-sm mt-2">Outline Azul</p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <PersonIcon size="lg" variant="filled" color="#10B981" />
                <p className="text-sm mt-2">Filled Verde</p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <PersonIcon size="lg" variant="gradient" color="#F59E0B" />
                <p className="text-sm mt-2">Gradient Laranja</p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <PersonIcon size="lg" variant="filled" color="#EC4899" />
                <p className="text-sm mt-2">Filled Rosa</p>
              </div>
            </div>
          </div>

          {/* Ícones de Composição Corporal */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Ícones de Composição Corporal</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <BodyCompositionIcon type="fat" size="lg" />
              <BodyCompositionIcon type="muscle" size="lg" />
              <BodyCompositionIcon type="water" size="lg" />
              <BodyCompositionIcon type="bone" size="lg" />
            </div>
          </div>

          {/* Indicadores de Saúde */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Indicadores de Saúde</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <HealthIndicatorIcon status="excellent" size="lg" />
              <HealthIndicatorIcon status="good" size="lg" />
              <HealthIndicatorIcon status="warning" size="lg" />
              <HealthIndicatorIcon status="danger" size="lg" />
            </div>
          </div>

          {/* Tamanhos */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Diferentes Tamanhos</h3>
            <div className="flex items-center gap-4">
              <PersonIcon size="sm" variant="filled" color="#3B82F6" />
              <PersonIcon size="md" variant="filled" color="#3B82F6" />
              <PersonIcon size="lg" variant="filled" color="#3B82F6" />
              <PersonIcon size="xl" variant="filled" color="#3B82F6" />
            </div>
          </div>

          {/* Gêneros */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Diferentes Gêneros</h3>
            <div className="flex items-center gap-4">
              <div className="text-center">
                <PersonIcon size="lg" variant="filled" gender="male" />
                <p className="text-sm mt-2">Masculino</p>
              </div>
              <div className="text-center">
                <PersonIcon size="lg" variant="filled" gender="female" />
                <p className="text-sm mt-2">Feminino</p>
              </div>
              <div className="text-center">
                <PersonIcon size="lg" variant="filled" gender="neutral" />
                <p className="text-sm mt-2">Neutro</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PersonIconDemo; 