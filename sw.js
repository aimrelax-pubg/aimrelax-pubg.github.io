/* AIMRELAX-PUBG FINAL Web Push Service Worker */

const AIMRELAX_ORIGIN = 'https://aimrelax-pubg.github.io';
const AIMRELAX_HOME = AIMRELAX_ORIGIN + '/';

self.addEventListener('install', function(event) {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', function(event) {
  event.waitUntil(self.clients.claim());
});

/*
  Ստուգում է՝ տվյալ private chat-ը բաց է արդյոք։
*/
async function isPrivateChatOpen(chatId) {
  if (!chatId) return false;

  const windows = await self.clients.matchAll({
    type: 'window',
    includeUncontrolled: true
  });

  for (const client of windows) {
    try {
      if (!client.url || !client.url.startsWith(AIMRELAX_ORIGIN)) {
        continue;
      }

      const channel = new MessageChannel();

      const result = await new Promise(function(resolve) {
        let finished = false;

        function finish(value) {
          if (finished) return;
          finished = true;
          resolve(!!value);
        }

        const timer = setTimeout(function() {
          finish(false);
        }, 1000);

        channel.port1.onmessage = function(event) {
          clearTimeout(timer);

          const activeId =
            event.data && event.data.chatId != null
              ? String(event.data.chatId)
              : null;

          finish(
            activeId !== null &&
            activeId === String(chatId)
          );
        };

        try {
          client.postMessage(
            {
              type: 'AIMRELAX_QUERY_ACTIVE_CHAT'
            },
            [channel.port2]
          );
        } catch (error) {
          clearTimeout(timer);
          finish(false);
        }
      });

      if (result) {
        return true;
      }

    } catch (error) {
      console.error(
        'AIMRELAX active chat check error:',
        error
      );
    }
  }

  return false;
}


/*
  PUSH
*/
self.addEventListener('push', function(event) {

  event.waitUntil(
    (async function() {

      let data = {};

      try {
        data = event.data
          ? event.data.json()
          : {};
      } catch (error) {
        data = {
          body: event.data
            ? event.data.text()
            : 'Նոր հաղորդագրություն'
        };
      }

      const url =
        data.url || AIMRELAX_HOME;

      const type =
        data.type || 'notification';

      const chatId =
        data.chatId != null
          ? String(data.chatId)
          : null;


      /*
        Եթե հենց այդ մարդու chat-ը բաց է,
        համակարգային notification ՉԻ ցուցադրվում։
      */
      if (
        type === 'private_chat' &&
        chatId
      ) {
        const chatIsOpen =
          await isPrivateChatOpen(chatId);

        if (chatIsOpen) {
          return;
        }
      }


      const options = {
        body:
          data.body || 'Նոր ծանուցում',

        icon:
          data.icon ||
          AIMRELAX_ORIGIN + '/icon-192.png',

        badge:
          data.badge ||
          AIMRELAX_ORIGIN + '/icon-192.png',

        tag:
          data.tag ||
          (
            chatId
              ? 'aimrelax-chat-' + chatId
              : 'aimrelax-' +
                type +
                '-' +
                Date.now()
          ),

        renotify: true,

        requireInteraction: false,

        silent: false,

        vibrate: [200, 100, 200],

        data: {
          url: url,
          chatId: chatId,
          type: type
        }
      };


      await self.registration.showNotification(
        data.title || 'AIMRELAX-PUBG',
        options
      );

    })()
  );
});


/*
  NOTIFICATION CLICK
*/
self.addEventListener(
  'notificationclick',
  function(event) {

    event.notification.close();

    const data =
      event.notification &&
      event.notification.data
        ? event.notification.data
        : {};

    const url =
      data.url || AIMRELAX_HOME;

    const type =
      data.type || 'notification';

    const chatId =
      data.chatId != null
        ? String(data.chatId)
        : null;


    event.waitUntil(
      (async function() {

        const windows =
          await self.clients.matchAll({
            type: 'window',
            includeUncontrolled: true
          });


        for (const client of windows) {

          try {

            if (
              !client.url ||
              !client.url.startsWith(
                AIMRELAX_ORIGIN
              )
            ) {
              continue;
            }


            await client.focus();


            if (
              type === 'private_chat' &&
              chatId
            ) {

              client.postMessage({
                type: 'OPEN_PRIVATE_CHAT',
                chatId: chatId
              });

            } else if (
              type === 'clan_notification' ||
              type === 'clan_application'
            ) {

              client.postMessage({
                type: 'OPEN_CLAN'
              });

            } else {

              client.postMessage({
                type: 'OPEN_NOTIFICATION',
                url: url
              });

            }

            return;

          } catch (error) {

            console.error(
              'AIMRELAX notification client error:',
              error
            );

          }

        }


        try {

          await self.clients.openWindow(url);

        } catch (error) {

          console.error(
            'AIMRELAX openWindow error:',
            error
          );

        }

      })()
    );
  }
);
