import { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes, Navigate, useNavigate } from "react-router-dom";
import type { User } from "@supabase/supabase-js";
import { ScholiumNavbar } from "@repo/ui";
import type { AppLink } from "@repo/ui";
import "@repo/ui/scholium-navbar.css";
import { supabase } from "@/integrations/supabase/client";
import SubjectsPage from "@/pages/SubjectsPage";
import Demo from "@/pages/Demo";
import ComponentsPage from "@/pages/ComponentsPage";
import ChaptersPage from "@/pages/ChaptersPage";
import GeneratePaperPage from "@/pages/GeneratePaperPage";
import SettingsPage from "@/pages/Settings";

async function loadScholiumApps(): Promise<AppLink[]> {
  const first = await supabase
    .from("scholium_apps")
    .select("id, title, url, icon, subjects, description")
    .order("sort_order");
  if (first.error && /(subjects|description)/i.test(first.error.message)) {
    const fallback = await supabase
      .from("scholium_apps")
      .select("id, title, url, icon")
      .order("sort_order");
    return (fallback.data ?? []) as AppLink[];
  }
  return (first.data ?? []) as AppLink[];
}

function NavbarWired({ apps, user }: { apps: AppLink[]; user: User | null }) {
  const navigate = useNavigate();
  const homeUrl = apps.find((a) => a.id === "scholium-home")?.url ?? "";
  return (
    <ScholiumNavbar
      apps={apps}
      homeUrl={homeUrl}
      user={user ? { email: user.email ?? "" } : null}
      onSignOut={async () => {
        await supabase.auth.signOut();
      }}
      onSettings={() => navigate("/settings")}
    />
  );
}

export default function App() {
  const [apps, setApps] = useState<AppLink[]>([]);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    loadScholiumApps().then(setApps);
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setUser(data.session?.user ?? null));
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => data.subscription.unsubscribe();
  }, []);

  const ownDescription = apps.find((a) => a.id === "past-papers")?.description ?? null;

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/demo" element={<Demo />} />
        <Route path="*" element={<MainRoutes apps={apps} user={user} ownDescription={ownDescription} />} />
      </Routes>
    </BrowserRouter>
  );
}

function MainRoutes({ apps, user, ownDescription }: { apps: AppLink[]; user: User | null; ownDescription: string | null }) {
  return (
    <>
      <NavbarWired apps={apps} user={user} />
      <Routes>
        <Route path="/" element={<SubjectsPage description={ownDescription} />} />
        <Route path="/generate" element={<GeneratePaperPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/:subject" element={<ComponentsPage />} />
        <Route path="/:subject/:component" element={<ChaptersPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
