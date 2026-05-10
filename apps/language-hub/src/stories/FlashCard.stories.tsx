import type { Meta, StoryObj } from '@storybook/react-vite';
import { MemoryRouter } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Check, X, Volume2, Trophy, RotateCcw } from 'lucide-react';

// ---------------------------------------------------------------------------
// This story covers the flashcard question-card UI shared by Study.tsx and
// Practice.tsx. Both pages build the same card from the same shadcn primitives
// with identical logic; testing this component in isolation lets you verify
// every visual state (question types, correct/incorrect feedback, retype,
// completion) without needing Supabase or a live router param.
// ---------------------------------------------------------------------------

type QuestionType = 'fr-to-en' | 'en-to-fr' | 'dictation';

interface CardStoryProps {
  questionType: QuestionType;
  language: 'french' | 'spanish';
  term: string;
  definition: string;
  prompt: string;
  showResult: boolean;
  isCorrect: boolean;
  retypeMode: boolean;
  currentIndex: number;
  totalQuestions: number;
}

function FlashCardUI({
  questionType,
  language,
  term,
  definition,
  prompt,
  showResult,
  isCorrect,
  retypeMode,
  currentIndex,
  totalQuestions,
}: CardStoryProps) {
  const flag = language === 'spanish' ? '🇪🇸' : '🇫🇷';
  const badgeClass =
    questionType === 'fr-to-en'
      ? 'bg-primary/10 text-primary'
      : questionType === 'en-to-fr'
      ? 'bg-accent/10 text-accent'
      : 'bg-success/10 text-success';

  const badgeLabel =
    questionType === 'fr-to-en'
      ? `${flag} → 🇬🇧 Translation`
      : questionType === 'en-to-fr'
      ? `🇬🇧 → ${flag} Translation`
      : '🎧 Dictation';

  const correctAnswer = questionType === 'fr-to-en' ? definition : term;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto max-w-2xl px-6 py-4 flex items-center gap-4">
          <Button variant="ghost" size="icon" disabled>←</Button>
          <div>
            <h1 className="font-bold font-display">Vocabulaire Français</h1>
            <p className="text-sm text-muted-foreground">
              Question {currentIndex + 1} of {totalQuestions}
            </p>
          </div>
        </div>
      </header>

      <div className="container mx-auto max-w-2xl px-6 pt-4">
        <Progress value={((currentIndex + 1) / totalQuestions) * 100} className="h-2" />
      </div>

      <main className="container mx-auto max-w-2xl px-6 py-8">
        <Card className="shadow-card animate-slide-up">
          <CardContent className="p-8">
            <div className="flex justify-center mb-6">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${badgeClass}`}>
                {badgeLabel}
              </span>
            </div>

            <div className="text-center mb-8">
              <p className="text-lg text-muted-foreground mb-4">{prompt}</p>

              {questionType === 'dictation' && (
                <Button variant="outline" size="lg" className="mb-4">
                  <Volume2 className="mr-2 h-5 w-5" />
                  Play Audio
                </Button>
              )}

              {questionType !== 'dictation' && (
                <p className="text-2xl font-serif font-semibold text-foreground">
                  {questionType === 'fr-to-en' ? term : definition}
                </p>
              )}
            </div>

            <div className="space-y-4">
              <Input
                placeholder="Type your answer..."
                defaultValue={showResult ? (isCorrect ? correctAnswer : 'wrong answer') : ''}
                disabled={showResult}
                className={`text-lg text-center py-6 ${
                  showResult
                    ? isCorrect
                      ? 'border-success bg-success/5'
                      : 'border-destructive bg-destructive/5'
                    : ''
                }`}
              />

              {showResult && (
                <div
                  className={`p-4 rounded-lg ${
                    isCorrect ? 'bg-success/10' : 'bg-destructive/10'
                  } animate-slide-up`}
                >
                  <div className="flex items-center justify-center gap-2 mb-2">
                    {isCorrect ? (
                      <>
                        <Check className="h-5 w-5 text-success" />
                        <span className="font-semibold text-success">Correct!</span>
                      </>
                    ) : (
                      <>
                        <X className="h-5 w-5 text-destructive" />
                        <span className="font-semibold text-destructive">Incorrect</span>
                      </>
                    )}
                  </div>
                  {!isCorrect && (
                    <>
                      <p className="text-center text-foreground mb-3">
                        Correct answer:{' '}
                        <span className="font-semibold">{correctAnswer}</span>
                      </p>
                      <Button variant="outline" size="sm" className="w-full">
                        <Check className="mr-2 h-4 w-4" />
                        Mark as Correct (synonym)
                      </Button>
                    </>
                  )}
                </div>
              )}

              {retypeMode && (
                <Input
                  placeholder="Retype the correct answer..."
                  className="text-lg text-center py-6"
                  autoFocus
                />
              )}

              {!showResult ? (
                <Button variant="hero" className="w-full">
                  Check Answer
                </Button>
              ) : isCorrect ? (
                <Button variant="hero" className="w-full">
                  Next Question
                </Button>
              ) : !retypeMode ? (
                <Button variant="hero" className="w-full">
                  Retype Answer to Continue
                </Button>
              ) : (
                <Button variant="hero" className="w-full" disabled>
                  Next Question
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-6 text-muted-foreground">Score: 3/5</div>
      </main>
    </div>
  );
}

const meta: Meta<typeof FlashCardUI> = {
  title: 'Pages/FlashCard',
  component: FlashCardUI,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  decorators: [(Story) => <MemoryRouter><Story /></MemoryRouter>],
  args: {
    term: 'bonjour',
    definition: 'hello',
    language: 'french',
    currentIndex: 2,
    totalQuestions: 9,
    showResult: false,
    isCorrect: false,
    retypeMode: false,
  },
  argTypes: {
    questionType: { control: 'select', options: ['fr-to-en', 'en-to-fr', 'dictation'] },
    language: { control: 'radio', options: ['french', 'spanish'] },
    showResult: { control: 'boolean' },
    isCorrect: { control: 'boolean' },
    retypeMode: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof FlashCardUI>;

export const FrenchToEnglish: Story = {
  args: {
    questionType: 'fr-to-en',
    prompt: 'Translate to English: "bonjour"',
  },
};

export const EnglishToFrench: Story = {
  args: {
    questionType: 'en-to-fr',
    prompt: 'Translate to French: "hello"',
  },
};

export const Dictation: Story = {
  args: {
    questionType: 'dictation',
    prompt: 'Listen and write the French word:',
  },
};

export const AnsweredCorrectly: Story = {
  args: {
    questionType: 'fr-to-en',
    prompt: 'Translate to English: "bonjour"',
    showResult: true,
    isCorrect: true,
  },
};

export const AnsweredIncorrectly: Story = {
  args: {
    questionType: 'fr-to-en',
    prompt: 'Translate to English: "bonjour"',
    showResult: true,
    isCorrect: false,
  },
};

export const RetypeMode: Story = {
  args: {
    questionType: 'fr-to-en',
    prompt: 'Translate to English: "bonjour"',
    showResult: true,
    isCorrect: false,
    retypeMode: true,
  },
};

export const SpanishQuestion: Story = {
  args: {
    questionType: 'en-to-fr',
    language: 'spanish',
    term: 'hola',
    definition: 'hello',
    prompt: 'Translate to Spanish: "hello"',
  },
};

export const DictationCorrect: Story = {
  args: {
    questionType: 'dictation',
    prompt: 'Listen and write the French word:',
    showResult: true,
    isCorrect: true,
  },
};

export const CompletionScreen: Story = {
  render: () => (
    <div className="min-h-screen bg-background">
        <main className="container mx-auto max-w-2xl px-6 py-12">
          <Card className="shadow-card text-center py-12 animate-bounce-soft">
            <CardContent>
              <Trophy className="h-20 w-20 mx-auto text-accent mb-6" />
              <h2 className="text-3xl font-bold font-display mb-2">Set Complete!</h2>
              <p className="text-xl text-muted-foreground mb-6">Vocabulaire Français</p>
              <div className="text-6xl font-bold gradient-hero bg-clip-text text-transparent mb-2">
                89%
              </div>
              <p className="text-muted-foreground mb-8">8 correct out of 9 questions</p>
              <div className="flex gap-4 justify-center">
                <Button variant="outline">
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Study Again
                </Button>
                <Button variant="hero">Back to Sets</Button>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
  ),
};
