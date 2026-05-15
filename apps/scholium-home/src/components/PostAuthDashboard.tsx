import { LogOut, Sun, Moon } from "lucide-react";
import { ScholiumLogo, useDarkMode } from "@repo/ui";
import { useAuth } from "@/contexts/AuthContext";
import AppGrid from "./AppGrid";

export default function PostAuthDashboard() {
  const { user, signOut } = useAuth();
  const { isDark, toggle } = useDarkMode();

  const name =
    user?.email
      ?.split("@")[0]
      .replace(/[._]/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase()) ?? "Learner";

  return (
    <div className="min-h-screen bg-background">
      <nav className="sticky top-0 z-50 bg-background/90 backdrop-blur-md border-b border-border shadow-card">
        <div className="container mx-auto flex items-center justify-between h-16 px-4 sm:px-6">
          <ScholiumLogo size="md" />

          <div className="flex items-center gap-2">
            <button
              onClick={toggle}
              className="w-9 h-9 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            >
              {isDark ? <Sun size={16} /> : <Moon size={16} />}
            </button>

            <button
              onClick={signOut}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
            >
              <LogOut size={14} />
              Sign Out
            </button>
          </div>
        </div>
      </nav>

      <main>
        <div className="container mx-auto px-4 sm:px-6 pt-16 pb-4 text-center">
          <p className="text-muted-foreground text-sm mb-2 animate-fade-in">
            Welcome back
          </p>
          <h1
            className="font-display font-bold text-foreground animate-fade-in-up"
            style={{ fontSize: "clamp(1.75rem, 4vw, 2.5rem)" }}
          >
            {name}
          </h1>
        </div>

        <AppGrid hidePlaceholder />
      </main>
    </div>
  );
}
