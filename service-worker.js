const CACHE_NAME = 'mafia-bunker-cache-v2';
const urlsToCache = [
  './',
  './index.html',
  './style.css',
  './background.jpg',
  './bunker.png',
  './mafia.png',
  './bunker.html',
  './mafia.html',
  './images/bunker-background.jpg',
  './images/mafia-background.jpg',
  './data/bunker-settings.json',
  './data/disasters.json',
  './data/fields.json',
  './data/roles.json',
  './data/supplies.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache)));
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => response || fetch(event.request).then((networkResponse) => {
      const responseClone = networkResponse.clone();
      caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseClone));
      return networkResponse;
    }).catch(() => response))
  );
});
