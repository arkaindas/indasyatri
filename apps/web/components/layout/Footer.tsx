import React from 'react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="mt-16 pb-24 md:pb-8 px-4 text-center text-sm text-[var(--text-secondary)]">
      <div
        className="max-w-5xl mx-auto py-6"
        style={{ borderTop: '1px solid rgba(0,0,0,0.1)' }}
      >
        <div className="flex flex-wrap justify-center gap-4 mb-3">
          <Link href="/suggest-route" className="hover:text-[var(--accent)] transition-colors">
            Suggest a Route
          </Link>
          <span>·</span>
          <Link href="/search" className="hover:text-[var(--accent)] transition-colors">
            Find a Ride
          </Link>
          <span>·</span>
          <Link href="/offer" className="hover:text-[var(--accent)] transition-colors">
            Offer a Ride
          </Link>
        </div>
        <p className="text-xs opacity-70">
          © 2026 IndasYatri — Made for Bengal&apos;s small towns
        </p>
      </div>
    </footer>
  );
}
