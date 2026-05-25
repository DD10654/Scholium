import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Zap, Download, AlertCircle } from "lucide-react";
import Layout from "@/components/Layout";
import { EmptyState } from "@/components/StateViews";
import { useAsync } from "@/hooks/useAsync";
import {
  listSubjects,
  listComponents,
  getQuestionsByChapter,
  generatePaper,
} from "@/lib/papers";

type SelectionMap = {
  [chapterNum: number]: number; // chapter -> question count
};

// chapter_num in the database matches the position shown here.
const CHAPTER_NAMES: Record<number, string> = {
  1:  "Number",
  2:  "Operations with Numbers",
  3:  "Using Number",
  4:  "Angles and Bearings",
  5:  "Triangles, Quadrilaterals and Polygons",
  6:  "Indices, Standard Forms and Surds",
  7:  "Introduction to Algebra",
  8:  "Simultaneous Linear Equations",
  9:  "Symmetry, Congruency and Similarity",
  10: "Pythagoras' Theorem",
  11: "Coordinate Geometry",
  12: "Mensuration",
  13: "Quadratic Expressions",
  14: "Functions 1",
  15: "Trigonometry",
  16: "Circle Properties",
  17: "Vectors and Transformations",
  18: "Sets",
  19: "Descriptive Statistics",
  20: "Cumulative Frequency Graphs and Linear Regression",
  21: "Probability",
  22: "Sequences",
  23: "Functions 2",
};

const ALL_CHAPTERS = Object.keys(CHAPTER_NAMES).map(Number);

export default function GeneratePaperPage() {
  const navigate = useNavigate();
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [selectedComponent, setSelectedComponent] = useState<string | null>(
    null
  );
  const [selections, setSelections] = useState<SelectionMap>({});
  const [chapterCounts, setChapterCounts] = useState<Record<number, number>>({});
  const [includeMarkScheme, setIncludeMarkScheme] = useState(true);
  const [randomize, setRandomize] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generateError, setGenerateError] = useState<string | null>(null);

  // Load subjects
  const { data: subjects, loading: loadingSubjects } = useAsync(
    () => listSubjects(),
    []
  );

  // Load components for selected subject
  const { data: components, loading: loadingComponents } = useAsync(
    () =>
      selectedSubject ? listComponents(selectedSubject) : Promise.resolve([]),
    [selectedSubject]
  );

  // Load available question counts per chapter when component is selected
  useEffect(() => {
    if (!selectedComponent) return;

    async function loadCounts() {
      const counts: Record<number, number> = {};
      const promises = ALL_CHAPTERS.map(async (ch) => {
        try {
          const questions = await getQuestionsByChapter(ch);
          counts[ch] = questions.length;
        } catch {
          counts[ch] = 0;
        }
      });
      await Promise.all(promises);
      setChapterCounts(counts);
    }

    loadCounts();
  }, [selectedComponent]);

  const handleSubjectSelect = (subject: string) => {
    setSelectedSubject(subject);
    setSelectedComponent(null);
    setSelections({});
  };

  const handleComponentSelect = (component: string) => {
    setSelectedComponent(component);
    setSelections({});
  };

  const handleChapterToggle = (chapter: number, count: number) => {
    setSelections((prev) => {
      const updated = { ...prev };
      if (count === 0) {
        delete updated[chapter];
      } else {
        updated[chapter] = count;
      }
      return updated;
    });
    setGenerateError(null);
  };

  const selectedChapters = Object.keys(selections).map(Number);
  const totalQuestions = Object.values(selections).reduce((a, b) => a + b, 0);
  const estimatedTime = Math.round(totalQuestions * 2.5);

  const handleGenerate = async () => {
    if (totalQuestions === 0) {
      setGenerateError("Please select at least one chapter with questions");
      return;
    }

    setIsGenerating(true);
    setGenerateError(null);

    try {
      // For each selected chapter, fetch questions and randomly pick the requested count
      const selectedQuestionIds: string[] = [];

      for (const chapter of selectedChapters) {
        const requested = selections[chapter];
        const allQuestions = await getQuestionsByChapter(chapter);

        if (allQuestions.length === 0) {
          throw new Error(
            `No questions available for Chapter ${chapter}`
          );
        }

        // Shuffle and pick the requested count
        const shuffled = [...allQuestions].sort(() => Math.random() - 0.5);
        const picked = shuffled.slice(
          0,
          Math.min(requested, shuffled.length)
        );
        selectedQuestionIds.push(...picked.map((q) => q.id));
      }

      const pdf = await generatePaper(selectedQuestionIds, {
        includeMarkScheme,
        randomize,
      });

      // Download PDF
      const url = URL.createObjectURL(pdf);
      const link = document.createElement("a");
      link.href = url;
      const timestamp = new Date().toISOString().slice(0, 10);
      link.download = `${selectedSubject}-${selectedComponent}-${timestamp}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      setGenerateError(
        error instanceof Error ? error.message : "Failed to generate paper"
      );
      console.error("Generation error:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Layout>
      <button
        onClick={() => navigate("/")}
        className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors mb-6"
      >
        <ChevronLeft size={16} />
        Back
      </button>

      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 rounded-lg bg-accent/10">
            <Zap size={20} className="text-accent" />
          </div>
          <h1 className="font-display font-bold text-3xl">Generate Paper</h1>
        </div>
        <p className="text-muted-foreground text-sm">
          Select chapters and the number of questions you want from each. Questions are picked at random.
        </p>
      </div>

      {/* Step 1: Subject Selection */}
      <section className="mb-8">
        <h2 className="font-display font-semibold text-lg mb-4 flex items-center gap-2">
          <span className="flex items-center justify-center w-7 h-7 rounded-full bg-primary/10 text-primary text-sm font-bold">
            1
          </span>
          Select Subject
        </h2>
        {loadingSubjects ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-12 rounded-lg bg-card animate-pulse" />
            ))}
          </div>
        ) : subjects && subjects.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {subjects.map((subject) => (
              <button
                key={subject}
                onClick={() => handleSubjectSelect(subject)}
                className="px-4 py-3 rounded-lg border-2 font-medium transition-all text-left"
                style={{
                  borderColor:
                    selectedSubject === subject
                      ? "hsl(var(--primary))"
                      : "hsl(var(--border))",
                  backgroundColor:
                    selectedSubject === subject
                      ? "hsl(var(--primary) / 0.08)"
                      : "transparent",
                  color:
                    selectedSubject === subject
                      ? "hsl(var(--primary))"
                      : "hsl(var(--foreground))",
                }}
              >
                {subject}
              </button>
            ))}
          </div>
        ) : (
          <EmptyState
            title="No subjects available"
            hint="Upload papers to get started."
          />
        )}
      </section>

      {/* Step 2: Component Selection */}
      {selectedSubject && (
        <section className="mb-8">
          <h2 className="font-display font-semibold text-lg mb-4 flex items-center gap-2">
            <span className="flex items-center justify-center w-7 h-7 rounded-full bg-accent/10 text-accent text-sm font-bold">
              2
            </span>
            Select Component
          </h2>
          {loadingComponents ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-12 rounded-lg bg-card animate-pulse" />
              ))}
            </div>
          ) : components && components.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {components.map((component) => (
                <button
                  key={component}
                  onClick={() => handleComponentSelect(component)}
                  className="px-4 py-3 rounded-lg border-2 font-medium transition-all text-left"
                  style={{
                    borderColor:
                      selectedComponent === component
                        ? "hsl(var(--accent))"
                        : "hsl(var(--border))",
                    backgroundColor:
                      selectedComponent === component
                        ? "hsl(var(--accent) / 0.08)"
                        : "transparent",
                    color:
                      selectedComponent === component
                        ? "hsl(var(--accent))"
                        : "hsl(var(--foreground))",
                  }}
                >
                  {component}
                </button>
              ))}
            </div>
          ) : (
            <EmptyState
              title="No components available"
              hint="This subject has no components yet."
            />
          )}
        </section>
      )}

      {/* Step 3: Chapter Selection with Question Counts */}
      {selectedComponent && (
        <section className="mb-8">
          <h2 className="font-display font-semibold text-lg mb-4 flex items-center gap-2">
            <span className="flex items-center justify-center w-7 h-7 rounded-full bg-success/10 text-success text-sm font-bold">
              3
            </span>
            Choose Chapters & Question Counts
          </h2>

          <div className="space-y-2">
            {ALL_CHAPTERS.map((chapter) => {
              const available = chapterCounts[chapter] ?? 0;
              if (available === 0) return null;

              const isSelected = selections.hasOwnProperty(chapter);
              const questionCount = selections[chapter] || 0;
              const chapterName = CHAPTER_NAMES[chapter];

              return (
                <div
                  key={chapter}
                  className="rounded-xl border-2 p-4 transition-all"
                  style={{
                    borderColor: isSelected
                      ? "hsl(var(--success))"
                      : "hsl(var(--border))",
                    backgroundColor: isSelected
                      ? "hsl(var(--success) / 0.04)"
                      : "transparent",
                  }}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={(e) => {
                          handleChapterToggle(
                            chapter,
                            e.target.checked ? Math.min(5, available) : 0
                          );
                        }}
                        className="w-5 h-5 rounded mt-0.5 cursor-pointer"
                        aria-label={`Select ${chapterName}`}
                      />
                      <div>
                        <label className="font-display font-semibold text-foreground block mb-1">
                          Chapter {chapter}: {chapterName}
                        </label>
                        <p className="text-xs text-muted-foreground">
                          {available} questions available
                        </p>
                      </div>
                    </div>
                    {isSelected && (
                      <div className="flex items-center gap-2">
                        <label className="text-xs font-medium text-muted-foreground">
                          Questions:
                        </label>
                        <input
                          type="number"
                          min="1"
                          max={available}
                          value={questionCount}
                          onChange={(e) => {
                            const val = parseInt(e.target.value, 10);
                            if (!isNaN(val) && val > 0) {
                              handleChapterToggle(
                                chapter,
                                Math.min(val, available)
                              );
                            }
                          }}
                          className="w-16 px-2 py-1 rounded border border-border bg-background text-foreground text-center text-sm font-medium focus:outline-none focus:border-success"
                        />
                        <span className="text-xs text-muted-foreground">
                          / {available}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Options and Summary */}
      {selectedComponent && totalQuestions > 0 && (
        <section className="mb-8 rounded-xl bg-gradient-to-br from-card to-card/50 border border-border p-5">
          <div className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Mark Scheme</label>
                <input
                  type="checkbox"
                  checked={includeMarkScheme}
                  onChange={(e) => setIncludeMarkScheme(e.target.checked)}
                  className="w-4 h-4 rounded cursor-pointer"
                />
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Randomize Order</label>
                <input
                  type="checkbox"
                  checked={randomize}
                  onChange={(e) => setRandomize(e.target.checked)}
                  className="w-4 h-4 rounded cursor-pointer"
                />
              </div>
            </div>

            <div className="border-t border-border pt-4">
              <p className="text-xs font-medium text-muted-foreground mb-3">
                PAPER SUMMARY
              </p>
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div>
                  <p className="text-2xl font-display font-bold text-foreground">
                    {totalQuestions}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Questions
                  </p>
                </div>
                <div>
                  <p className="text-2xl font-display font-bold text-foreground">
                    {selectedChapters.length}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Chapters
                  </p>
                </div>
                <div>
                  <p className="text-2xl font-display font-bold text-foreground">
                    {estimatedTime}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Minutes
                  </p>
                </div>
              </div>

              <div className="text-xs text-muted-foreground space-y-1 mb-4">
                {[...selectedChapters].sort((a, b) => a - b).map((ch) => (
                  <div key={ch} className="flex justify-between">
                    <span>
                      Chapter {ch}: {CHAPTER_NAMES[ch] ?? "Unknown"}
                    </span>
                    <span className="font-medium text-foreground">
                      {selections[ch]} Q
                    </span>
                  </div>
                ))}
              </div>

              {generateError && (
                <div className="mb-4 flex items-start gap-2 p-3 rounded bg-destructive/10 border border-destructive/20">
                  <AlertCircle
                    size={16}
                    className="text-destructive mt-0.5 shrink-0"
                  />
                  <p className="text-sm text-destructive">{generateError}</p>
                </div>
              )}

              <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="w-full px-4 py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2"
                style={{
                  backgroundColor: isGenerating
                    ? "hsl(var(--muted))"
                    : "hsl(var(--primary))",
                  color: isGenerating
                    ? "hsl(var(--muted-foreground))"
                    : "hsl(var(--primary-foreground))",
                  cursor: isGenerating ? "not-allowed" : "pointer",
                  opacity: isGenerating ? 0.6 : 1,
                }}
              >
                <Download size={18} />
                {isGenerating ? "Generating..." : "Generate & Download"}
              </button>
            </div>
          </div>
        </section>
      )}
    </Layout>
  );
}
