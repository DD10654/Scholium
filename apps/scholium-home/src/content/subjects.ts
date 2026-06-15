// Static content for the SEO subject landing pages (/subjects/:slug). Each
// entry stands alone so the route always renders, even before the DB-loaded
// suite arrives. Tool links are resolved from the live suite at render time by
// the `tools` slugs. Keep claims honest — credibility lives on /memory-science.

export interface SubjectSample {
  /** Column headers, e.g. ["French", "English"] or ["Term", "Definition"]. */
  columns: [string, string];
  rows: [string, string][];
}

export interface SubjectContent {
  slug: string;
  name: string;
  emoji: string;
  headline: string;
  intro: string;
  /** Canonical tool slugs (see lib/apps.ts) most relevant to this subject. */
  tools: string[];
  sample: SubjectSample;
}

export const SUBJECTS: SubjectContent[] = [
  {
    slug: "french",
    name: "French",
    emoji: "🇫🇷",
    headline: "Practise French vocabulary until the words are yours.",
    intro:
      "Build French vocabulary with spaced repetition and active recall — the two techniques the research backs most strongly. Drill nouns, verbs, and phrases, with dictation and review timed to the moment you're about to forget.",
    tools: ["language-hub", "past-papers"],
    sample: {
      columns: ["French", "English"],
      rows: [
        ["la maison", "the house"],
        ["le livre", "the book"],
        ["la pomme", "the apple"],
        ["apprendre", "to learn"],
      ],
    },
  },
  {
    slug: "spanish",
    name: "Spanish",
    emoji: "🇪🇸",
    headline: "Make Spanish vocabulary stick.",
    intro:
      "Flashcards, drills, and dictation for Spanish, scheduled with spaced repetition so each word comes back right before it slips. Build your own sets or practise the essentials.",
    tools: ["language-hub", "past-papers"],
    sample: {
      columns: ["Spanish", "English"],
      rows: [
        ["la casa", "the house"],
        ["el libro", "the book"],
        ["aprender", "to learn"],
        ["el restaurante", "the restaurant"],
      ],
    },
  },
  {
    slug: "economics",
    name: "Economics",
    emoji: "📈",
    headline: "Master every Economics definition.",
    intro:
      "IGCSE and A-Level Economics lives or dies on precise definitions. Recall App runs them through four progressive passes — match, choose, recall, write — so the exact wording is there when you need it.",
    tools: ["recall-app", "past-papers"],
    sample: {
      columns: ["Term", "Definition"],
      rows: [
        ["Scarcity", "Limited resources relative to unlimited wants — the core economic problem."],
        ["Opportunity Cost", "The value of the next best alternative forgone when making a choice."],
        ["Price Elasticity of Demand", "How responsive quantity demanded is to a change in price."],
        ["Comparative Advantage", "Producing a good at a lower opportunity cost than another producer."],
      ],
    },
  },
  {
    slug: "physics",
    name: "Physics",
    emoji: "⚛️",
    headline: "Lock in Physics definitions and laws.",
    intro:
      "From kinematics to quantum mechanics, Physics rewards exact recall of terms, laws, and units. Active-recall passes turn passive reading into durable memory.",
    tools: ["recall-app", "past-papers"],
    sample: {
      columns: ["Term", "Definition"],
      rows: [
        ["Velocity", "The rate of change of displacement with respect to time; a vector."],
        ["Newton's Second Law", "Net force equals mass times acceleration (F = ma)."],
        ["Half-Life", "The time for half the radioactive nuclei in a sample to decay."],
        ["Refractive Index", "The ratio of the speed of light in a vacuum to its speed in a medium."],
      ],
    },
  },
  {
    slug: "biology",
    name: "Biology",
    emoji: "🧬",
    headline: "Remember the Biology that exams test.",
    intro:
      "Biology is dense with terminology — cells, genetics, physiology, ecology. Spaced retrieval practice keeps it all accessible instead of cramming it the night before.",
    tools: ["recall-app", "past-papers"],
    sample: {
      columns: ["Term", "Definition"],
      rows: [
        ["Osmosis", "Net movement of water across a semi-permeable membrane down a water-potential gradient."],
        ["Mitosis", "Cell division producing two genetically identical daughter cells."],
        ["Transpiration", "The loss of water vapour from a plant's leaves and stem."],
        ["Homeostasis", "Maintenance of a stable internal environment despite external change."],
      ],
    },
  },
  {
    slug: "poetry",
    name: "Poetry & English Literature",
    emoji: "🪶",
    headline: "Read poems closely — and remember what you found.",
    intro:
      "Annotate poems with linked notes: connect imagery, form, and theme into a web you can revise from. Putting analysis into your own words is itself a powerful memory technique.",
    tools: ["poetry-notes", "past-papers"],
    sample: {
      columns: ["Device", "Why it matters"],
      rows: [
        ["Metaphor", "Maps one idea onto another to compress meaning — track the vehicle and tenor."],
        ["Enjambment", "A line running on without pause; controls pace and surprise."],
        ["Volta", "The 'turn' in a sonnet where the argument or mood shifts."],
        ["Caesura", "A deliberate pause mid-line that fractures rhythm for effect."],
      ],
    },
  },
];

export function getSubject(slug: string): SubjectContent | undefined {
  return SUBJECTS.find((s) => s.slug === slug.toLowerCase());
}
