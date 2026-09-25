/* AIMRELAX-PUBG FINAL Web Push Service Worker */

const AIMRELAX_ORIGIN = 'https://aimrelax-pubg.github.io';
const AIMRELAX_HOME = `${AIMRELAX_ORIGIN}/`;

let activeChatId = null;

self.addEventListener('message', event => {
  const data = event.data || {};

  if (data.type === 'AIMRELAX_ACTIVE_CHAT') {
    activeChatId = data.chatId ? String(data.chatId) : null;
  }
});

self.addEventListener('push', event => {
  let data = {};

  try {
    data = event.data ? event.data.json() : {};
  } catch (e) {
    data = {
      body: event.data
        ? event.data.text()
        : 'Նոր հաղորդագրություն'
    };
  }

  const url = data.url || AIMRELAX_HOME;
  const type = data.type || 'notification';
  const chatId = data.chatId ? String(data.chatId) : null;

  // Եթե հենց այդ չատը արդեն բաց է՝ notification չցուցադրել
  if (
    type === 'private_chat' &&
    chatId &&
    activeChatId === chatId
  ) {
    return;
  }

  const options = {
    body: data.body || 'Նոր ծանուցում',

    icon:
      data.icon ||
      `${AIMRELAX_ORIGIN}/icon-192.png`,

    badge:
      data.badge ||
      `${AIMRELAX_ORIGIN}/icon-192.png`,

    tag:
      data.tag ||
      (
        chatId
          ? `aimrelax-chat-${chatId}`
          : `aimrelax-${type}-${Date.now()}`
      ),

    renotify: true,
    requireInteraction: false,
    silent: false,

    vibrate: [200, 100, 200],

    data: {
      url,
      chatId,
      type
    }
  };

  event.waitUntil(
    self.registration.showNotification(
      data.title || 'AIMRELAX-PUBG',
      options
    )
  );
});

self.addEventListener('notificationclick', event => {
  event.notification.close();

  const data =
    event.notification?.data || {};

  const url =
    data.url || AIMRELAX_HOME;

  const type =
    data.type || 'notification';

  const chatId =
    data.chatId
      ? String(data.chatId)
      : null;

  event.waitUntil(
    (async () => {

      const windows =
        await clients.matchAll({
          type: 'window',
          includeUncontrolled: true
        });

      for (const client of windows) {

        try {

          if (
            !client.url ||
            !client.url.startsWith(AIMRELAX_ORIGIN)
          ) {
            continue;
          }

          await client.focus();

          // Private chat
          if (
            type === 'private_chat' &&
            chatId
          ) {

            client.postMessage({
              type: 'OPEN_PRIVATE_CHAT',
              chatId: chatId
            });

          }

          // Clan notification
          else if (
            type === 'clan_notification' ||
            type === 'clan_application'
          ) {

            client.postMessage({
              type: 'OPEN_CLAN'
            });

          }

          // Other notification
          else {

            client.postMessage({
              type: 'OPEN_NOTIFICATION',
              url: url
            });

          }

          return;

        } catch (e) {

          console.error(
            'AIMRELAX notification client error:',
            e
          );

        }
      }

      // Եթե կայքը բաց չէ
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

self.addEventListener(
  'install',
  event => {
    event.waitUntil(
      self.skipWaiting()
    );
  }
);

self.addEventListener(
  'activate',
  event => {
    event.waitUntil(
      clients.claim()
    );
  }
);
