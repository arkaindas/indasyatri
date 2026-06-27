import React from 'react';

interface NeuButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'accent' | 'whatsapp' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

export function NeuButton({
  children,
  className = '',
  variant = 'default',
  size = 'md',
  ...props
}: NeuButtonProps) {
  const variantCls = {
    default: 'neu-btn',
    accent: 'neu-btn neu-btn-accent',
    whatsapp: 'neu-btn !bg-[#25D366] !text-white hover:!bg-[#1eb858]',
    danger: 'neu-btn !bg-[var(--danger)] !text-white',
  }[variant];

  const sizeCls = {
    sm: '!py-2 !px-3 !text-sm',
    md: '',
    lg: '!py-3 !px-6 !text-base',
  }[size];

  return (
    <button className={`${variantCls} ${sizeCls} ${className}`} {...props}>
      {children}
    </button>
  );
}
