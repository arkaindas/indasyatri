'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { NeuBadge } from '@/components/ui/NeuBadge';
import { NeuButton } from '@/components/ui/NeuButton';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { EmptyState } from '@/components/common/EmptyState';
import { useLang } from '@/context/LangContext';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/common/Toast';
import {
  getPassengerBookings,
  getRide,
  cancelBooking,
  generateSimpleWhatsAppLink,
  type Booking,
  type Ride,
} from '@indasyatri/shared';
import { formatTime } from '@indasyatri/shared';

function MyBookingsContent() {
  const { t } = useLang();
  const { user } = useAuth();
  const { showToast } = useToast();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [rideMap, setRideMap] = useState<Record<string, Ride>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    getPassengerBookings(user.uid).then(async (data) => {
      setBookings(data);
      // Fetch ride data for all unique rideIds
      const ids = data.map((b) => b.rideId).filter((id, i, arr) => arr.indexOf(id) === i);
      const rides = await Promise.all(ids.map((id) => getRide(id)));
      const map: Record<string, Ride> = {};
      rides.forEach((r) => { if (r) map[r.id] = r; });
      setRideMap(map);
    }).finally(() => setLoading(false));
  }, [user]);

  const handleCancel = async (booking: Booking) => {
    try {
      await cancelBooking(booking.id, booking.rideId, booking.seatsBooked);
      setBookings((prev) =>
        prev.map((b) => b.id === booking.id ? { ...b, status: 'cancelled' as const } : b)
      );
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
        <EmptyState message="No bookings yet. Find a ride and book a seat!" />
      ) : (
        bookings.map((booking) => {
          const ride = rideMap[booking.rideId];
          const isCancelled = booking.status === 'cancelled';

          const waLink = ride
            ? generateSimpleWhatsAppLink(
                ride.driverWhatsapp,
                `Hi, I've booked a seat on your ${booking.date} ride from ${booking.routeFrom} to ${booking.routeTo} on IndasYatri. Please confirm my booking.`
              )
            : null;

          const cleanPhone = ride?.driverPhone.replace(/[\s\-\+]/g, '') ?? '';
          const phoneForCall = cleanPhone.startsWith('91') ? cleanPhone : `91${cleanPhone}`;

          return (
            <div
              key={booking.id}
              className="neu-card flex flex-col gap-4"
              style={{ opacity: isCancelled ? 0.65 : 1 }}
            >
              {/* Status + Route */}
              <div className="flex justify-between items-start gap-2">
                <div>
                  <div className="font-semibold text-lg">
                    {booking.routeFrom} → {booking.routeTo}
                  </div>
                  <div className="text-sm text-[var(--text-secondary)]">
                    {booking.date}
                    {ride && ` · ${formatTime(ride.departureTime)}`}
                    {` · ${booking.seatsBooked} seat(s)`}
                  </div>
                </div>
                <NeuBadge variant={isCancelled ? 'danger' : 'success'}>
                  {isCancelled ? 'Cancelled' : '✓ Booked'}
                </NeuBadge>
              </div>

              {/* Ride details */}
              {ride && (
                <div className="p-3 rounded-[12px] flex flex-col gap-2" style={{ background: 'var(--bg-secondary)' }}>
                  {/* Driver */}
                  <div className="flex items-center gap-2">
                    {ride.driverPhoto ? (
                      <Image
                        src={ride.driverPhoto}
                        alt={ride.driverName}
                        width={32}
                        height={32}
                        className="rounded-full"
                      />
                    ) : (
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0"
                        style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}
                      >
                        {ride.driverName[0]}
                      </div>
                    )}
                    <div>
                      <div className="text-sm font-medium">{ride.driverName}</div>
                      <div className="text-xs text-[var(--text-secondary)]">Driver</div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-[var(--text-secondary)]">
                    <span>🚗 {ride.vehicleModel} ({ride.vehicleType})</span>
                    <span>📋 {ride.vehicleNumber}</span>
                    <span className="font-semibold" style={{ color: 'var(--accent)' }}>₹{ride.pricePerSeat}/seat</span>
                  </div>
                </div>
              )}

              {/* Actions */}
              {!isCancelled && (
                <div className="flex gap-2 flex-wrap">
                  {waLink && (
                    <a
                      href={waLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="neu-btn !bg-[#25D366] !text-white !text-sm"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                      </svg>
                      WhatsApp Driver
                    </a>
                  )}
                  {ride && (
                    <a
                      href={`tel:+${phoneForCall}`}
                      className="neu-btn !bg-blue-500 !text-white !text-sm"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                      </svg>
                      Call Driver
                    </a>
                  )}
                  <NeuButton variant="danger" size="sm" onClick={() => handleCancel(booking)}>
                    {t('common.cancel')}
                  </NeuButton>
                </div>
              )}
            </div>
          );
        })
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
