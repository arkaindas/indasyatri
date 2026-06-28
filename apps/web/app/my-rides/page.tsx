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
import {
  updateRideStatus,
  getRideBookings,
  cancelBooking,
  generateSimpleWhatsAppLink,
  type Ride,
  type Booking,
} from '@indasyatri/shared';
import { formatTime } from '@indasyatri/shared';

// ── Passengers expandable panel ────────────────────────────────────────────

function PassengersPanel({ ride }: { ride: Ride }) {
  const { showToast } = useToast();
  const [open, setOpen] = useState(false);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [fetched, setFetched] = useState(false);
  const [loadingBookings, setLoadingBookings] = useState(false);

  const toggle = async () => {
    if (!open && !fetched) {
      setLoadingBookings(true);
      try {
        const data = await getRideBookings(ride.id);
        setBookings(data);
        setFetched(true);
      } catch {
        showToast('Could not load passengers.', 'error');
      } finally {
        setLoadingBookings(false);
      }
    }
    setOpen((v) => !v);
  };

  const handleCancelPassenger = async (booking: Booking) => {
    try {
      await cancelBooking(booking.id, booking.rideId, booking.seatsBooked);
      setBookings((prev) => prev.filter((b) => b.id !== booking.id));
      showToast('Booking cancelled for passenger.', 'info');
    } catch {
      showToast('Could not cancel booking.', 'error');
    }
  };

  const bookedCount = fetched ? bookings.length : ride.totalSeats - ride.availableSeats;

  return (
    <div className="border-t border-[var(--bg-secondary)] pt-3 mt-1">
      <button
        onClick={toggle}
        className="flex items-center gap-2 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors"
      >
        <span>{open ? '▼' : '▶'}</span>
        <span>Passengers ({bookedCount})</span>
        {loadingBookings && <span className="ml-1 opacity-60">…</span>}
      </button>

      {open && (
        <div className="mt-3 flex flex-col gap-2">
          {bookings.length === 0 ? (
            <p className="text-sm text-[var(--text-secondary)] py-1">No confirmed bookings yet.</p>
          ) : (
            bookings.map((b) => {
              const cleanPhone = b.passengerPhone.replace(/[\s\-\+]/g, '');
              const phoneForLink = cleanPhone.startsWith('91') ? cleanPhone : `91${cleanPhone}`;
              const waLink = generateSimpleWhatsAppLink(
                b.passengerPhone,
                `Hi ${b.passengerName}, this is your driver. Confirming your booking for the ${b.date} ride from ${ride.routeFrom} to ${ride.routeTo} at ${formatTime(ride.departureTime)}. See you there!`
              );

              return (
                <div
                  key={b.id}
                  className="flex items-center justify-between flex-wrap gap-2 p-3 rounded-[12px]"
                  style={{ background: 'var(--bg-secondary)' }}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0"
                      style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}
                    >
                      {b.passengerName[0]?.toUpperCase()}
                    </div>
                    <div>
                      <div className="text-sm font-medium">{b.passengerName}</div>
                      <div className="text-xs text-[var(--text-secondary)]">{b.seatsBooked} seat(s)</div>
                    </div>
                  </div>

                  <div className="flex gap-1.5 flex-wrap">
                    <a
                      href={waLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="neu-btn !py-1.5 !px-3 !text-xs !bg-[#25D366] !text-white"
                    >
                      WhatsApp
                    </a>
                    <a
                      href={`tel:+${phoneForLink}`}
                      className="neu-btn !py-1.5 !px-3 !text-xs !bg-blue-500 !text-white"
                    >
                      Call
                    </a>
                    <button
                      onClick={() => handleCancelPassenger(b)}
                      className="neu-btn !py-1.5 !px-3 !text-xs"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}

// ── Main page ──────────────────────────────────────────────────────────────

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
          <div key={ride.id} className="neu-card flex flex-col gap-3">
            <div className="flex justify-between items-start">
              <div>
                <div className="font-semibold">{ride.routeFrom} → {ride.routeTo}</div>
                <div className="text-sm text-[var(--text-secondary)]">
                  {ride.date} · {formatTime(ride.departureTime)} · ₹{ride.pricePerSeat}/seat
                </div>
                <div className="text-xs text-[var(--text-secondary)] mt-0.5">
                  🚗 {ride.vehicleModel} · 🪑 {ride.availableSeats}/{ride.totalSeats} seats
                </div>
              </div>
              <NeuBadge variant={ride.status === 'active' ? 'success' : ride.status === 'cancelled' ? 'danger' : 'muted'}>
                {t(`ride.${ride.status}`)}
              </NeuBadge>
            </div>

            {ride.status === 'active' && (
              <div className="flex gap-2 flex-wrap">
                <NeuButton size="sm" onClick={() => updateStatus(ride.id, 'full')}>
                  Mark Full
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

            <PassengersPanel ride={ride} />
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
