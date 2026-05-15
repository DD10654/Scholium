import { KeyRound, Brain, Leaf } from "lucide-react";

const FEATURES = [
  {
    icon: KeyRound,
    title: "One Account, All Tools",
    body: "Sign up once. Your credentials work across Language Flash Hub, Recall Master, and Poetry Notes — and every tool we add in the future.",
    color: "hsl(var(--primary))",
    bg: "hsl(var(--primary) / 0.08)",
  },
  {
    icon: Brain,
    title: "Grounded in Memory Science",
    body: "Every tool applies proven techniques: spaced repetition in vocabulary, active recall passes in study, and associative note-taking in annotation.",
    color: "hsl(var(--accent))",
    bg: "hsl(var(--accent) / 0.08)",
  },
  {
    icon: Leaf,
    title: "Distraction-Free by Design",
    body: "No social feeds, no gamification traps. Clean, focused interfaces that get out of the way and let you actually learn.",
    color: "hsl(var(--success))",
    bg: "hsl(var(--success) / 0.08)",
  },
];

export default function FeaturesSection() {
  return (
    <section className="py-24" style={{ background: "hsl(var(--muted) / 0.4)" }}>
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <h2
            className="font-display font-bold text-foreground mb-3"
            style={{ fontSize: "clamp(1.75rem, 4vw, 2.5rem)" }}
          >
            Why Scholium?
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Built around how memory works — not how engagement metrics work.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {FEATURES.map(({ icon: Icon, title, body, color, bg }) => (
            <div
              key={title}
              className="bg-card rounded-2xl p-7 border border-border"
              style={{ boxShadow: "var(--shadow-card)" }}
            >
              <div
                className="w-11 h-11 flex items-center justify-center rounded-xl mb-5"
                style={{ background: bg }}
              >
                <Icon size={20} style={{ color }} />
              </div>
              <h3 className="font-display font-bold text-foreground mb-2 text-lg">
                {title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
