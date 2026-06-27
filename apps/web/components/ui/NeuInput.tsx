import React from 'react';

interface NeuInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function NeuInput({ label, error, className = '', id, ...props }: NeuInputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-sm font-semibold text-[var(--text-secondary)]">
          {label}
        </label>
      )}
      <input id={id} className={`neu-input ${className}`} {...props} />
      {error && <p className="text-xs text-[var(--danger)]">{error}</p>}
    </div>
  );
}
