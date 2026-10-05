const CACHE_NAME = 'muallim-v2.8.0-cache';
const ASSETS = [
  './', './index.html', './teacher.html', './admin.html', './css/styles.css',
  './js/app.js', './js/grammar-visuals.js',
  './data/metadata.json', './manifest.json',
  './icons/icon.svg', './icons/icon-192.png', './icons/icon-512.png', './icons/apple-touch-icon.png'
];
// Unit JSON files and search index cached on first fetch, not pre-cached

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request).then(resp => {
      if (resp.ok && (e.request.url.includes('/data/unit') || e.request.url.includes('/data/search-index'))) {
        var clone = resp.clone();
        caches.open(CACHE_NAME).then(c => c.put(e.request, clone));
      }
      return resp;
    }))
  );
});
