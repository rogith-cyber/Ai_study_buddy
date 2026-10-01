import React, { useState } from 'react';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { LandingPage } from '@/components/LandingPage';
import { AuthPage } from '@/components/AuthPage';
import { DashboardLayout } from '@/components/DashboardLayout';

function AppContent() {
  const { user } = useAuth();
  const [authMode, setAuthMode] = useState<'login' | 'register' | null>(null);

  return (
    <div className="min-h-screen relative bg-[#020106] text-slate-100 overflow-x-hidden selection:bg-purple-500 selection:text-white">
      {/* 1. Dark Black Corner-to-Center Radial Vignette Background */}
      <div className="corner-gradient-bg" />

      {/* 2. Fluid Flowing Ambient Neon Animated Blobs */}
      <div className="blob-green" />
      <div className="blob-emerald" />
      <div className="blob-mint" />

      {/* 3. Pure State Routing Logic */}
      {user ? (
        <DashboardLayout />
      ) : authMode ? (
        <AuthPage
          initialMode={authMode}
          onBackToLanding={() => setAuthMode(null)}
        />
      ) : (
        <LandingPage onGoToAuth={(mode) => setAuthMode(mode || 'login')} />
      )}
    </div>
  );
}

export function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
