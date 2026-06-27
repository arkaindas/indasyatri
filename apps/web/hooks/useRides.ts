'use client';

import { useState, useEffect } from 'react';
import {
  getUpcomingRides,
  searchRides,
  getDriverRides,
  type Ride,
} from '@indasyatri/shared';
import { todayString, addDays } from '@indasyatri/shared';

export function useUpcomingRides(upcomingDays = 7) {
  const [rides, setRides] = useState<Ride[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const today = todayString();
    const maxDate = addDays(today, upcomingDays);
    getUpcomingRides(today, maxDate)
      .then(setRides)
      .catch(() => setError('Failed to load rides'))
      .finally(() => setLoading(false));
  }, [upcomingDays]);

  return { rides, loading, error };
}

export function useSearchRides(from: string, to: string, date: string) {
  const [rides, setRides] = useState<Ride[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!from || !to || !date) return;
    setLoading(true);
    setError(null);
    searchRides(from, to, date)
      .then(setRides)
      .catch(() => setError('Failed to search rides'))
      .finally(() => setLoading(false));
  }, [from, to, date]);

  return { rides, loading, error };
}

export function useDriverRides(driverUid: string | undefined) {
  const [rides, setRides] = useState<Ride[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!driverUid) { setLoading(false); return; }
    getDriverRides(driverUid)
      .then(setRides)
      .finally(() => setLoading(false));
  }, [driverUid]);

  return { rides, loading, setRides };
}
