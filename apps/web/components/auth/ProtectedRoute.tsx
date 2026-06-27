'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { useLang } from '@/context/LangContext';
import { LoginButton } from './LoginButton';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const { t } = useLang();

  if (loading) return <LoadingSpinner fullPage />;

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)] p-6">
        <div className="neu-card text-center max-w-sm w-full">
          <div className="text-4xl mb-4">🔒</div>
          <h2 className="text-xl font-semibold mb-2">{t('auth.loginRequired')}</h2>
          <p className="text-[var(--text-secondary)] text-sm mb-6">
            {t('auth.signIn')}
          </p>
          <LoginButton />
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
