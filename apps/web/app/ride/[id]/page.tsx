'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getRide, createBooking, generateSimpleWhatsAppLink, type Ride } from '@indasyatri/shared';
import { formatTime } from '@indasyatri/shared';
import { WhatsAppButton } from '@/components/ui/WhatsAppButton';
import { CallButton } from '@/components/ui/CallButton';
import { NeuBadge } from '@/components/ui/NeuBadge';
import { NeuButton } from '@/components/ui/NeuButton';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { useLang } from '@/context/LangContext';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/common/Toast';

export default function RideDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { t } = useLang();
  const { user } = useAuth();
  const { showToast } = useToast();
  const [ride, setRide] = useState<Ride | null>(null);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [booked, setBooked] = useState(false);

  useEffect(() => {
    if (id) {
      getRide(id).then(setRide).finally(() => setLoading(false));
    }
  }, [id]);

  const handleBook = async () => {
    if (!user || !ride) return;
    setBooking(true);
    try {
      await createBooking({
        rideId: ride.id,
        routeFrom: ride.routeFrom,
        routeTo: ride.routeTo,
        date: ride.date,
        passengerUid: user.uid,
        passengerName: user.name,
        passengerPhone: user.phone,
        seatsBooked: 1,
        status: 'confirmed',
      });
      setRide((prev) => prev ? { ...prev, availableSeats: prev.availableSeats - 1 } : prev);
      setBooked(true);
      // Auto-open WhatsApp so passenger can confirm booking with driver
      const waUrl = generateSimpleWhatsAppLink(
        ride.driverWhatsapp,
        `Hi, I've booked a seat on your ${ride.date} ride from ${ride.routeFrom} to ${ride.routeTo} on IndasYatri. Please confirm my booking.`
      );
      window.open(waUrl, '_blank', 'noopener,noreferrer');
      showToast("Seat booked! WhatsApp opened to confirm with driver.", 'success');
    } catch {
      showToast(t('common.error'), 'error');
    } finally {
      setBooking(false);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: 'IndasYatri Ride', url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast('Link copied!', 'info');
    }
  };

  if (loading) return <LoadingSpinner fullPage />;
  if (!ride) return <div className="text-center py-20 text-[var(--text-secondary)]">Ride not found.</div>;

  const isFull = ride.availableSeats === 0 || ride.status !== 'active';

  return (
    <div className="max-w-2xl mx-auto">
      <Link href="/search" className="text-[var(--text-secondary)] text-sm mb-4 flex items-center gap-1 hover:text-[var(--accent)]">
        ← {t('common.back')}
      </Link>

      <div className="flex flex-col gap-5 mt-4">
        <div className="neu-card">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-2xl font-semibold">{ride.routeFrom} → {ride.routeTo}</h1>
              <p className="text-[var(--text-secondary)]">{ride.date} · {formatTime(ride.departureTime)}</p>
            </div>
            <NeuBadge variant={ride.status === 'active' ? 'success' : 'danger'}>
              {t(`ride.${ride.status}`)}
            </NeuBadge>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-[var(--text-secondary)] text-xs font-semibold uppercase mb-1">{t('ride.driver')}</p>
              <div className="flex items-center gap-2">
                {ride.driverPhoto && (
                  <Image src={ride.driverPhoto} alt={ride.driverName} width={36} height={36} className="rounded-full" />
                )}
                <span className="font-medium">{ride.driverName}</span>
              </div>
            </div>
            <div>
              <p className="text-[var(--text-secondary)] text-xs font-semibold uppercase mb-1">{t('ride.vehicle')}</p>
              <p className="font-medium">{ride.vehicleModel} ({ride.vehicleType})</p>
              <p className="text-[var(--text-secondary)] text-xs">{ride.vehicleNumber}</p>
            </div>
            <div>
              <p className="text-[var(--text-secondary)] text-xs font-semibold uppercase mb-1">Price</p>
              <p className="font-semibold text-[var(--accent)] text-lg">₹{ride.pricePerSeat} <span className="text-sm font-normal text-[var(--text-secondary)]">{t('ride.perSeat')}</span></p>
            </div>
            <div>
              <p className="text-[var(--text-secondary)] text-xs font-semibold uppercase mb-1">Seats</p>
              <p className="font-medium">{ride.availableSeats} of {ride.totalSeats} available</p>
            </div>
          </div>

          {ride.notes && (
            <div className="mt-4 p-3 rounded-[12px] bg-[var(--bg-secondary)] text-sm">
              <span className="font-semibold text-[var(--text-secondary)]">{t('ride.notes')}: </span>
              {ride.notes}
            </div>
          )}
        </div>

        {ride.status === 'active' && (
          <div className="neu-card flex flex-col gap-3">
            {!isFull ? (
              <>
                <div className="flex gap-3 flex-wrap">
                  <WhatsAppButton ride={ride} label={t('ride.whatsapp')} size="md" />
                  <CallButton phone={ride.driverPhone} label={t('ride.call')} size="md" />
                </div>
                {user && !booked && (
                  <NeuButton variant="accent" onClick={handleBook} disabled={booking} className="w-full">
                    {booking ? t('common.loading') : t('ride.bookSeat')}
                  </NeuButton>
                )}
                {user && booked && (
                  <div className="p-3 rounded-[12px] text-center text-sm font-medium" style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}>
                    ✓ Seat booked! Open WhatsApp above to confirm pickup details.
                  </div>
                )}
              </>
            ) : (
              <p className="text-center font-semibold text-[var(--danger)]">🚫 {t('ride.rideFull')}</p>
            )}
            <NeuButton onClick={handleShare} className="w-full" size="sm">
              🔗 {t('ride.shareRide')}
            </NeuButton>
          </div>
        )}
      </div>
    </div>
  );
}
