/* Capture the dev-only hero scenes to PNG app-card screenshots.
 *
 * Usage:
 *   1. Start the dev server:  pnpm dev   (scholium-home, http://localhost:3030)
 *   2. node scripts/capture-hero-scenes.mjs   [baseUrl]
 *
 * It visits /__hero-scenes, screenshots every [data-slug] frame at 2x, and
 * overwrites src/assets/screenshots/<slug>.png — the same filenames AppCard
 * already loads via import.meta.glob, so no app code changes are needed.
 *
 * Playwright isn't a direct dependency of scholium-home; it is hoisted in the
 * monorepo (installed for poetry-notes), so we resolve it from the repo root. */
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const appRoot = path.resolve(__dirname, "..");
const repoRoot = path.resolve(appRoot, "../..");
const baseUrl = process.argv[2] ?? "http://localhost:3030";
const outDir = process.env.OUT_DIR
  ? path.resolve(process.env.OUT_DIR)
  : path.join(appRoot, "src/assets/screenshots");

const require = createRequire(import.meta.url);
// Playwright is installed for poetry-notes and linked into its node_modules.
const playwrightPath = require.resolve("playwright", {
  paths: [path.join(repoRoot, "apps/poetry-notes"), repoRoot, appRoot],
});
const pw = await import(playwrightPath);
const chromium = pw.chromium ?? pw.default?.chromium;

const browser = await chromium.launch();
// 1.5× keeps the ~1600px scenes crisp at the card's ~585px display width while
// keeping PNG sizes reasonable (the radial-gradient backgrounds inflate PNGs).
const page = await browser.newPage({ deviceScaleFactor: 1.5 });

await page.goto(`${baseUrl}/__hero-scenes`, { waitUntil: "networkidle" });
// Hide the shared sticky navbar so it doesn't bleed into the captures.
await page.addStyleTag({ content: ".rui-navbar { display: none !important; }" });
// Let IBM Plex Sans (and emoji) finish loading before painting.
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(400);

const slugs = await page.$$eval("[data-slug]", (els) =>
  els.map((el) => el.getAttribute("data-slug")),
);

if (slugs.length === 0) {
  throw new Error("No [data-slug] hero scenes found at /__hero-scenes");
}

for (const slug of slugs) {
  const el = await page.$(`[data-slug="${slug}"]`);
  const file = path.join(outDir, `${slug}.png`);
  await el.screenshot({ path: file });
  console.log(`✓ ${slug}.png`);
}

await browser.close();
console.log(`\nWrote ${slugs.length} screenshots to ${outDir}`);
