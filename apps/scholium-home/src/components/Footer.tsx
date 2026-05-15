import { useState, useEffect } from "react";
import { ScholiumLogo } from "@repo/ui";
import { supabase } from "@/integrations/supabase/client";
import type { AppLink } from "@repo/ui";

export default function Footer() {
  const [apps, setApps] = useState<AppLink[]>([]);

  useEffect(() => {
    supabase
      .from("scholium_apps")
      .select("id, title, url, icon")
      .order("sort_order")
      .then(({ data }) => setApps((data ?? []) as AppLink[]));
  }, []);

  return (
    <footer className="border-t border-border bg-background">
      <div className="container mx-auto px-4 sm:px-6 py-10">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex flex-col items-center sm:items-start gap-1.5">
            <ScholiumLogo size="sm" />
            <p className="text-xs text-muted-foreground">
              Learning tools that respect your memory.
            </p>
          </div>

          <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            {apps.map((app) => (
              <a
                key={app.id}
                href={app.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                {app.title}
              </a>
            ))}
          </nav>
        </div>

        <p className="mt-8 text-center text-xs text-muted-foreground/60">
          © {new Date().getFullYear()} Scholium. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
