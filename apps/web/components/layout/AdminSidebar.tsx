'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLang } from '@/context/LangContext';

const adminLinks = [
  { href: '/admin', label: 'admin.dashboard', icon: '📊' },
  { href: '/admin/routes', label: 'admin.routes', icon: '🗺️' },
  { href: '/admin/rides', label: 'admin.rides', icon: '🚗' },
  { href: '/admin/users', label: 'admin.users', icon: '👥' },
  { href: '/admin/settings', label: 'admin.settings', icon: '⚙️' },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { t } = useLang();

  return (
    <aside className="w-56 shrink-0">
      <nav className="neu-card !p-3 flex flex-col gap-1">
        {adminLinks.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-[12px] text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-[var(--accent)] text-white'
                  : 'text-[var(--text-primary)] hover:text-[var(--accent)]'
              }`}
            >
              <span>{link.icon}</span>
              {t(link.label)}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
