import type { ReactNode } from 'react';
import './SettingsLayout.css';

interface SettingsLayoutProps {
  title?: string;
  onBack: () => void;
  children: ReactNode;
}

export function SettingsLayout({ title = 'Settings', onBack, children }: SettingsLayoutProps) {
  return (
    <div className="rui-settings-page">
      <header className="rui-settings-header">
        <div className="rui-settings-header-inner">
          <button className="rui-settings-back" onClick={onBack} aria-label="Back">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 4L6 10L12 16" />
            </svg>
          </button>
          <span className="rui-settings-title">{title}</span>
        </div>
      </header>
      <main className="rui-settings-main">
        {children}
      </main>
    </div>
  );
}
