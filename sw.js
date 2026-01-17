/**
 * BAHN-BINGO Service Worker
 * Enables offline functionality and caching
 */

const CACHE_NAME = 'bahn-bingo-v3';
const ASSETS_TO_CACHE = [
    '/',
    '/index.html',
    '/styles.css',
    '/app.js',
    '/events.js',
    '/manifest.json',
    '/privacy.html',
    '/impressum.html'
];

// Install: Cache all static assets
self.addEventListener('install', (event) => {
    console.log('[SW] Installing...');
    
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('[SW] Caching assets');
                return cache.addAll(ASSETS_TO_CACHE);
            })
            .then(() => {
                // Activate immediately
                return self.skipWaiting();
            })
    );
});

// Activate: Clean up old caches
self.addEventListener('activate', (event) => {
    console.log('[SW] Activating...');
    
    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames
                        .filter((name) => name !== CACHE_NAME)
                        .map((name) => {
                            console.log('[SW] Deleting old cache:', name);
                            return caches.delete(name);
                        })
                );
            })
            .then(() => {
                // Take control of all pages immediately
                return self.clients.claim();
            })
    );
});

// Fetch: Serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
    // Only handle GET requests
    if (event.request.method !== 'GET') return;
    
    // Skip cross-origin requests (like Google Fonts)
    if (!event.request.url.startsWith(self.location.origin)) {
        // For fonts, use network-first strategy
        if (event.request.url.includes('fonts.googleapis.com') || 
            event.request.url.includes('fonts.gstatic.com')) {
            event.respondWith(
                fetch(event.request)
                    .then((response) => {
                        // Clone and cache the font
                        const responseClone = response.clone();
                        caches.open(CACHE_NAME).then((cache) => {
                            cache.put(event.request, responseClone);
                        });
                        return response;
                    })
                    .catch(() => {
                        return caches.match(event.request);
                    })
            );
            return;
        }
        return;
    }
    
    // Cache-first strategy for our own assets
    event.respondWith(
        caches.match(event.request)
            .then((cachedResponse) => {
                if (cachedResponse) {
                    // Return cached version
                    // Also fetch in background to update cache
                    fetch(event.request)
                        .then((networkResponse) => {
                            caches.open(CACHE_NAME)
                                .then((cache) => {
                                    cache.put(event.request, networkResponse);
                                });
                        })
                        .catch(() => {});
                    
                    return cachedResponse;
                }
                
                // Not in cache, fetch from network
                return fetch(event.request)
                    .then((networkResponse) => {
                        // Cache the new response
                        const responseClone = networkResponse.clone();
                        caches.open(CACHE_NAME)
                            .then((cache) => {
                                cache.put(event.request, responseClone);
                            });
                        
                        return networkResponse;
                    })
                    .catch(() => {
                        // Offline and not in cache
                        // Return offline page if it's a navigation request
                        if (event.request.mode === 'navigate') {
                            return caches.match('/index.html');
                        }
                        
                        return new Response('Offline', {
                            status: 503,
                            statusText: 'Service Unavailable'
                        });
                    });
            })
    );
});

// Handle messages from the main thread
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});

// Background Sync (for future multiplayer features)
self.addEventListener('sync', (event) => {
    if (event.tag === 'sync-stats') {
        console.log('[SW] Syncing stats...');
        // Future: Sync with server
    }
});

// Push Notifications (for future features)
self.addEventListener('push', (event) => {
    if (!event.data) return;
    
    const data = event.data.json();
    
    const options = {
        body: data.body || 'Neues Update!',
        icon: '/icon-192.png',
        badge: '/icon-72.png',
        vibrate: [100, 50, 100],
        data: {
            url: data.url || '/'
        }
    };
    
    event.waitUntil(
        self.registration.showNotification(data.title || 'Bahn-Bingo', options)
    );
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    
    event.waitUntil(
        clients.openWindow(event.notification.data.url || '/')
    );
});
