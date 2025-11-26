const CACHE_NAME = 'student-tracker-cache-v1';
const urlsToCache = [
    '/',
    'index.html',
    'manifest.json',
    'icons/icon-192x192.svg',
    'icons/icon-512x512.svg',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
    'https://cdn.jsdelivr.net/npm/chart.js',
    'https://fonts.googleapis.com/css2?family=Tajawal:wght@400;700&display=swap',
    'https://fonts.gstatic.com/s/tajawal/v12/Iura6YBj_oCad4k1rzY.ttf',
    'https://fonts.gstatic.com/s/tajawal/v12/Iurf6YBj_oCad4k1l4qkLrY.ttf'
];

// Install event: cache all the essential files
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Opened cache');
                // Use {cache: 'reload'} to bypass browser's HTTP cache for these requests
                const requests = urlsToCache.map(url => new Request(url, {cache: 'reload'}));
                return cache.addAll(requests);
            })
    );
});

// Activate event: clean up old caches
self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// Fetch event: serve from cache first, then fall back to network
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Cache hit - return response
                if (response) {
                    return response;
                }
                // Not in cache - fetch from network
                return fetch(event.request);
            })
    );
});
