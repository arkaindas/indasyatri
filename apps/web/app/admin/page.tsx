'use client';

import React, { useEffect, useState } from 'react';
import { useLang } from '@/context/LangContext';
import { getAllUsers, getAllRides, getApprovedRoutes, getPendingRoutes } from '@indasyatri/shared';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';

interface Stats {
  users: number;
  rides: number;
  activeRoutes: number;
  pending: number;
}

export default function AdminDashboard() {
  const { t } = useLang();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getAllUsers(), getAllRides(), getApprovedRoutes(), getPendingRoutes()])
      .then(([users, rides, routes, pending]) => {
        setStats({
          users: users.length,
          rides: rides.length,
          activeRoutes: routes.length,
          pending: pending.length,
        });
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">{t('admin.dashboard')}</h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: t('admin.totalUsers'), value: stats?.users ?? 0, icon: '👥' },
          { label: t('admin.totalRides'), value: stats?.rides ?? 0, icon: '🚗' },
          { label: t('admin.activeRoutes'), value: stats?.activeRoutes ?? 0, icon: '🗺️' },
          { label: t('admin.pendingCount'), value: stats?.pending ?? 0, icon: '⏳' },
        ].map((card) => (
          <div key={card.label} className="neu-card text-center">
            <div className="text-3xl mb-2">{card.icon}</div>
            <div className="text-3xl font-semibold text-[var(--accent)]">{card.value}</div>
            <div className="text-sm text-[var(--text-secondary)] mt-1">{card.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
