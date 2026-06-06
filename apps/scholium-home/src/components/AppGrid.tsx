import type { AppLink } from "@repo/ui";
import AppCard from "./AppCard";

interface AppGridProps {
  apps: AppLink[];
  loading: boolean;
  highlightedAppId?: string | null;
  subject?: string | null;
}

export default function AppGrid({ apps, loading, highlightedAppId, subject }: AppGridProps) {
  const toolApps = apps.filter((a) => a.id !== "scholium-home");
  const count = toolApps.length;
  const subtitle = subject
    ? `Tools that cover ${subject}.`
    : count === 0
      ? "Purpose-built tools for different kinds of study."
      : `${count} tools, one account. Each one purpose-built for a different kind of study, use one or use them all.`;

  return (
    <section id="tools" className="relative py-24 border-t border-[color:var(--color-rule)]">
      <div className="max-w-5xl mx-auto px-6">
        <header className="mb-12 text-center">
          <h2
            className="text-foreground"
            style={{
              fontSize: "clamp(2rem, 5vw, 3.25rem)",
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
              fontWeight: 700,
            }}
          >
            {subject ? (
              <>
                The Scholium Suite —{" "}
                <span style={{ color: "hsl(var(--primary))" }}>For {subject}</span>
              </>
            ) : (
              <>
                The Scholium <span style={{ color: "hsl(var(--primary))" }}>suite.</span>
              </>
            )}
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-foreground/75 leading-relaxed text-lg">
            {subtitle}
          </p>
        </header>

        {loading ? (
          <div className="flex flex-col gap-12">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-paper rounded-[var(--radius-lg)] border border-[color:var(--color-border)] h-64 animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-12 rui-stagger">
            {toolApps.map((app, i) => (
              <AppCard
                key={app.id}
                {...app}
                highlighted={app.id === highlightedAppId}
                imageSide={i % 2 === 0 ? "right" : "left"}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
