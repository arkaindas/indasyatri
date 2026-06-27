import React from 'react';

interface EmptyStateProps {
  message: string;
  action?: React.ReactNode;
  icon?: string;
}

export function EmptyState({ message, action, icon = '🚗' }: EmptyStateProps) {
  return (
    <div className="neu-card text-center py-12 flex flex-col items-center gap-4">
      <span className="text-5xl">{icon}</span>
      <p className="text-[var(--text-secondary)]">{message}</p>
      {action}
    </div>
  );
}
