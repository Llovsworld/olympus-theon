const CACHE_NAME = 'olympus-theon-v4';
const PAGE_CACHE_NAME = 'olympus-theon-pages-v4';
const MAX_CACHED_PAGES = 10;
const STATIC_ASSETS = [
    '/icon-192.png',
    '/hero-gym-poster.webp',
];
const STATIC_PATHS = new Set(STATIC_ASSETS);

function isPublicPage(pathname) {
    return !pathname.startsWith('/admin') && !pathname.startsWith('/api');
}

function isCacheablePageResponse(response) {
    const cacheControl = response.headers.get('cache-control')?.toLowerCase() || '';
    const contentType = response.headers.get('content-type')?.toLowerCase() || '';

    return response.ok
        && contentType.includes('text/html')
        && !cacheControl.includes('private')
        && !cacheControl.includes('no-store');
}

async function trimPageCache() {
    const cache = await caches.open(PAGE_CACHE_NAME);
    const keys = await cache.keys();
    await Promise.all(keys.slice(0, Math.max(0, keys.length - MAX_CACHED_PAGES)).map((key) => cache.delete(key)));
}

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => cache.addAll(STATIC_ASSETS))
            .then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        Promise.all([
            caches.keys().then((cacheNames) => Promise.all(
                cacheNames
                    .filter((name) => name !== CACHE_NAME && name !== PAGE_CACHE_NAME)
                    .map((name) => caches.delete(name))
            )),
            self.clients.claim(),
        ])
    );
});

self.addEventListener('fetch', (event) => {
    if (event.request.method !== 'GET') return;

    const url = new URL(event.request.url);
    if (url.origin !== self.location.origin) return;

    if (event.request.mode === 'navigate' && isPublicPage(url.pathname)) {
        event.respondWith(
            fetch(event.request)
                .then((response) => {
                    if (isCacheablePageResponse(response)) {
                        const responseClone = response.clone();
                        event.waitUntil(
                            caches.open(PAGE_CACHE_NAME)
                                .then((cache) => cache.put(event.request, responseClone))
                                .then(trimPageCache)
                        );
                    }
                    return response;
                })
                .catch(() => caches.match(event.request))
        );
        return;
    }

    if (!STATIC_PATHS.has(url.pathname)) return;

    const networkResponse = fetch(event.request).then(async (response) => {
        if (response.ok) {
            const cache = await caches.open(CACHE_NAME);
            await cache.put(event.request, response.clone());
        }
        return response;
    });

    event.waitUntil(networkResponse.then(() => undefined).catch(() => undefined));
    event.respondWith(
        caches.match(event.request).then((cachedResponse) => cachedResponse || networkResponse)
    );
});
