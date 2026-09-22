const CACHE_NAME = 'aimrelax-pubg-v2';

const APP_FILES = [
  '/',
  '/index.html',
  '/manifest.webmanifest',
  '/icon-192.png',
  '/icon-512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(APP_FILES))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const request = event.request;

  if (
    request.method !== 'GET' ||
    request.url.includes('supabase.co') ||
    request.url.includes('/rest/') ||
    request.url.includes('/auth/')
  ) {
    return;
  }

  event.respondWith(
    fetch(request)
      .then(response => {
        if (
          response &&
          response.status === 200 &&
          response.type === 'basic'
        ) {
          const copy = response.clone();

          caches.open(CACHE_NAME).then(cache => {
            cache.put(request, copy);
          });
        }

        return response;
      })
      .catch(() => caches.match(request))
  );
});


/* =========================
   PUSH NOTIFICATION
========================= */

self.addEventListener('push', event => {
  event.waitUntil(
    (async () => {

      let data = {};

      try {
        if (event.data) {
          data = event.data.json();
        }
      } catch (e) {
        data = {
          title: 'AIMRELAX-PUBG',
          body: event.data
            ? event.data.text()
            : 'Նոր հաղորդագրություն'
        };
      }

      const title = data.title || 'AIMRELAX-PUBG';
      const body = data.body || 'Նոր հաղորդագրություն';

      await self.registration.showNotification(title, {
        body: body,
        icon: '/icon-192.png',
        badge: '/icon-192.png',
        tag: data.tag || 'aimrelax-notification',
        renotify: true,
        requireInteraction: false,

        data: {
          url: data.url || '/',
          chatId: data.chatId || null,
          type: data.type || 'notification'
        }
      });

    })()
  );
});


/* =========================
   NOTIFICATION CLICK
========================= */

self.addEventListener('notificationclick', event => {
  event.notification.close();

  const data = event.notification.data || {};
  const url = data.url || '/';

  event.waitUntil(
    clients.openWindow(url)
  );
});
