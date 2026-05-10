import { useState } from 'react';
import { supabase } from '../integrations/supabase/client';
import { ScholiumLogo } from '@repo/ui';
import '@repo/ui/app-hero-header.css';

export function ResetPasswordView() {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    if (password !== confirm) { setError('Passwords do not match.'); return; }
    setLoading(true);
    const { error: err } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (err) { setError(err.message); return; }
    setSuccess(true);
  }

  if (success) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div>
          <h2 style={{ margin: '0 0 0.5rem' }}>Password updated!</h2>
          <p style={{ color: 'var(--color-text-muted)' }}>You are now signed in.</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--color-bg-primary)',
      padding: '2rem 1rem',
    }}>
      <form
        onSubmit={handleSubmit}
        style={{
          width: '100%',
          maxWidth: '22rem',
          padding: '2.25rem 2rem 2.5rem',
          background: 'var(--color-bg-secondary)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-xl)',
          boxShadow: 'var(--shadow-hover)',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem',
          fontFamily: 'var(--font-body)',
          color: 'var(--color-text-primary)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'center', color: 'var(--color-accent-primary)' }}>
          <ScholiumLogo size="lg" />
        </div>
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ margin: '0 0 0.4rem', fontSize: '1.25rem', fontWeight: 800, fontFamily: 'var(--font-display)' }}>
            Set a new password
          </h1>
        </div>
        <label style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text-secondary)' }}>
          New password
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            autoFocus
            style={{ padding: '0.6rem 0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', background: 'var(--color-bg-primary)', color: 'var(--color-text-primary)', fontSize: '0.95rem' }}
          />
        </label>
        <label style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text-secondary)' }}>
          Confirm password
          <input
            type="password"
            value={confirm}
            onChange={e => setConfirm(e.target.value)}
            placeholder="••••••••"
            required
            style={{ padding: '0.6rem 0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', background: 'var(--color-bg-primary)', color: 'var(--color-text-primary)', fontSize: '0.95rem' }}
          />
        </label>
        {error ? (
          <div style={{ fontSize: '0.85rem', color: 'var(--color-accent-destructive)', background: 'hsla(0,84%,60%,0.08)', border: '1px solid hsla(0,84%,60%,0.2)', borderRadius: 'var(--radius-sm)', padding: '0.5rem 0.75rem' }}>
            {error}
          </div>
        ) : null}
        <button
          type="submit"
          disabled={loading}
          style={{ padding: '0.7rem 1rem', background: 'var(--gradient-hero)', color: '#fff', border: 'none', borderRadius: 'var(--radius-md)', fontFamily: 'var(--font-display)', fontSize: '0.95rem', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.6 : 1 }}
        >
          {loading ? 'Updating…' : 'Update password →'}
        </button>
      </form>
    </div>
  );
}
