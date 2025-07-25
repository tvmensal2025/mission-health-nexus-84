import React from 'react';

const ChallengesPage: React.FC = () => {
  return (
    <div className="container py-6">
      <h1 className="text-3xl font-bold mb-2">Desafios de Saúde</h1>
      <p className="text-muted-foreground">
        Participe de desafios para melhorar sua saúde e ganhar recompensas
      </p>
      
      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Desafios Disponíveis</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-6 border rounded-lg bg-white shadow-sm">
            <h3 className="text-lg font-semibold mb-2">Jejum 16:8 por 7 dias</h3>
            <p className="text-sm text-gray-600 mb-4">
              16h de jejum, 8h de alimentação por 7 dias consecutivos
            </p>
            <div className="flex justify-between items-center">
              <span className="text-sm text-green-600 font-medium">Médio</span>
              <span className="text-sm text-blue-600 font-medium">200 pts</span>
            </div>
          </div>
          
          <div className="p-6 border rounded-lg bg-white shadow-sm">
            <h3 className="text-lg font-semibold mb-2">10.000 passos por dia</h3>
            <p className="text-sm text-gray-600 mb-4">
              Caminhe 10.000 passos diariamente por 30 dias
            </p>
            <div className="flex justify-between items-center">
              <span className="text-sm text-green-600 font-medium">Médio</span>
              <span className="text-sm text-blue-600 font-medium">300 pts</span>
            </div>
          </div>
          
          <div className="p-6 border rounded-lg bg-white shadow-sm">
            <h3 className="text-lg font-semibold mb-2">2L de água por dia</h3>
            <p className="text-sm text-gray-600 mb-4">
              Beba pelo menos 2 litros de água todos os dias por 30 dias
            </p>
            <div className="flex justify-between items-center">
              <span className="text-sm text-green-600 font-medium">Fácil</span>
              <span className="text-sm text-blue-600 font-medium">150 pts</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChallengesPage; 