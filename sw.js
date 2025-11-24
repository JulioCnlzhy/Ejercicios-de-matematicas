// Service Worker para notificaciones push
const CACHE_NAME = 'math-app-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/style.css',
  '/script.js',
  '/icon-192x192.png',
  '/badge-72x72.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Devuelve el recurso en cache o haz la petición normal
        return response || fetch(event.request);
      }
    )
  );
});

self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : {};
  const options = {
    body: data.body || '¡Nueva notificación de Matemáticas!',
    icon: data.icon || '/icon-192x192.png',
    badge: '/badge-72x72.png',
    tag: 'math-push',
    requireInteraction: true,
    actions: data.actions || [
      {
        action: 'practice',
        title: '📝 Practicar'
      },
      {
        action: 'dismiss',
        title: '❌ Cerrar'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification(
      data.title || 'Matemáticas App',
      options
    )
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'practice') {
    event.waitUntil(
      clients.matchAll({ type: 'window' })
        .then((clientList) => {
          for (const client of clientList) {
            if (client.url.includes('/') && 'focus' in client) {
              return client.focus();
            }
          }
          if (clients.openWindow) {
            return clients.openWindow('/');
          }
        })
    );
  }
});