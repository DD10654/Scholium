import { useEffect, useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { ScholiumNavbar } from "@repo/ui";
import type { AppLink } from "@repo/ui";
import "@repo/ui/scholium-navbar.css";
import { supabase } from "@/integrations/supabase/client";
import Index from "./pages/Index";
import Demo from "./pages/Demo";
import CreateSet from "./pages/CreateSet";
import Study from "./pages/Study";
import Practice from "./pages/Practice";
import PracticeSetup from "./pages/PracticeSetup";
import Auth from "./pages/Auth";
import ResetPassword from "./pages/ResetPassword";
import EditSet from "./pages/EditSet";
import Folder from "./pages/Folder";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

async function loadScholiumApps(): Promise<AppLink[]> {
  const first = await supabase
    .from("scholium_apps")
    .select("id, title, url, icon, subjects, description, has_demo, no_login")
    .order("sort_order");
  if (first.error && /(subjects|description|has_demo|no_login)/i.test(first.error.message)) {
    const fallback = await supabase
      .from("scholium_apps")
      .select("id, title, url, icon")
      .order("sort_order");
    return (fallback.data ?? []) as AppLink[];
  }
  return (first.data ?? []) as AppLink[];
}

function NavbarWired({ apps }: { apps: AppLink[] }) {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const homeUrl = apps.find((a) => a.id === "scholium-home")?.url ?? "";
  return (
    <ScholiumNavbar
      apps={apps}
      homeUrl={homeUrl}
      user={user ? { email: user.email ?? "" } : null}
      onSignOut={signOut}
      onSettings={() => navigate("/settings")}
    />
  );
}

function FadeRoutes({ description }: { description?: string | null }) {
  const location = useLocation();
  return (
    <div key={location.key} className="page-fade-in">
      <Routes>
        <Route path="/" element={<Index description={description} />} />
        <Route path="/create" element={<CreateSet />} />
        <Route path="/edit/:id" element={<EditSet />} />
        <Route path="/folder/:id" element={<Folder />} />
        <Route path="/study/:id" element={<Study />} />
        <Route path="/practice" element={<Practice />} />
        <Route path="/practice-setup" element={<PracticeSetup />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/auth/reset-password" element={<ResetPassword />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

const App = () => {
  const [apps, setApps] = useState<AppLink[]>([]);

  useEffect(() => {
    loadScholiumApps().then(setApps);
  }, []);

  const ownDescription = apps.find((a) => a.id === "language-hub")?.description ?? null;

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/demo" element={<Demo />} />
            <Route
              path="*"
              element={
                <AuthProvider>
                  <NavbarWired apps={apps} />
                  <FadeRoutes description={ownDescription} />
                </AuthProvider>
              }
            />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
