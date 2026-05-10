import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { AppProvider, useApp } from "@/contexts/AppContext";
import { Toaster } from "@/components/ui/sonner";
import { useDarkMode } from "@repo/ui";
import Login from "@/pages/Login";
import Home from "@/pages/Home";
import Study from "@/pages/Study";
import PracticeSection from "@/pages/PracticeSection";
import Settings from "@/pages/Settings";
import ResetPassword from "@/pages/ResetPassword";

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

function FadeRoutes() {
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
              <Home />
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
  useDarkMode();
  return (
    <AppProvider>
      <BrowserRouter>
        <FadeRoutes />
        <Toaster />
      </BrowserRouter>
    </AppProvider>
  );
}
