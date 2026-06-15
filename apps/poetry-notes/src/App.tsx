import { useEffect, useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ProjectProvider, useProject } from './contexts/ProjectContext';
import { ScholiumNavbar, SCHOLIUM_HOME_URL } from '@repo/ui';
import type { AppLink } from '@repo/ui';
import '@repo/ui/scholium-navbar.css';
import { supabase } from './integrations/supabase/client';
import { Login } from './pages/Login';
import { Settings } from './pages/Settings';
import { LandingPage } from './components/LandingPage';
import { MainLayout } from './components/Layout/MainLayout';
import { ResetPasswordView } from './components/ResetPasswordView';
import Demo from './pages/Demo';
import './App.css';

// This app's own row in scholium_apps. Ids are UUIDs (not slugs), so match by URL.
const OWN_APP_URL = 'https://poetrynotes.vercel.app';

async function loadScholiumApps(): Promise<AppLink[]> {
  const first = await supabase
    .from('scholium_apps')
    .select('id, title, url, icon, subjects, description, has_demo, no_login')
    .order('sort_order');
  if (first.error && /(subjects|description|has_demo|no_login)/i.test(first.error.message)) {
    const fallback = await supabase
      .from('scholium_apps')
      .select('id, title, url, icon')
      .order('sort_order');
    return (fallback.data ?? []) as AppLink[];
  }
  return (first.data ?? []) as AppLink[];
}

type View = 'landing' | 'editor' | 'settings';

function AppContent() {
  const { user, loadingAuth, isPasswordRecovery, signOut } = useAuth();
  const { setUserId, saveToCloud } = useProject();
  const [currentView, setCurrentView] = useState<View>('landing');
  const [apps, setApps] = useState<AppLink[]>([]);

  useEffect(() => {
    setUserId(user?.id ?? null);
  }, [user, setUserId]);

  useEffect(() => {
    loadScholiumApps().then(setApps);
  }, []);

  if (loadingAuth) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontSize: '2rem' }}>📝</span>
      </div>
    );
  }

  if (isPasswordRecovery) return <ResetPasswordView />;
  if (!user) return <Login />;

  const handleProjectReady = () => setCurrentView('editor');

  const handleBackToLanding = async () => {
    await saveToCloud();
    setCurrentView('landing');
  };

  const handleSignOut = async () => {
    await saveToCloud();
    await signOut();
    setCurrentView('landing');
  };

  const ownDescription = apps.find((a) => a.url === OWN_APP_URL)?.description ?? null;

  return (
    <div className="app">
      <ScholiumNavbar
        apps={apps}
        homeUrl={SCHOLIUM_HOME_URL}
        user={user ? { email: user.email ?? '' } : null}
        onSignOut={handleSignOut}
        onSettings={() => setCurrentView('settings')}
      />
      <div key={currentView} className="page-fade-in">
        {currentView === 'settings' ? (
          <Settings onBack={() => setCurrentView('landing')} onSignOut={handleSignOut} />
        ) : currentView === 'editor' ? (
          <MainLayout onBackToLanding={handleBackToLanding} />
        ) : (
          <LandingPage
            onProjectReady={handleProjectReady}
            onSettings={() => setCurrentView('settings')}
            description={ownDescription}
          />
        )}
      </div>
    </div>
  );
}

export default function App() {
  if (typeof window !== 'undefined' && window.location.pathname === '/demo') {
    return <Demo />;
  }
  return (
    <AuthProvider>
      <ProjectProvider>
        <AppContent />
      </ProjectProvider>
    </AuthProvider>
  );
}
