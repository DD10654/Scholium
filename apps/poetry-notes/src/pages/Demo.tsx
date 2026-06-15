import { useEffect } from 'react';
import { ProjectProvider, useProject } from '../contexts/ProjectContext';
import { MainLayout } from '../components/Layout/MainLayout';
import demoProject from './demoProject';

// Centre the camera on the poem with the side notes peeking in, inviting a drag.
const INITIAL_ZOOM = 0.65;
const POEM_WORLD_CENTER_X = 820; // poem pinned at left:540, width 560 → centre 820
const POEM_WORLD_CENTER_Y = 300;

function DemoInner() {
  const { dispatch, setViewState } = useProject();

  useEffect(() => {
    // Same code path the real app uses to open a saved project — every position,
    // width, highlight and connection is rendered exactly as authored.
    dispatch({ type: 'SET_PROJECT', payload: demoProject });

    const vw = window.innerWidth;
    const usableH = window.innerHeight - 110; // banner + header
    setViewState((prev) => ({
      ...prev,
      camera: {
        zoom: INITIAL_ZOOM,
        x: POEM_WORLD_CENTER_X - vw / 2 / INITIAL_ZOOM,
        y: POEM_WORLD_CENTER_Y - usableH / 2 / INITIAL_ZOOM,
      },
    }));
  }, [dispatch, setViewState]);

  return <MainLayout onBackToLanding={() => { window.location.href = '/'; }} />;
}

export default function Demo() {
  return (
    <div className="demo-root">
      <style>{`
        .demo-root { height: 100vh; display: flex; flex-direction: column; overflow: hidden; }
        .demo-root .main-layout { flex: 1 1 auto; min-height: 0; height: auto; }
        /* Pin the poem at a fixed world position so the authored note
           coordinates line up regardless of the browser width. */
        .demo-root .poem-panel { position: absolute; left: 540px; top: 24px; margin: 0; width: 560px; }
        .demo-banner {
          display: flex; align-items: center; justify-content: space-between;
          gap: 1rem; padding: 0.6rem 1.5rem; flex-shrink: 0;
          border-bottom: 1px solid var(--color-border);
          background: var(--color-bg-secondary);
        }
        .demo-banner span { font-size: 0.85rem; color: var(--color-text-muted); }
        .demo-banner strong { color: var(--color-text-primary); }
        .demo-banner a {
          font-size: 0.85rem; font-weight: 600; color: hsl(220, 70%, 50%);
          text-decoration: none; white-space: nowrap;
        }
      `}</style>

      <div className="demo-banner">
        <span><strong>Preview</strong> · drag the canvas to explore · no account needed</span>
        <a href="/">Sign up to save your notes →</a>
      </div>

      <ProjectProvider>
        <DemoInner />
      </ProjectProvider>
    </div>
  );
}
