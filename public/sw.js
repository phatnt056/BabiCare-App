const CACHE_NAME = "babicare-cache-v1";
const ASSETS_TO_CACHE = [
  "/",
  "/index.html",
  "/icon.png",
  "/manifest.json"
];

// Install Event: Pre-cache the shell assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("[Service Worker] Pre-caching offline shell");
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(() => {
      return self.skipWaiting();
    })
  );
});

// Activate Event: Cleanup older caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log("[Service Worker] Removing old cache", key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => {
      return self.clients.claim();
    })
  );
});

// Fetch Interceptor: Dynamic stale-while-revalidate for static assets, network-fallback-to-cache for others
self.addEventListener("fetch", (event) => {
  // Only handle HTTP/HTTPS, skip safari-extension and other protocols
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  const requestUrl = new URL(event.request.url);

  // If it's a navigation request (routing), always try network first, fallback to cached index.html
  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request)
        .catch(() => {
          return caches.match("/index.html") || caches.match("/");
        })
    );
    return;
  }

  // Stale-While-Revalidate caching pattern for images, styles, and js assets
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        // Fetch fresh copy in background to update cache
        fetch(event.request)
          .then((networkResponse) => {
            if (networkResponse.status === 200) {
              caches.open(CACHE_NAME).then((cache) => cache.put(event.request, networkResponse));
            }
          })
          .catch(() => { /* Ignore background fetch failures */ });
        return cachedResponse;
      }

      // Not in cache, fetch from network and cache for next time if it stands for static asset
      return fetch(event.request).then((networkResponse) => {
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== "basic") {
          return networkResponse;
        }

        // Cache static assets (JS, CSS, static images, google web fonts)
        const isStaticAsset = 
          requestUrl.pathname.includes("/assets/") || 
          requestUrl.pathname.endsWith(".js") || 
          requestUrl.pathname.endsWith(".css") || 
          requestUrl.pathname.endsWith(".png") || 
          requestUrl.pathname.endsWith(".jpg") || 
          requestUrl.pathname.endsWith(".svg") ||
          event.request.url.includes("fonts.gstatic.com") ||
          event.request.url.includes("fonts.googleapis.com");

        if (isStaticAsset) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }

        return networkResponse;
      });
    })
  );
});
