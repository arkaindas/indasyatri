// Minimal service worker — satisfies PWA installability criteria.
// Firebase messaging SW (firebase-messaging-sw.js) handles FCM separately.
const CACHE = 'iy-v1';

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE));
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(self.clients.claim());
});

// Network-first: serve from network, fall back to cache for navigation.
self.addEventListener('fetch', (e) => {
  if (e.request.mode === 'navigate') {
    e.respondWith(
      fetch(e.request).catch(() => caches.match('/'))
    );
  }
});
