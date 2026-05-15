import { useEffect, useState } from "react";
import { Sun, Moon, LogOut } from "lucide-react";
import { ScholiumLogo, useDarkMode } from "@repo/ui";
import type { User } from "@supabase/supabase-js";

interface NavProps {
  user: User | null;
  onSignInClick: () => void;
  onGetStartedClick: () => void;
  onSignOut: () => void;
}

const glassBtn: React.CSSProperties = {
  background: "hsl(var(--background) / 0.55)",
  backdropFilter: "blur(12px)",
  WebkitBackdropFilter: "blur(12px)",
  border: "1px solid hsl(var(--border) / 0.7)",
};

const primaryGlassBtn: React.CSSProperties = {
  background: "hsl(var(--primary) / 0.88)",
  backdropFilter: "blur(12px)",
  WebkitBackdropFilter: "blur(12px)",
  border: "1px solid hsl(var(--primary) / 0.35)",
};

export default function Nav({ user, onSignInClick, onGetStartedClick, onSignOut }: NavProps) {
  const { isDark, toggle } = useDarkMode();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const displayName = user?.email?.split("@")[0] ?? null;

  return (
    <nav
      className={`sticky top-0 z-50 w-full transition-all duration-200 ${
        scrolled
          ? "bg-background/90 backdrop-blur-md border-b border-border"
          : "bg-transparent"
      }`}
      style={scrolled ? { boxShadow: "var(--shadow-card)" } : undefined}
    >
      <div className="container mx-auto flex items-center justify-between h-16 px-4 sm:px-6">
        <a href="/" aria-label="Scholium home" className="inline-flex items-center">
          <ScholiumLogo size="md" />
        </a>

        <div className="flex items-center gap-2">
          <button
            onClick={toggle}
            className="w-9 h-9 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground transition-colors"
            style={glassBtn}
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDark ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          {user ? (
            <>
              <span className="hidden sm:inline text-sm text-muted-foreground">
                {displayName}
              </span>
              <button
                onClick={onSignOut}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-foreground rounded-lg transition-all hover:opacity-80"
                style={glassBtn}
              >
                <LogOut size={14} />
                Sign Out
              </button>
            </>
          ) : (
            <>
              <button
                onClick={onSignInClick}
                className="hidden sm:inline-flex items-center px-4 py-2 text-sm font-medium text-foreground rounded-lg transition-all hover:opacity-80"
                style={glassBtn}
              >
                Sign In
              </button>
              <button
                onClick={onGetStartedClick}
                className="inline-flex items-center px-4 py-2 text-sm font-semibold text-white rounded-lg transition-all hover:opacity-90 shadow-sm"
                style={primaryGlassBtn}
              >
                Get Started
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
