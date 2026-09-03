const CACHE = "saran-portfolio-v3";
const PRECACHE = [
  "./",
  "./index.html",
  "./css/styles.css",
  "./css/fx.css",
  "./js/app.js",
  "./js/fx.js",
  "./js/scene.js",
  "./js/three.module.js",
  "./assets/icon-192.png",
  "./assets/icon-512.png",
  "./manifest.json",
  "./assets/icon.svg",
  "./assets/cv.html"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(PRECACHE)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  event.respondWith(
    caches.match(req).then((cached) => {
      const fetchPromise = fetch(req)
        .then((res) => {
          if (res && res.status === 200 && res.type === "basic") {
            const copy = res.clone();
            caches.open(CACHE).then((cache) => cache.put(req, copy));
          }
          return res;
        })
        .catch(() => cached);

      return cached || fetchPromise;
    })
  );
});
