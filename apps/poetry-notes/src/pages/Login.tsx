import { AuthCard } from '@repo/ui';
import { supabase } from '../integrations/supabase/client';

export function Login() {
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
      redirectTo: window.location.origin,
    });
    return error ? error.message : null;
  }

  return (
    <AuthCard
      onSignIn={handleSignIn}
      onSignUp={handleSignUp}
      onForgotPassword={handleForgotPassword}
    />
  );
}
