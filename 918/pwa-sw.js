
self.addEventListener('install', function(e) {
    console.log('[Service Worker] Install');
    // await cache.addAll(contentToCache);
});

self.addEventListener('fetch', function(e) {
    console.log('[Service Worker] Fetched resource '+e.request.url);
    fetch(e.request).then((response) => {
        console.log('[Service Worker] response: ' + response)
    })
});
