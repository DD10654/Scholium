import { useEffect, useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ProjectProvider, useProject } from './contexts/ProjectContext';
import { useDarkMode } from '@repo/ui';
import { Login } from './pages/Login';
import { Settings } from './pages/Settings';
import { LandingPage } from './components/LandingPage';
import { MainLayout } from './components/Layout/MainLayout';
import { ResetPasswordView } from './components/ResetPasswordView';
import './App.css';

type View = 'landing' | 'editor' | 'settings';

function AppContent() {
  const { user, loadingAuth, isPasswordRecovery, signOut } = useAuth();
  const { setUserId, saveToCloud } = useProject();
  useDarkMode();
  const [currentView, setCurrentView] = useState<View>('landing');

  useEffect(() => {
    setUserId(user?.id ?? null);
  }, [user, setUserId]);

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

  return (
    <div className="app">
      <div key={currentView} className="page-fade-in">
        {currentView === 'settings' ? (
          <Settings onBack={() => setCurrentView('landing')} onSignOut={handleSignOut} />
        ) : currentView === 'editor' ? (
          <MainLayout onBackToLanding={handleBackToLanding} />
        ) : (
          <LandingPage
            onProjectReady={handleProjectReady}
            onSettings={() => setCurrentView('settings')}
          />
        )}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ProjectProvider>
        <AppContent />
      </ProjectProvider>
    </AuthProvider>
  );
}
