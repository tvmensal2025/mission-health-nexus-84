import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BodyChart, BodyCompositionChart, BodyTrendChart } from './body-chart';

export const BodyChartDemo: React.FC = () => {
  // Dados de exemplo para o gráfico principal
  const bodyData = {
    imc: 33.9,
    idade: 43,
    tmb: 1459,
    peso: 90.1,
    altura: 163,
    circunferencia: 99.0
  };

  // Dados de exemplo para composição corporal
  const compositionData = {
    gordura: 44.1,
    musculo: 24.0,
    agua: 39.9,
    osso: 15.0
  };

  // Dados de exemplo para evolução temporal
  const trendData = [
    { date: '01/01', value: 92.5, type: 'peso' as const },
    { date: '01/08', value: 91.8, type: 'peso' as const },
    { date: '01/15', value: 91.2, type: 'peso' as const },
    { date: '01/22', value: 90.5, type: 'peso' as const },
    { date: '01/29', value: 90.1, type: 'peso' as const }
  ];

  const imcTrendData = [
    { date: '01/01', value: 34.8, type: 'imc' as const },
    { date: '01/08', value: 34.5, type: 'imc' as const },
    { date: '01/15', value: 34.2, type: 'imc' as const },
    { date: '01/22', value: 34.0, type: 'imc' as const },
    { date: '01/29', value: 33.9, type: 'imc' as const }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            🎯 Gráficos Dentro do Corpo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Estes gráficos representam dados de saúde dentro de uma silhueta humana, 
            criando uma visualização mais intuitiva e personalizada.
          </p>
        </CardContent>
      </Card>

      {/* Gráfico Principal - Como na imagem */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BodyChart
          title="Peso, Altura e TMB"
          data={bodyData}
          showRisk={true}
          showSymptoms={true}
        />

        <BodyCompositionChart
          data={compositionData}
        />
      </div>

      {/* Gráficos de Evolução */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BodyTrendChart
          data={trendData.map(d => ({ ...d, time: '00:00' }))}
        />

        <BodyTrendChart
          data={imcTrendData.map(d => ({ ...d, time: '00:00' }))}
        />
      </div>

      {/* Explicação dos Componentes */}
      <Card>
        <CardHeader>
          <CardTitle>📊 Tipos de Gráficos Dentro do Corpo</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold mb-2">BodyChart</h3>
              <p className="text-sm text-muted-foreground">
                Gráfico principal com silhueta humana, medidas corporais e botões de ação.
                Ideal para mostrar IMC, idade, TMB e medidas físicas.
              </p>
            </div>

            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold mb-2">BodyCompositionChart</h3>
              <p className="text-sm text-muted-foreground">
                Silhueta com gradiente colorido representando a composição corporal.
                Mostra gordura, músculo, água e massa óssea de forma visual.
              </p>
            </div>

            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold mb-2">BodyTrendChart</h3>
              <p className="text-sm text-muted-foreground">
                Linha de tendência desenhada dentro da silhueta humana.
                Perfeito para mostrar evolução de peso, IMC ou outros parâmetros.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Como Usar */}
      <Card>
        <CardHeader>
          <CardTitle>🔧 Como Implementar</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">1. Importar Componentes</h3>
              <pre className="bg-muted p-3 rounded text-sm overflow-x-auto">
{`import { BodyChart, BodyCompositionChart, BodyTrendChart } from '@/components/ui/body-chart';`}
              </pre>
            </div>

            <div>
              <h3 className="font-semibold mb-2">2. Preparar Dados</h3>
              <pre className="bg-muted p-3 rounded text-sm overflow-x-auto">
{`const bodyData = {
  imc: 33.9,
  idade: 43,
  tmb: 1459,
  peso: 90.1,
  altura: 163,
  circunferencia: 99.0
};`}
              </pre>
            </div>

            <div>
              <h3 className="font-semibold mb-2">3. Usar Componente</h3>
              <pre className="bg-muted p-3 rounded text-sm overflow-x-auto">
{`<BodyChart
  title="Peso, Altura e TMB"
  data={bodyData}
  showRisk={true}
  showSymptoms={true}
/>`}
              </pre>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Vantagens */}
      <Card>
        <CardHeader>
          <CardTitle>✅ Vantagens dos Gráficos Dentro do Corpo</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h3 className="font-semibold">🎯 Visualização Intuitiva</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Dados representados dentro da silhueta humana</li>
                <li>• Fácil compreensão da localização dos dados</li>
                <li>• Conexão visual entre dados e corpo</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold">🎨 Design Moderno</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Tema escuro profissional</li>
                <li>• Cores contrastantes e legíveis</li>
                <li>• Interface limpa e organizada</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold">📊 Dados Contextuais</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Medidas posicionadas corretamente</li>
                <li>• Linhas de referência na silhueta</li>
                <li>• Informações complementares</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold">🔧 Flexibilidade</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Múltiplos tipos de gráficos</li>
                <li>• Personalização de cores e dados</li>
                <li>• Fácil integração com dados reais</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BodyChartDemo; 