/* SOUPS 2026 Hannover Guide — offline service worker.
   Cache-first for the app shell, network-first (with cache fallback) for map tiles. */
const VERSION = 'soups26-guide-v24';
const SHELL = [
  './',
  './index.html',
  './support.js',
  './image-slot.js',
  './map.html',
  './manifest.webmanifest',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './images/welfenschloss.webp',
  './images/leine-eis.webp',
  './images/sponsor-hannoverimpuls.webp',
  './images/sponsor-cispa.webp',
  './images/wifi-uhevent.svg',
  './_ds/broadsheet-f75e36a9-287e-4ae1-8947-5158a447224a/styles.css',
  './_ds/broadsheet-f75e36a9-287e-4ae1-8947-5158a447224a/_ds_bundle.js'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(VERSION)
      .then((c) => Promise.allSettled(SHELL.map((u) => c.add(new Request(u, { cache: 'reload' })))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  const isTile = /tile\.openstreetmap\.org|unpkg\.com|fonts\.(googleapis|gstatic)\.com/.test(url.host);

  e.respondWith((async () => {
    const cache = await caches.open(VERSION);
    const hit = await cache.match(req, { ignoreSearch: false });
    if (hit && !isTile) return hit;
    try {
      const res = await fetch(req);
      if (res && (res.ok || res.type === 'opaque')) cache.put(req, res.clone()).catch(() => {});
      return res;
    } catch (err) {
      if (hit) return hit;
      const shell = await cache.match('./SOUPS26-Guide.dc.html');
      if (req.mode === 'navigate' && shell) return shell;
      return new Response('Offline', { status: 503, statusText: 'Offline' });
    }
  })());
});
