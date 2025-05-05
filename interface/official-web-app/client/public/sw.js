/**
 * TiffinWale Service Worker
 * Implements runtime caching and offline functionality
 */

const CACHE_NAME = 'tiffinwale-cache-v3';

// Assets to cache on install
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/favicon.ico',
  '/favicon.png',
  '/apple-touch-icon.png',
  '/manifest.json'
];

// Install event - precache critical resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        // Ignore failures for individual items
        return Promise.allSettled(
          PRECACHE_ASSETS.map(url => 
            cache.add(url).catch(error => console.log('Could not cache:', url, error))
          )
        );
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            // Delete old caches
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Helper function to determine if a request is an API call
const isApiRequest = (url) => {
  return url.pathname.startsWith('/api/') || url.host.includes('api.tiffin-wale.com');
};

// Helper function to determine if a request is a health check or ping
const isHealthRequest = (url) => {
  return url.pathname.includes('/health') || url.pathname.includes('/ping');
};

// Helper function to determine if a request is for an image
const isImageRequest = (url) => {
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.avif'];
  return imageExtensions.some(ext => url.pathname.toLowerCase().endsWith(ext));
};

// Helper function to determine if a request is for a static asset
const isStaticAsset = (url) => {
  const staticExtensions = ['.js', '.css', '.woff', '.woff2', '.ttf', '.eot', '.json'];
  return (
    url.pathname.startsWith('/assets/') || 
    staticExtensions.some(ext => url.pathname.toLowerCase().endsWith(ext))
  );
};

// Network-first strategy for API requests
const networkFirstStrategy = async (request) => {
  try {
    // Try network first
    const networkResponse = await fetch(request);
    
    // Clone the response before using it to avoid consuming the body
    const responseToCache = networkResponse.clone();
    
    // Cache the successful response
    caches.open(CACHE_NAME).then(cache => {
      cache.put(request, responseToCache);
    });
    
    return networkResponse;
  } catch (error) {
    // If network fails, try cache
    const cachedResponse = await caches.match(request);
    return cachedResponse || Promise.reject('No network or cache response available');
  }
};

// Network-only strategy for health endpoints
const networkOnlyStrategy = async (request) => {
  try {
    return await fetch(request);
  } catch (error) {
    return new Response(JSON.stringify({ status: 'error', message: 'Network unavailable' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 503
    });
  }
};

// Cache-first strategy for static assets
const cacheFirstStrategy = async (request) => {
  // Look in cache first
  const cachedResponse = await caches.match(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }
  
  // If not in cache, fetch from network and cache
  try {
    const networkResponse = await fetch(request);
    
    // Cache the response if it's valid
    if (networkResponse.ok) {
      const responseToCache = networkResponse.clone();
      caches.open(CACHE_NAME).then(cache => {
        cache.put(request, responseToCache);
      });
    }
    
    return networkResponse;
  } catch (error) {
    // Network failed, no cache available
    return Promise.reject('No network or cache response available');
  }
};

// Stale-while-revalidate strategy for images
const staleWhileRevalidateStrategy = async (request) => {
  // Try to get from cache immediately (stale)
  const cachedResponse = await caches.match(request);
  
  // Fetch a fresh version regardless (revalidate)
  const fetchPromise = fetch(request).then(networkResponse => {
    // Cache the new version if it's valid
    if (networkResponse.ok) {
      const responseToCache = networkResponse.clone();
      caches.open(CACHE_NAME).then(cache => {
        cache.put(request, responseToCache);
      });
    }
    return networkResponse;
  }).catch(error => {
    console.error('Fetch failed:', error);
    // Let it fail - we'll return the cached version if available
  });
  
  // Return cached version immediately if available, otherwise wait for network
  return cachedResponse || fetchPromise;
};

// Fetch event - apply different strategies based on request type
self.addEventListener('fetch', (event) => {
  try {
    const url = new URL(event.request.url);
    
    // Skip all API requests - let the browser handle them directly
    if (isApiRequest(url)) {
      return;
    }
    
    // Skip POST requests - let the browser handle them directly
    if (event.request.method !== 'GET') {
      return;
    }
    
    // For images and static assets
    if (isImageRequest(url) || isStaticAsset(url)) {
      event.respondWith(
        caches.match(event.request)
          .then((cachedResponse) => {
            if (cachedResponse) {
              return cachedResponse;
            }
            
            return fetch(event.request)
              .then((response) => {
                // Don't cache non-successful responses
                if (!response || response.status !== 200) {
                  return response;
                }
                
                // Cache the successful response
                const responseToCache = response.clone();
                caches.open(CACHE_NAME)
                  .then((cache) => {
                    cache.put(event.request, responseToCache);
                  })
                  .catch(error => console.error('Cache put error:', error));
                
                return response;
              })
              .catch((error) => {
                console.error('Fetch failed:', error);
                // Return a fallback response for images
                if (isImageRequest(url)) {
                  return new Response('Image not available', { status: 404, headers: { 'Content-Type': 'text/plain' } });
                }
                throw error;
              });
          })
      );
      return;
    }
    
    // For everything else (navigation requests)
    if (event.request.mode === 'navigate') {
      event.respondWith(
        caches.match(event.request)
          .then((cachedResponse) => {
            if (cachedResponse) {
              return cachedResponse;
            }
            
            return fetch(event.request)
              .then((response) => {
                // Don't cache non-successful responses
                if (!response || response.status !== 200) {
                  return response;
                }
                
                // Cache the successful response
                const responseToCache = response.clone();
                caches.open(CACHE_NAME)
                  .then((cache) => {
                    cache.put(event.request, responseToCache);
                  })
                  .catch(error => console.error('Cache put error:', error));
                
                return response;
              });
          })
      );
    }
  } catch (error) {
    console.error('Service worker fetch event error:', error);
  }
}); 