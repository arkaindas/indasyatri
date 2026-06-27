'use client';

import { useState, useEffect } from 'react';
import { getApprovedRoutes, type Route } from '@indasyatri/shared';

export function useApprovedRoutes() {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getApprovedRoutes()
      .then(setRoutes)
      .finally(() => setLoading(false));
  }, []);

  return { routes, loading };
}
