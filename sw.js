self.addEventListener("push", event => {
  let data = {};

  try {
    data = event.data ? event.data.json() : {};
  } catch (e) {
    data = {};
  }

  event.waitUntil(
    self.registration.showNotification(
      data.title || "AIMRELAX-PUBG",
      {
        body: data.body || "Նոր հաղորդագրություն",
        icon: "/icon-192.png",
        badge: "/icon-192.png",

        data: {
          url: data.url || "https://aimrelax-pubg.github.io/"
        },

        tag: data.tag || "aimrelax-chat",
        requireInteraction: true
      }
    )
  );
});


self.addEventListener("notificationclick", event => {
  event.notification.close();

  const url =
    event.notification &&
    event.notification.data &&
    event.notification.data.url
      ? event.notification.data.url
      : "https://aimrelax-pubg.github.io/";

  event.waitUntil(
    (async () => {

      const windows = await clients.matchAll({
        type: "window",
        includeUncontrolled: true
      });

      for (const client of windows) {
        try {
          await client.focus();
          await client.navigate(url);
          return;
        } catch (e) {}
      }

      await clients.openWindow(url);

    })()
  );
});


self.addEventListener("install", event => {
  self.skipWaiting();
});


self.addEventListener("activate", event => {
  event.waitUntil(
    clients.claim()
  );
});
