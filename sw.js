const CACHE_NAME = "qwen-mobile-fast-v20260828-01";

const ASSETS = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./qwen-app-icon.png",
  "./apple-touch-icon.png",
  "./assets/img-001.webp",
  "./assets/img-002.webp",
  "./assets/img-003.webp",
  "./assets/img-004.webp",
  "./assets/img-007.webp",
  "./assets/img-009.webp",
  "./assets/img-010.webp",
  "./assets/composer-typing.webp",
  "./assets/logo-hushang.webp",
  "./assets/logo-shuyi.webp",
  "./assets/product-board-mixue.webp",
  "./assets/product-board-chabaidao.webp",
  "./assets/product-board-hushang.webp",
  "./assets/product-board-bawang.webp",
  "./assets/product-board-shuyi.webp"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;

      return fetch(event.request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          return response;
        })
        .catch(() => caches.match("./index.html"));
    })
  );
});
