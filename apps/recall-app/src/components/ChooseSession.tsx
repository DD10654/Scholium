import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, Check, Sparkles, X } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface ChooseQuestion {
  term: string;
  definition: string;
  /** The term plus distractors, pre-shuffled. */
  options: string[];
}

interface ChooseCardProps {
  questions: ChooseQuestion[];
  index: number;
  picked: string | null;
  onPick: (option: string) => void;
  onNext: () => void;
  /** Small label above the definition, e.g. "📈 Economics · Basic Concepts". */
  cardLabel?: string;
}

// The single source of truth for the "choose the term" question UI — progress
// dots, the definition card, the term options, and the next button. Used by the
// full-page ChooseSession (demo + Practice) and by Pass 2 of the study flow, so
// every "choose" pass in the app looks identical.
export function ChooseCard({ questions, index, picked, onPick, onNext, cardLabel }: ChooseCardProps) {
  const q = questions[index];
  const answered = picked !== null;
  if (!q) return null;

  return (
    <div className="flex flex-col items-center w-full">
      <div className="flex flex-wrap items-center justify-center gap-2 mb-8 max-w-md">
        {questions.map((qq, i) => (
          <span
            key={`${qq.term}-${i}`}
            className={cn(
              "h-2 rounded-full transition-all",
              i === index ? "w-8 bg-primary" : i < index ? "w-2 bg-primary/50" : "w-2 bg-border",
            )}
          />
        ))}
      </div>

      <div className="w-full rounded-2xl border-2 border-border bg-card shadow-card p-8 sm:p-10">
        <p className="text-xs uppercase tracking-[0.15em] text-muted-foreground mb-3">
          {cardLabel ? `${cardLabel} · ` : ""}
          {index + 1} of {questions.length}
        </p>
        <p className="text-lg sm:text-xl text-foreground leading-relaxed font-medium">
          {q.definition}
        </p>

        <p className="mt-7 mb-3 text-sm font-medium text-muted-foreground">
          Which term is being defined?
        </p>
        <div className="grid gap-2.5">
          {q.options.map((option) => {
            const isCorrect = option === q.term;
            const isPicked = option === picked;
            return (
              <button
                key={option}
                onClick={() => onPick(option)}
                disabled={answered}
                className={cn(
                  "flex items-center justify-between gap-3 rounded-xl border-2 px-4 py-3 text-left font-semibold transition-all",
                  !answered && "border-border bg-background hover:border-primary hover:-translate-y-0.5",
                  answered && isCorrect && "border-success bg-success/10 text-foreground",
                  answered && isPicked && !isCorrect && "border-destructive bg-destructive/10 text-foreground",
                  answered && !isCorrect && !isPicked && "border-border bg-background opacity-60",
                )}
              >
                {option}
                {answered && isCorrect && <Check className="h-5 w-5 text-success shrink-0" />}
                {answered && isPicked && !isCorrect && <X className="h-5 w-5 text-destructive shrink-0" />}
              </button>
            );
          })}
        </div>

        {answered && (
          <div className="mt-7 flex justify-end">
            <Button size="lg" onClick={onNext}>
              {index + 1 >= questions.length ? "See results" : "Next"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

interface ChooseSessionProps {
  questions: ChooseQuestion[];
  /** Centered page title (e.g. the section name, or "Recall."). */
  title: string;
  subtitle?: string;
  cardLabel?: string;
  /** Optional top banner (used by the no-account demo). */
  banner?: ReactNode;
  /** Optional back button in the header. */
  onExit?: () => void;
  /** Results headline given (correct, total). Defaults to "{c} of {t} correct". */
  doneHeadline?: (correct: number, total: number) => string;
  doneMessage?: ReactNode;
  doneActions: ReactNode;
}

// Full-page "choose" session: header + ChooseCard + results. Used by the demo
// (/demo) and the Practice screen.
export default function ChooseSession({
  questions,
  title,
  subtitle,
  cardLabel,
  banner,
  onExit,
  doneHeadline,
  doneMessage,
  doneActions,
}: ChooseSessionProps) {
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [finished, setFinished] = useState(false);

  // Reset whenever a new question set comes in (e.g. "Practice again" re-samples).
  useEffect(() => {
    setIndex(0);
    setPicked(null);
    setCorrectCount(0);
    setFinished(false);
  }, [questions]);

  function pick(option: string) {
    if (picked !== null || !questions[index]) return;
    setPicked(option);
    if (option === questions[index].term) setCorrectCount((c) => c + 1);
  }

  function next() {
    if (index + 1 >= questions.length) {
      setFinished(true);
      return;
    }
    setIndex((i) => i + 1);
    setPicked(null);
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {banner}

      <header className="relative mx-auto max-w-2xl w-full px-6 pt-10 pb-2 text-center">
        {onExit && (
          <button
            onClick={onExit}
            aria-label="Back"
            className="absolute left-6 top-10 text-muted-foreground hover:text-foreground transition-colors p-1"
          >
            <ArrowLeft size={20} />
          </button>
        )}
        <h1 className="text-foreground text-3xl sm:text-4xl font-bold tracking-tight font-display">
          {title}
        </h1>
        {subtitle && <p className="mt-2 text-muted-foreground leading-relaxed">{subtitle}</p>}
      </header>

      <main className="mx-auto max-w-2xl w-full px-6 py-8 flex-1 flex flex-col">
        {!finished ? (
          <ChooseCard
            questions={questions}
            index={index}
            picked={picked}
            onPick={pick}
            onNext={next}
            cardLabel={cardLabel}
          />
        ) : (
          <div className="flex flex-col items-center text-center mt-6">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 border-2 border-primary/30 flex items-center justify-center mb-6">
              <Sparkles className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-3xl font-bold text-foreground font-display">
              {doneHeadline
                ? doneHeadline(correctCount, questions.length)
                : `${correctCount} of ${questions.length} correct`}
            </h2>
            {doneMessage && (
              <p className="mt-3 text-muted-foreground max-w-md leading-relaxed">{doneMessage}</p>
            )}
            <div className="mt-8 flex flex-col sm:flex-row gap-3">{doneActions}</div>
          </div>
        )}
      </main>
    </div>
  );
}
