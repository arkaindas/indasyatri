import React from 'react';
import type { Ride } from '@indasyatri/shared';
import { RideCard } from './RideCard';
import { DateGroupHeader } from '@/components/common/DateGroupHeader';
import { EmptyState } from '@/components/common/EmptyState';
import { useLang } from '@/context/LangContext';

function groupByDate(rides: Ride[]): Map<string, Ride[]> {
  const map = new Map<string, Ride[]>();
  for (const ride of rides) {
    const list = map.get(ride.date) ?? [];
    list.push(ride);
    map.set(ride.date, list);
  }
  return map;
}

export function RideList({
  rides,
  emptyMessage,
  emptyAction,
}: {
  rides: Ride[];
  emptyMessage?: string;
  emptyAction?: React.ReactNode;
}) {
  const { t } = useLang();

  if (rides.length === 0) {
    return (
      <EmptyState
        message={emptyMessage ?? t('ride.noRides')}
        action={emptyAction}
      />
    );
  }

  const grouped = groupByDate(rides);

  return (
    <div className="flex flex-col gap-2">
      {Array.from(grouped.entries()).map(([date, dateRides]) => (
        <div key={date}>
          <DateGroupHeader date={date} />
          <div className="flex flex-col gap-4">
            {dateRides.map((ride) => (
              <RideCard key={ride.id} ride={ride} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
