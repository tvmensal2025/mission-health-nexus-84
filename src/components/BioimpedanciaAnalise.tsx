import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, TrendingDown, Minus, 
  AlertTriangle, CheckCircle, Info 
} from 'lucide-react';

interface AnaliseProps {
  titulo: string;
  valor: number;
  unidade: string;
  valorAnterior?: number;
  referencia: {
    min: number;
    max: number;
    otimo: number;
  };
  interpretacao: string;
  recomendacao: string;
  cor: 'red' | 'yellow' | 'green' | 'blue';
}

const BioimpedanciaAnalise: React.FC<AnaliseProps> = ({
  titulo,
  valor,
  unidade,
  valorAnterior,
  referencia,
  interpretacao,
  recomendacao,
  cor
}) => {
  const variacao = valorAnterior ? ((valor - valorAnterior) / valorAnterior) * 100 : 0;
  const percentualReferencia = ((valor - referencia.min) / (referencia.max - referencia.min)) * 100;
  
  const getStatusColor = () => {
    if (valor < referencia.min) return 'text-red-500';
    if (valor > referencia.max) return 'text-yellow-500';
    if (valor >= referencia.otimo) return 'text-green-500';
    return 'text-blue-500';
  };

  const getStatusIcon = () => {
    if (valor < referencia.min) return <AlertTriangle className="h-4 w-4" />;
    if (valor > referencia.max) return <Info className="h-4 w-4" />;
    if (valor >= referencia.otimo) return <CheckCircle className="h-4 w-4" />;
    return <Info className="h-4 w-4" />;
  };

  const getVariacaoIcon = () => {
    if (variacao > 0) return <TrendingUp className="h-4 w-4 text-green-500" />;
    if (variacao < 0) return <TrendingDown className="h-4 w-4 text-red-500" />;
    return <Minus className="h-4 w-4 text-gray-500" />;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="text-lg">{titulo}</span>
          <div className="flex items-center gap-2">
            {getStatusIcon()}
            {valorAnterior && getVariacaoIcon()}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <div className={`text-3xl font-bold ${getStatusColor()}`}>
            {valor.toFixed(1)} {unidade}
          </div>
          {valorAnterior && (
            <div className="flex items-center justify-center gap-2 mt-2">
              <span className="text-sm text-muted-foreground">
                {variacao > 0 ? '+' : ''}{variacao.toFixed(1)}%
              </span>
              <span className="text-xs text-muted-foreground">
                vs {valorAnterior.toFixed(1)} {unidade}
              </span>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Referência:</span>
            <span>{referencia.min} - {referencia.max} {unidade}</span>
          </div>
          <Progress 
            value={Math.min(Math.max(percentualReferencia, 0), 100)} 
            className="h-2"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Baixo</span>
            <span>Ótimo</span>
            <span>Alto</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="text-sm">
            <strong>Interpretação:</strong> {interpretacao}
          </div>
          <div className="text-sm">
            <strong>Recomendação:</strong> {recomendacao}
          </div>
        </div>

        <div className="flex gap-2">
          <Badge variant={valor < referencia.min ? 'destructive' : 'secondary'}>
            {valor < referencia.min ? 'Abaixo do Normal' : 
             valor > referencia.max ? 'Acima do Normal' : 
             valor >= referencia.otimo ? 'Ótimo' : 'Normal'}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};

export default BioimpedanciaAnalise; 