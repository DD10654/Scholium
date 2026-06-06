export default function LanguageHubScene() {
  return (
    <div className="hero-scene hs-language" data-slug="language-hub">
      <div className="hs-deck">
        <div className="hs-card hs-card--behind" />
        <div className="hs-card hs-card--front">
          <span className="hs-chip">🇫🇷 French</span>
          <div className="hs-front">bonjour</div>
          <div className="hs-divider" />
          <div className="hs-back">hello</div>
          <div className="hs-progress">
            <div className="hs-track">
              <div className="hs-fill" />
            </div>
            <span className="hs-count">6 / 10</span>
          </div>
        </div>
      </div>
    </div>
  );
}
