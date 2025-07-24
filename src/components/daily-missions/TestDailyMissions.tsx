import React from 'react';
import { User } from '@supabase/supabase-js';

interface TestDailyMissionsProps {
  user: User | null;
}

export const TestDailyMissions: React.FC<TestDailyMissionsProps> = ({ user }) => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Teste do Sistema de Missão do Dia</h1>
      
      <div className="space-y-4">
        <div className="p-4 bg-blue-50 rounded-lg">
          <h2 className="font-semibold text-blue-800">Status do Usuário</h2>
          <p className="text-blue-600">
            {user ? `Usuário logado: ${user.email}` : 'Nenhum usuário logado'}
          </p>
        </div>

        <div className="p-4 bg-green-50 rounded-lg">
          <h2 className="font-semibold text-green-800">Componentes Criados</h2>
          <ul className="text-green-600 space-y-1">
            <li>✅ DailyMissionsNew.tsx</li>
            <li>✅ QuestionCard.tsx</li>
            <li>✅ SectionCard.tsx</li>
            <li>✅ useDailyMissions.ts</li>
            <li>✅ daily-questions.ts</li>
            <li>✅ daily-missions.ts (tipos)</li>
          </ul>
        </div>

        <div className="p-4 bg-yellow-50 rounded-lg">
          <h2 className="font-semibold text-yellow-800">Banco de Dados</h2>
          <p className="text-yellow-600">
            Tabelas criadas: daily_mission_sessions, daily_responses, user_achievements, weekly_insights
          </p>
        </div>

        <div className="p-4 bg-purple-50 rounded-lg">
          <h2 className="font-semibold text-purple-800">Próximos Passos</h2>
          <ol className="text-purple-600 space-y-1">
            <li>1. Aplicar migração no Supabase remoto</li>
            <li>2. Testar o componente DailyMissionsNew</li>
            <li>3. Verificar se as perguntas carregam</li>
            <li>4. Testar salvamento de respostas</li>
          </ol>
        </div>
      </div>
    </div>
  );
}; 