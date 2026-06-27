'use client';

import React from 'react';
import Link from 'next/link';
import { useLang } from '@/context/LangContext';
import { useSettings } from '@/hooks/useSettings';
import { useUpcomingRides } from '@/hooks/useRides';
import { useApprovedRoutes } from '@/hooks/useRoutes';
import { RideList } from '@/components/rides/RideList';
import { RouteChips } from '@/components/routes/RouteChips';
import { NeuButton } from '@/components/ui/NeuButton';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';

export default function HomePage() {
  const { t } = useLang();
  const { settings } = useSettings();
  const { rides, loading: ridesLoading } = useUpcomingRides(settings.upcomingRideDays);
  const { routes, loading: routesLoading } = useApprovedRoutes();

  return (
    <div className="flex flex-col gap-10">
      {/* Hero */}
      <section className="neu-card text-center py-10">
        <h1 className="text-3xl font-semibold mb-2">
          Indas<span className="text-[var(--accent)]">Yatri</span>
          <span className="ml-2 text-2xl">🚗</span>
        </h1>
        <p className="text-[var(--text-secondary)] text-sm mb-1">ইন্দাসযাত্রী</p>
        <p className="mt-4 text-[var(--text-secondary)] max-w-md mx-auto">{t('home.hero')}</p>
        <p className="text-xs text-[var(--text-secondary)] mt-1 opacity-70">{t('home.heroSub')}</p>

        <div className="flex gap-4 justify-center flex-wrap mt-8">
          <Link href="/search">
            <div className="neu-card !py-6 !px-8 text-center hover:text-[var(--accent)] transition-colors cursor-pointer">
              <div className="text-3xl mb-2">🔍</div>
              <div className="font-semibold">{t('home.findRide')}</div>
            </div>
          </Link>
          <Link href="/offer">
            <div className="neu-card !py-6 !px-8 text-center hover:text-[var(--accent)] transition-colors cursor-pointer">
              <div className="text-3xl mb-2">🙋</div>
              <div className="font-semibold">{t('home.offerRide')}</div>
            </div>
          </Link>
        </div>
      </section>

      {/* Popular Routes */}
      <section>
        <h2 className="text-xl font-semibold mb-4">{t('home.popularRoutes')}</h2>
        {routesLoading ? (
          <LoadingSpinner />
        ) : (
          <RouteChips routes={routes} />
        )}
      </section>

      {/* Upcoming Rides */}
      <section>
        <h2 className="text-xl font-semibold mb-4">{t('home.upcomingRides')}</h2>
        {ridesLoading ? (
          <LoadingSpinner />
        ) : (
          <RideList
            rides={rides}
            emptyMessage={t('home.noRides')}
            emptyAction={
              <Link href="/offer">
                <NeuButton variant="accent">Post the first ride</NeuButton>
              </Link>
            }
          />
        )}
      </section>

      {/* How it works */}
      <section>
        <h2 className="text-xl font-semibold mb-6">{t('home.howItWorks')}</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            { step: '1', icon: '🔍', text: t('home.step1') },
            { step: '2', icon: '📱', text: t('home.step2') },
            { step: '3', icon: '🤝', text: t('home.step3') },
          ].map(({ step, icon, text }) => (
            <div key={step} className="neu-card text-center">
              <div className="text-4xl mb-3">{icon}</div>
              <div className="font-semibold text-[var(--accent)] text-sm mb-1">Step {step}</div>
              <p className="text-sm text-[var(--text-secondary)]">{text}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
