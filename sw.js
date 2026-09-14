// =========================================================
// Message App - Service Worker
// =========================================================

const CACHE_NAME = "message-app-v1";


// =========================================================
// INSTALL
// =========================================================

self.addEventListener("install", event => {

  console.log("Service Worker installed");

  self.skipWaiting();

});


// =========================================================
// ACTIVATE
// =========================================================

self.addEventListener("activate", event => {

  console.log("Service Worker activated");

  event.waitUntil(
    self.clients.claim()
  );

});


// =========================================================
// PUSH NOTIFICATION
// =========================================================

self.addEventListener("push", event => {

  let data = {};

  try {

    data = event.data
      ? event.data.json()
      : {};

  } catch (error) {

    console.error(
      "Push data error:",
      error
    );

    data = {
      title: "Message App",
      body: "لديك إشعار جديد."
    };

  }


  const title =
    data.title ||
    "Message App";


  const options = {

    body:
      data.body ||
      "لديك إشعار جديد.",

    icon:
      data.icon ||
      "./icon.png",

    badge:
      data.badge ||
      "./icon.png",

    tag:
      data.tag ||
      "message-app",

    renotify: true,

    data: {

      url:
        data.url ||
        "./index.html",

      type:
        data.type ||
        "message",

      sender:
        data.sender ||
        "",

      callId:
        data.callId ||
        ""

    }

  };


  event.waitUntil(

    self.registration
      .showNotification(
        title,
        options
      )

  );

});


// =========================================================
// NOTIFICATION CLICK
// =========================================================

self.addEventListener(
  "notificationclick",
  event => {

    event.notification.close();


    const data =
      event.notification.data ||
      {};


    const url =
      data.url ||
      "./index.html";


    event.waitUntil(

      clients
        .matchAll({
          type: "window",
          includeUncontrolled: true
        })

        .then(
          clientList => {

            /*
              إذا كان التطبيق مفتوحًا،
              نحاول إحضار نافذته للمقدمة.
            */

            for(
              const client of clientList
            ){

              if(
                "focus" in client
              ){

                return client
                  .focus();

              }

            }


            /*
              إذا لم يكن مفتوحًا،
              نفتح التطبيق.
            */

            if(
              clients.openWindow
            ){

              return clients
                .openWindow(url);

            }

          }
        )

    );

  }
);


// =========================================================
// NOTIFICATION CLOSE
// =========================================================

self.addEventListener(
  "notificationclose",
  event => {

    console.log(
      "Notification closed"
    );

  }
);


// =========================================================
// FETCH
// =========================================================

self.addEventListener(
  "fetch",
  event => {

    /*
      لا نتدخل في طلبات التطبيق.
      نخلي GitHub Pages والمتصفح
      يتعاملون معها بشكل طبيعي.
    */

  }
);
