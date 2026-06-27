'use client';

import React from 'react';

interface NeuToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
}

export function NeuToggle({ checked, onChange, label }: NeuToggleProps) {
  return (
    <label className="flex items-center gap-3 cursor-pointer select-none">
      {label && <span className="text-sm text-[var(--text-secondary)]">{label}</span>}
      <div
        onClick={() => onChange(!checked)}
        className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${
          checked ? 'bg-[var(--accent)]' : 'bg-[var(--text-secondary)]'
        }`}
        style={{ boxShadow: 'inset 2px 2px 5px rgba(0,0,0,0.2)' }}
      >
        <div
          className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${
            checked ? 'translate-x-7' : 'translate-x-1'
          }`}
        />
      </div>
    </label>
  );
}
