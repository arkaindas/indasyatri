import React from 'react';

type BadgeVariant = 'default' | 'success' | 'danger' | 'muted';

interface NeuBadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

export function NeuBadge({ children, variant = 'default', className = '' }: NeuBadgeProps) {
  const cls = {
    default: 'neu-badge',
    success: 'neu-badge neu-badge-success',
    danger: 'neu-badge neu-badge-danger',
    muted: 'neu-badge neu-badge-muted',
  }[variant];

  return <span className={`${cls} ${className}`}>{children}</span>;
}
