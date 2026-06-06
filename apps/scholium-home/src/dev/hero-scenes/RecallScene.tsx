const PASSES = [
  { label: "Match", tag: "P1", state: "done" },
  { label: "Choose", tag: "P2", state: "done" },
  { label: "Recall", tag: "P3", state: "active" },
  { label: "Write", tag: "P4", state: "todo" },
] as const;

const CONFIDENCE = ["Again", "Hard", "Good", "Easy"] as const;

export default function RecallScene() {
  return (
    <div className="hero-scene hs-recall" data-slug="recall-app">
      <div className="hs-rail">
        {PASSES.map((p) => (
          <span key={p.tag} className={`hs-pass hs-pass--${p.state}`}>
            <span className="hs-dot">{p.state === "done" ? "✓" : p.tag}</span>
            {p.label}
          </span>
        ))}
      </div>

      <div className="hs-rcard">
        <div className="hs-term">Mitochondria</div>
        <div className="hs-def">
          The organelle that produces most of a cell's ATP — its energy currency.
        </div>
        <div className="hs-confidence">
          {CONFIDENCE.map((c) => (
            <span key={c} className={`hs-conf${c === "Good" ? " hs-conf--pick" : ""}`}>
              {c}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
