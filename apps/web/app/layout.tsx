import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/context/ThemeContext';
import { LangProvider } from '@/context/LangContext';
import { AuthProvider } from '@/context/AuthContext';
import { ToastProvider } from '@/components/common/Toast';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { MobileNav } from '@/components/layout/MobileNav';

export const metadata: Metadata = {
  title: 'IndasYatri — ইন্দাসযাত্রী',
  description: 'Share rides, save money, travel together. Hyperlocal cab sharing for West Bengal.',
  openGraph: {
    title: 'IndasYatri',
    description: 'Share rides, save money, travel together.',
    url: 'https://indasyatri.vercel.app',
    siteName: 'IndasYatri',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <ThemeProvider>
          <LangProvider>
            <AuthProvider>
              <ToastProvider>
                <Header />
                <main className="max-w-5xl mx-auto px-4 pt-6 pb-4 min-h-screen">
                  {children}
                </main>
                <Footer />
                <MobileNav />
              </ToastProvider>
            </AuthProvider>
          </LangProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
