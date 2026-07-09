import './legal.css';

export interface ScholiumFooterProps {
  /** Path/URL for the Terms page. Same-origin route in every app. */
  termsHref?: string;
  /** Path/URL for the Privacy page. */
  privacyHref?: string;
  /** Optional home/brand URL. */
  homeUrl?: string;
}

/** Minimal, router-agnostic site footer referencing the legal pages. Uses plain
 *  anchors so it works in every app (including poetry-notes, which has no
 *  react-router). Theming comes from tokens.css. */
export function ScholiumFooter({
  termsHref = '/terms',
  privacyHref = '/privacy',
  homeUrl,
}: ScholiumFooterProps) {
  const year = new Date().getFullYear();
  return (
    <footer className="rui-footer">
      <div className="rui-footer-inner">
        <p className="rui-footer-copy">
          © {year} {homeUrl ? <a href={homeUrl}>Scholium</a> : 'Scholium'}. All rights reserved.
        </p>
        <nav className="rui-footer-links" aria-label="Legal">
          <a href={termsHref}>Terms of Service</a>
          <a href={privacyHref}>Privacy Policy</a>
        </nav>
      </div>
    </footer>
  );
}
