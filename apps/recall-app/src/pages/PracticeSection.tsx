import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Loader2, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useApp } from "@/contexts/AppContext";
import type { Card } from "@/types";
import ChooseSession, { type ChooseQuestion } from "@/components/ChooseSession";

const PRACTICE_COUNT = 30;

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildQuestions(cards: Card[]): ChooseQuestion[] {
  return cards.map((card, i) => {
    const distractorCount = Math.min(3, cards.length - 1);
    const distractors = shuffle(cards.filter((_, j) => j !== i))
      .slice(0, distractorCount)
      .map((c) => c.term);
    return {
      term: card.term,
      definition: card.definition,
      options: shuffle([card.term, ...distractors]),
    };
  });
}

type Phase = "loading" | "prep" | "session";

export default function PracticeSection() {
  const { sectionId } = useParams<{ sectionId: string }>();
  const navigate = useNavigate();
  const { user } = useApp();

  const [sectionName, setSectionName] = useState("");
  const [allCards, setAllCards] = useState<Card[]>([]);
  const [phase, setPhase] = useState<Phase>("loading");
  const [questions, setQuestions] = useState<ChooseQuestion[]>([]);

  useEffect(() => {
    if (!user) navigate("/login");
  }, [user, navigate]);

  useEffect(() => {
    if (!sectionId) return;
    const sid = sectionId;
    async function load() {
      const chaptersRes = await supabase
        .from("recall_chapters")
        .select("id, section_name")
        .eq("section_id", sid);

      if (!chaptersRes.data?.length) {
        setPhase("prep");
        return;
      }

      const name = (chaptersRes.data[0] as { id: string; section_name: string }).section_name;
      const ids = chaptersRes.data.map((c: { id: string }) => c.id);

      const cardsRes = await supabase
        .from("recall_cards")
        .select("term, definition")
        .in("chapter_id", ids);

      setSectionName(name);
      setAllCards((cardsRes.data ?? []) as Card[]);
      setPhase("prep");
    }
    load();
  }, [sectionId]);

  function startQuiz() {
    const sampled = shuffle(allCards).slice(0, PRACTICE_COUNT);
    setQuestions(buildQuestions(sampled));
    setPhase("session");
  }

  if (phase === "loading") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  if (phase === "session") {
    return (
      <ChooseSession
        questions={questions}
        title={sectionName || "Section Practice"}
        subtitle="Multiple choice · read the definition, choose the term"
        cardLabel={sectionName || undefined}
        onExit={() => navigate("/")}
        doneHeadline={(c, t) => `${c} of ${t} correct`}
        doneMessage="Nice work — keep running the passes to lock these in."
        doneActions={
          <>
            <Button size="lg" variant="outline" onClick={() => navigate("/")}>
              Back to Dashboard
            </Button>
            <Button size="lg" variant="accent" onClick={startQuiz}>
              Practice Again
            </Button>
          </>
        }
      />
    );
  }

  // prep
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="relative mx-auto max-w-2xl w-full px-6 pt-10 pb-2 text-center">
        <button
          onClick={() => navigate("/")}
          aria-label="Back"
          className="absolute left-6 top-10 text-muted-foreground hover:text-foreground transition-colors p-1"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-foreground text-3xl sm:text-4xl font-bold tracking-tight font-display">
          {sectionName || "Section Practice"}
        </h1>
      </header>

      <main className="mx-auto max-w-2xl w-full px-6 py-8 flex-1 flex flex-col items-center justify-center text-center gap-6">
        <div className="w-16 h-16 rounded-2xl bg-accent/10 border-2 border-accent/30 flex items-center justify-center">
          <Zap size={28} className="text-accent" />
        </div>
        {allCards.length === 0 ? (
          <>
            <p className="text-muted-foreground">No cards found in this section.</p>
            <Button variant="outline" onClick={() => navigate("/")}>
              Back to Dashboard
            </Button>
          </>
        ) : (
          <>
            <p className="text-muted-foreground max-w-sm">
              Read each definition and choose the matching term.{" "}
              {Math.min(PRACTICE_COUNT, allCards.length)} questions from a pool of {allCards.length}.
            </p>
            <Button size="lg" variant="accent" onClick={startQuiz}>
              Start Practice →
            </Button>
          </>
        )}
      </main>
    </div>
  );
}
