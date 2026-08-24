/* Muallim ul-Quran — Service Worker v2.0 */
/* Strategy: Cache-First with background network refresh (stale-while-revalidate) */

const CACHE_NAME = 'muallim-v2';
const ASSETS = [
  './',
  './index.html',
  './styles.css',
  './app.js',
  './manifest.json',
  './pwa_book_data.js',
  './icons/icon.svg',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/apple-touch-icon.png'
];

// Install — pre-cache all app shell assets
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then(c => c.addAll(ASSETS.filter(a => {
        // Skip PNG icons during install if they don't exist yet —
        // the SVG icon is sufficient for the install prompt.
        return !a.endsWith('.png');
      })))
      .then(() => self.skipWaiting())
  );
});

// Activate — purge stale caches from previous versions
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

// Fetch — Cache-First, background refresh
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  // Skip cross-origin requests (e.g. TTS, external APIs)
  if (!e.request.url.startsWith(self.location.origin)) return;

  e.respondWith(
    caches.match(e.request).then(cached => {
      const net = fetch(e.request).then(res => {
        if (res && res.ok) {
          caches.open(CACHE_NAME).then(c => c.put(e.request, res.clone()));
        }
        return res;
      }).catch(() => cached);   // offline fallback: return stale cache
      return cached || net;     // serve cache immediately if available
    })
  );
});
