const CACHE_NAME = 'muallim-v2.0.0-cache';
const ASSETS = [
  './', './index.html', './css/styles.css',
  './js/app.js',
  './data/metadata.json', './manifest.json', './icons/icon.svg'
];
// Unit JSON files cached on first fetch, not pre-cached

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
      if (resp.ok && e.request.url.includes('/data/unit')) {
        var clone = resp.clone();
        caches.open(CACHE_NAME).then(c => c.put(e.request, clone));
      }
      return resp;
    }))
  );
});
