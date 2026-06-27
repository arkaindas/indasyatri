'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useLang } from '@/context/LangContext';
import { useSearchRides } from '@/hooks/useRides';
import { RideSearchForm } from '@/components/rides/RideSearchForm';
import { RideList } from '@/components/rides/RideList';
import { NeuButton } from '@/components/ui/NeuButton';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';

function SearchContent() {
  const { t } = useLang();
  const params = useSearchParams();
  const from = params.get('from') ?? '';
  const to = params.get('to') ?? '';
  const date = params.get('date') ?? '';

  const { rides, loading } = useSearchRides(from, to, date);

  const hasSearch = from && to && date;

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold">{t('nav.findRide')}</h1>
      <RideSearchForm defaultFrom={from} defaultTo={to} defaultDate={date} />

      {hasSearch && (
        <section>
          <h2 className="text-lg font-semibold mb-4">
            {from} → {to} · {date}
          </h2>
          {loading ? (
            <LoadingSpinner />
          ) : (
            <RideList
              rides={rides}
              emptyMessage={t('ride.noRides')}
              emptyAction={
                <Link href="/alerts">
                  <NeuButton variant="accent" size="sm">🔔 {t('ride.setAlert')}</NeuButton>
                </Link>
              }
            />
          )}
        </section>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <SearchContent />
    </Suspense>
  );
}
