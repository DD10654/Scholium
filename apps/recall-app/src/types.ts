export interface Card {
  term: string;
  definition: string;
}

export interface Chapter {
  id: string;
  name: string;
  cards: Card[];
  cardCount?: number; // populated when cards are not loaded
}

export interface Section {
  id: string;
  name: string;
  chapters: Chapter[];
}

export interface Subject {
  id: string;
  name: string;
  emoji: string;
  accent: "blue" | "orange";
  sections: Section[];
}

export interface User {
  email: string;
  name: string;
}

export type Passes = Record<string, number>;
