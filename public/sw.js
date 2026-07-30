const CACHE_VERSION = 'stocklingo-v1';
const STATIC_CACHE = `static-${CACHE_VERSION}`;
const PAGES_CACHE = `pages-${CACHE_VERSION}`;

const PRECACHE_URLS = [
  '/',
  '/learn',
  '/daily',
  '/profile',
  '/review',
  '/manifest.json',
  '/icon-192.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) =>
      cache.addAll(PRECACHE_URLS.map((url) => {
        if (url !== '/' && url !== '/manifest.json' && url !== '/icon-192.png' && !url.includes('.')) {
          return url + '.html';
        }
        return url;
      }))
    )
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== STATIC_CACHE && key !== PAGES_CACHE)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

function isStaticAsset(url) {
  return /\.(js|css|png|jpg|jpeg|svg|gif|webp|woff2?|ttf|eot|ico)(\?|$)/.test(url.pathname);
}

function isHTMLPage(url) {
  return url.pathname === '/' || url.pathname.endsWith('.html') || !url.pathname.includes('.');
}

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  if (url.origin !== self.location.origin) return;
  if (event.request.method !== 'GET') return;

  if (isStaticAsset(url)) {
    // CacheFirst for static assets
    event.respondWith(
      caches.match(event.request).then((cached) => {
        if (cached) return cached;
        return fetch(event.request).then((response) => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(STATIC_CACHE).then((cache) => cache.put(event.request, clone));
          }
          return response;
        });
      })
    );
    return;
  }

  if (isHTMLPage(url)) {
    // NetworkFirst for HTML pages
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(PAGES_CACHE).then((cache) => cache.put(event.request, clone));
          }
          return response;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }
});
