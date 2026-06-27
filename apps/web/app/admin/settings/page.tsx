'use client';

import React, { useState } from 'react';
import { useLang } from '@/context/LangContext';
import { useSettings } from '@/hooks/useSettings';
import { useToast } from '@/components/common/Toast';
import { updateSettings } from '@indasyatri/shared';
import { NeuInput } from '@/components/ui/NeuInput';
import { NeuButton } from '@/components/ui/NeuButton';
import { NeuToggle } from '@/components/ui/NeuToggle';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';

export default function AdminSettingsPage() {
  const { t } = useLang();
  const { settings, loading, setSettings } = useSettings();
  const { showToast } = useToast();
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateSettings(settings);
      showToast(t('profile.saved'), 'success');
    } catch {
      showToast(t('common.error'), 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-md flex flex-col gap-6">
      <h1 className="text-2xl font-semibold">{t('admin.settings')}</h1>

      <div className="neu-card flex flex-col gap-5">
        <NeuInput
          label={t('admin.upcomingDays')}
          type="number"
          min={1}
          max={30}
          value={settings.upcomingRideDays}
          onChange={(e) => setSettings((s) => ({ ...s, upcomingRideDays: Number(e.target.value) }))}
        />
        <NeuInput
          label={t('admin.maxSeats')}
          type="number"
          min={1}
          max={10}
          value={settings.maxSeatsPerRide}
          onChange={(e) => setSettings((s) => ({ ...s, maxSeatsPerRide: Number(e.target.value) }))}
        />
        <NeuToggle
          checked={settings.maintenanceMode}
          onChange={(v) => setSettings((s) => ({ ...s, maintenanceMode: v }))}
          label="Maintenance Mode"
        />
        <NeuButton variant="accent" onClick={handleSave} disabled={saving}>
          {saving ? t('common.loading') : t('common.save')}
        </NeuButton>
      </div>
    </div>
  );
}
