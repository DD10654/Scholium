import './ScholiumLogo.css';

interface ScholiumLogoProps {
  size?: 'sm' | 'md' | 'lg';
}

export function ScholiumLogo({ size = 'sm' }: ScholiumLogoProps) {
  return (
    <div className={`rui-scholium-logo rui-scholium-logo--${size}`}>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
      </svg>
      <span>Scholium</span>
    </div>
  );
}
