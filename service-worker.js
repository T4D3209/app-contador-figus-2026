// Cambiá este número cada vez que modifiques archivos,
// para que el navegador actualice el cache automáticamente.
const CACHE_VERSION = 'v1';
const CACHE_NAME = `figuritas-2026-${CACHE_VERSION}`;

// Archivos que se guardan en cache para funcionar offline
const ARCHIVOS_CACHE = [
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

// ── Instalación: guarda los archivos en cache ──────────────────
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ARCHIVOS_CACHE);
    })
  );
  // Activa el nuevo service worker sin esperar a que se cierren las pestañas
  self.skipWaiting();
});

// ── Activación: limpia caches viejos ──────────────────────────
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

// ── Fetch: sirve desde cache, con fallback a red ───────────────
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => {
      // Si está en cache lo devuelve, si no va a la red
      return cached || fetch(event.request);
    })
  );
});
