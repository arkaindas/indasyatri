'use client';

import React, { useState } from 'react';
import { NeuSelect } from '@/components/ui/NeuSelect';
import { NeuButton } from '@/components/ui/NeuButton';
import { useLang } from '@/context/LangContext';
import { useAuth } from '@/context/AuthContext';
import { useApprovedRoutes } from '@/hooks/useRoutes';
import { useToast } from '@/components/common/Toast';
import { createAlert, requestNotificationPermission } from '@indasyatri/shared';
import { todayString } from '@indasyatri/shared';

export function AlertSubscribeForm({ onCreated }: { onCreated?: () => void }) {
  const { t } = useLang();
  const { user } = useAuth();
  const { routes } = useApprovedRoutes();
  const { showToast } = useToast();

  const [routeId, setRouteId] = useState('');
  const [date, setDate] = useState('any');
  const [submitting, setSubmitting] = useState(false);

  const routeOptions = routes.map((r) => ({ value: r.id, label: `${r.from} → ${r.to}` }));
  const selectedRoute = routes.find((r) => r.id === routeId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !selectedRoute) return;

    setSubmitting(true);
    try {
      const fcmToken = await requestNotificationPermission() ?? '';
      await createAlert({
        userUid: user.uid,
        userName: user.name,
        routeId,
        routeFrom: selectedRoute.from,
        routeTo: selectedRoute.to,
        targetDate: date,
        isActive: true,
        fcmToken,
      });
      showToast(t('alert.notify'), 'success');
      setRouteId(''); setDate('any');
      onCreated?.();
    } catch {
      showToast(t('common.error'), 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="neu-card flex flex-col gap-4">
      <h3 className="font-semibold">{t('alert.create')}</h3>
      <NeuSelect
        label={t('nav.findRide')}
        options={routeOptions}
        placeholder={t('form.selectRoute')}
        value={routeId}
        onChange={(e) => setRouteId(e.target.value)}
      />
      <div>
        <label className="text-sm font-semibold text-[var(--text-secondary)] block mb-1.5">
          {t('form.selectDate')}
        </label>
        <input
          type="date"
          className="neu-input"
          value={date === 'any' ? '' : date}
          min={todayString()}
          placeholder="Any date"
          onChange={(e) => setDate(e.target.value || 'any')}
        />
        <p className="text-xs text-[var(--text-secondary)] mt-1">{t('alert.anyDate')}</p>
      </div>
      <NeuButton type="submit" variant="accent" disabled={submitting || !routeId}>
        🔔 {submitting ? t('common.loading') : t('alert.create')}
      </NeuButton>
    </form>
  );
}
