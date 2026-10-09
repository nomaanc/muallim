// @ts-check
const CACHE_NAME = 'muallim-v4.0.1-cache';
const ASSETS = [
  './', './index.html', './teacher.html', './admin.html', './css/styles.css', './css/layout.css',
  './js/app.js', './js/grammar-visuals.js', './js/audio-fx.js',
  './js/visuals/loader.js', './js/visuals/visual-helper.js',
  './js/visuals/unit1.js', './js/visuals/unit2.js', './js/visuals/unit3.js',
  './js/visuals/unit4.js', './js/visuals/unit5.js', './js/visuals/unit6.js', './js/visuals/unit7.js',
  './data/quizzes/unit1.json', './data/quizzes/unit2.json', './data/quizzes/unit3.json',
  './data/quizzes/unit4.json', './data/quizzes/unit5.json', './data/quizzes/unit6.json', './data/quizzes/unit7.json',
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
    ).then(() => {
      return self.clients.matchAll({ type: 'window' }).then(clients => {
        clients.forEach(client => client.postMessage({ type: 'SW_UPDATED' }));
      });
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request).then(resp => {
      if (resp.ok && (e.request.url.includes('/data/unit') || e.request.url.includes('/data/quizzes') || e.request.url.includes('/data/search-index'))) {
        var clone = resp.clone();
        caches.open(CACHE_NAME).then(c => c.put(e.request, clone));
      }
      return resp;
    }))
  );
});
