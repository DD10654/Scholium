import type { TwoSider } from "@/types";

// Essay questions whose marks come from arguing both sides. Each point is
// pre-compressed to one keyword; the keywords' initials spell a mnemonic so a
// student only has to remember one word per side in the exam. Static seed data
// (like data/subjects.ts) — progress is stored per-user in localStorage.
export const TWO_SIDERS: TwoSider[] = [
  {
    id: "eco-tariffs",
    subject: "Economics",
    emoji: "📈",
    question: "Evaluate the case for and against the use of protectionist tariffs.",
    marks: 25,
    sides: [
      {
        stance: "for",
        label: "FOR tariffs",
        mnemonic: "DRIVES",
        points: [
          { letter: "D", keyword: "Dumping", point: "Shields domestic firms from foreign goods sold below cost." },
          { letter: "R", keyword: "Revenue", point: "Tariffs are a source of government tax revenue." },
          { letter: "I", keyword: "Infant industry", point: "Protects young industries until they reach an efficient scale." },
          { letter: "V", keyword: "Vulnerable jobs", point: "Safeguards employment in sectors exposed to import competition." },
          { letter: "E", keyword: "External balance", point: "Curbs imports to help narrow a current-account deficit." },
          { letter: "S", keyword: "Security", point: "Protects strategically vital industries — steel, food, defence." },
        ],
      },
      {
        stance: "against",
        label: "AGAINST tariffs",
        mnemonic: "PRICER",
        points: [
          { letter: "P", keyword: "Prices", point: "Consumers pay more, lowering real incomes." },
          { letter: "R", keyword: "Retaliation", point: "Partners impose counter-tariffs, risking a trade war." },
          { letter: "I", keyword: "Inefficiency", point: "Protected firms lack incentive to cut costs — X-inefficiency." },
          { letter: "C", keyword: "Choice", point: "The range of goods available to consumers narrows." },
          { letter: "E", keyword: "Efficiency loss", point: "Ignoring comparative advantage misallocates resources; welfare falls." },
          { letter: "R", keyword: "Regressive", point: "Price rises hit low-income households hardest." },
        ],
      },
    ],
  },
  {
    id: "eco-minimum-wage",
    subject: "Economics",
    emoji: "📈",
    question: "Discuss whether the government should raise the national minimum wage.",
    marks: 25,
    sides: [
      {
        stance: "for",
        label: "FOR raising it",
        mnemonic: "SPEND",
        points: [
          { letter: "S", keyword: "Standards", point: "Lifts low-paid workers' living standards, cutting in-work poverty." },
          { letter: "P", keyword: "Productivity", point: "Firms train and invest to justify the higher wage — the efficiency-wage effect." },
          { letter: "E", keyword: "Extra demand", point: "Higher incomes raise consumer spending, supporting growth." },
          { letter: "N", keyword: "Narrower gap", point: "Reduces income inequality between low and high earners." },
          { letter: "D", keyword: "Dependency", point: "Less reliance on state top-up benefits, easing the fiscal burden." },
        ],
      },
      {
        stance: "against",
        label: "AGAINST raising it",
        mnemonic: "COBRA",
        points: [
          { letter: "C", keyword: "Costs", point: "Raises firms' labour costs, squeezing profits and small businesses." },
          { letter: "O", keyword: "Output prices", point: "Firms pass costs on, adding to cost-push inflation." },
          { letter: "B", keyword: "Barriers", point: "Prices low-skilled and young workers out of jobs, raising unemployment." },
          { letter: "R", keyword: "Relocation", point: "Firms substitute capital for labour or offshore production." },
          { letter: "A", keyword: "Awkward fit", point: "A single national rate ignores regional differences in living costs." },
        ],
      },
    ],
  },
];

export function getTwoSider(id: string | undefined): TwoSider | undefined {
  return TWO_SIDERS.find((t) => t.id === id);
}
