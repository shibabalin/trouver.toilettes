// Service Worker minimal — requis pour l'installation PWA sur Android
const CACHE = 'fontaines-v1';

// Fichiers à mettre en cache pour un accès hors-ligne de base
const ASSETS = [
  '/trouver.toilettes/',
  '/trouver.toilettes/index.html',
  '/trouver.toilettes/manifest.json'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// Stratégie : network-first, fallback cache
self.addEventListener('fetch', e => {
  // Ne pas intercepter les requêtes Overpass/Nominatim (toujours réseau)
  if (e.request.url.includes('overpass') || e.request.url.includes('nominatim') || e.request.url.includes('openstreetmap')) {
    return;
  }
  e.respondWith(
    fetch(e.request).catch(() => caches.match(e.request))
  );
});
