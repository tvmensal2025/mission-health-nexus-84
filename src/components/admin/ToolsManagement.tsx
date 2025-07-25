import React, { useState } from 'react';
import { User } from '@supabase/supabase-js';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SessionManagement from './SessionManagement';
import SaboteurManagement from './SaboteurManagement';
import {
  Settings, FileText, Brain, Users, 
  BarChart3, Wrench, Cog, Target
} from 'lucide-react';

interface ToolsManagementProps {
  user: User | null;
}

export default function ToolsManagement({ user }: ToolsManagementProps) {
  const [activeTab, setActiveTab] = useState('sessions');

  const tools = [
    {
      id: 'sessions',
      title: 'Gestão de Sessões',
      description: 'Crie e gerencie sessões personalizadas para usuários',
      icon: FileText,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      component: SessionManagement
    },
    {
      id: 'saboteurs',
      title: 'Sabotadores Customizados',
      description: 'Crie sabotadores específicos para diferentes contextos',
      icon: Brain,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      component: SaboteurManagement
    },
    {
      id: 'analytics',
      title: 'Análise de Ferramentas',
      description: 'Estatísticas e insights sobre o uso das ferramentas',
      icon: BarChart3,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      component: null // Placeholder para futuro
    },
    {
      id: 'settings',
      title: 'Configurações',
      description: 'Configure parâmetros globais das ferramentas',
      icon: Cog,
      color: 'text-gray-600',
      bgColor: 'bg-gray-50',
      borderColor: 'border-gray-200',
      component: null // Placeholder para futuro
    }
  ];

  const renderToolContent = (toolId: string) => {
    const tool = tools.find(t => t.id === toolId);
    if (!tool?.component) {
      return (
        <div className="text-center py-12">
          <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${tool?.bgColor} ${tool?.borderColor} border-2 mb-4`}>
            {tool?.icon && <tool.icon className={`w-8 h-8 ${tool.color}`} />}
          </div>
          <h3 className="text-xl font-semibold mb-2">{tool?.title}</h3>
          <p className="text-muted-foreground mb-4">{tool?.description}</p>
          <p className="text-sm text-muted-foreground">Em desenvolvimento...</p>
        </div>
      );
    }

    const Component = tool.component;
    return <Component user={user} />;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-primary/10 rounded-lg">
            <Wrench className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Ferramentas Administrativas</h1>
            <p className="text-muted-foreground">
              Gerencie sessões, sabotadores e outras ferramentas personalizadas
            </p>
          </div>
        </div>

        {/* Cards de Visão Geral */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {tools.map((tool) => {
            const Icon = tool.icon;
            const isActive = activeTab === tool.id;
            return (
              <Card 
                key={tool.id}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  isActive ? `${tool.bgColor} ${tool.borderColor} border-2` : 'hover:border-primary/20'
                }`}
                onClick={() => setActiveTab(tool.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${tool.bgColor}`}>
                      <Icon className={`w-5 h-5 ${tool.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm mb-1 truncate">
                        {tool.title}
                      </h3>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {tool.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Conteúdo das Ferramentas */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          {tools.map((tool) => {
            const Icon = tool.icon;
            return (
              <TabsTrigger 
                key={tool.id} 
                value={tool.id}
                className="flex items-center gap-2"
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tool.title.split(' ')[0]}</span>
              </TabsTrigger>
            );
          })}
        </TabsList>

        {tools.map((tool) => (
          <TabsContent key={tool.id} value={tool.id} className="space-y-4">
            {renderToolContent(tool.id)}
          </TabsContent>
        ))}
      </Tabs>

      {/* Seção de Ajuda */}
      <Card className="border-dashed">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Guia Rápido
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-medium mb-2">Sessões Personalizadas</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Crie sessões com conteúdo estruturado</li>
                <li>• Atribua sessões para usuários específicos</li>
                <li>• Acompanhe o progresso em tempo real</li>
                <li>• Configure dificuldade e tempo estimado</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Sabotadores Customizados</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Defina sabotadores para contextos específicos</li>
                <li>• Configure características e estratégias</li>
                <li>• Personalize cores e ícones</li>
                <li>• Ative/desative conforme necessário</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}