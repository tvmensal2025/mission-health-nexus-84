import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { DailyQuestion } from '@/types/daily-missions';
import { CheckCircle, Star, Trophy } from 'lucide-react';

interface QuestionCardProps {
  question: DailyQuestion;
  onAnswer: (questionId: string, answer: string | number, textResponse?: string) => void;
  currentAnswer?: string | number;
  currentTextResponse?: string;
  isCompleted?: boolean;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  onAnswer,
  currentAnswer,
  currentTextResponse,
  isCompleted = false
}) => {
  const [textValue, setTextValue] = useState(currentTextResponse || '');

  const handleMultipleChoice = (option: string) => {
    onAnswer(question.id, option);
  };

  const handleYesNo = (answer: boolean) => {
    onAnswer(question.id, answer ? 'Sim' : 'Não');
  };

  const handleScale = (value: number) => {
    onAnswer(question.id, value);
  };

  const handleEmojiScale = (value: number) => {
    onAnswer(question.id, value);
  };

  const handleStarScale = (value: number) => {
    onAnswer(question.id, value);
  };

  const handleTextSubmit = () => {
    if (textValue.trim()) {
      onAnswer(question.id, 'text_response', textValue.trim());
    }
  };

  const renderMultipleChoice = () => (
    <div className="space-y-3">
      {question.options?.map((option, index) => (
        <Button
          key={index}
          variant={currentAnswer === option ? "default" : "outline"}
          className={`w-full justify-start text-left h-auto py-3 px-4 ${
            currentAnswer === option ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
          }`}
          onClick={() => handleMultipleChoice(option)}
        >
          {currentAnswer === option && <CheckCircle className="mr-2 h-4 w-4" />}
          {option}
        </Button>
      ))}
    </div>
  );

  const renderYesNo = () => (
    <div className="flex gap-3">
      <Button
        variant={currentAnswer === 'Sim' ? "default" : "outline"}
        className="flex-1"
        onClick={() => handleYesNo(true)}
      >
        {currentAnswer === 'Sim' && <CheckCircle className="mr-2 h-4 w-4" />}
        Sim
      </Button>
      <Button
        variant={currentAnswer === 'Não' ? "default" : "outline"}
        className="flex-1"
        onClick={() => handleYesNo(false)}
      >
        {currentAnswer === 'Não' && <CheckCircle className="mr-2 h-4 w-4" />}
        Não
      </Button>
    </div>
  );

  const renderScale = () => (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        {question.scale?.labels.map((label, index) => (
          <div key={index} className="text-center">
            <Button
              variant={currentAnswer === index + 1 ? "default" : "outline"}
              size="sm"
              className="w-8 h-8 p-0"
              onClick={() => handleScale(index + 1)}
            >
              {index + 1}
            </Button>
            <p className="text-xs text-muted-foreground mt-1">{label}</p>
          </div>
        ))}
      </div>
    </div>
  );

  const renderEmojiScale = () => (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        {question.scale?.emojis?.map((emoji, index) => (
          <div key={index} className="text-center">
            <Button
              variant={currentAnswer === index + 1 ? "default" : "outline"}
              size="lg"
              className="w-12 h-12 p-0 text-2xl"
              onClick={() => handleEmojiScale(index + 1)}
            >
              {emoji}
            </Button>
            <p className="text-xs text-muted-foreground mt-1">
              {question.scale?.labels[index]}
            </p>
          </div>
        ))}
      </div>
    </div>
  );

  const renderStarScale = () => (
    <div className="space-y-3">
      <div className="flex justify-center gap-2">
        {Array.from({ length: 5 }, (_, index) => (
          <Button
            key={index}
            variant={currentAnswer && (currentAnswer as number) >= index + 1 ? "default" : "outline"}
            size="lg"
            className="w-12 h-12 p-0"
            onClick={() => handleStarScale(index + 1)}
          >
            <Star className={`h-6 w-6 ${currentAnswer && (currentAnswer as number) >= index + 1 ? 'fill-current' : ''}`} />
          </Button>
        ))}
      </div>
      <p className="text-center text-sm text-muted-foreground">
        {question.scale?.labels[currentAnswer ? (currentAnswer as number) - 1 : 0]}
      </p>
    </div>
  );

  const renderText = () => (
    <div className="space-y-3">
      <Textarea
        placeholder={question.placeholder}
        value={textValue}
        onChange={(e) => setTextValue(e.target.value)}
        className="min-h-[100px] resize-none"
      />
      <Button
        onClick={handleTextSubmit}
        disabled={!textValue.trim()}
        className="w-full"
      >
        Salvar Resposta
      </Button>
    </div>
  );

  const renderQuestionContent = () => {
    switch (question.type) {
      case 'multiple_choice':
        return renderMultipleChoice();
      case 'yes_no':
        return renderYesNo();
      case 'scale':
        return renderScale();
      case 'emoji_scale':
        return renderEmojiScale();
      case 'star_scale':
        return renderStarScale();
      case 'text':
        return renderText();
      default:
        return null;
    }
  };

  return (
    <Card className={`transition-all duration-200 ${
      isCompleted ? 'bg-green-50 border-green-200' : 'hover:shadow-md'
    }`}>
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="text-lg font-semibold mb-2">{question.question}</h3>
              {isCompleted && (
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  <CheckCircle className="mr-1 h-3 w-3" />
                  Respondido
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-1 text-yellow-600">
              <Trophy className="h-4 w-4" />
              <span className="text-sm font-medium">{question.points}</span>
            </div>
          </div>

          {/* Question Content */}
          {renderQuestionContent()}

          {/* Current Answer Display */}
          {currentAnswer && question.type !== 'text' && (
            <div className="mt-4 p-3 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground">Sua resposta:</p>
              <p className="font-medium">
                {question.type === 'emoji_scale' && question.scale?.emojis
                  ? question.scale.emojis[(currentAnswer as number) - 1]
                  : currentAnswer}
              </p>
            </div>
          )}

          {currentTextResponse && question.type === 'text' && (
            <div className="mt-4 p-3 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground">Sua resposta:</p>
              <p className="font-medium">{currentTextResponse}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}; 