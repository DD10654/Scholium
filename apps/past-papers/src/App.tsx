import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { useDarkMode } from "@repo/ui";
import SubjectsPage from "@/pages/SubjectsPage";
import ComponentsPage from "@/pages/ComponentsPage";
import ChaptersPage from "@/pages/ChaptersPage";
import GeneratePaperPage from "@/pages/GeneratePaperPage";
import SettingsPage from "@/pages/Settings";

export default function App() {
  useDarkMode();
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SubjectsPage />} />
        <Route path="/generate" element={<GeneratePaperPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/:subject" element={<ComponentsPage />} />
        <Route path="/:subject/:component" element={<ChaptersPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
