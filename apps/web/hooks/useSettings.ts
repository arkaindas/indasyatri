'use client';

import { useState, useEffect } from 'react';
import { getSettings, type AppSettings } from '@indasyatri/shared';
import { DEFAULT_SETTINGS } from '@indasyatri/shared';

export function useSettings() {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSettings()
      .then(setSettings)
      .finally(() => setLoading(false));
  }, []);

  return { settings, loading, setSettings };
}
