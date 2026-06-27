'use client';

import React, { useEffect, useState } from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { NeuBadge } from '@/components/ui/NeuBadge';
import { NeuButton } from '@/components/ui/NeuButton';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { EmptyState } from '@/components/common/EmptyState';
import { useLang } from '@/context/LangContext';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/common/Toast';
import { getPassengerBookings, cancelBooking, type Booking } from '@indasyatri/shared';

function MyBookingsContent() {
  const { t } = useLang();
  const { user } = useAuth();
  const { showToast } = useToast();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      getPassengerBookings(user.uid).then(setBookings).finally(() => setLoading(false));
    }
  }, [user]);

  const handleCancel = async (booking: Booking) => {
    try {
      await cancelBooking(booking.id, booking.rideId, booking.seatsBooked);
      setBookings((prev) => prev.map((b) => b.id === booking.id ? { ...b, status: 'cancelled' as const } : b));
      showToast('Booking cancelled.', 'info');
    } catch {
      showToast(t('common.error'), 'error');
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold">{t('nav.myBookings')}</h1>

      {bookings.length === 0 ? (
        <EmptyState message="No bookings yet." />
      ) : (
        bookings.map((booking) => (
          <div key={booking.id} className="neu-card flex justify-between items-start flex-wrap gap-4">
            <div>
              <div className="font-semibold">{booking.routeFrom} → {booking.routeTo}</div>
              <div className="text-sm text-[var(--text-secondary)]">
                {booking.date} · {booking.seatsBooked} seat(s)
              </div>
            </div>
            <div className="flex items-center gap-2">
              <NeuBadge variant={booking.status === 'confirmed' ? 'success' : 'danger'}>
                {booking.status}
              </NeuBadge>
              {booking.status === 'confirmed' && (
                <NeuButton variant="danger" size="sm" onClick={() => handleCancel(booking)}>
                  {t('common.cancel')}
                </NeuButton>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default function MyBookingsPage() {
  return (
    <ProtectedRoute>
      <MyBookingsContent />
    </ProtectedRoute>
  );
}
