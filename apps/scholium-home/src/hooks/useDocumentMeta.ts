import { useEffect } from "react";

/**
 * Best-effort SPA metadata: sets the document title and a handful of SEO/OG
 * meta tags while a page is mounted, restoring the title on unmount.
 *
 * Note: this runs client-side, so crawlers that don't execute JS won't see it.
 * For full crawler-visible SEO these routes would need prerendering/SSR.
 */
export function useDocumentMeta(opts: {
  title: string;
  description?: string;
  canonicalPath?: string;
}) {
  const { title, description, canonicalPath } = opts;

  useEffect(() => {
    const prevTitle = document.title;
    document.title = title;

    const set = (selector: string, create: () => HTMLElement, apply: (el: HTMLElement) => void) => {
      let el = document.head.querySelector<HTMLElement>(selector);
      if (!el) {
        el = create();
        document.head.appendChild(el);
      }
      apply(el);
      return el;
    };

    const metaTag = (name: string, attr: "name" | "property") =>
      set(
        `meta[${attr}="${name}"]`,
        () => {
          const m = document.createElement("meta");
          m.setAttribute(attr, name);
          return m;
        },
        (el) => description !== undefined && el.setAttribute("content", description),
      );

    if (description !== undefined) {
      metaTag("description", "name");
      metaTag("og:description", "property");
    }

    set(
      'meta[property="og:title"]',
      () => {
        const m = document.createElement("meta");
        m.setAttribute("property", "og:title");
        return m;
      },
      (el) => el.setAttribute("content", title),
    );

    if (canonicalPath) {
      set(
        'link[rel="canonical"]',
        () => {
          const l = document.createElement("link");
          l.setAttribute("rel", "canonical");
          return l;
        },
        (el) => el.setAttribute("href", `${window.location.origin}${canonicalPath}`),
      );
    }

    return () => {
      document.title = prevTitle;
    };
  }, [title, description, canonicalPath]);
}
