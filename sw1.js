const CACHE_VERSION = 'v2'; // bump this on every future deploy
const CACHE_NAME = `resumepro-cache-${CACHE_VERSION}`;

const urlsToCache = [
  './',
  './index.html',
  './style.css',
  './app.js',
  './manifest.json',
  './favicon_circle.png'
];

// Install: pre-cache core files, activate the new SW immediately
self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

// Activate: remove old cache versions, take control of already-open tabs right away
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames =>
      Promise.all(
        cacheNames
          .filter(name => name !== CACHE_NAME)
          .map(name => caches.delete(name))
      )
    ).then(() => self.clients.claim())
  );
});

// Fetch: network-first for same-origin GET requests, fall back to cache when offline
self.addEventListener('fetch', event => {
  const { request } = event;

  // Skip non-GET and cross-origin requests (AdSense, CDN libraries, etc.)
  // — let the browser handle those normally, don't intercept them
  if (request.method !== 'GET' || new URL(request.url).origin !== self.location.origin) {
    return;
  }

  event.respondWith(
    fetch(request)
      .then(networkResponse => {
        const responseClone = networkResponse.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(request, responseClone));
        return networkResponse;
      })
      .catch(() => caches.match(request))
  );
});