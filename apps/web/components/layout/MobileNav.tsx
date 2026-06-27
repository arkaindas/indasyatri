'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useLang } from '@/context/LangContext';

export function MobileNav() {
  const pathname = usePathname();
  const { user } = useAuth();
  const { t } = useLang();

  const items = [
    { href: '/', label: t('nav.home'), icon: '🏠' },
    { href: '/search', label: t('nav.findRide'), icon: '🔍' },
    { href: '/offer', label: '+', icon: null, accent: true },
    { href: '/alerts', label: t('nav.alerts'), icon: '🔔' },
    { href: user ? '/profile' : '/search', label: t('nav.profile'), icon: '👤' },
  ];

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 flex items-center"
      style={{
        background: 'var(--bg-primary)',
        boxShadow: '0 -3px 12px rgba(0,0,0,0.1)',
        height: '64px',
      }}
    >
      {items.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex-1 flex flex-col items-center justify-center gap-0.5 min-h-[44px] transition-colors ${
              item.accent
                ? 'relative'
                : isActive
                ? 'text-[var(--accent)]'
                : 'text-[var(--text-secondary)]'
            }`}
          >
            {item.accent ? (
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center text-white text-2xl font-bold"
                style={{ background: 'var(--accent)', boxShadow: 'var(--shadow-outer)' }}
              >
                +
              </div>
            ) : (
              <>
                <span className="text-xl leading-none">{item.icon}</span>
                <span className="text-[10px] font-medium leading-none">{item.label}</span>
              </>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
