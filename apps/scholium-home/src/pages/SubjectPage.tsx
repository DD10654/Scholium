import { ArrowUpRight, FlaskConical, PlayCircle } from "lucide-react";
import { useParams } from "react-router-dom";
import type { AppLink } from "@repo/ui";
import Footer from "@/components/Footer";
import { getSubject } from "@/content/subjects";
import { DEMO_SLUGS, demoUrl, findApp } from "@/lib/apps";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";

// Friendly fallbacks for a tool's name/blurb before the DB-loaded suite arrives.
const TOOL_FALLBACK: Record<string, { title: string; blurb: string }> = {
  "language-hub": {
    title: "Language Hub",
    blurb: "Flashcards, drills, and dictation with spaced review in French and Spanish.",
  },
  "recall-app": {
    title: "Recall App",
    blurb: "Active recall in four progressive passes — match, choose, recall, write.",
  },
  "poetry-notes": {
    title: "Poetry Notes",
    blurb: "Annotate poems with linked notes that connect imagery, form, and theme.",
  },
  "past-papers": {
    title: "Past Papers",
    blurb: "Topical exam practice with mark schemes, organised by subject and chapter.",
  },
};

interface SubjectPageProps {
  apps: AppLink[];
}

export default function SubjectPage({ apps }: SubjectPageProps) {
  const { slug = "" } = useParams();
  const subject = getSubject(slug);

  useDocumentMeta({
    title: subject
      ? `${subject.name} revision tools — Scholium`
      : "Subject not found — Scholium",
    description: subject?.intro,
    canonicalPath: subject ? `/subjects/${subject.slug}` : undefined,
  });

  if (!subject) {
    return (
      <div className="min-h-screen flex flex-col">
        <main className="flex-1 flex flex-col items-center justify-center px-6 text-center gap-4">
          <h1 className="text-2xl font-bold text-foreground">We don't have that subject yet.</h1>
          <a href="/" className="sch-btn sch-btn--primary sch-focus">
            Back to Scholium
          </a>
        </main>
        <Footer apps={apps} />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        {/* Hero */}
        <section className="relative py-20 overflow-hidden">
          <div
            aria-hidden
            className="absolute inset-0 -z-10 pointer-events-none"
            style={{
              backgroundImage:
                "radial-gradient(ellipse 70% 50% at 20% 20%, hsl(var(--primary) / 0.12), transparent 60%), radial-gradient(ellipse 60% 50% at 80% 80%, hsl(var(--accent) / 0.12), transparent 60%)",
            }}
          />
          <div className="max-w-3xl mx-auto px-6 text-center">
            <div className="text-5xl mb-5" aria-hidden>
              {subject.emoji}
            </div>
            <h1
              className="text-foreground"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(2rem, 6vw, 3.5rem)",
                lineHeight: 1.08,
                letterSpacing: "-0.025em",
                fontWeight: 700,
              }}
            >
              {subject.headline}
            </h1>
            <p className="mt-6 text-lg text-foreground/80 leading-relaxed">{subject.intro}</p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <a href="/signup" className="sch-btn sch-btn--primary sch-focus">
                Start free
              </a>
              <a href="#tools" className="sch-btn sch-btn--ghost sch-focus">
                See the tools
              </a>
            </div>
          </div>
        </section>

        {/* Tools for this subject */}
        <section id="tools" className="py-16 border-t border-[color:var(--color-rule)]">
          <div className="max-w-4xl mx-auto px-6">
            <h2
              className="text-foreground mb-8 text-center"
              style={{ fontSize: "clamp(1.5rem, 4vw, 2.25rem)", fontWeight: 700, letterSpacing: "-0.02em" }}
            >
              Tools for {subject.name}
            </h2>
            <div className="grid gap-5 sm:grid-cols-2">
              {subject.tools.map((toolSlug) => {
                const app = findApp(toolSlug, apps);
                const fallback = TOOL_FALLBACK[toolSlug];
                const title = app?.title ?? fallback?.title ?? toolSlug;
                const blurb = app?.description ?? fallback?.blurb ?? "";
                const canTry = app?.has_demo ?? DEMO_SLUGS.has(toolSlug);
                return (
                  <div
                    key={toolSlug}
                    className="bg-paper rounded-[var(--radius-lg)] border p-6 flex flex-col"
                    style={{ boxShadow: "var(--shadow-card)", borderColor: "var(--color-border)" }}
                  >
                    <h3 className="text-foreground" style={{ fontSize: "1.2rem", fontWeight: 700 }}>
                      {title}
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed flex-1">{blurb}</p>
                    <div className="mt-5 flex flex-wrap items-center gap-2">
                      {app && (
                        <a
                          href={app.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="sch-btn sch-btn--primary sch-focus"
                          style={{ padding: "0.6rem 1rem", fontSize: "0.85rem" }}
                        >
                          Open {title}
                          <ArrowUpRight size={16} aria-hidden />
                        </a>
                      )}
                      {canTry && app && (
                        <a
                          href={demoUrl(app)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="sch-btn sch-btn--ghost sch-focus"
                          style={{ padding: "0.6rem 1rem", fontSize: "0.85rem" }}
                        >
                          <PlayCircle size={16} aria-hidden />
                          Try free
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Sample content */}
        <section className="py-16 border-t border-[color:var(--color-rule)]">
          <div className="max-w-2xl mx-auto px-6">
            <h2
              className="text-foreground mb-6 text-center"
              style={{ fontSize: "clamp(1.4rem, 4vw, 2rem)", fontWeight: 700, letterSpacing: "-0.02em" }}
            >
              A taste of what you'll practise
            </h2>
            <div
              className="bg-paper rounded-[var(--radius-lg)] border overflow-hidden"
              style={{ borderColor: "var(--color-border)" }}
            >
              <div
                className="grid grid-cols-2 text-xs font-semibold uppercase tracking-[0.1em] text-muted-foreground"
                style={{ borderBottom: "1px solid var(--color-rule)" }}
              >
                <div className="px-5 py-3">{subject.sample.columns[0]}</div>
                <div className="px-5 py-3" style={{ borderLeft: "1px solid var(--color-rule)" }}>
                  {subject.sample.columns[1]}
                </div>
              </div>
              {subject.sample.rows.map(([a, b], i) => (
                <div
                  key={a}
                  className="grid grid-cols-2 text-sm"
                  style={{ borderTop: i === 0 ? "none" : "1px solid var(--color-rule)" }}
                >
                  <div className="px-5 py-3 font-semibold text-foreground">{a}</div>
                  <div
                    className="px-5 py-3 text-foreground/80 leading-relaxed"
                    style={{ borderLeft: "1px solid var(--color-rule)" }}
                  >
                    {b}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Memory science callout */}
        <section className="py-16 border-t border-[color:var(--color-rule)]">
          <div className="max-w-2xl mx-auto px-6 text-center">
            <span
              aria-hidden
              className="inline-flex items-center justify-center rounded-[var(--radius-sm)] mb-5"
              style={{
                width: "2.75rem",
                height: "2.75rem",
                background: "hsl(var(--accent) / 0.1)",
                color: "hsl(var(--accent))",
                border: "1px solid hsl(var(--accent) / 0.25)",
              }}
            >
              <FlaskConical size={22} strokeWidth={2} />
            </span>
            <h2 className="text-foreground mb-3" style={{ fontSize: "1.6rem", fontWeight: 700, letterSpacing: "-0.02em" }}>
              Why this works
            </h2>
            <p className="text-foreground/75 leading-relaxed mb-6">
              Every tool is built on spaced repetition and active recall — techniques with
              decades of peer-reviewed evidence behind them.
            </p>
            <a href="/memory-science" className="sch-btn sch-btn--ghost sch-focus">
              See the research
            </a>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 border-t border-[color:var(--color-rule)]">
          <div className="max-w-2xl mx-auto px-6 text-center">
            <h2 className="text-foreground mb-3" style={{ fontSize: "1.75rem", fontWeight: 700, letterSpacing: "-0.02em" }}>
              Ready to revise {subject.name}?
            </h2>
            <p className="text-foreground/75 leading-relaxed mb-7">
              Free forever, and you can try any tool without an account.
            </p>
            <a href="/signup" className="sch-btn sch-btn--primary sch-focus">
              Create free account
            </a>
          </div>
        </section>
      </main>
      <Footer apps={apps} />
    </div>
  );
}
