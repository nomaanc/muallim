// @ts-check
// v6.0.2 — Student-only PWA: 7 units, 114 lessons, 14,956 items, 570 quiz questions
const CACHE_NAME = 'muallim-v6.0.2-cache';
const ASSETS = [
  './',
  './index.html',
  './css/styles.css',
  './css/layout.css',
  './fonts/amiri-quran.woff2',
  './fonts/noto-sans.woff2',
  './js/app.js',
  './js/audio-fx.js',
  './js/core/audio.js',
  './js/core/quiz.js',
  './js/core/renderer.js',
  './js/core/router.js',
  './js/core/search.js',
  './js/core/srs.js',
  './js/core/store.js',
  './js/core/sync.js',
  './js/visuals/archetypes.js',
  './js/visuals/loader.js',
  './js/visuals/visual-helper.js',
  './js/visuals/unit1.js',
  './js/visuals/unit2.js',
  './js/visuals/unit3.js',
  './js/visuals/unit4.js',
  './js/visuals/unit5.js',
  './js/visuals/unit6.js',
  './js/visuals/unit7.js',
  './data/quizzes/unit1.json',
  './data/quizzes/unit2.json',
  './data/quizzes/unit3.json',
  './data/quizzes/unit4.json',
  './data/quizzes/unit5.json',
  './data/quizzes/unit6.json',
  './data/quizzes/unit7.json',
  './data/metadata.json',
  './manifest.json',
  './icons/icon.svg',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/apple-touch-icon.png'
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE_NAME).then((c) => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('message', (e) => {
  if (e.data && e.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  const reqUrl = new URL(e.request.url);
  // Leave cross-origin audio (everyayah.com) and CDNs strictly network-only
  if (reqUrl.origin !== self.location.origin) return;

  e.respondWith(
    caches.match(e.request).then((cached) => {
      if (cached) return cached;
      return fetch(e.request).then((resp) => {
        if (
          resp.ok &&
          (reqUrl.pathname.includes('/data/unit') ||
            reqUrl.pathname.includes('/data/quizzes') ||
            reqUrl.pathname.includes('/data/search-index'))
        ) {
          const clone = resp.clone();
          caches.open(CACHE_NAME).then((c) => c.put(e.request, clone));
        }
        return resp;
      });
    })
  );
});
