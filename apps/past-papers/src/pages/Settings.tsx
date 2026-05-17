import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { SettingsLayout, SettingsCard, useDarkMode } from "@repo/ui";
import "@repo/ui/settings-layout.css";
import "@repo/ui/settings-card.css";
import { supabase } from "@/integrations/supabase/client";

export default function SettingsPage() {
  const navigate = useNavigate();
  const { isDark, toggle } = useDarkMode();

  const [resetEmail, setResetEmail] = useState("");
  const [resetLoading, setResetLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [resetError, setResetError] = useState("");

  const [loggingOut, setLoggingOut] = useState(false);

  async function handlePasswordReset(e: FormEvent) {
    e.preventDefault();
    setResetError("");
    if (!resetEmail.trim()) { setResetError("Please enter your email"); return; }
    setResetLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail.trim(), {
        redirectTo: window.location.origin,
      });
      if (error) throw error;
      setResetSent(true);
    } catch (err) {
      setResetError(err instanceof Error ? err.message : "Failed to send reset email");
    } finally {
      setResetLoading(false);
    }
  }

  async function handleLogout() {
    setLoggingOut(true);
    try {
      await supabase.auth.signOut();
    } finally {
      setLoggingOut(false);
      navigate("/");
    }
  }

  return (
    <SettingsLayout onBack={() => navigate(-1)}>
      <SettingsCard
        icon="🌙"
        title="Dark Mode"
        description="Toggle between light and dark theme"
        action={
          <button
            className="rui-toggle"
            role="switch"
            aria-pressed={isDark}
            onClick={toggle}
            aria-label="Toggle dark mode"
          />
        }
      />

      <SettingsCard
        icon="🔑"
        title="Reset Password"
        description="We'll send a password reset link to your email"
      >
        {resetSent ? (
          <div>
            <p className="rui-settings-success">Reset link sent!</p>
            <p className="rui-settings-muted">Check your email and follow the link.</p>
            <button className="rui-settings-outline-btn" onClick={() => setResetSent(false)}>
              Send Again
            </button>
          </div>
        ) : (
          <form onSubmit={handlePasswordReset} style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            <div>
              <label className="rui-settings-label" htmlFor="pp-reset-email">Email</label>
              <input
                id="pp-reset-email"
                className="rui-settings-input"
                type="email"
                value={resetEmail}
                onChange={e => setResetEmail(e.target.value)}
                disabled={resetLoading}
                placeholder="you@example.com"
              />
            </div>
            {resetError && (
              <p style={{ fontSize: "0.8125rem", color: "var(--color-accent-destructive)" }}>{resetError}</p>
            )}
            <div>
              <button type="submit" className="rui-settings-primary-btn" disabled={resetLoading}>
                {resetLoading ? "Sending…" : "Send Reset Link"}
              </button>
            </div>
          </form>
        )}
      </SettingsCard>

      <SettingsCard
        icon="🚪"
        title="Log Out"
        description="Sign out of your Scholium account on this device"
        variant="danger"
        action={
          <button className="rui-settings-danger-btn" onClick={handleLogout} disabled={loggingOut}>
            {loggingOut ? "Logging out…" : "Log Out"}
          </button>
        }
      />

      <SettingsCard
        icon="📚"
        title="About Past Papers"
        description="Browse topical papers and mark schemes by subject, component, and chapter. Content is read-only and updated as new papers are added."
      />
    </SettingsLayout>
  );
}
