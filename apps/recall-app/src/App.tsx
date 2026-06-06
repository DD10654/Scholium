import { useEffect, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { AppProvider, useApp } from "@/contexts/AppContext";
import { Toaster } from "@/components/ui/sonner";
import { ScholiumNavbar } from "@repo/ui";
import type { AppLink } from "@repo/ui";
import "@repo/ui/scholium-navbar.css";
import { supabase } from "@/integrations/supabase/client";
import Login from "@/pages/Login";
import Home from "@/pages/Home";
import Demo from "@/pages/Demo";
import Study from "@/pages/Study";
import PracticeSection from "@/pages/PracticeSection";
import Settings from "@/pages/Settings";
import ResetPassword from "@/pages/ResetPassword";

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

function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user, loadingAuth } = useApp();
  if (loadingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    );
  }
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function RedirectIfAuthed({ children }: { children: React.ReactNode }) {
  const { user, loadingAuth } = useApp();
  if (loadingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    );
  }
  if (user) return <Navigate to="/" replace />;
  return <>{children}</>;
}

function NavbarWired({ apps }: { apps: AppLink[] }) {
  const { supabaseUser, logout } = useApp();
  const navigate = useNavigate();
  const homeUrl = apps.find((a) => a.id === "scholium-home")?.url ?? "";
  return (
    <ScholiumNavbar
      apps={apps}
      homeUrl={homeUrl}
      user={supabaseUser ? { email: supabaseUser.email ?? "" } : null}
      onSignOut={async () => {
        await logout();
        navigate("/login");
      }}
      onSettings={() => navigate("/settings")}
    />
  );
}

function FadeRoutes({ description }: { description?: string | null }) {
  const location = useLocation();
  return (
    <div key={location.key} className="page-fade-in">
      <Routes>
        <Route
          path="/login"
          element={
            <RedirectIfAuthed>
              <Login />
            </RedirectIfAuthed>
          }
        />
        <Route
          path="/"
          element={
            <RequireAuth>
              <Home description={description} />
            </RequireAuth>
          }
        />
        <Route
          path="/study/:id"
          element={
            <RequireAuth>
              <Study />
            </RequireAuth>
          }
        />
        <Route
          path="/practice-section/:sectionId"
          element={
            <RequireAuth>
              <PracticeSection />
            </RequireAuth>
          }
        />
        <Route
          path="/settings"
          element={
            <RequireAuth>
              <Settings />
            </RequireAuth>
          }
        />
        <Route path="/auth/reset-password" element={<ResetPassword />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default function App() {
  const [apps, setApps] = useState<AppLink[]>([]);

  useEffect(() => {
    loadScholiumApps().then(setApps);
  }, []);

  const ownDescription = apps.find((a) => a.id === "recall-app")?.description ?? null;

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/demo" element={<Demo />} />
        <Route
          path="*"
          element={
            <AppProvider>
              <NavbarWired apps={apps} />
              <FadeRoutes description={ownDescription} />
              <Toaster />
            </AppProvider>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
