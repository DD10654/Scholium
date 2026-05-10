import { Check, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface CompletionScreenProps {
  score?: number;
  total?: number;
  onComplete: () => void;
}

export function CompletionScreen({ score, total, onComplete }: CompletionScreenProps) {
  const pct = total && total > 0 ? Math.round(((score ?? 0) / total) * 100) : 100;
  return (
    <div className="flex flex-col items-center text-center py-8 gap-6 animate-slide-up">
      <div className="w-20 h-20 rounded-full bg-accent/10 flex items-center justify-center">
        <Trophy size={40} className="text-accent animate-float" />
      </div>
      {total !== undefined ? (
        <>
          <div>
            <div className="text-6xl font-bold bg-gradient-hero bg-clip-text text-transparent mb-1">
              {pct}%
            </div>
            <div className="text-muted-foreground text-sm">
              {score} / {total} correct
            </div>
          </div>
          <Progress value={pct} className="max-w-xs" />
        </>
      ) : (
        <div className="text-2xl font-bold text-foreground">All matched!</div>
      )}
      <p className="text-muted-foreground text-sm max-w-xs">
        {pct === 100
          ? "Perfect score — outstanding work!"
          : pct >= 70
            ? "Great effort — keep it up!"
            : "Keep practicing — you'll get there!"}
      </p>
      <Button size="lg" onClick={onComplete}>
        <Check size={18} /> Complete Session
      </Button>
    </div>
  );
}
