import { Download, FileText, ScrollText } from "lucide-react";
import Layout from "@/components/Layout";

interface DemoChapter {
  number: number;
  name: string;
  hasMS: boolean;
}

const CHAPTERS: DemoChapter[] = [
  { number: 1, name: "Number", hasMS: true },
  { number: 2, name: "Algebra and graphs", hasMS: true },
  { number: 3, name: "Coordinate geometry", hasMS: true },
  { number: 4, name: "Geometry", hasMS: true },
  { number: 5, name: "Mensuration", hasMS: false },
  { number: 6, name: "Trigonometry", hasMS: true },
  { number: 7, name: "Vectors and transformations", hasMS: true },
  { number: 8, name: "Probability", hasMS: true },
];

function PaperLink({ variant, available }: { variant: "qp" | "ms"; available: boolean }) {
  const label = variant === "qp" ? "Question paper" : "Mark scheme";
  const Icon = variant === "qp" ? FileText : ScrollText;
  const accentVar = variant === "qp" ? "--primary" : "--accent";
  const color = `hsl(var(${accentVar}))`;
  const bg = `hsl(var(${accentVar}) / 0.08)`;
  const border = `hsl(var(${accentVar}) / 0.2)`;

  if (!available) {
    return (
      <div className="flex items-center gap-3 rounded-xl border border-dashed border-border px-4 py-3 text-sm text-muted-foreground">
        <Icon size={16} className="opacity-50" />
        <span>{label} not available</span>
      </div>
    );
  }

  return (
    <div
      className="group flex items-center gap-3 rounded-xl border px-4 py-3 text-sm font-medium"
      style={{ background: bg, borderColor: border, color }}
    >
      <Icon size={16} />
      <span className="flex-1">{label}</span>
      <Download size={14} className="opacity-60" />
    </div>
  );
}

function ChapterCard({ entry }: { entry: DemoChapter }) {
  return (
    <article
      className="rounded-2xl border border-border bg-card p-5"
      style={{ boxShadow: "var(--shadow-card)" }}
    >
      <div className="flex items-baseline gap-3 mb-4">
        <span
          className="font-display font-bold text-sm w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
          style={{
            background: "hsl(var(--primary) / 0.1)",
            color: "hsl(var(--primary))",
          }}
        >
          {entry.number}
        </span>
        <h3 className="font-display font-bold text-lg text-foreground leading-tight">
          {entry.name}
        </h3>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <PaperLink variant="qp" available={true} />
        <PaperLink variant="ms" available={entry.hasMS} />
      </div>
    </article>
  );
}

function Crumb({ children, active }: { children: React.ReactNode; active?: boolean }) {
  return (
    <span
      className={`text-sm ${active ? "text-foreground font-semibold" : "text-muted-foreground"}`}
    >
      {children}
    </span>
  );
}

export default function Demo() {
  return (
    <Layout subtitle="Each chapter has a paper compilation and its mark scheme.">
      <div className="mb-4 flex items-center gap-2">
        <Crumb>Subjects</Crumb>
        <span className="text-muted-foreground">/</span>
        <Crumb>Mathematics (0580)</Crumb>
        <span className="text-muted-foreground">/</span>
        <Crumb active>Paper 4 — Extended</Crumb>
      </div>

      <div className="mb-6">
        <h2 className="font-display font-bold text-2xl text-foreground">Paper 4 — Extended</h2>
        <p className="text-sm text-muted-foreground mt-1">Mathematics (0580)</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {CHAPTERS.map((entry) => (
          <ChapterCard key={entry.number} entry={entry} />
        ))}
      </div>
    </Layout>
  );
}
