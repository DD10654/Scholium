import { ChevronDown, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { PASS_CONFIG } from "@/components/PassBadge";

interface DemoChapter {
  id: string;
  name: string;
  cards: number;
  pass: number;
}

interface DemoSection {
  id: string;
  name: string;
  emoji: string;
  accent: "blue" | "green";
  expanded?: boolean;
  chapters: DemoChapter[];
}

const SECTIONS: DemoSection[] = [
  {
    id: "sec-1",
    name: "Cell Biology",
    emoji: "🧬",
    accent: "blue",
    expanded: true,
    chapters: [
      { id: "ch-1", name: "Cell structure & organelles", cards: 32, pass: 3 },
      { id: "ch-2", name: "Membrane transport", cards: 24, pass: 2 },
      { id: "ch-3", name: "Mitosis & meiosis", cards: 41, pass: 1 },
      { id: "ch-4", name: "Enzyme kinetics", cards: 18, pass: 4 },
    ],
  },
  {
    id: "sec-2",
    name: "Genetics",
    emoji: "🧪",
    accent: "green",
    chapters: [
      { id: "ch-5", name: "Mendelian inheritance", cards: 27, pass: 2 },
      { id: "ch-6", name: "DNA replication", cards: 22, pass: 3 },
      { id: "ch-7", name: "Protein synthesis", cards: 35, pass: 1 },
    ],
  },
  {
    id: "sec-3",
    name: "Ecology",
    emoji: "🌱",
    accent: "blue",
    chapters: [
      { id: "ch-8", name: "Energy flow", cards: 19, pass: 2 },
      { id: "ch-9", name: "Nutrient cycles", cards: 26, pass: 1 },
    ],
  },
  {
    id: "sec-4",
    name: "Human Physiology",
    emoji: "❤️",
    accent: "green",
    chapters: [
      { id: "ch-10", name: "Circulatory system", cards: 38, pass: 3 },
      { id: "ch-11", name: "Respiration", cards: 24, pass: 2 },
      { id: "ch-12", name: "Nervous coordination", cards: 31, pass: 1 },
    ],
  },
];

const SUBJECTS = [
  { id: "biology", name: "Biology", emoji: "🧬", active: true },
  { id: "chemistry", name: "Chemistry", emoji: "⚗️", active: false },
];

function ChapterRow({ chapter }: { chapter: DemoChapter }) {
  const color = PASS_CONFIG[chapter.pass] || PASS_CONFIG[1];
  return (
    <div
      className={cn(
        "rounded-lg border-2 bg-card shadow-card p-4 flex items-center justify-between gap-3",
        color.ring,
      )}
    >
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-sm text-foreground truncate">{chapter.name}</div>
        <div className="text-xs text-muted-foreground mt-0.5">{chapter.cards} terms</div>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <span
          className={cn(
            "flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold",
            color.bg,
            color.text,
          )}
        >
          <span className={cn("w-1.5 h-1.5 rounded-full", color.dot)} />
          P{chapter.pass}
          <ChevronDown size={10} />
        </span>
      </div>
    </div>
  );
}

function SectionCard({ section }: { section: DemoSection }) {
  const totalCards = section.chapters.reduce((s, c) => s + c.cards, 0);
  return (
    <div className="rounded-xl border-2 border-border bg-card shadow-card overflow-hidden">
      <div className="w-full flex items-center justify-between p-5 text-left">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0",
              section.accent === "blue" ? "bg-primary/10" : "bg-accent/10",
            )}
          >
            {section.emoji}
          </div>
          <div>
            <div className="font-bold text-foreground">{section.name}</div>
            <div className="text-xs text-muted-foreground">
              {section.chapters.length} chapters · {totalCards} terms
            </div>
          </div>
        </div>
        <ChevronDown
          size={18}
          className={cn(
            "text-muted-foreground transition-transform duration-200",
            section.expanded && "rotate-180",
          )}
        />
      </div>
      {section.expanded && (
        <div className="px-5 pb-5 flex flex-col gap-2 border-t border-border pt-4">
          {section.chapters.map((ch) => (
            <ChapterRow key={ch.id} chapter={ch} />
          ))}
          <button className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg gradient-warm text-white font-semibold text-sm mt-1">
            <Zap size={14} />
            Practice 30 Random Definitions
          </button>
        </div>
      )}
    </div>
  );
}

export default function Demo() {
  return (
    <div className="min-h-screen bg-background">
      <header className="max-w-5xl mx-auto px-6 pt-10 pb-2">
        <h1 className="text-foreground text-3xl sm:text-4xl font-bold tracking-tight">
          Recall.
        </h1>
        <p className="mt-2 text-muted-foreground max-w-2xl leading-relaxed">
          A laboratory for memory. Four progressive passes (match, choose, recall, write) until the answer is yours.
        </p>
      </header>

      <div className="max-w-5xl mx-auto px-6 mt-6">
        <div className="flex gap-2">
          {SUBJECTS.map((s) => (
            <button
              key={s.id}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm",
                s.active
                  ? "bg-primary text-primary-foreground shadow-soft"
                  : "bg-card text-muted-foreground border border-border",
              )}
            >
              <span>{s.emoji}</span>
              {s.name}
            </button>
          ))}
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-6 py-6">
        <div className="grid md:grid-cols-2 gap-4">
          {SECTIONS.map((section) => (
            <SectionCard key={section.id} section={section} />
          ))}
        </div>
        <div className="flex justify-end mt-6">
          <Button variant="default">
            <Zap className="mr-2 h-4 w-4" />
            Practice Random
          </Button>
        </div>
      </main>
    </div>
  );
}
