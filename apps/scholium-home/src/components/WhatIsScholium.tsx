import type { Persona } from "./PersonaSelector";

interface WhatIsScholiumProps {
  persona: Persona | null;
}

interface WhatIsCopy {
  p1: string;
  p2: string;
}

function getCopy(persona: Persona | null): WhatIsCopy {
  if (persona === "teacher") {
    return {
      p1: "Scholium is a free suite of revision tools you can share with your students. One account is all it takes, vocabulary drills, active recall passes, poetry annotation, and past paper practice are all included.",
      p2: "Send students to the right tool knowing it won't distract them with feeds, streaks, or gamification loops. Focused interfaces that get out of the way.",
    };
  }
  if (persona === "parent") {
    return {
      p1: "Scholium is a free suite of revision tools built for students and designed to be safe, focused, and genuinely useful. One account unlocks everything, no subscriptions, no tiers.",
      p2: "Vocabulary drills, active recall, poetry annotation, and exam practice, all in one place, all free, and none of it designed to keep your child scrolling.",
    };
  }
  return {
    p1: "Scholium is a free suite of focused learning tools for students, teachers, and parents. One account unlocks every tool, built on proven memory techniques rather than engagement tricks.",
    p2: "Drill vocabulary, run active recall in passes, annotate poetry, and practise topical exam papers, all in one place, all yours forever.",
  };
}

export default function WhatIsScholium({ persona }: WhatIsScholiumProps) {
  const copy = getCopy(persona);
  return (
    <section id="what-is" className="py-20 border-t border-[color:var(--color-rule)]">
      <div className="max-w-3xl mx-auto px-6 text-center">
        <h2
          className="text-foreground mb-6"
          style={{
            fontSize: "clamp(2rem, 5vw, 3rem)",
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
            fontWeight: 700,
          }}
        >
          What is <span style={{ color: "hsl(var(--primary))" }}>Scholium?</span>
        </h2>
        <p className="text-foreground/80 text-lg leading-relaxed mb-4">
          {copy.p1}
        </p>
        <p className="text-foreground/75 text-base leading-relaxed">
          {copy.p2}
        </p>
      </div>
    </section>
  );
}
