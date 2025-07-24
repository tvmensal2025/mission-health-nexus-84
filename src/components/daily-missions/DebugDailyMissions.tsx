import React from 'react';
import { User } from '@supabase/supabase-js';
import { dailyQuestions, getQuestionsBySection } from '@/data/daily-questions';

interface DebugDailyMissionsProps {
  user: User | null;
}

export const DebugDailyMissions: React.FC<DebugDailyMissionsProps> = ({ user }) => {
  const morningQuestions = getQuestionsBySection('morning');
  const habitsQuestions = getQuestionsBySection('habits');
  const mindsetQuestions = getQuestionsBySection('mindset');

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold mb-6">Debug - Sistema de Missão do Dia</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Seção Manhã */}
        <div className="p-4 bg-blue-50 rounded-lg">
          <h2 className="font-bold text-blue-800 mb-3">🌅 RITUAL DA MANHÃ</h2>
          <p className="text-blue-600 mb-2">Perguntas: {morningQuestions.length}</p>
          <ul className="text-sm text-blue-700 space-y-1">
            {morningQuestions.map((q, index) => (
              <li key={q.id} className="flex items-center gap-2">
                <span className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center text-xs">
                  {index + 1}
                </span>
                <span>{q.question.substring(0, 30)}...</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Seção Hábitos */}
        <div className="p-4 bg-green-50 rounded-lg">
          <h2 className="font-bold text-green-800 mb-3">💪 HÁBITOS DO DIA</h2>
          <p className="text-green-600 mb-2">Perguntas: {habitsQuestions.length}</p>
          <ul className="text-sm text-green-700 space-y-1">
            {habitsQuestions.map((q, index) => (
              <li key={q.id} className="flex items-center gap-2">
                <span className="w-6 h-6 bg-green-200 rounded-full flex items-center justify-center text-xs">
                  {index + 1}
                </span>
                <span>{q.question.substring(0, 30)}...</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Seção Mente */}
        <div className="p-4 bg-purple-50 rounded-lg">
          <h2 className="font-bold text-purple-800 mb-3">🧠 MENTE & EMOÇÕES</h2>
          <p className="text-purple-600 mb-2">Perguntas: {mindsetQuestions.length}</p>
          <ul className="text-sm text-purple-700 space-y-1">
            {mindsetQuestions.map((q, index) => (
              <li key={q.id} className="flex items-center gap-2">
                <span className="w-6 h-6 bg-purple-200 rounded-full flex items-center justify-center text-xs">
                  {index + 1}
                </span>
                <span>{q.question.substring(0, 30)}...</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Detalhes das Perguntas */}
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Detalhes de Todas as Perguntas</h2>
        <div className="space-y-4">
          {dailyQuestions.map((question, index) => (
            <div key={question.id} className="p-4 border rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <span className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-sm font-bold">
                  {index + 1}
                </span>
                <div>
                  <h3 className="font-semibold">{question.question}</h3>
                  <p className="text-sm text-gray-600">
                    ID: {question.id} | Seção: {question.section} | Tipo: {question.type} | Pontos: {question.points}
                  </p>
                </div>
              </div>
              
              {question.options && (
                <div className="ml-11">
                  <p className="text-sm text-gray-600 mb-1">Opções:</p>
                  <ul className="text-sm space-y-1">
                    {question.options.map((option, optIndex) => (
                      <li key={optIndex} className="text-gray-700">• {option}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Status do Usuário */}
      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h2 className="font-bold text-gray-800 mb-2">Status do Usuário</h2>
        <p className="text-gray-600">
          {user ? `Logado como: ${user.email}` : 'Nenhum usuário logado'}
        </p>
      </div>
    </div>
  );
}; 