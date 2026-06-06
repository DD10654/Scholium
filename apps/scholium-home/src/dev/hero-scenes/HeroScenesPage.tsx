import "./hero-scenes.css";
import LanguageHubScene from "./LanguageHubScene";
import RecallScene from "./RecallScene";
import PoetryNotesScene from "./PoetryNotesScene";
import PastPapersScene from "./PastPapersScene";

/* Dev-only gallery of the four app-card "signature moment" scenes.
 * Each scene is a 1600×1120 frame tagged with data-slug; the Playwright
 * capture script (scripts/capture-hero-scenes.mjs) screenshots each one to
 * src/assets/screenshots/<slug>.png. Not linked from the live UI. */
export default function HeroScenesPage() {
  return (
    <div style={{ background: "#fff", display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
      <LanguageHubScene />
      <RecallScene />
      <PoetryNotesScene />
      <PastPapersScene />
    </div>
  );
}
