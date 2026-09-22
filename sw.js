const CACHE_NAME = 'aimrelax-pubg-v3';

const APP_FILES = [
  '/',
  '/index.html',
  '/manifest.webmanifest',
  '/icon-192.png',
  '/icon-512.png'
];

/* =========================
   INSTALL
========================= */

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(APP_FILES))
      .then(() => self.skipWaiting())
  );
});


/* =========================
   ACTIVATE
========================= */

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


/* =========================
   FETCH
========================= */

self.addEventListener('fetch', event => {

  const request = event.request;

  if (
    request.method !== 'GET' ||
    request.url.includes('supabase.co')
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
   PUSH
========================= */

self.addEventListener('push', event => {

  const receivedAt = new Date().toISOString();

  console.log(
    '[AIMRELAX PUSH RECEIVED]',
    receivedAt
  );

  event.waitUntil(

    (async () => {

      /*
       * PUSH-Ի ՍՏԱՑՄԱՆ ԺԱՄԸ ՊԱՀՈՒՄ ԵՆՔ
       * ՈՐՊԵՍԶԻ ՀԵՏՈ ՀԱՍԿԱՆԱՆՔ՝
       * PUSH-Ը ԵՐԲ Է ԻՐԱԿԱՆՈՒՄ ՀԱՍԵԼ։
       */

      try {

        const cache = await caches.open(
          'aimrelax-push-debug'
        );

        await cache.put(
          '/__aimrelax_push_debug__',

          new Response(
            JSON.stringify({
              receivedAt: receivedAt
            }),

            {
              headers: {
                'Content-Type':
                  'application/json'
              }
            }
          )
        );

      } catch (error) {

        console.error(
          'Push debug save error:',
          error
        );

      }


      /* =========================
         READ PUSH DATA
      ========================= */

      let data = {};

      try {

        if (event.data) {
          data = event.data.json();
        }

      } catch (error) {

        data = {

          title: 'AIMRELAX-PUBG',

          body: event.data
            ? event.data.text()
            : 'Նոր հաղորդագրություն'

        };

      }


      /* =========================
         NOTIFICATION DATA
      ========================= */

      const title =
        data.title || 'AIMRELAX-PUBG';

      const body =
        data.body || 'Նոր հաղորդագրություն';


      const notificationData = {

        url: data.url || '/',

        chatId:
          data.chatId || null,

        type:
          data.type || 'notification'

      };


      /* =========================
         SHOW NOTIFICATION
      ========================= */

      await self.registration.showNotification(

        title,

        {

          body: body,

          icon: '/icon-192.png',

          badge: '/icon-192.png',

          tag:
            data.tag ||
            'aimrelax-notification',

          renotify: true,

          requireInteraction: false,

          data: notificationData

        }

      );

    })()

  );

});


/* =========================
   NOTIFICATION CLICK
========================= */

self.addEventListener(
  'notificationclick',
  event => {

    event.notification.close();

    const data =
      event.notification.data || {};

    let url =
      data.url || '/';


    /* =========================
       MAKE ABSOLUTE URL
    ========================= */

    if (url.startsWith('/')) {

      url =
        self.registration.scope +
        url.substring(1);

    }


    event.waitUntil(

      (async () => {

        try {

          const clientList =
            await clients.matchAll({

              type: 'window',

              includeUncontrolled: true

            });


          /* =========================
             IF AIMRELAX IS ALREADY OPEN
          ========================= */

          for (const client of clientList) {

            if (
              client.url.startsWith(
                'https://aimrelax-pubg.github.io/'
              )
            ) {

              await client.focus();

              if ('navigate' in client) {

                await client.navigate(url);

              }

              return;

            }

          }


          /* =========================
             IF AIMRELAX IS CLOSED
          ========================= */

          if (clients.openWindow) {

            await clients.openWindow(url);

          }

        } catch (error) {

          console.error(
            'Notification click error:',
            error
          );

        }

      })()

    );

  }
);
