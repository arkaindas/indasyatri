'use client';

import React from 'react';
import Link from 'next/link';
import { useLang } from '@/context/LangContext';
import type { Route } from '@indasyatri/shared';

export function RouteChips({ routes }: { routes: Route[] }) {
  const { lang } = useLang();

  if (routes.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {routes.map((route) => {
        const fromLabel = lang === 'bn' ? route.fromBn : route.from;
        const toLabel = lang === 'bn' ? route.toBn : route.to;
        return (
          <Link
            key={route.id}
            href={`/search?from=${encodeURIComponent(route.from)}&to=${encodeURIComponent(route.to)}`}
            className="neu-card-sm !py-2 !px-4 text-sm font-medium hover:text-[var(--accent)] transition-colors whitespace-nowrap"
          >
            {fromLabel} → {toLabel}
          </Link>
        );
      })}
    </div>
  );
}
