'use client';

import React, { useState, useEffect } from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { RouteSuggestForm } from '@/components/routes/RouteSuggestForm';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { NeuBadge } from '@/components/ui/NeuBadge';
import { useLang } from '@/context/LangContext';
import { useAuth } from '@/context/AuthContext';
import { getAllRoutes, type Route } from '@indasyatri/shared';

function SuggestRouteContent() {
  const { t } = useLang();
  const { user } = useAuth();
  const [myRoutes, setMyRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(true);

  const loadRoutes = () => {
    if (!user) return;
    getAllRoutes()
      .then((all) => setMyRoutes(all.filter((r) => r.submittedBy === user.uid)))
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadRoutes(); }, [user]);

  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-6">
      <h1 className="text-2xl font-semibold">{t('route.suggestNew')}</h1>
      <RouteSuggestForm onSuccess={loadRoutes} />

      {loading ? (
        <LoadingSpinner />
      ) : myRoutes.length > 0 ? (
        <section>
          <h2 className="text-lg font-semibold mb-3">My Suggestions</h2>
          <div className="flex flex-col gap-3">
            {myRoutes.map((route) => (
              <div key={route.id} className="neu-card flex justify-between items-center">
                <div>
                  <div className="font-medium">{route.from} → {route.to}</div>
                  <div className="text-sm text-[var(--text-secondary)]">{route.fromBn} → {route.toBn}</div>
                </div>
                <NeuBadge
                  variant={
                    route.status === 'approved' ? 'success' :
                    route.status === 'rejected' ? 'danger' : 'muted'
                  }
                >
                  {t(`route.${route.status}`)}
                </NeuBadge>
              </div>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}

export default function SuggestRoutePage() {
  return (
    <ProtectedRoute>
      <SuggestRouteContent />
    </ProtectedRoute>
  );
}
