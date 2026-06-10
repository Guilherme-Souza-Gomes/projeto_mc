var staticCacheName = "django-pwa-v" + new Date().getTime();
var filesToCache = [
    '/',
    '/static/css/seu_estilo.css', // adicione seus css/js principais aqui
];

// Instalar o Service Worker e cachear os arquivos locais
self.addEventListener("install", event => {
    this.skipWaiting();
    event.waitUntil(
        caches.open(staticCacheName)
            .then(cache => {
                return cache.addAll(filesToCache);
            })
    );
});

// Limpar caches antigos
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.filter(cacheName => cacheName.startsWith("django-pwa-"))
                          .filter(cacheName => cacheName !== staticCacheName)
                          .map(cacheName => caches.delete(cacheName))
            );
        })
    );
});

// Responder com o cache ou buscar na rede
self.addEventListener("fetch", event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            return response || fetch(event.request);
        }).catch(() => {
            return caches.match('/');
        })
    );
});