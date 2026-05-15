import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useDarkMode } from "@repo/ui";
import { AuthProvider } from "@/contexts/AuthContext";
import HomePage from "@/pages/HomePage";
import ResetPassword from "@/pages/ResetPassword";

export default function App() {
  useDarkMode();
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/auth/reset-password" element={<ResetPassword />} />
          <Route path="*" element={<HomePage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
