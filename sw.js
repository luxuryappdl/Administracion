
/* =========================================================
   DL LUXURY
   PWA - ADMINISTRACIÓN
========================================================= */

const CACHE_NAME = "dl-luxury-admin-v1";

const ARCHIVOS = [
    "./",
    "./index.html",
    "./style.css",
    "./manifest.json"
];


/* =========================================================
   INSTALAR
========================================================= */

self.addEventListener("install", event => {

    event.waitUntil(

        caches.open(CACHE_NAME)

            .then(cache => {

                return cache.addAll(ARCHIVOS);

            })

            .then(() => {

                return self.skipWaiting();

            })

    );

});


/* =========================================================
   ACTIVAR
========================================================= */

self.addEventListener("activate", event => {

    event.waitUntil(

        caches.keys().then(keys => {

            return Promise.all(

                keys.map(key => {

                    if (key !== CACHE_NAME) {

                        return caches.delete(key);

                    }

                })

            );

        }).then(() => {

            return self.clients.claim();

        })

    );

});


/* =========================================================
   PETICIONES
========================================================= */

self.addEventListener("fetch", event => {

    if (event.request.method !== "GET") {
        return;
    }

    const url = new URL(event.request.url);


    /* =====================================================
       NO CACHEAR SUPABASE
    ===================================================== */

    if (url.hostname.includes("supabase.co")) {
        return;
    }


    /* =====================================================
       NO CACHEAR CDN
    ===================================================== */

    if (
        url.hostname.includes("cdnjs.cloudflare.com") ||
        url.hostname.includes("jsdelivr.net")
    ) {
        return;
    }


    /* =====================================================
       ARCHIVOS LOCALES
    ===================================================== */

    event.respondWith(

        caches.match(event.request)

            .then(cached => {

                if (cached) {

                    return cached;

                }

                return fetch(event.request);

            })

    );

});
