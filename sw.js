self.addEventListener('push', function(event) {
  const data = event.data ? event.data.json() : {};
  const title = data.title || 'Message App';
  const options = {
    body: data.body || 'لديك رسالة أو مكالمة جديدة',
    icon: 'https://cdn-icons-png.flaticon.com/512/733/733585.png',
    badge: 'https://cdn-icons-png.flaticon.com/512/733/733585.png',
    dir: 'rtl'
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  event.waitUntil(
    clients.openWindow('/')
  );
});
