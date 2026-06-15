// Real, citable research behind Scholium's design. Every claim here maps to a
// peer-reviewed source listed in REFERENCES — no invented statistics. Keep it
// that way: if you can't cite it, don't claim it.

export interface Citation {
  /** Short in-text marker, e.g. "Cepeda et al., 2006". */
  label: string;
  /** Index into REFERENCES (1-based) for the footnote number. */
  ref: number;
}

export interface Pillar {
  id: string;
  /** Lucide icon name resolved in the page. */
  icon: "Repeat" | "Brain" | "Dumbbell";
  technique: string;
  finding: string;
  inScholium: string;
  citations: Citation[];
}

export interface Reference {
  authors: string;
  year: string;
  title: string;
  source: string;
  url: string;
}

export const PILLARS: Pillar[] = [
  {
    id: "spaced-repetition",
    icon: "Repeat",
    technique: "Spaced repetition",
    finding:
      "Spreading practice out over time produces substantially stronger long-term retention than cramming the same amount of study into one session. In a synthesis of 254 studies, spaced practice reliably beat massed practice, and a major review of learning techniques rated it one of the few with “high utility” across subjects and ages.",
    inScholium:
      "Language Hub schedules each word to come back as you’re about to forget it, and Recall App brings missed definitions forward instead of letting them lapse.",
    citations: [
      { label: "Cepeda et al., 2006", ref: 1 },
      { label: "Dunlosky et al., 2013", ref: 2 },
    ],
  },
  {
    id: "active-recall",
    icon: "Brain",
    technique: "Active recall (the testing effect)",
    finding:
      "Pulling an answer out of memory strengthens it far more than re-reading or reviewing it. Across experiments, students who tested themselves remembered dramatically more a week later than those who simply restudied — the “testing effect.” Practice testing was also rated high-utility in the same large review of techniques.",
    inScholium:
      "Recall App is built entirely on retrieval — its match, choose, recall, and write passes each demand the answer from you. Poetry Notes makes you put meaning into your own words rather than re-reading the poem.",
    citations: [
      { label: "Roediger & Karpicke, 2006", ref: 3 },
      { label: "Dunlosky et al., 2013", ref: 2 },
    ],
  },
  {
    id: "desirable-difficulty",
    icon: "Dumbbell",
    technique: "Desirable difficulty — and why we skip the gamification",
    finding:
      "Conditions that make studying feel harder in the moment — spacing, retrieval, interleaving — often produce better lasting learning, while the easy fluency of re-reading flatters you into thinking you’ve learned more than you have. Relatedly, matching teaching to “learning styles” has no credible evidence behind it. So we don’t chase the feeling of progress; we build for the kind that lasts.",
    inScholium:
      "No streaks, no leaderboards, no notifications engineered to pull you back. The tools optimise for what you retain next week, not minutes spent in the app today.",
    citations: [
      { label: "Bjork et al., 2013", ref: 4 },
      { label: "Pashler et al., 2008", ref: 5 },
    ],
  },
];

export const REFERENCES: Reference[] = [
  {
    authors: "Cepeda, N. J., Pashler, H., Vul, E., Wixted, J. T., & Rohrer, D.",
    year: "2006",
    title: "Distributed practice in verbal recall tasks: A review and quantitative synthesis.",
    source: "Psychological Bulletin, 132(3), 354–380.",
    url: "https://doi.org/10.1037/0033-2909.132.3.354",
  },
  {
    authors: "Dunlosky, J., Rawson, K. A., Marsh, E. J., Nathan, M. J., & Willingham, D. T.",
    year: "2013",
    title:
      "Improving students’ learning with effective learning techniques: Promising directions from cognitive and educational psychology.",
    source: "Psychological Science in the Public Interest, 14(1), 4–58.",
    url: "https://doi.org/10.1177/1529100612453266",
  },
  {
    authors: "Roediger, H. L., & Karpicke, J. D.",
    year: "2006",
    title:
      "Test-enhanced learning: Taking memory tests improves long-term retention.",
    source: "Psychological Science, 17(3), 249–255.",
    url: "https://doi.org/10.1111/j.1467-9280.2006.01693.x",
  },
  {
    authors: "Bjork, R. A., Dunlosky, J., & Kornell, N.",
    year: "2013",
    title: "Self-regulated learning: Beliefs, techniques, and illusions.",
    source: "Annual Review of Psychology, 64, 417–444.",
    url: "https://doi.org/10.1146/annurev-psych-113011-143823",
  },
  {
    authors: "Pashler, H., McDaniel, M., Rohrer, D., & Bjork, R.",
    year: "2008",
    title: "Learning styles: Concepts and evidence.",
    source: "Psychological Science in the Public Interest, 9(3), 105–119.",
    url: "https://doi.org/10.1111/j.1539-6053.2009.01038.x",
  },
];
