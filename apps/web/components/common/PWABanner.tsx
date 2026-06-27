'use client';
import { useEffect, useState } from 'react';

export default function PWABanner() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [show, setShow] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(display-mode: standalone)').matches) return;

    const ios = /iPhone|iPad|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOS(ios);

    if (ios) {
      setTimeout(() => setShow(true), 5000);
      return;
    }

    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setTimeout(() => setShow(true), 5000);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') setShow(false);
      setDeferredPrompt(null);
    }
  };

  const handleDismiss = () => setShow(false);

  if (!show) return null;

  return (
    <div style={{
      position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 9999,
      background: 'var(--bg-primary, #e8e0d4)',
      boxShadow: '-4px -4px 10px #ffffff, 4px -4px 10px #c4bdb2',
      padding: '16px 20px',
      display: 'flex', alignItems: 'center', gap: '12px',
      borderTopLeftRadius: '20px', borderTopRightRadius: '20px',
    }}>
      <div style={{
        width: 44, height: 44, borderRadius: 12, flexShrink: 0,
        background: '#d4781c', display: 'flex', alignItems: 'center',
        justifyContent: 'center', fontSize: 22,
      }}>🚗</div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ margin: 0, fontWeight: 600, fontSize: 14, color: 'var(--text-primary, #3d3428)' }}>
          Install IndasYatri
        </p>
        <p style={{ margin: 0, fontSize: 12, color: 'var(--text-secondary, #7a6e5d)', marginTop: 2 }}>
          {isIOS ? 'Tap Share → Add to Home Screen' : 'Install for faster access & offline use'}
        </p>
      </div>

      {!isIOS && (
        <button onClick={handleInstall} style={{
          background: '#d4781c', color: '#fff', border: 'none',
          borderRadius: 10, padding: '8px 14px', fontWeight: 600,
          fontSize: 13, cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0,
        }}>Install</button>
      )}

      <button onClick={handleDismiss} style={{
        background: 'transparent', border: 'none', fontSize: 18,
        cursor: 'pointer', color: 'var(--text-secondary, #7a6e5d)',
        padding: '4px', lineHeight: 1, flexShrink: 0,
      }}>✕</button>
    </div>
  );
}
