'use client';

import React from 'react';
import type { RideAlert } from '@indasyatri/shared';
import { deleteAlert } from '@indasyatri/shared';
import { NeuButton } from '@/components/ui/NeuButton';
import { useLang } from '@/context/LangContext';
import { useToast } from '@/components/common/Toast';

interface AlertListProps {
  alerts: RideAlert[];
  onDeleted: (id: string) => void;
}

export function AlertList({ alerts, onDeleted }: AlertListProps) {
  const { t } = useLang();
  const { showToast } = useToast();

  const handleDelete = async (alertId: string) => {
    try {
      await deleteAlert(alertId);
      onDeleted(alertId);
      showToast('Alert removed.', 'info');
    } catch {
      showToast(t('common.error'), 'error');
    }
  };

  if (alerts.length === 0) {
    return <p className="text-[var(--text-secondary)] text-center py-6">{t('alert.noAlerts')}</p>;
  }

  return (
    <div className="flex flex-col gap-3">
      {alerts.map((alert) => (
        <div key={alert.id} className="neu-card flex items-center justify-between gap-4">
          <div>
            <div className="font-semibold text-sm">{alert.routeFrom} → {alert.routeTo}</div>
            <div className="text-xs text-[var(--text-secondary)]">
              {alert.targetDate === 'any' ? t('alert.anyDate') : alert.targetDate}
            </div>
          </div>
          <NeuButton variant="danger" size="sm" onClick={() => handleDelete(alert.id)}>
            🗑 {t('alert.delete')}
          </NeuButton>
        </div>
      ))}
    </div>
  );
}
