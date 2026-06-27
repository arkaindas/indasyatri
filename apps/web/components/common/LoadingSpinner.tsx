import React from 'react';
import { useLang } from '@/context/LangContext';

export function LoadingSpinner({ fullPage = false }: { fullPage?: boolean }) {
  const { t } = useLang();
  const content = (
    <div className="flex flex-col items-center gap-3">
      <div className="w-10 h-10 border-4 border-[var(--accent-light)] border-t-[var(--accent)] rounded-full animate-spin" />
      <span className="text-sm text-[var(--text-secondary)]">{t('common.loading')}</span>
    </div>
  );

  if (fullPage) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)]">
        {content}
      </div>
    );
  }
  return <div className="py-12 flex justify-center">{content}</div>;
}
