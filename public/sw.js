const CACHE_NAME = 'olympus-theon-static-v2';
const STATIC_ASSETS = ['/olympus_logo.png', '/hero-gym.png'];
const CACHEABLE_DESTINATIONS = new Set(['image', 'font']);

self.addEventListener('install', (event) => {
    event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS)));
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((names) => Promise.all(
            names
                .filter((name) => name.startsWith('olympus-theon-') && name !== CACHE_NAME)
                .map((name) => caches.delete(name))
        ))
    );
    self.clients.claim();
});

self.addEventListener('fetch', (event) => {
    const request = event.request;
    if (request.method !== 'GET' || !CACHEABLE_DESTINATIONS.has(request.destination)) return;

    const url = new URL(request.url);
    if (url.origin !== self.location.origin) return;

    event.respondWith(
        fetch(request)
            .then((response) => {
                if (response.ok && response.type === 'basic') {
                    const copy = response.clone();
                    event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.put(request, copy)));
                }
                return response;
            })
            .catch(async () => (await caches.match(request)) || Response.error())
    );
});
