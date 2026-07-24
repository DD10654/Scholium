import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useProject } from '../contexts/ProjectContext';
import { SettingsLayout, SettingsCard } from '@repo/ui';
import { useAnalytics } from '@repo/analytics';
import { supabase } from '../integrations/supabase/client';

interface SettingsProps {
  onBack: () => void;
  onSignOut: () => void;
}

export function Settings({ onBack, onSignOut }: SettingsProps) {
  const { user } = useAuth();
  const { isDarkMode, toggleDarkMode } = useProject();
  const { isOptedOut, setOptOut } = useAnalytics();
  const [shareAnalytics, setShareAnalytics] = useState(() => !isOptedOut());
  const toggleAnalytics = () => {
    const next = !shareAnalytics;
    setShareAnalytics(next);
    setOptOut(!next);
  };
  const [resetEmail, setResetEmail] = useState(user?.email || '');
  const [loading, setLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [resetError, setResetError] = useState('');

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail.trim()) { setResetError('Please enter your email'); return; }
    setLoading(true);
    setResetError('');
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail.trim(), {
        redirectTo: window.location.origin,
      });
      if (error) throw error;
      setResetSent(true);
    } catch (err) {
      setResetError(err instanceof Error ? err.message : 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SettingsLayout onBack={onBack}>
      <SettingsCard
        icon="👤"
        title="Account"
        description={`Signed in as ${user?.email ?? ''}`}
      />

      <SettingsCard
        icon="🌙"
        title="Dark Mode"
        description="Toggle between light and dark theme"
        action={
          <button
            className="rui-toggle"
            role="switch"
            aria-pressed={isDarkMode}
            onClick={toggleDarkMode}
            aria-label="Toggle dark mode"
          />
        }
      />

      <SettingsCard
        icon="📊"
        title="Usage analytics"
        description="Help improve Scholium by sharing anonymous usage data. We never collect the content you create, and you can turn this off anytime."
        action={
          <button
            className="rui-toggle"
            role="switch"
            aria-pressed={shareAnalytics}
            onClick={toggleAnalytics}
            aria-label="Toggle usage analytics"
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
          <form onSubmit={handlePasswordReset} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div>
              <label className="rui-settings-label" htmlFor="pn-reset-email">Email</label>
              <input
                id="pn-reset-email"
                className="rui-settings-input"
                type="email"
                value={resetEmail}
                onChange={e => setResetEmail(e.target.value)}
                disabled={loading}
              />
            </div>
            {resetError && <p style={{ fontSize: '0.8125rem', color: 'var(--color-accent-destructive)' }}>{resetError}</p>}
            <div>
              <button type="submit" className="rui-settings-primary-btn" disabled={loading}>
                {loading ? 'Sending…' : 'Send Reset Link'}
              </button>
            </div>
          </form>
        )}
      </SettingsCard>

      <SettingsCard
        icon="🚪"
        title="Log Out"
        description="Sign out of your account on this device"
        variant="danger"
        action={
          <button className="rui-settings-danger-btn" onClick={onSignOut}>
            Log Out
          </button>
        }
      />

      <SettingsCard
        icon="📝"
        title="About Poetry Notes"
        description="Capture, annotate, and revisit poetry with a rich-text editor built for close reading."
      />
    </SettingsLayout>
  );
}
