'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { Ride } from '@indasyatri/shared';
import { formatTime } from '@indasyatri/shared';
import { NeuBadge } from '@/components/ui/NeuBadge';
import { WhatsAppButton } from '@/components/ui/WhatsAppButton';
import { CallButton } from '@/components/ui/CallButton';
import { useLang } from '@/context/LangContext';

export function RideCard({ ride }: { ride: Ride }) {
  const { t } = useLang();

  const statusVariant = {
    active: 'success' as const,
    full: 'danger' as const,
    cancelled: 'danger' as const,
    completed: 'muted' as const,
  }[ride.status];

  const seatsLabel =
    ride.availableSeats === 1
      ? `1 ${t('ride.seat')}`
      : `${ride.availableSeats} ${t('ride.seats')}`;

  return (
    <div className="neu-card flex flex-col gap-4">
      {/* Header row */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="font-semibold text-lg">
            {ride.routeFrom} → {ride.routeTo}
          </div>
          <div className="text-sm text-[var(--text-secondary)] flex items-center gap-2 mt-0.5">
            <span>🕐 {formatTime(ride.departureTime)}</span>
            <span>·</span>
            <span>₹{ride.pricePerSeat} {t('ride.perSeat')}</span>
          </div>
        </div>
        <NeuBadge variant={statusVariant}>
          {t(`ride.${ride.status}`)}
        </NeuBadge>
      </div>

      {/* Driver */}
      <div className="flex items-center gap-3">
        {ride.driverPhoto ? (
          <Image
            src={ride.driverPhoto}
            alt={ride.driverName}
            width={40}
            height={40}
            className="rounded-full"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-[var(--accent-light)] flex items-center justify-center text-[var(--accent)] font-semibold">
            {ride.driverName[0]}
          </div>
        )}
        <div>
          <div className="font-medium text-sm">{ride.driverName}</div>
          <div className="text-xs text-[var(--text-secondary)]">
            🚗 {ride.vehicleModel} ({ride.vehicleType})
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-[var(--text-secondary)]">
        <span>🪑 {seatsLabel}</span>
        <span>📋 {ride.vehicleNumber}</span>
        {ride.notes && <span>📝 {ride.notes}</span>}
      </div>

      {/* Seats visual bar */}
      <div className="flex gap-1">
        {Array.from({ length: ride.totalSeats }).map((_, i) => (
          <div
            key={i}
            className={`h-2 flex-1 rounded-full ${
              i < ride.availableSeats
                ? 'bg-[var(--success)]'
                : 'bg-[var(--text-secondary)] opacity-30'
            }`}
          />
        ))}
      </div>

      {/* CTA */}
      {ride.status === 'active' && (
        <div className="flex gap-2 flex-wrap">
          <WhatsAppButton ride={ride} label={t('ride.whatsapp')} />
          <CallButton phone={ride.driverPhone} label={t('ride.call')} />
          <Link
            href={`/ride/${ride.id}`}
            className="neu-btn text-sm ml-auto"
          >
            View Details
          </Link>
        </div>
      )}
    </div>
  );
}
