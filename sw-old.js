self.addEventListener('push', event => {
  let data = {};

  try {
    data = event.data ? event.data.json() : {};
  } catch (e) {
    data = {};
  }

  const url = data.url || 'https://aimrelax-pubg.github.io/';
  
  let chatId = null;

  try {
    const parsed = new URL(url);
    chatId = parsed.searchParams.get('chat');
  } catch (e) {}

  event.waitUntil(
    self.registration.showNotification(
      data.title || 'AIMRELAX-PUBG',
      {
        body: data.body || 'Նոր հաղորդագրություն',
        icon: '/icon-192.png',
        badge: '/icon-192.png',

        data: {
          url: url,
          chatId: chatId
        },

        tag: data.tag || 'aimrelax-chat',
        requireInteraction: true
      }
    )
  );
});


self.addEventListener('notificationclick', event => {
  event.notification.close();

  const notificationData = event.notification?.data || {};
  const url =
    notificationData.url ||
    'https://aimrelax-pubg.github.io/';

  const chatId = notificationData.chatId || null;

  event.waitUntil(
    (async () => {

      const windows = await clients.matchAll({
        type: 'window',
        includeUncontrolled: true
      });

      /*
       * Եթե կայքը արդեն բաց է,
       * էջը ՉԵՆՔ տեղափոխում գլխավոր էջ։
       * Ուղղակի հաղորդագրություն ենք ուղարկում
       * արդեն բացված էջին։
       */
      if (windows.length > 0) {

        for (const client of windows) {
          try {
            await client.focus();

            client.postMessage({
              type: 'OPEN_PRIVATE_CHAT',
              chatId: chatId
            });

            return;

          } catch (e) {}
        }
      }

      /*
       * Եթե կայքը ընդհանրապես բաց չէ,
       * բացում ենք notification-ի URL-ը։
       *
       * HTML-ը ?chat=... տեսնելով պետք է
       * անմիջապես բացի համապատասխան չատը։
       */
      try {
        await clients.openWindow(url);
      } catch (e) {}

    })()
  );
});


self.addEventListener('install', event => {
  event.waitUntil(
    self.skipWaiting()
  );
});


self.addEventListener('activate', event => {
  event.waitUntil(
    clients.claim()
  );
});
