/* AIMRELAX-PUBG Web Push Service Worker */

self.addEventListener('push', event => {
  let data = {};

  try {
    data = event.data ? event.data.json() : {};
  } catch (e) {
    data = {
      body: event.data ? event.data.text() : 'Նոր հաղորդագրություն'
    };
  }

  const url = data.url || 'https://aimrelax-pubg.github.io/';
  const chatId = data.chatId || null;

  const options = {
    body: data.body || 'Նոր հաղորդագրություն',
    icon: data.icon || 'https://aimrelax-pubg.github.io/icon-192.png',
    badge: data.badge || 'https://aimrelax-pubg.github.io/icon-192.png',
    tag: data.tag || (chatId
      ? 'aimrelax-chat-' + chatId
      : 'aimrelax-notification'),
    renotify: true,
    requireInteraction: false,
    silent: false,
    vibrate: [200, 100, 200],

    data: {
      url: url,
      chatId: chatId,
      type: data.type || 'notification'
    }
  };

  event.waitUntil(
    self.registration.showNotification(
      data.title || 'AIMRELAX-PUBG',
      options
    )
  );
});


/*
  NOTIFICATION CLICK

  Եթե կայքը արդեն բաց է՝
  - էջը ՉԻ navigate անում
  - էջը ՉԻ refresh անում
  - նույն էջը focus է անում
  - ուղարկում է OPEN_PRIVATE_CHAT հրամանը

  Եթե կայքը փակ է՝
  - բացում է notification-ի URL-ը
*/
self.addEventListener('notificationclick', event => {

  event.notification.close();

  const notificationData =
    event.notification &&
    event.notification.data
      ? event.notification.data
      : {};

  const url =
    notificationData.url ||
    'https://aimrelax-pubg.github.io/';

  const chatId =
    notificationData.chatId || null;


  event.waitUntil(
    (async () => {

      const windows = await clients.matchAll({
        type: 'window',
        includeUncontrolled: true
      });


      /*
        ԿԱՅՔԸ ԱՐԴԵՆ ԲԱՑ Է
      */
      for (const client of windows) {

        try {

          if (
            !client.url ||
            !client.url.startsWith(self.location.origin)
          ) {
            continue;
          }


          // Մնում ենք նույն էջում
          await client.focus();


          // Բացում ենք ճիշտ private chat-ը
          client.postMessage({
            type: 'OPEN_PRIVATE_CHAT',
            chatId: chatId
          });


          return;

        } catch (e) {
          console.error(
            'AIMRELAX notification client error:',
            e
          );
        }
      }


      /*
        ԿԱՅՔԸ ՓԱԿ Է
        Միայն այս դեպքում նոր էջ ենք բացում։
      */
      try {

        await clients.openWindow(url);

      } catch (e) {

        console.error(
          'AIMRELAX openWindow error:',
          e
        );

      }

    })()
  );

});


/*
  SERVICE WORKER INSTALL
*/
self.addEventListener('install', event => {

  event.waitUntil(
    self.skipWaiting()
  );

});


/*
  SERVICE WORKER ACTIVATE
*/
self.addEventListener('activate', event => {

  event.waitUntil(
    clients.claim()
  );

});
