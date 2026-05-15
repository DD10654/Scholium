import { ExternalLink } from "lucide-react";

const APP_META: Record<string, { tagline: string; description: string; accent: string }> = {
  "language-hub": {
    tagline: "Master vocabulary in French & Spanish",
    description: "Flashcards, quizzes, and dictation for effective language acquisition. Track your progress across both languages.",
    accent: "--primary",
  },
  "recall-app": {
    tagline: "Active recall across 4 progressive passes",
    description: "Match → choose → recall → write. Each pass builds deeper, more durable memory for any academic subject.",
    accent: "--accent",
  },
  "poetry-notes": {
    tagline: "Annotate poetry with connected notes",
    description: "Mark up poems and build an interconnected note canvas. Your annotations sync securely to the cloud across sessions.",
    accent: "--success",
  },
};

interface AppCardProps {
  id: string;
  title: string;
  url: string;
  icon?: string | null;
}

export default function AppCard({ id, title, url, icon }: AppCardProps) {
  const meta = APP_META[id];
  const accentVar = meta?.accent ?? "--primary";
  const accentColor = `hsl(var(${accentVar}))`;
  const accentBg = `hsl(var(${accentVar}) / 0.08)`;
  const accentBorder = `hsl(var(${accentVar}) / 0.2)`;

  return (
    <div
      className="group flex flex-col bg-card rounded-2xl p-6 border border-border transition-all duration-200 hover:-translate-y-1"
      style={{ boxShadow: "var(--shadow-card)" }}
      onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "var(--shadow-hover)")}
      onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "var(--shadow-card)")}
    >
      <div
        className="w-14 h-14 flex items-center justify-center rounded-2xl text-3xl mb-5"
        style={{ background: accentBg, border: `1px solid ${accentBorder}` }}
      >
        {icon ?? "✨"}
      </div>

      <h3 className="font-display font-bold text-lg text-foreground mb-1">{title}</h3>

      {meta && (
        <>
          <p className="text-sm font-semibold mb-3" style={{ color: accentColor }}>
            {meta.tagline}
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed flex-1">
            {meta.description}
          </p>
        </>
      )}

      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold transition-colors hover:opacity-80"
        style={{ color: accentColor }}
      >
        Open App
        <ExternalLink size={13} />
      </a>
    </div>
  );
}
