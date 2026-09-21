self.addEventListener("push", event => {
  let data = {};

  try {
    data = event.data ? event.data.json() : {};
  } catch (e) {
    console.error("Push data error:", e);
  }

  const title = data.title || "AIMRELAX-PUBG";

  const options = {
    body: data.body || "Դուք ունեք նոր ծանուցում։",
    icon: "/icon-192.png",
    badge: "/icon-192.png",
    data: {
      url: data.url || "https://aimrelax-pubg.github.io/"
    },
    vibrate: [200, 100, 200],
    tag: data.tag || ("aimrelax-" + Date.now())
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});


self.addEventListener("notificationclick", event => {
  event.notification.close();

  const url =
    event.notification?.data?.url ||
    "https://aimrelax-pubg.github.io/";

  console.log("Notification clicked:", url);

  event.waitUntil(
    clients.openWindow(url)
  );
});
