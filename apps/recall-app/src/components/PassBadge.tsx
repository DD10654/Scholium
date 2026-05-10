import { cn } from "@/lib/utils";

export const PASS_CONFIG: Record<
  number,
  { label: string; bg: string; text: string; dot: string; ring: string }
> = {
  1: {
    label: "Pass 1 · Matching",
    bg: "bg-primary/10",
    text: "text-primary",
    dot: "bg-primary",
    ring: "border-primary/40",
  },
  2: {
    label: "Pass 2 · Multiple Choice",
    bg: "bg-accent/10",
    text: "text-accent",
    dot: "bg-accent",
    ring: "border-accent/40",
  },
  3: {
    label: "Pass 3 · Fill in Blank",
    bg: "bg-success/10",
    text: "text-success",
    dot: "bg-success",
    ring: "border-success/40",
  },
  4: {
    label: "Pass 4 · Complete Recall",
    bg: "bg-pass4/10",
    text: "text-pass4",
    dot: "bg-pass4",
    ring: "border-pass4/40",
  },
};

export function PassBadge({ pass }: { pass: number }) {
  const c = PASS_CONFIG[pass] || PASS_CONFIG[1];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold",
        c.bg,
        c.text,
      )}
    >
      {c.label}
    </span>
  );
}
