self.addEventListener("install", event => {
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(
    self.clients.claim()
  );
});


/* =========================
   استقبال الإشعارات
========================= */

self.addEventListener("push", event => {

  let data = {};

  try {
    data = event.data
      ? event.data.json()
      : {};
  } catch (e) {
    console.error("Push data error:", e);
  }

  const title =
    data.title || "مكالمة واردة";

  const options = {
    body:
      data.body ||
      "لديك مكالمة واردة",
    icon:
      data.icon ||
      "/icon.png",
    badge:
      data.badge ||
      "/icon.png",
    data: data,
    requireInteraction: true,
    actions: [
      {
        action: "accept-call",
        title: "قبول"
      },
      {
        action: "reject-call",
        title: "رفض"
      }
    ]
  };

  event.waitUntil(
    self.registration
      .showNotification(
        title,
        options
      )
  );

});


/* =========================
   الضغط على الإشعار
========================= */

self.addEventListener(
  "notificationclick",
  event => {

    event.notification.close();

    const data =
      event.notification.data || {};

    event.waitUntil(
      self.clients
        .matchAll({
          type: "window",
          includeUncontrolled: true
        })
        .then(clients => {

          for (const client of clients) {

            if ("focus" in client) {

              client.postMessage({
                type:
                  "incoming-call",
                action:
                  event.action,
                ...data
              });

              return client.focus();
            }

          }

          if (
            self.clients.openWindow
          ) {

            return self.clients.openWindow(
              "./"
            );

          }

        })
    );

  }
);
