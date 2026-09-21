self.addEventListener("push", event => {
  let data = {};

  try {
    data = event.data ? event.data.json() : {};
  } catch (e) {}

  const title = data.title || "AIMRELAX-PUBG";

  const options = {
    body: data.body || "Դուք ունեք նոր ծանուցում։",
    icon: "/icon-192.png",
    badge: "/icon-192.png",
    data: {
      url: data.url || "https://aimrelax-pubg.github.io/"
    },
    vibrate: [200, 100, 200],
    tag: data.tag || "aimrelax-notification"
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

self.addEventListener("notificationclick", event => {
  event.notification.close();

  const url =
    event.notification.data?.url ||
    "https://aimrelax-pubg.github.io/";

  event.waitUntil(
    clients.matchAll({
      type: "window",
      includeUncontrolled: true
    }).then(async list => {

      for (const client of list) {
        if ("focus" in client) {
          await client.navigate(url);
          return client.focus();
        }
      }

      if (clients.openWindow) {
        return clients.openWindow(url);
      }
    })
  );
});
