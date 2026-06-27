import React from 'react';

interface NeuCardProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md';
}

export function NeuCard({ children, className = '', size = 'md', ...props }: NeuCardProps) {
  const cls = size === 'sm' ? 'neu-card-sm' : 'neu-card';
  return (
    <div className={`${cls} ${className}`} {...props}>
      {children}
    </div>
  );
}
