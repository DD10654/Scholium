import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { ArrowLeft, BookOpen, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PASS_CONFIG, PassBadge } from "@/components/PassBadge";
import { supabase } from "@/integrations/supabase/client";
import { useApp } from "@/contexts/AppContext";
import type { Chapter } from "@/types";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useTourStyles } from "@repo/ui";
import { useTour } from "@/hooks/useTour";
import { Joyride, type EventData, STATUS } from "react-joyride";
import { Pass1 } from "@/components/study/Pass1";
import { Pass2 } from "@/components/study/Pass2";
import { Pass3 } from "@/components/study/Pass3";
import { Pass4 } from "@/components/study/Pass4";

const STUDY_TOUR_STEPS: import("react-joyride").Step[] = [
  {
    target: '[data-tour="study-pass"]',
    title: "Your Pass Level",
    content: "Each pass tests you differently: matching → multiple choice → recall → full definition from memory. Work through all 4 to truly master the material.",
    placement: "bottom" as const,
    disableBeacon: true,
  },
  {
    target: '[data-tour="study-start"]',
    title: "You're Ready!",
    content: "Click here to begin your first study session. Tour complete — good luck!",
    placement: "top" as const,
  },
];

async function fetchChapter(id: string): Promise<Chapter | null> {
  const [chapterRes, cardsRes] = await Promise.all([
    supabase.from("recall_chapters").select("id, name").eq("id", id).single(),
    supabase
      .from("recall_cards")
      .select("term, definition")
      .eq("chapter_id", id)
      .order("sort_order", { ascending: true }),
  ]);
  if (chapterRes.error || !chapterRes.data) return null;
  return {
    id: chapterRes.data.id,
    name: chapterRes.data.name,
    cards: (cardsRes.data ?? []) as { term: string; definition: string }[],
  };
}

export default function Study() {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, setPassForChapter } = useApp();

  const pass = Math.max(1, Math.min(4, Number(searchParams.get("pass") || 1)));
  const [chapter, setChapter] = useState<Chapter | null | undefined>(undefined);
  const [started, setStarted] = useState(false);
  const { completed: studyTourDone, complete: completeStudyTour } = useTour("recall-app-study");
  const studyTourStyles = useTourStyles();

  function handleStudyTourCallback({ status }: EventData) {
    if (status === STATUS.FINISHED || status === STATUS.SKIPPED) completeStudyTour();
  }

  useEffect(() => {
    if (!user) { navigate("/login"); return; }
  }, [user, navigate]);

  useEffect(() => {
    if (!id) { setChapter(null); return; }
    fetchChapter(id).then(setChapter);
  }, [id]);

  if (chapter === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  if (!chapter) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 text-center">
        <div>
          <h2 className="text-xl font-bold mb-2">Chapter not found</h2>
          <Button onClick={() => navigate("/")}>Back to dashboard</Button>
        </div>
      </div>
    );
  }

  const info = PASS_CONFIG[pass];
  const passDescriptions: Record<number, string> = {
    1: "Match each term to its correct definition. Click a term, then its definition.",
    2: "Select the correct definition for each term from four options.",
    3: "Read the definition and type the missing term. A letter-count hint is shown.",
    4: "See the term and write the full definition from memory. Then self-assess.",
  };
  const passLabel = info.label.split(" · ")[1];

  async function onComplete() {
    if (!chapter) return;
    const nextPass = Math.min(pass + 1, 4);
    await setPassForChapter(chapter.id, nextPass);
    toast.success(
      pass < 4 ? `Great work! Moved to Pass ${nextPass}` : "Chapter mastered! 🎉",
    );
    navigate("/");
  }

  return (
    <div className="min-h-screen bg-background">
      <Joyride
        steps={STUDY_TOUR_STEPS}
        run={!studyTourDone && !started}
        continuous
        onEvent={handleStudyTourCallback}
        options={{ showProgress: true, buttons: ['back', 'primary', 'skip'] }}
        styles={studyTourStyles}
        locale={{ last: "Done" }}
      />
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
            <div className="font-bold text-foreground truncate">{chapter.name}</div>
            <div className="text-xs text-muted-foreground">{chapter.cards.length} terms</div>
          </div>
          <PassBadge pass={pass} />
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-8">
        {!started ? (
          <div className="flex flex-col items-center text-center gap-6 py-8">
            <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center", info.bg)}>
              <BookOpen size={28} className={info.text} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2 font-display">
                {chapter.name}
              </h2>
              <span
                data-tour="study-pass"
                className={cn("inline-block px-3 py-1 rounded-full text-xs font-bold mb-4", info.bg, info.text)}
              >
                Pass {pass} · {passLabel}
              </span>
              <p className="text-muted-foreground text-sm max-w-sm mx-auto">
                {passDescriptions[pass]}
              </p>
            </div>
            <div className="bg-card rounded-xl border border-border p-4 text-left w-full max-w-xs">
              <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
                Session info
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Terms</span>
                <span className="font-semibold">{chapter.cards.length}</span>
              </div>
              <div className="flex justify-between text-sm mt-1">
                <span className="text-muted-foreground">Mode</span>
                <span className={cn("font-semibold", info.text)}>{passLabel}</span>
              </div>
            </div>
            <Button size="lg" onClick={() => setStarted(true)} data-tour="study-start">
              Start Studying →
            </Button>
          </div>
        ) : (
          <>
            {pass === 1 && <Pass1 cards={chapter.cards} onComplete={onComplete} />}
            {pass === 2 && <Pass2 cards={chapter.cards} onComplete={onComplete} />}
            {pass === 3 && <Pass3 cards={chapter.cards} onComplete={onComplete} />}
            {pass === 4 && <Pass4 cards={chapter.cards} onComplete={onComplete} />}
          </>
        )}
      </main>
    </div>
  );
}
