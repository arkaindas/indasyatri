'use client';

import React, { useState } from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { NeuBadge } from '@/components/ui/NeuBadge';
import { NeuButton } from '@/components/ui/NeuButton';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { EmptyState } from '@/components/common/EmptyState';
import { useLang } from '@/context/LangContext';
import { useAuth } from '@/context/AuthContext';
import { useDriverRides } from '@/hooks/useRides';
import { useToast } from '@/components/common/Toast';
import { updateRideStatus, type Ride } from '@indasyatri/shared';
import { formatTime } from '@indasyatri/shared';

function MyRidesContent() {
  const { t } = useLang();
  const { user } = useAuth();
  const { rides, loading, setRides } = useDriverRides(user?.uid);
  const { showToast } = useToast();
  const [confirmCancel, setConfirmCancel] = useState<string | null>(null);

  const updateStatus = async (rideId: string, status: Ride['status']) => {
    try {
      await updateRideStatus(rideId, status);
      setRides((prev) => prev.map((r) => r.id === rideId ? { ...r, status } : r));
      showToast('Updated!', 'success');
    } catch {
      showToast(t('common.error'), 'error');
    }
    setConfirmCancel(null);
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold">{t('nav.myRides')}</h1>

      {rides.length === 0 ? (
        <EmptyState message="You haven't posted any rides yet." />
      ) : (
        rides.map((ride) => (
          <div key={ride.id} className="neu-card">
            <div className="flex justify-between items-start mb-3">
              <div>
                <div className="font-semibold">{ride.routeFrom} → {ride.routeTo}</div>
                <div className="text-sm text-[var(--text-secondary)]">
                  {ride.date} · {formatTime(ride.departureTime)} · ₹{ride.pricePerSeat}/seat
                </div>
              </div>
              <NeuBadge variant={ride.status === 'active' ? 'success' : ride.status === 'cancelled' ? 'danger' : 'muted'}>
                {t(`ride.${ride.status}`)}
              </NeuBadge>
            </div>

            <div className="text-sm text-[var(--text-secondary)] mb-4">
              🪑 {ride.availableSeats}/{ride.totalSeats} seats · {ride.vehicleModel}
            </div>

            {ride.status === 'active' && (
              <div className="flex gap-2 flex-wrap">
                <NeuButton size="sm" onClick={() => updateStatus(ride.id, 'full')}>
                  Mark as Full
                </NeuButton>
                <NeuButton size="sm" onClick={() => updateStatus(ride.id, 'completed')}>
                  Completed
                </NeuButton>
                {confirmCancel === ride.id ? (
                  <>
                    <NeuButton variant="danger" size="sm" onClick={() => updateStatus(ride.id, 'cancelled')}>
                      {t('common.confirm')} Cancel
                    </NeuButton>
                    <NeuButton size="sm" onClick={() => setConfirmCancel(null)}>
                      {t('common.back')}
                    </NeuButton>
                  </>
                ) : (
                  <NeuButton variant="danger" size="sm" onClick={() => setConfirmCancel(ride.id)}>
                    {t('admin.cancel')}
                  </NeuButton>
                )}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default function MyRidesPage() {
  return (
    <ProtectedRoute>
      <MyRidesContent />
    </ProtectedRoute>
  );
}
