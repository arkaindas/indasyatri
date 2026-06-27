'use client';

import { useState, useEffect } from 'react';
import { getUserAlerts, type RideAlert } from '@indasyatri/shared';

export function useAlerts(userUid: string | undefined) {
  const [alerts, setAlerts] = useState<RideAlert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userUid) { setLoading(false); return; }
    getUserAlerts(userUid)
      .then(setAlerts)
      .finally(() => setLoading(false));
  }, [userUid]);

  return { alerts, loading, setAlerts };
}
