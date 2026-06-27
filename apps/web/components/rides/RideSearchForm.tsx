'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { NeuSelect } from '@/components/ui/NeuSelect';
import { NeuButton } from '@/components/ui/NeuButton';
import { useLang } from '@/context/LangContext';
import { useApprovedRoutes } from '@/hooks/useRoutes';
import { todayString } from '@indasyatri/shared';

interface Props {
  defaultFrom?: string;
  defaultTo?: string;
  defaultDate?: string;
  onSearch?: (from: string, to: string, date: string) => void;
}

export function RideSearchForm({ defaultFrom = '', defaultTo = '', defaultDate = '', onSearch }: Props) {
  const { t } = useLang();
  const router = useRouter();
  const { routes } = useApprovedRoutes();

  const [from, setFrom] = useState(defaultFrom);
  const [to, setTo] = useState(defaultTo);
  const [date, setDate] = useState(defaultDate || todayString());

  useEffect(() => {
    if (defaultFrom) setFrom(defaultFrom);
    if (defaultTo) setTo(defaultTo);
    if (defaultDate) setDate(defaultDate);
  }, [defaultFrom, defaultTo, defaultDate]);

  const fromOptions = Array.from(new Set(routes.map((r) => r.from))).map((v) => ({
    value: v,
    label: v,
  }));

  const toOptions = routes
    .filter((r) => !from || r.from === from)
    .map((r) => ({ value: r.to, label: r.to }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!from || !to || !date) return;
    if (onSearch) {
      onSearch(from, to, date);
    } else {
      router.push(`/search?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}&date=${date}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="neu-card flex flex-col gap-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <NeuSelect
          label={t('form.from')}
          options={fromOptions}
          placeholder={t('form.selectRoute')}
          value={from}
          onChange={(e) => { setFrom(e.target.value); setTo(''); }}
        />
        <NeuSelect
          label={t('form.to')}
          options={toOptions}
          placeholder={t('form.selectRoute')}
          value={to}
          onChange={(e) => setTo(e.target.value)}
          disabled={!from}
        />
      </div>
      <div>
        <label className="text-sm font-semibold text-[var(--text-secondary)] block mb-1.5">
          {t('form.selectDate')}
        </label>
        <input
          type="date"
          value={date}
          min={todayString()}
          onChange={(e) => setDate(e.target.value)}
          className="neu-input"
        />
      </div>
      <NeuButton type="submit" variant="accent" disabled={!from || !to || !date}>
        🔍 {t('form.search')}
      </NeuButton>
    </form>
  );
}
