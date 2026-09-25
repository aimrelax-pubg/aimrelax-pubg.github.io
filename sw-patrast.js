const AIMRELAX_SITE = "https://aimrelax-pubg.github.io/";

self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      await self.clients.claim();
    })()
  );
});

self.addEventListener("push", (event) => {
  event.waitUntil(
    (async () => {
      let data = {};

      try {
        data = event.data ? event.data.json() : {};
      } catch (e) {
        try {
          data = {
            title: "AIMRELAX-PUBG",
            body: event.data ? event.data.text() : "Նոր ծանուցում"
          };
        } catch (_) {}
      }

      const title = data.title || "AIMRELAX-PUBG";
      const body = data.body || "Նոր ծանուցում";

      const type = data.type || "general";

      let url = data.url || AIMRELAX_SITE;

      if (type === "private_chat" && data.chatId) {
        url =
          AIMRELAX_SITE +
          "?chat=" +
          encodeURIComponent(data.chatId);
      }

      if (type === "clan_notification") {
        if (data.url) {
          url = data.url;
        } else {
          url = AIMRELAX_SITE + "?section=community";
        }
      }

      const notificationData = {
        type: type,
        chatId: data.chatId || null,
        url: url,
        section: data.section || null,
        notificationId: data.notificationId || null
      };

      const options = {
        body: body,
        icon: AIMRELAX_SITE + "icon-192.png",
        badge: AIMRELAX_SITE + "icon-192.png",

        data: notificationData,

        tag:
          data.tag ||
          (
            type === "private_chat"
              ? "aimrelax-chat-" + (data.chatId || "message")
              : "aimrelax-" + type
          ),

        renotify: true,

        requireInteraction: false,

        vibrate: [200, 100, 200]
      };

      await self.registration.showNotification(title, options);
    })()
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  event.waitUntil(
    (async () => {
      const data = event.notification.data || {};

      let url = data.url || AIMRELAX_SITE;

      if (data.type === "private_chat" && data.chatId) {
        url =
          AIMRELAX_SITE +
          "?chat=" +
          encodeURIComponent(data.chatId);
      }

      const windowClients = await self.clients.matchAll({
        type: "window",
        includeUncontrolled: true
      });

      // Եթե կայքը արդեն բաց է
      if (windowClients.length > 0) {
        const client = windowClients[0];

        try {
          await client.focus();

          if (data.type === "private_chat" && data.chatId) {
            client.postMessage({
              type: "OPEN_PRIVATE_CHAT",
              chatId: data.chatId
            });
          } else if (data.type === "clan_notification") {
            client.postMessage({
              type: "OPEN_CLAN_NOTIFICATION",
              url: url,
              notificationId: data.notificationId || null
            });
          } else {
            client.postMessage({
              type: "OPEN_NOTIFICATION",
              url: url
            });
          }

          return;
        } catch (e) {
          // Եթե focus/postMessage-ը չստացվեց՝ բացում ենք URL-ը
        }
      }

      // Եթե կայքը ամբողջությամբ փակ է
      if (self.clients.openWindow) {
        await self.clients.openWindow(url);
      }
    })()
  );
});

self.addEventListener("notificationclose", (event) => {
  // Հատուկ գործողություն պետք չէ
});
