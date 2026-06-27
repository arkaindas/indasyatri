import React from 'react';
import { formatDate } from '@indasyatri/shared';
import { useLang } from '@/context/LangContext';

export function DateGroupHeader({ date }: { date: string }) {
  const { lang } = useLang();
  const label = formatDate(date, lang);
  return (
    <div className="flex items-center gap-3 my-4">
      <div className="h-px flex-1 bg-[var(--text-secondary)] opacity-30" />
      <span className="text-sm font-semibold text-[var(--accent)]">{label}</span>
      <div className="h-px flex-1 bg-[var(--text-secondary)] opacity-30" />
    </div>
  );
}
