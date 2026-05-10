import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Check, Loader2, Trophy, X, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { useApp } from "@/contexts/AppContext";
import type { Card } from "@/types";
import { cn } from "@/lib/utils";

const PRACTICE_COUNT = 30;

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pickDistractors(pool: Card[], correctIdx: number, count: number): Card[] {
  return shuffle(pool.filter((_, i) => i !== correctIdx)).slice(0, count);
}

type Phase = "loading" | "prep" | "quiz" | "done";

export default function PracticeSection() {
  const { sectionId } = useParams<{ sectionId: string }>();
  const navigate = useNavigate();
  const { user } = useApp();

  const [sectionName, setSectionName] = useState("");
  const [allCards, setAllCards] = useState<Card[]>([]);
  const [cards, setCards] = useState<Card[]>([]);
  const [phase, setPhase] = useState<Phase>("loading");

  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [chosen, setChosen] = useState<Card | null>(null);
  const [shuffledOpts, setShuffledOpts] = useState<Card[]>([]);

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

      if (!chaptersRes.data?.length) { setPhase("prep"); return; }

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
    setCards(sampled);
    setIdx(0);
    setScore(0);
    setChosen(null);
    setPhase("quiz");
  }

  const buildOpts = useCallback(
    (cardList: Card[], i: number) => {
      if (!cardList[i]) return [];
      const distractorCount = Math.min(3, cardList.length - 1);
      return shuffle([cardList[i], ...pickDistractors(cardList, i, distractorCount)]);
    },
    [],
  );

  useEffect(() => {
    if (phase !== "quiz") return;
    setShuffledOpts(buildOpts(cards, idx));
    setChosen(null);
  }, [idx, cards, phase, buildOpts]);

  function pick(opt: Card) {
    if (chosen) return;
    setChosen(opt);
    if (opt.term === cards[idx].term) setScore((s) => s + 1);
  }

  function next() {
    if (idx + 1 >= cards.length) setPhase("done");
    else setIdx((i) => i + 1);
  }

  const card = cards[idx];
  const pct = cards.length > 0 ? Math.round((score / cards.length) * 100) : 0;
  const progress = phase === "quiz" && cards.length > 0 ? Math.round((idx / cards.length) * 100) : 0;

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 border-b border-border bg-card/80 backdrop-blur-sm">
        <div className="max-w-2xl mx-auto px-6 h-16 flex items-center gap-4">
          <button
            onClick={() => navigate("/")}
            className="text-muted-foreground hover:text-foreground transition-colors p-1"
            aria-label="Back"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="flex-1 min-w-0">
            <div className="font-bold text-foreground truncate">{sectionName || "Section Practice"}</div>
            <div className="text-xs text-muted-foreground">
              {phase === "quiz" ? `Question ${idx + 1} of ${cards.length}` : "Multiple Choice"}
            </div>
          </div>
          {phase === "quiz" && (
            <div className="flex items-center gap-2">
              <Progress value={progress} className="w-20" />
              <span className="text-xs font-semibold text-muted-foreground w-8 text-right">
                {progress}%
              </span>
            </div>
          )}
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-8">
        {phase === "loading" && (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="animate-spin text-primary" size={32} />
          </div>
        )}

        {phase === "prep" && (
          <div className="flex flex-col items-center text-center gap-6 py-8">
            <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center">
              <Zap size={28} className="text-accent" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2 font-display">
                {sectionName}
              </h2>
              <p className="text-muted-foreground text-sm max-w-sm mx-auto">
                {allCards.length === 0
                  ? "No cards found in this section."
                  : `Practice ${Math.min(PRACTICE_COUNT, allCards.length)} randomly selected definitions using multiple choice.`}
              </p>
            </div>
            {allCards.length > 0 && (
              <>
                <div className="bg-card rounded-xl border border-border p-4 text-left w-full max-w-xs">
                  <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">
                    Session info
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Questions</span>
                    <span className="font-semibold">{Math.min(PRACTICE_COUNT, allCards.length)}</span>
                  </div>
                  <div className="flex justify-between text-sm mt-1.5">
                    <span className="text-muted-foreground">Pool size</span>
                    <span className="font-semibold">{allCards.length} definitions</span>
                  </div>
                  <div className="flex justify-between text-sm mt-1.5">
                    <span className="text-muted-foreground">Mode</span>
                    <span className="font-semibold text-accent">Multiple Choice</span>
                  </div>
                </div>
                <Button size="lg" variant="accent" onClick={startQuiz}>
                  Start Practice →
                </Button>
              </>
            )}
            {allCards.length === 0 && (
              <Button variant="outline" onClick={() => navigate("/")}>
                Back to Dashboard
              </Button>
            )}
          </div>
        )}

        {phase === "quiz" && card && (
          <div className="flex flex-col gap-6">
            <div className="bg-card rounded-xl border-2 border-primary/20 p-6">
              <div className="text-xs font-bold text-primary uppercase tracking-wider mb-3">
                Term
              </div>
              <div className="text-2xl font-bold text-foreground font-display">
                {card.term}
              </div>
            </div>

            <div className="text-xs font-semibold text-muted-foreground">
              Which definition is correct?
            </div>

            <div className="grid grid-cols-1 gap-3">
              {shuffledOpts.map((opt, i) => {
                const isCorrect = opt.term === card.term;
                const isChosen = chosen?.term === opt.term;
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
                    <><X size={16} /> The correct answer was highlighted.</>
                  )}
                </span>
                <Button size="sm" onClick={next}>
                  {idx + 1 >= cards.length ? "Finish" : "Next →"}
                </Button>
              </div>
            )}
          </div>
        )}

        {phase === "done" && (
          <div className="flex flex-col items-center text-center py-8 gap-6 animate-slide-up">
            <div className="w-20 h-20 rounded-full bg-accent/10 flex items-center justify-center">
              <Trophy size={40} className="text-accent" />
            </div>
            <div>
              <div className="text-6xl font-bold bg-gradient-hero bg-clip-text text-transparent mb-1">
                {pct}%
              </div>
              <div className="text-muted-foreground text-sm">
                {score} / {cards.length} correct
              </div>
            </div>
            <Progress value={pct} className="max-w-xs" />
            <p className="text-muted-foreground text-sm max-w-xs">
              {pct === 100
                ? "Perfect score — outstanding work!"
                : pct >= 70
                  ? "Great effort — keep it up!"
                  : "Keep practicing — you'll get there!"}
            </p>
            <div className="flex gap-3 flex-wrap justify-center">
              <Button variant="outline" onClick={() => navigate("/")}>
                Back to Dashboard
              </Button>
              <Button variant="accent" onClick={startQuiz}>
                Practice Again
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
