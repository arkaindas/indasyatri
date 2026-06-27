'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useLang } from '@/context/LangContext';
import { LoginButton } from '@/components/auth/LoginButton';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { LangToggle } from '@/components/ui/LangToggle';

export function Header() {
  const { user } = useAuth();
  const { t } = useLang();

  return (
    <header
      className="sticky top-0 z-40 px-4 py-3"
      style={{
        background: 'var(--bg-primary)',
        boxShadow: '0 3px 12px rgba(0,0,0,0.1)',
      }}
    >
      <div className="max-w-5xl mx-auto flex items-center justify-between gap-3">
        {/* Logo */}
        <Link href="/" className="flex flex-col leading-tight">
          <span className="font-semibold text-lg">
            Indas<span className="text-[var(--accent)]">Yatri</span>
          </span>
          <span className="text-xs text-[var(--text-secondary)] font-light">ইন্দাসযাত্রী</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          <NavLink href="/">{t('nav.home')}</NavLink>
          <NavLink href="/search">{t('nav.findRide')}</NavLink>
          <NavLink href="/offer">{t('nav.offerRide')}</NavLink>
          {user && (
            <>
              <NavLink href="/my-rides">{t('nav.myRides')}</NavLink>
              <NavLink href="/alerts">{t('nav.alerts')}</NavLink>
            </>
          )}
          {user?.role === 'admin' && (
            <NavLink href="/admin">{t('nav.admin')}</NavLink>
          )}
        </nav>

        {/* Right controls */}
        <div className="flex items-center gap-2">
          <LangToggle />
          <ThemeToggle />
          <LoginButton />
        </div>
      </div>
    </header>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="px-3 py-2 rounded-[12px] text-sm font-medium text-[var(--text-primary)] hover:text-[var(--accent)] transition-colors"
    >
      {children}
    </Link>
  );
}
