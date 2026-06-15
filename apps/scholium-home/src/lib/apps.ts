import type { AppLink } from "@repo/ui";

// Canonical tool slugs → keywords that identify the row in the DB-loaded suite,
// regardless of how its title/URL/id is spelled (e.g. "Lang. Hub").
export const TOOL_KEYWORDS: Record<string, string[]> = {
  "language-hub": ["language", "lang"],
  "recall-app": ["recall"],
  "poetry-notes": ["poetry"],
  "past-papers": ["past-paper", "pastpaper", "past paper", "past papers"],
};

/** Tools that expose a no-signup interactive trial at `<app-url>/demo`. */
export const DEMO_SLUGS = new Set(["language-hub", "recall-app", "poetry-notes"]);

export function findApp(slug: string, apps: AppLink[]): AppLink | undefined {
  const keywords = TOOL_KEYWORDS[slug] ?? [slug];
  return apps.find((a) => {
    const haystack = `${a.title} ${a.url} ${a.id}`.toLowerCase();
    return keywords.some((k) => haystack.includes(k));
  });
}

export function demoUrl(app: AppLink): string {
  return `${app.url.replace(/\/+$/, "")}/demo`;
}
