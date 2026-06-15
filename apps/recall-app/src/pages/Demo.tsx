import { useMemo, useState } from "react";
import { ArrowRight, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SUBJECTS } from "@/data/subjects";
import ChooseSession, { type ChooseQuestion } from "@/components/ChooseSession";

// Self-contained trial: the real first Economics set ("Basic Concepts") run as
// a single "choose" pass — no account, no Supabase. Shares ChooseSession with
// the real practice screen so the UI is identical.
const ECON_CARDS =
  SUBJECTS.find((s) => s.id === "economics")?.sections[0]?.chapters[0]?.cards ?? [];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function Demo() {
  const [round, setRound] = useState(0);

  const questions = useMemo<ChooseQuestion[]>(() => {
    void round; // re-sample when "Try again" bumps the round
    const cards = ECON_CARDS.slice(0, 8);
    return cards.map((card) => {
      const distractors = shuffle(cards.filter((c) => c.term !== card.term))
        .slice(0, 3)
        .map((c) => c.term);
      return {
        term: card.term,
        definition: card.definition,
        options: shuffle([card.term, ...distractors]),
      };
    });
  }, [round]);

  return (
    <ChooseSession
      questions={questions}
      title="Recall."
      subtitle="A taste of the “choose” pass on real IGCSE Economics definitions — read the meaning, recall the term."
      cardLabel="📈 Economics · Basic Concepts"
      banner={
        <div className="w-full border-b border-border bg-card/60">
          <div className="mx-auto max-w-2xl px-6 py-3 flex items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">Preview</span> · no account needed
            </p>
            <a
              href="/login"
              className="text-sm font-semibold text-primary hover:underline whitespace-nowrap"
            >
              Sign up to track your passes →
            </a>
          </div>
        </div>
      }
      doneHeadline={(c, t) => `${c} of ${t} on the first pass.`}
      doneMessage={
        <>
          This was one of four passes — match, choose, recall, write — each harder than the last.
          The full app remembers what you missed and brings it back until every definition is yours,
          across Economics, Physics, and any set you build.
        </>
      }
      doneActions={
        <>
          <a href="/login">
            <Button size="lg" className="w-full sm:w-auto">
              Create free account
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </a>
          <Button size="lg" variant="outline" onClick={() => setRound((r) => r + 1)}>
            <RotateCcw className="mr-2 h-4 w-4" />
            Try again
          </Button>
        </>
      }
    />
  );
}
