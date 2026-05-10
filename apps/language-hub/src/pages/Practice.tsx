import { useEffect, useState } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Dumbbell } from "lucide-react";
import { toast } from "sonner";
import { QuizSession, QuizQuestion, QuestionType } from "@/components/QuizSession";
import { useTourStyles } from "@repo/ui";
import { useTour } from "@/hooks/useTour";
import { Joyride, type EventData, STATUS } from "react-joyride";

const PRACTICE_TOUR_STEPS = [
  {
    target: '[data-tour="practice-progress"]',
    title: "Your Progress",
    content: "This bar tracks how far through the session you are. Keep going!",
    placement: "bottom" as const,
    disableBeacon: true,
  },
  {
    target: '[data-tour="practice-question"]',
    title: "Answer the Question",
    content: "Read the prompt carefully and select or type your answer. Tour complete — enjoy the practice!",
    placement: "top" as const,
  },
];

interface VocabularyItem {
  id: string;
  term: string;
  definition: string;
  set_id: string;
}

const generateQuestions = (
  items: VocabularyItem[],
  setLanguageMap: Record<string, string>,
  allowedTypes: QuestionType[],
): QuizQuestion[] => {
  const types = allowedTypes.length > 0 ? allowedTypes : (["fr-to-en", "en-to-fr", "dictation"] as QuestionType[]);
  const questions: QuizQuestion[] = [];

  items.forEach((item) => {
    const language = setLanguageMap[item.set_id] || "french";
    const langLabel = language === "spanish" ? "Spanish" : "French";
    const type = types[Math.floor(Math.random() * types.length)];
    let prompt = "";
    let answer = "";

    switch (type) {
      case "fr-to-en":
        prompt = `Translate to English: "${item.term}"`;
        answer = item.definition;
        break;
      case "en-to-fr":
        prompt = `Translate to ${langLabel}: "${item.definition}"`;
        answer = item.term;
        break;
      case "dictation":
        prompt = `Listen and write the ${langLabel} word:`;
        answer = item.term;
        break;
    }

    questions.push({ item, type, prompt, answer, language });
  });

  return questions.sort(() => Math.random() - 0.5);
};

const Practice = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const VALID_TYPES: QuestionType[] = ["fr-to-en", "en-to-fr", "dictation"];
  const rawCount = parseInt(searchParams.get("count") || "20", 10);
  const count = Number.isFinite(rawCount) ? Math.min(Math.max(rawCount, 5), 200) : 20;
  const allowedTypes = (searchParams.get("types") || "fr-to-en,en-to-fr,dictation")
    .split(",")
    .filter((t): t is QuestionType => VALID_TYPES.includes(t as QuestionType));

  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const { completed: practiceTourDone, complete: completePracticeTour } = useTour("language-hub-practice");
  const practiceTourStyles = useTourStyles();

  function handlePracticeTourCallback({ status }: EventData) {
    if (status === STATUS.FINISHED || status === STATUS.SKIPPED) completePracticeTour();
  }

  useEffect(() => {
    fetchMasteredItems();
  }, [count]);

  const fetchMasteredItems = async () => {
    try {
      const { data: progressData, error: progressError } = await supabase
        .from("set_progress")
        .select("item_id")
        .eq("mastered", true);

      if (progressError) throw progressError;

      if (!progressData || progressData.length === 0) {
        toast.error("No mastered items found. Complete some vocabulary sets first!");
        navigate("/");
        return;
      }

      const masteredIds = progressData.map((p) => p.item_id);

      const { data: itemsData, error: itemsError } = await supabase
        .from("vocabulary_items")
        .select("*")
        .in("id", masteredIds);

      if (itemsError) throw itemsError;

      if (!itemsData || itemsData.length === 0) {
        toast.error("No vocabulary items found");
        navigate("/");
        return;
      }

      const shuffled = itemsData.sort(() => Math.random() - 0.5);
      const selected = shuffled.slice(0, Math.min(count, shuffled.length));

      if (selected.length < count) {
        toast.info(`Only ${selected.length} mastered items available`);
      }

      const uniqueSetIds = [...new Set(selected.map((i) => i.set_id))];
      const { data: setsData } = await supabase
        .from("vocabulary_sets")
        .select("id, language")
        .in("id", uniqueSetIds);

      const setLanguageMap: Record<string, string> = {};
      (setsData || []).forEach((s) => {
        setLanguageMap[s.id] = s.language || "french";
      });

      setQuestions(generateQuestions(selected, setLanguageMap, allowedTypes));
    } catch (error) {
      console.error("Error fetching mastered items:", error);
      toast.error("Failed to load practice items");
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading practice session...</div>
      </div>
    );
  }

  return (
    <>
      <Joyride
        steps={PRACTICE_TOUR_STEPS}
        run={!practiceTourDone && !loading}
        continuous
        onEvent={handlePracticeTourCallback}
        options={{ showProgress: true, buttons: ['back', 'primary', 'skip'] }}
        styles={practiceTourStyles}
        locale={{ last: "Done" }}
      />
      <QuizSession
        questions={questions}
        title="Practice Mode"
      completionTitle="Practice Complete!"
      completionSubtitle="Cross-Set Review"
      completionActions={
        <>
          <Link to="/practice-setup">
            <Button variant="outline">
              <Dumbbell className="mr-2 h-4 w-4" />
              Practice Again
            </Button>
          </Link>
          <Link to="/">
            <Button variant="hero">Back to Sets</Button>
          </Link>
        </>
      }
      />
    </>
  );
};

export default Practice;
