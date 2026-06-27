'use client';

import React, { useState } from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { AlertSubscribeForm } from '@/components/alerts/AlertSubscribeForm';
import { AlertList } from '@/components/alerts/AlertList';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { useLang } from '@/context/LangContext';
import { useAuth } from '@/context/AuthContext';
import { useAlerts } from '@/hooks/useAlerts';
import { getUserAlerts } from '@indasyatri/shared';

function AlertsContent() {
  const { t } = useLang();
  const { user } = useAuth();
  const { alerts, loading, setAlerts } = useAlerts(user?.uid);

  const handleCreated = async () => {
    if (user) {
      try {
        const updated = await getUserAlerts(user.uid);
        setAlerts(updated);
      } catch {
        // list will still show the previous state
      }
    }
  };

  const handleDeleted = (id: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  };

  const MAX_ALERTS = 5;
  const canCreate = alerts.length < MAX_ALERTS;

  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-6">
      <h1 className="text-2xl font-semibold">{t('nav.alerts')}</h1>

      {canCreate ? (
        <AlertSubscribeForm onCreated={handleCreated} />
      ) : (
        <div className="neu-card text-center text-[var(--text-secondary)]">
          {t('alert.maxAlerts')}
        </div>
      )}

      <section>
        <h2 className="text-lg font-semibold mb-3">{t('alert.active')}</h2>
        {loading ? (
          <LoadingSpinner />
        ) : (
          <AlertList alerts={alerts} onDeleted={handleDeleted} />
        )}
      </section>
    </div>
  );
}

export default function AlertsPage() {
  return (
    <ProtectedRoute>
      <AlertsContent />
    </ProtectedRoute>
  );
}
