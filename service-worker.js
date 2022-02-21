const cacheName = 'hello-world-service-worker';
const filesToCache = [
  '/',
  'index.html',
];

self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(cacheName).then(function (cache) {
      return cache.addAll(filesToCache);
    })
  );
});

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (cacheNames) {
      return Promise.all(cacheNames.map(function (name) {
        return caches.delete(name);
      }));
    })
  );
});

self.addEventListener('fetch', function (event) {
  event.respondWith(
    caches.open(cacheName).then(function (cache) {
      return fetch(event.request).then(function (response) {
        cache.put(event.request, response.clone());
        return response;
      }).catch(function () {
        return cache.match(event.request).then(function (response) {
          return response || fetch(event.request);
        });
      });
    })
  );
});
