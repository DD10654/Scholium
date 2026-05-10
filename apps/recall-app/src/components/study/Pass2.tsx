import { useCallback, useEffect, useState } from "react";
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Card } from "@/types";
import { cn } from "@/lib/utils";
import { shuffle, pickDistractors } from "./utils";
import { CompletionScreen } from "./CompletionScreen";

interface Pass2Props {
  cards: Card[];
  onComplete: () => void;
}

export function Pass2({ cards, onComplete }: Pass2Props) {
  const [idx, setIdx] = useState(0);
  const [chosen, setChosen] = useState<Card | null>(null);
  const [correct, setCorrect] = useState(0);

  const card = cards[idx];
  const buildOpts = useCallback(
    () => (card ? shuffle([card, ...pickDistractors(cards, idx, 3)]) : []),
    [card, cards, idx],
  );
  const [shuffledOpts, setShuffledOpts] = useState<Card[]>(() => buildOpts());

  useEffect(() => {
    setShuffledOpts(buildOpts());
    setChosen(null);
  }, [idx, buildOpts]);

  if (idx >= cards.length)
    return <CompletionScreen score={correct} total={cards.length} onComplete={onComplete} />;

  function pick(opt: Card) {
    if (chosen) return;
    setChosen(opt);
    if (opt.term === card.term) setCorrect((c) => c + 1);
  }

  function next() {
    setIdx((i) => i + 1);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-card rounded-xl border-2 border-primary/20 p-6">
        <div className="text-xs font-bold text-primary uppercase tracking-wider mb-3">Term</div>
        <div className="text-2xl font-bold text-foreground font-display">{card.term}</div>
      </div>

      <div className="text-xs font-semibold text-muted-foreground">Which definition is correct?</div>

      <div className="grid grid-cols-1 gap-3">
        {shuffledOpts.map((opt, i) => {
          const isCorrect = opt.term === card.term;
          const isChosen = chosen && opt.term === chosen.term;
          return (
            <button
              key={i}
              onClick={() => pick(opt)}
              className={cn(
                "w-full text-left px-5 py-4 rounded-xl border-2 text-sm transition-all duration-200",
                !chosen
                  ? "border-border bg-card hover:border-primary/50 hover:bg-secondary/50 cursor-pointer text-foreground"
                  : isCorrect
                    ? "border-success bg-success/10 text-success font-semibold"
                    : isChosen
                      ? "border-destructive bg-destructive/10 text-destructive"
                      : "border-border bg-card text-muted-foreground opacity-60",
              )}
            >
              <div className="flex items-start gap-3">
                <span
                  className={cn(
                    "w-6 h-6 rounded-full border-2 flex-shrink-0 flex items-center justify-center text-xs font-bold mt-0.5",
                    !chosen
                      ? "border-border"
                      : isCorrect
                        ? "border-success bg-success text-white"
                        : isChosen
                          ? "border-destructive bg-destructive text-white"
                          : "border-border",
                  )}
                >
                  {chosen && isCorrect ? (
                    <Check size={12} />
                  ) : chosen && isChosen ? (
                    <X size={12} />
                  ) : (
                    String.fromCharCode(65 + i)
                  )}
                </span>
                {opt.definition}
              </div>
            </button>
          );
        })}
      </div>

      {chosen && (
        <div
          className={cn(
            "rounded-xl p-4 flex items-center justify-between animate-slide-up",
            chosen.term === card.term
              ? "bg-success/10 border border-success/30"
              : "bg-destructive/10 border border-destructive/30",
          )}
        >
          <span
            className={cn(
              "font-semibold text-sm flex items-center gap-2",
              chosen.term === card.term ? "text-success" : "text-destructive",
            )}
          >
            {chosen.term === card.term ? (
              <><Check size={16} /> Correct!</>
            ) : (
              <><X size={16} /> The correct answer was shown in green.</>
            )}
          </span>
          <Button size="sm" onClick={next}>
            {idx + 1 >= cards.length ? "Finish" : "Next →"}
          </Button>
        </div>
      )}
    </div>
  );
}
