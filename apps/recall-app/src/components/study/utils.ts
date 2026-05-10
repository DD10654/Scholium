import type { Card } from "@/types";

export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function pickDistractors(cards: Card[], correctIdx: number, count = 3): Card[] {
  const pool = cards.filter((_, i) => i !== correctIdx);
  return shuffle(pool).slice(0, count);
}
