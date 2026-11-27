// @ts-check
// v7.0.1 — Student-only PWA: 7 units, 114 lessons, 14,956 items, 570 quizzes, 4 model exams, Mushaf showcase
const CACHE_NAME = 'muallim-v7.0.1-cache';
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
  './js/core/exams.js',
  './js/core/quiz.js',
  './js/core/renderer.js',
  './js/core/router.js',
  './js/core/search.js',
  './js/core/srs.js',
  './js/core/store.js',
  './js/core/sync.js',
  './js/visuals/loader.js',
  './js/visuals/visual-helper.js',
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

/**
 * Determine whether a same-origin path belongs to lazy-cached curriculum/visual assets.
 * @param {string} pathname
 * @returns {boolean}
 */
function isLazyCachedPath(pathname) {
  return (
    pathname.includes('/data/lessons/') ||
    pathname.includes('/data/unit') ||
    pathname.includes('/data/quizzes/') ||
    pathname.includes('/data/exams/') ||
    pathname.includes('/data/search-index') ||
    /\/js\/visuals\/unit\d+\.js$/i.test(pathname)
  );
}

/**
 * Determine whether a request is an app-shell HTML/JS/CSS asset for Stale-While-Revalidate.
 * @param {Request} request
 * @param {URL} reqUrl
 * @returns {boolean}
 */
function isAppShellRequest(request, reqUrl) {
  if (request.mode === 'navigate') return true;
  const p = reqUrl.pathname;
  if (p.endsWith('/') || p.endsWith('/index.html')) return true;
  if (isLazyCachedPath(p)) return false;
  return p.endsWith('.html') || p.endsWith('.js') || p.endsWith('.css');
}

/**
 * Build a clean JSON 503 error response for uncached data requests while offline.
 * @param {string} message
 * @returns {Response}
 */
function offlineJsonResponse(message) {
  return new Response(
    JSON.stringify({ error: message, offline: true }),
    {
      status: 503,
      statusText: 'Service Unavailable',
      headers: { 'Content-Type': 'application/json; charset=utf-8' }
    }
  );
}

self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  const reqUrl = new URL(e.request.url);
  // Leave cross-origin audio (everyayah.com) and CDNs network-only
  if (reqUrl.origin !== self.location.origin) return;

  const isIndexOrNav =
    e.request.mode === 'navigate' ||
    reqUrl.pathname.endsWith('/') ||
    reqUrl.pathname.endsWith('/index.html');

  // Stale-While-Revalidate for app-shell HTML / JS / CSS
  if (isAppShellRequest(e.request, reqUrl)) {
    e.respondWith((async () => {
      const cache = await caches.open(CACHE_NAME);
      const matchOpts = isIndexOrNav ? { ignoreSearch: true } : undefined;
      const cached =
        (await cache.match(e.request, matchOpts)) ||
        (isIndexOrNav ? await cache.match('./index.html', { ignoreSearch: true }) : undefined);

      const networkPromise = fetch(e.request)
        .then((resp) => {
          if (resp && resp.ok) {
            const cacheKey = isIndexOrNav ? './index.html' : e.request;
            cache.put(cacheKey, resp.clone());
          }
          return resp;
        })
        .catch(async () => {
          if (e.request.mode === 'navigate') {
            const fallback = await cache.match('./index.html', { ignoreSearch: true });
            if (fallback) return fallback;
          }
          return null;
        });

      if (cached) {
        e.waitUntil(networkPromise);
        return cached;
      }

      const netResp = await networkPromise;
      if (netResp) return netResp;

      if (e.request.mode === 'navigate') {
        const fallback = await cache.match('./index.html', { ignoreSearch: true });
        if (fallback) return fallback;
      }
      return new Response('Offline', { status: 503, statusText: 'Service Unavailable' });
    })());
    return;
  }

  // Cache-first with lazy on-demand caching + offline fallback for data, unit visuals, fonts, icons
  e.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);
    const cached = await cache.match(e.request);
    if (cached) return cached;

    try {
      const resp = await fetch(e.request);
      if (resp && resp.ok && (isLazyCachedPath(reqUrl.pathname) || reqUrl.pathname.includes('/data/'))) {
        cache.put(e.request, resp.clone());
      }
      return resp;
    } catch (_err) {
      if (e.request.mode === 'navigate') {
        const fallback = await cache.match('./index.html', { ignoreSearch: true });
        if (fallback) return fallback;
      }
      if (reqUrl.pathname.includes('/data/') || reqUrl.pathname.endsWith('.json')) {
        return offlineJsonResponse('Resource unavailable offline in cache.');
      }
      return new Response('Offline', { status: 503, statusText: 'Service Unavailable' });
    }
  })());
});
