import { ArrowRight } from "lucide-react";
import type { Persona } from "./PersonaSelector";

interface FeaturesSectionProps {
  persona: Persona | null;
}

interface Feature {
  title: string;
  body: string;
  accentVar: string;
  cta: { label: string; href?: string; sectionId?: string };
}

const CTAS: Feature["cta"][] = [
  { label: "Sign Up", href: "/signup" },
  { label: "View the apps", sectionId: "tools" },
  { label: "Select your subjects", sectionId: "subjects" },
];

function getFeatures(persona: Persona | null): Feature[] {
  if (persona === "teacher") {
    return [
      {
        title: "One account, every tool",
        body: "One set of credentials. Your students sign in once and every tool in the suite is available, no separate subscriptions or juggling accounts.",
        accentVar: "--primary",
        cta: CTAS[0],
      },
      {
        title: "Built on memory science",
        body: "Each tool is backed by a specific memory principle, spaced repetition, active recall, elaborative interrogation. Nothing is included for the sake of it.",
        accentVar: "--accent",
        cta: CTAS[1],
      },
      {
        title: "No feeds. No streaks.",
        body: "No leaderboards, no streaks, no notifications pulling students away. Tools that help them think, not tools that keep them hooked.",
        accentVar: "--primary",
        cta: CTAS[2],
      },
    ];
  }
  if (persona === "parent") {
    return [
      {
        title: "One account, every tool",
        body: "One login and every tool is included. No separate subscriptions, no extra charges, everything is available from the moment your child signs up.",
        accentVar: "--primary",
        cta: CTAS[0],
      },
      {
        title: "Built on memory science",
        body: "Every tool is built on the science of how memory forms: spaced practice, active retrieval, and meaningful connections. No tricks, no shortcuts.",
        accentVar: "--accent",
        cta: CTAS[1],
      },
      {
        title: "No feeds. No streaks.",
        body: "No addictive loops, no streaks to maintain, no social feeds to distract from work. Just structured tools that help knowledge stick.",
        accentVar: "--primary",
        cta: CTAS[2],
      },
    ];
  }
  return [
    {
      title: "One account, every tool",
      body: "Sign in once. Your credentials, settings, and dark-mode preference travel across the entire suite, and every tool we add to it.",
      accentVar: "--primary",
      cta: CTAS[0],
    },
    {
      title: "Built on memory science",
      body: "Spaced repetition for vocabulary. Active recall passes for study. Connected marginalia for poetry. Each tool earns its place.",
      accentVar: "--accent",
      cta: CTAS[1],
    },
    {
      title: "No feeds. No streaks.",
      body: "Just focused interfaces that get out of the way and let you do the work. We don't measure engagement, we measure retention.",
      accentVar: "--primary",
      cta: CTAS[2],
    },
  ];
}

function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

export default function FeaturesSection({ persona }: FeaturesSectionProps) {
  const features = getFeatures(persona);
  return (
    <section className="relative py-24 border-t border-[color:var(--color-rule)]">
      <div className="max-w-6xl mx-auto px-6">
        <header className="mb-14 text-center">
          <h2
            className="text-foreground"
            style={{
              fontSize: "clamp(2rem, 5vw, 3.25rem)",
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
              fontWeight: 700,
            }}
          >
            Why <span style={{ color: "hsl(var(--primary))" }}>Scholium?</span>
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-foreground/75 leading-relaxed text-lg">
            Three principles, written down once and held to since.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map(({ title, body, accentVar, cta }, i) => {
            const accent = `hsl(var(${accentVar}))`;
            const ctaClass =
              "mt-5 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.12em] transition-opacity hover:opacity-70";
            const ctaStyle: React.CSSProperties = { color: accent };
            return (
              <article
                key={title}
                className="relative bg-paper rounded-[var(--radius-lg)] p-7 border border-[color:var(--color-border)] flex flex-col"
                style={{
                  boxShadow: "var(--shadow-card)",
                  animation: `rui-rise 0.5s var(--ease-out-paper) ${0.08 + i * 0.08}s both`,
                }}
              >
                <h3
                  className="text-foreground mb-3 flex items-center gap-2.5 pb-2 border-b"
                  style={{
                    fontSize: "1.25rem",
                    fontWeight: 700,
                    letterSpacing: "-0.01em",
                    lineHeight: 1.25,
                    color: accent,
                    borderColor: accent,
                  }}
                >
                  <span
                    aria-hidden
                    className="inline-flex items-center justify-center shrink-0 rounded-full"
                    style={{
                      width: "1.6rem",
                      height: "1.6rem",
                      fontSize: "0.85rem",
                      fontWeight: 700,
                      background: `hsl(var(${accentVar}))`,
                      color: "#000",
                      lineHeight: 1,
                    }}
                  >
                    {i + 1}
                  </span>
                  {title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                  {body}
                </p>
                {cta.href ? (
                  <a href={cta.href} className={ctaClass} style={ctaStyle}>
                    {cta.label}
                    <ArrowRight size={14} aria-hidden />
                  </a>
                ) : (
                  <button
                    type="button"
                    onClick={() => cta.sectionId && scrollToSection(cta.sectionId)}
                    className={`${ctaClass} self-start`}
                    style={{ ...ctaStyle, background: "transparent", border: "none", padding: 0, cursor: "pointer" }}
                  >
                    {cta.label}
                    <ArrowRight size={14} aria-hidden />
                  </button>
                )}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
