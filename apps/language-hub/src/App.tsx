import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { useDarkMode } from "@repo/ui";
import Index from "./pages/Index";
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

function FadeRoutes() {
  const location = useLocation();
  return (
    <div key={location.key} className="page-fade-in">
      <Routes>
        <Route path="/" element={<Index />} />
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
  useDarkMode();
  return (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <FadeRoutes />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
  );
};

export default App;
