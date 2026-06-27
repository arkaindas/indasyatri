'use client';

import React, { useEffect, useState } from 'react';
import { useLang } from '@/context/LangContext';
import { useToast } from '@/components/common/Toast';
import { getAllRides, updateRideStatus, type Ride } from '@indasyatri/shared';
import { formatTime } from '@indasyatri/shared';
import { NeuBadge } from '@/components/ui/NeuBadge';
import { NeuButton } from '@/components/ui/NeuButton';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';

export default function AdminRidesPage() {
  const { t } = useLang();
  const { showToast } = useToast();
  const [rides, setRides] = useState<Ride[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllRides().then(setRides).finally(() => setLoading(false));
  }, []);

  const handleCancel = async (rideId: string) => {
    try {
      await updateRideStatus(rideId, 'cancelled');
      setRides((prev) => prev.map((r) => r.id === rideId ? { ...r, status: 'cancelled' } : r));
      showToast('Ride cancelled.', 'info');
    } catch {
      showToast(t('common.error'), 'error');
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold">{t('admin.rides')}</h1>
      {rides.map((ride) => (
        <div key={ride.id} className="neu-card flex items-center justify-between flex-wrap gap-3">
          <div>
            <div className="font-semibold">{ride.routeFrom} → {ride.routeTo}</div>
            <div className="text-sm text-[var(--text-secondary)]">
              {ride.date} · {formatTime(ride.departureTime)} · {ride.driverName} · ₹{ride.pricePerSeat}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <NeuBadge variant={ride.status === 'active' ? 'success' : 'danger'}>
              {t(`ride.${ride.status}`)}
            </NeuBadge>
            {ride.status === 'active' && (
              <NeuButton size="sm" variant="danger" onClick={() => handleCancel(ride.id)}>
                {t('admin.cancel')}
              </NeuButton>
            )}
          </div>
        </div>
      ))}
      {rides.length === 0 && <p className="text-center text-[var(--text-secondary)] py-6">No rides.</p>}
    </div>
  );
}
