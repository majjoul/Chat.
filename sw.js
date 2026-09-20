// Service Worker للتعامل مع الإشعارات والمكالمات في الخلفية

self.addEventListener('push', function(event) {
  let data = { title: 'Message App', body: 'لديك اتصال أو رسالة جديدة 📞' };
  
  if (event.data) {
    try {
      data = event.data.json();
    } catch (e) {
      data.body = event.data.text();
    }
  }

  const options = {
    body: data.body,
    icon: '💬',
    badge: '💬',
    vibrate: [300, 100, 300, 100, 300],
    tag: 'call-notification',
    renotify: true,
    actions: [
      { action: 'open', title: 'فتح التطبيق' }
    ]
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// التعامل مع الضغط على الإشعار لفتح التطبيق مباشرة
self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(clientList) {
      for (let i = 0; i < clientList.length; i++) {
        let client = clientList[i];
        if ('focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow('./');
      }
    })
  );
});
