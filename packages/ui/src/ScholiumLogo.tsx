import './ScholiumLogo.css';

interface ScholiumLogoProps {
  size?: 'sm' | 'md' | 'lg';
}

export function ScholiumLogo({ size = 'sm' }: ScholiumLogoProps) {
  return (
    <span className={`rui-scholium-logo rui-scholium-logo--${size}`}>
      <span className="rui-scholium-mark" aria-hidden="true">
        <svg viewBox="0 0 32 32" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 6 L5 26 L16 23 L27 26 L27 6 L16 9 Z" stroke="currentColor" strokeWidth="1.6" />
          <path d="M16 9 L16 23" stroke="currentColor" strokeWidth="1.6" opacity="0.55" />
          <circle cx="16" cy="16" r="1.4" fill="currentColor" />
        </svg>
      </span>
      <span className="rui-scholium-wordmark">Scholium</span>
    </span>
  );
}
