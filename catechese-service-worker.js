self.addEventListener('install', () => {
  self.skipWaiting();
});
self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});
self.addEventListener('fetch', (event) => {
  event.respondWith(fetch(event.request));
});

// ============ NOTIFICATIONS PUSH (même appli fermée / téléphone verrouillé) ============
self.addEventListener('push', (event) => {
  let donnees = {};
  try{ donnees = event.data ? event.data.json() : {}; }catch(e){ donnees = {}; }
  const titre = donnees.title || 'Nouveau message';
  const options = {
    body: donnees.body || '',
    tag: 'catechese-message-' + (donnees.title || ''),
    data: { expediteur: donnees.title || '' },
  };
  event.waitUntil(self.registration.showNotification(titre, options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    self.clients.matchAll({type:'window', includeUncontrolled:true}).then((clientsArr) => {
      for(const client of clientsArr){
        if('focus' in client) return client.focus();
      }
      if(self.clients.openWindow) return self.clients.openWindow('./');
    })
  );
});
