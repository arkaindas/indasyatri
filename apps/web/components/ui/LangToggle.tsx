'use client';

import React from 'react';
import { useLang } from '@/context/LangContext';

export function LangToggle() {
  const { lang, setLang } = useLang();

  return (
    <button
      onClick={() => setLang(lang === 'en' ? 'bn' : 'en')}
      className="neu-btn !py-1.5 !px-3 text-sm font-semibold"
      aria-label="Toggle language"
    >
      {lang === 'en' ? 'বাং' : 'EN'}
    </button>
  );
}
