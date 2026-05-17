import { useEffect, useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { AppHeroHeader, useDarkMode } from "@repo/ui";
import type { AppLink } from "@repo/ui";
import "@repo/ui/app-hero-header.css";
import { supabase } from "@/integrations/supabase/client";

interface LayoutProps {
  children: ReactNode;
  subtitle?: string;
}

export default function Layout({
  children,
  subtitle = "Browse topical papers and mark schemes by subject, component, and chapter.",
}: LayoutProps) {
  useDarkMode();
  const navigate = useNavigate();
  const [apps, setApps] = useState<AppLink[] | undefined>(undefined);

  useEffect(() => {
    supabase
      .from("scholium_apps")
      .select("id, title, url, icon")
      .order("sort_order")
      .then(({ data }) => setApps((data ?? []) as AppLink[]))
      .catch(() => setApps([]));
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <AppHeroHeader
        title="📚 Past Papers"
        subtitle={subtitle}
        apps={apps}
        onSettings={() => navigate("/settings")}
      />
      <main className="flex-1">
        <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-10">
          {children}
        </div>
      </main>
    </div>
  );
}
