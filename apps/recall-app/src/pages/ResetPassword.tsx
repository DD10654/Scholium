import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { ScholiumLogo } from "@repo/ui";
import "@repo/ui/app-hero-header.css";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (password.length < 6) { setError("Password must be at least 6 characters."); return; }
    if (password !== confirm) { setError("Passwords do not match."); return; }
    setLoading(true);
    const { error: err } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (err) { setError(err.message); return; }
    setSuccess(true);
    setTimeout(() => navigate("/"), 2000);
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-3">
          <div className="text-4xl">✅</div>
          <h2 className="text-xl font-bold font-display">Password updated!</h2>
          <p className="text-muted-foreground text-sm">Redirecting you now…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-card border border-border rounded-2xl shadow-card p-8 flex flex-col gap-5"
      >
        <div className="flex justify-center text-primary">
          <ScholiumLogo size="lg" />
        </div>
        <div className="text-center">
          <h1 className="text-lg font-bold font-display">Set a new password</h1>
        </div>
        <label className="flex flex-col gap-1 text-sm font-semibold text-muted-foreground">
          New password
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="••••••••"
            className="mt-1 px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
            required
            autoFocus
          />
        </label>
        <label className="flex flex-col gap-1 text-sm font-semibold text-muted-foreground">
          Confirm password
          <input
            type="password"
            value={confirm}
            onChange={e => setConfirm(e.target.value)}
            placeholder="••••••••"
            className="mt-1 px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
            required
          />
        </label>
        {error ? (
          <div className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg px-3 py-2">
            {error}
          </div>
        ) : null}
        <Button type="submit" variant="hero" disabled={loading} className="w-full">
          {loading ? "Updating…" : "Update password →"}
        </Button>
      </form>
    </div>
  );
}
