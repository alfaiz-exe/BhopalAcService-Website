const CACHE_NAME = 'bac-static-v1';
const CORE_ASSETS = [
  '/',
  '/index.html',
  '/style.css',
  '/script.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
    ))
  );
  self.clients.claim();
});

// Basic runtime caching strategy
self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // Only handle HTTP(S) requests and skip local development hosts.
  if (!url.protocol.startsWith('http') || ['localhost', '127.0.0.1'].includes(url.hostname)) {
    return;
  }

  // Always try cache first for navigation and images
  if (req.mode === 'navigate' || req.destination === 'image') {
    event.respondWith(
      caches.match(req).then(cached => cached || fetch(req).then(res => {
        const copy = res.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(req, copy));
        return res;
      })).catch(() => caches.match('/index.html'))
    );
    return;
  }

  // For styles and scripts, use network-first with fallback to cache
  if (req.destination === 'style' || req.destination === 'script') {
    event.respondWith(
      fetch(req).then(res => {
        const copy = res.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(req, copy));
        return res;
      }).catch(() => caches.match(req))
    );
    return;
  }

  // Default: try cache then network
  event.respondWith(caches.match(req).then(cached => cached || fetch(req)));
});
