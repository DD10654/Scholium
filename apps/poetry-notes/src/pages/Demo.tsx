import '../components/Layout/Header.css';
import '../components/Layout/MainLayout.css';
import '../components/Editor/PoemEditor.css';
import '../components/Notes/Note.css';

interface DemoNote {
  id: string;
  title: string;
  type?: 'context' | 'personal-response' | 'default';
  body: string;
  x: number;
  y: number;
  width: number;
  highlightX: number;
  highlightY: number;
}

const NOTES: DemoNote[] = [
  {
    id: 'n1',
    title: 'Context',
    type: 'context',
    body: 'Frost wrote this in 1915 as a gentle joke about his friend Edward Thomas, who endlessly second-guessed walking choices.',
    x: 80,
    y: 120,
    width: 240,
    highlightX: 520,
    highlightY: 220,
  },
  {
    id: 'n2',
    title: 'Note',
    body: 'The diverging roads work as a metaphor for choice itself — the speaker has to commit even with incomplete information.',
    x: 60,
    y: 380,
    width: 250,
    highlightX: 520,
    highlightY: 360,
  },
  {
    id: 'n3',
    title: 'Personal response',
    type: 'personal-response',
    body: 'The “sigh” in the final stanza is doing a lot of work — is it relief or regret?',
    x: 920,
    y: 200,
    width: 240,
    highlightX: 760,
    highlightY: 540,
  },
  {
    id: 'n4',
    title: 'Note',
    body: 'Repetition of “I” throughout — the poem is structurally first-person reflective.',
    x: 940,
    y: 480,
    width: 230,
    highlightX: 760,
    highlightY: 720,
  },
];

function curvePath(fromX: number, fromY: number, toX: number, toY: number): string {
  const midX = (fromX + toX) / 2;
  return `M ${fromX} ${fromY} C ${midX} ${fromY}, ${midX} ${toY}, ${toX} ${toY}`;
}

export default function Demo() {
  return (
    <div className="main-layout" style={{ height: '100vh' }}>
      <header
        className="app-header"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0.75rem 1.5rem',
          borderBottom: '1px solid var(--color-border)',
          background: 'var(--color-bg-secondary)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ fontSize: '1.25rem' }}>📝</span>
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--color-text-primary)' }}>
              The Road Not Taken
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>
              Robert Frost · 4 notes · 4 highlights
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button className="header-button">
            <span className="button-icon">📥</span>
            <span>Export</span>
          </button>
          <button className="header-button">
            <span className="button-icon">🌙</span>
            <span>Dark</span>
          </button>
          <button className="header-button">
            <span className="button-icon">🎯</span>
            <span>Recenter</span>
          </button>
        </div>
      </header>

      <div className="viewport" style={{ position: 'relative', flex: 1, overflow: 'hidden' }}>
        <svg
          className="note-connections-svg"
          width="100%"
          height="100%"
          style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 50 }}
        >
          <defs>
            <marker
              id="arrowhead"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill="hsla(220, 70%, 45%, 0.6)" />
            </marker>
          </defs>
          {NOTES.map((n) => {
            const noteAnchorX = n.x < 600 ? n.x + n.width : n.x;
            const noteAnchorY = n.y + 40;
            return (
              <path
                key={n.id}
                d={curvePath(noteAnchorX, noteAnchorY, n.highlightX, n.highlightY)}
                stroke="hsla(220, 70%, 45%, 0.6)"
                strokeWidth="1.5"
                fill="none"
                strokeDasharray="4 3"
                markerEnd="url(#arrowhead)"
              />
            );
          })}
        </svg>

        <div className="content-layer" style={{ position: 'relative', transform: 'none' }}>
          <div
            className="poem-panel"
            style={{ position: 'absolute', top: 100, left: '50%', transform: 'translateX(-50%)' }}
          >
            <div className="panel-header">
              <h2>Poem</h2>
              <span className="panel-hint">Select text to create notes</span>
            </div>
            <div className="panel-content">
              <div className="poem-editor-wrapper">
                <div className="poem-editor-container">
                  <div className="poem-editor-content">
                    <p>
                      <span className="poet-highlight">Two roads diverged in a yellow wood,</span>
                    </p>
                    <p>And sorry I could not travel both</p>
                    <p>And be one traveler, long I stood</p>
                    <p>
                      And looked down one as far as I could
                    </p>
                    <p>To where it bent in the undergrowth;</p>
                    <p>&nbsp;</p>
                    <p>
                      Then took <span className="poet-highlight">the other, as just as fair,</span>
                    </p>
                    <p>And having perhaps the better claim,</p>
                    <p>Because it was grassy and wanted wear;</p>
                    <p>Though as for that the passing there</p>
                    <p>Had worn them really about the same,</p>
                    <p>&nbsp;</p>
                    <p>And both that morning equally lay</p>
                    <p>In leaves no step had trodden black.</p>
                    <p>
                      Oh, <span className="poet-highlight">I kept the first for another day!</span>
                    </p>
                    <p>Yet knowing how way leads on to way,</p>
                    <p>I doubted if I should ever come back.</p>
                    <p>&nbsp;</p>
                    <p>
                      <em>I shall be telling this with</em>{' '}
                      <span className="poet-highlight">a sigh</span>
                    </p>
                    <p>Somewhere ages and ages hence:</p>
                    <p>Two roads diverged in a wood, and I—</p>
                    <p>I took the one less traveled by,</p>
                    <p>And that has made all the difference.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {NOTES.map((n) => (
            <div
              key={n.id}
              className={`note ${n.type === 'context' ? 'note-type-context' : n.type === 'personal-response' ? 'note-type-personal-response' : ''}`}
              style={{ left: n.x, top: n.y, width: n.width, position: 'absolute' }}
            >
              <div className="note-header">
                <span className="note-title">{n.title}</span>
                <span className="note-drag-handle">⋯</span>
              </div>
              <div className="note-content" style={{ padding: '0.75rem' }}>
                {n.body}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
