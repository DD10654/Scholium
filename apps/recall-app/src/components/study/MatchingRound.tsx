import { useState } from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Card } from "@/types";
import { cn } from "@/lib/utils";
import { shuffle } from "./utils";

interface MatchingRoundProps {
  terms: Card[];
  onRoundComplete: () => void;
}

export function MatchingRound({ terms, onRoundComplete }: MatchingRoundProps) {
  const [shuffledDefs] = useState(() => shuffle(terms.map((_, i) => i)));
  const [selected, setSelected] = useState<number | null>(null);
  const [matched, setMatched] = useState<Record<number, number>>({});
  const [wrongFlash, setWrongFlash] = useState<number | null>(null);
  const [allDone, setAllDone] = useState(false);

  const matchedTermIdxs = new Set(Object.keys(matched).map(Number));
  const matchedDefIdxs = new Set(Object.values(matched));

  function handleTermClick(idx: number) {
    if (matchedTermIdxs.has(idx)) return;
    setSelected(idx);
  }

  function handleDefClick(defOrder: number) {
    const origIdx = shuffledDefs[defOrder];
    if (matchedDefIdxs.has(origIdx)) return;
    if (selected === null) return;

    if (origIdx === selected) {
      const newMatched = { ...matched, [selected]: origIdx };
      setMatched(newMatched);
      setSelected(null);
      if (Object.keys(newMatched).length === terms.length) {
        setTimeout(() => setAllDone(true), 400);
      }
    } else {
      setWrongFlash(defOrder);
      setTimeout(() => {
        setWrongFlash(null);
        setSelected(null);
      }, 600);
    }
  }

  if (allDone) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-4 animate-bounce-soft">
        <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center">
          <Check size={32} className="text-success" />
        </div>
        <p className="font-bold text-lg text-foreground">Round complete!</p>
        <Button onClick={onRoundComplete}>Continue</Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="flex flex-col gap-3">
        <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">
          Terms
        </div>
        {terms.map((card, idx) => {
          const isMatched = matchedTermIdxs.has(idx);
          const isSelected = selected === idx;
          return (
            <button
              key={idx}
              onClick={() => handleTermClick(idx)}
              className={cn(
                "w-full text-left px-4 py-3 rounded-xl border-2 text-sm font-semibold transition-all duration-200",
                isMatched
                  ? "border-success/40 bg-success/10 text-success cursor-default"
                  : isSelected
                    ? "border-primary bg-primary/10 text-primary shadow-soft scale-[1.02]"
                    : "border-border bg-card text-foreground hover:border-primary/50 hover:bg-secondary/50 cursor-pointer",
              )}
            >
              {isMatched && <Check size={14} className="inline mr-1.5 -mt-0.5" />}
              {card.term}
            </button>
          );
        })}
      </div>

      <div className="flex flex-col gap-3">
        <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">
          Definitions
        </div>
        {shuffledDefs.map((origIdx, defOrder) => {
          const isMatched = matchedDefIdxs.has(origIdx);
          const isWrong = wrongFlash === defOrder;
          return (
            <button
              key={defOrder}
              onClick={() => handleDefClick(defOrder)}
              className={cn(
                "w-full text-left px-4 py-3 rounded-xl border-2 text-sm transition-all duration-200",
                isMatched
                  ? "border-success/40 bg-success/10 text-success cursor-default"
                  : isWrong
                    ? "border-destructive/60 bg-destructive/10 text-destructive animate-shake"
                    : selected !== null
                      ? "border-border bg-card text-foreground hover:border-primary/50 hover:bg-secondary/50 cursor-pointer"
                      : "border-border bg-card text-muted-foreground cursor-default opacity-60",
              )}
            >
              {isMatched && <Check size={14} className="inline mr-1.5 -mt-0.5" />}
              {terms[origIdx].definition}
            </button>
          );
        })}
      </div>
    </div>
  );
}
