export default function PoetryNotesScene() {
  return (
    <div className="hero-scene hs-poetry" data-slug="poetry-notes">
      <div className="hs-stage">
        <div className="hs-poem">
          <div className="hs-poem-title">The Tyger · W. Blake</div>
          <div className="hs-line">Tyger Tyger, burning bright,</div>
          <div className="hs-line">
            In the <span className="hs-mark hs-mark--teal">forests of the night</span>;
          </div>
          <div className="hs-line">
            What <span className="hs-mark hs-mark--rose">immortal hand or eye</span>,
          </div>
          <div className="hs-line">Could frame thy fearful symmetry?</div>
        </div>

        <div className="hs-note">
          <svg className="hs-connector" viewBox="0 0 120 200" preserveAspectRatio="none">
            <path
              d="M0 96 C -70 96, -90 150, -150 150"
              fill="none"
              stroke="#e94560"
              strokeWidth="2.5"
              strokeDasharray="2 7"
              strokeLinecap="round"
            />
          </svg>
          <div className="hs-note-eyebrow">Gloss</div>
          <div className="hs-note-body">
            "immortal hand" — the divine craftsman; echoes Prometheus shaping life
            from fire.
          </div>
        </div>
      </div>
    </div>
  );
}
