'use client';

import React, { useEffect, useState } from 'react';
import { getPendingRoutes, approveRoute, rejectRoute, type Route } from '@indasyatri/shared';
import { NeuButton } from '@/components/ui/NeuButton';
import { NeuBadge } from '@/components/ui/NeuBadge';
import { useLang } from '@/context/LangContext';
import { useToast } from '@/components/common/Toast';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';

export function RouteAdminList() {
  const { t } = useLang();
  const { showToast } = useToast();
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPendingRoutes().then(setRoutes).finally(() => setLoading(false));
  }, []);

  const handleApprove = async (route: Route) => {
    try {
      await approveRoute(route.id, route);
      setRoutes((prev) => prev.filter((r) => r.id !== route.id));
      showToast('Route approved!', 'success');
    } catch {
      showToast(t('common.error'), 'error');
    }
  };

  const handleReject = async (routeId: string) => {
    try {
      await rejectRoute(routeId);
      setRoutes((prev) => prev.filter((r) => r.id !== routeId));
      showToast('Route rejected.', 'info');
    } catch {
      showToast(t('common.error'), 'error');
    }
  };

  if (loading) return <LoadingSpinner />;
  if (routes.length === 0) {
    return <p className="text-[var(--text-secondary)] text-center py-8">No pending routes.</p>;
  }

  return (
    <div className="flex flex-col gap-3">
      {routes.map((route) => (
        <div key={route.id} className="neu-card flex items-center justify-between gap-4 flex-wrap">
          <div>
            <div className="font-semibold">{route.from} → {route.to}</div>
            <div className="text-sm text-[var(--text-secondary)]">
              {route.fromBn} → {route.toBn}
              {route.submittedByName && ` · by ${route.submittedByName}`}
            </div>
          </div>
          <div className="flex gap-2">
            <NeuButton variant="accent" size="sm" onClick={() => handleApprove(route)}>
              {t('admin.approve')}
            </NeuButton>
            <NeuButton variant="danger" size="sm" onClick={() => handleReject(route.id)}>
              {t('admin.reject')}
            </NeuButton>
          </div>
        </div>
      ))}
    </div>
  );
}
