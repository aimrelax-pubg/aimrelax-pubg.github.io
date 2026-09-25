/* AIMRELAX-PUBG FINAL Web Push Service Worker */

const AIMRELAX_ORIGIN = 'https://aimrelax-pubg.github.io';
const AIMRELAX_HOME = `${AIMRELAX_ORIGIN}/`;

self.addEventListener('install', event => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
});

// Ստուգում է՝ տվյալ չատը իրականում բաց է կայքում, թե ոչ
async function isPrivateChatOpen(chatId) {
  if (!chatId) return false;

  const windows = await self.clients.matchAll({
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

      const channel = new MessageChannel();

      const result = await new Promise(resolve => {
        let finished = false;

        const finish = value => {
          if (finished) return;

          finished = true;
          resolve(!!value);
        };

        const timer = setTimeout(() => {
          finish(false);
        }, 700);

        channel.port1.onmessage = event => {
          clearTimeout(timer);

          const id = event.data?.chatId;

          finish(
            id != null &&
            String(id) === String(chatId)
          );
        };

        try {
          client.postMessage(
            {
              type: 'AIMRELAX_QUERY_ACTIVE_CHAT'
            },
            [channel.port2]
          );
        } catch (e) {
          clearTimeout(timer);
          finish(false);
        }
      });

      if (result) {
        return true;
      }

    } catch (e) {
      console.error(
        'AIMRELAX active chat check error:',
        e
      );
    }
  }

  return false;
}


// PUSH
self.addEventListener('push', event => {

  event.waitUntil(
    (async () => {

      let data = {};

      try {

        data = event.data
          ? event.data.json()
          : {};

      } catch (e) {

        data = {
          body: event.data
            ? event.data.text()
            : 'Նոր հաղորդագրություն'
        };

      }


      const url =
        data.url ||
        AIMRELAX_HOME;

      const type =
        data.type ||
        'notification';

      const chatId =
        data.chatId
          ? String(data.chatId)
          : null;


      /*
       * Եթե հենց այդ չատը բաց է,
       * համակարգային notification ՉԵՆՔ ցույց տալիս։
       */
      if (
        type === 'private_chat' &&
        chatId
      ) {

        const open =
          await isPrivateChatOpen(chatId);

        if (open) {
          return;
        }
      }


      const options = {

        body:
          data.body ||
          'Նոր ծանուցում',

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

        vibrate: [
          200,
          100,
          200
        ],

        data: {

          url,

          chatId,

          type

        }

      };


      await self.registration.showNotification(

        data.title ||
        'AIMRELAX-PUBG',

        options

      );

    })()
  );

});


// NOTIFICATION CLICK
self.addEventListener(
  'notificationclick',
  event => {

    event.notification.close();


    const data =
      event.notification?.data ||
      {};


    const url =
      data.url ||
      AIMRELAX_HOME;

    const type =
      data.type ||
      'notification';

    const chatId =
      data.chatId
        ? String(data.chatId)
        : null;


    event.waitUntil(

      (async () => {

        const windows =
          await self.clients.matchAll({

            type: 'window',

            includeUncontrolled: true

          });


        // Եթե կայքը արդեն բաց է
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


            // Private Chat
            if (
              type === 'private_chat' &&
              chatId
            ) {

              client.postMessage({

                type:
                  'OPEN_PRIVATE_CHAT',

                chatId:
                  chatId

              });

            }

            // Clan notification
            else if (
              type === 'clan_notification' ||
              type === 'clan_application'
            ) {

              client.postMessage({

                type:
                  'OPEN_CLAN'

              });

            }

            // Other notification
            else {

              client.postMessage({

                type:
                  'OPEN_NOTIFICATION',

                url:
                  url

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

          await self.clients.openWindow(
            url
          );

        } catch (e) {

          console.error(
            'AIMRELAX openWindow error:',
            e
          );

        }

      })()

    );

  }
);
