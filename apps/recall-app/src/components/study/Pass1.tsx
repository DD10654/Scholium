import { useMemo, useState } from "react";
import type { Card } from "@/types";
import { CompletionScreen } from "./CompletionScreen";
import { MatchingRound } from "./MatchingRound";

interface Pass1Props {
  cards: Card[];
  onComplete: () => void;
}

export function Pass1({ cards, onComplete }: Pass1Props) {
  const chunks = useMemo(() => {
    const out: Card[][] = [];
    for (let i = 0; i < cards.length; i += 5) out.push(cards.slice(i, i + 5));
    return out;
  }, [cards]);
  const [chunkIdx, setChunkIdx] = useState(0);

  if (chunkIdx >= chunks.length) return <CompletionScreen onComplete={onComplete} />;

  return (
    <div>
      <div className="text-xs text-muted-foreground font-semibold mb-4">
        Round {chunkIdx + 1} of {chunks.length} — match each term to its definition
      </div>
      <MatchingRound
        key={chunkIdx}
        terms={chunks[chunkIdx]}
        onRoundComplete={() => setChunkIdx((i) => i + 1)}
      />
    </div>
  );
}
