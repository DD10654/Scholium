import { CheckCircle2 } from "lucide-react";
import { AuthCard } from "@repo/ui";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";

interface SignUpSectionProps {
  user: User | null;
}

export default function SignUpSection({ user }: SignUpSectionProps) {
  async function handleSignIn(email: string, password: string): Promise<string | null> {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return error ? error.message : null;
  }

  async function handleSignUp(email: string, password: string): Promise<string | null> {
    const { error } = await supabase.auth.signUp({ email, password });
    return error ? error.message : null;
  }

  async function handleForgotPassword(email: string): Promise<string | null> {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });
    return error ? error.message : null;
  }

  return (
    <section id="signup" className="py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <h2
            className="font-display font-bold text-foreground mb-3"
            style={{ fontSize: "clamp(1.75rem, 4vw, 2.5rem)" }}
          >
            Join Scholium — It&apos;s Free
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto leading-relaxed">
            Create one account and unlock Language Flash Hub, Recall Master, and
            Poetry Notes.
          </p>
        </div>

        <div className="flex justify-center">
          <div className="w-full max-w-sm">
            {user ? (
              <div
                className="text-center py-10 px-6 bg-card rounded-2xl border border-border"
                style={{ boxShadow: "var(--shadow-card)" }}
              >
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
                  style={{ background: "hsl(var(--primary) / 0.1)" }}
                >
                  <CheckCircle2 size={22} style={{ color: "hsl(var(--primary))" }} />
                </div>
                <p className="font-semibold text-foreground mb-1">You&apos;re signed in</p>
                <p className="text-sm text-muted-foreground">{user.email}</p>
                <p className="text-xs text-muted-foreground mt-3">
                  Head to the tools section above to launch an app.
                </p>
              </div>
            ) : (
              <AuthCard
                onSignIn={handleSignIn}
                onSignUp={handleSignUp}
                onForgotPassword={handleForgotPassword}
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
