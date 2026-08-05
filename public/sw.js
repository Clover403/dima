const CACHE_NAME = 'dima-sequence-cache-v2';
let cacheInstance = null;

// Helper function untuk mendapatkan instance cache secara efisien (agar tidak open cache ratusan kali)
async function getCache() {
  if (!cacheInstance) {
    cacheInstance = await caches.open(CACHE_NAME);
  }
  return cacheInstance;
}

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  // Bersihkan cache versi lama jika ada
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName.startsWith('dima-sequence-cache')) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // HANYA mencegat dan meng-cache aset dari R2 Cloudflare
  if (url.hostname.includes('pub-') && url.hostname.includes('r2.dev')) {
    event.respondWith(
      (async () => {
        const cache = await getCache();
        
        // Cek apakah gambar sudah ada di Cache Storage persisten
        const cachedResponse = await cache.match(event.request);
        if (cachedResponse) {
          return cachedResponse;
        }
        
        try {
          // Jika tidak ada di cache, download dari internet
          const networkResponse = await fetch(event.request);
          
          if (networkResponse && networkResponse.status === 200) {
            // Simpan copy ke cache secara asinkron (tidak memblokir render UI)
            cache.put(event.request, networkResponse.clone()).catch(() => {});
          }
          
          return networkResponse;
        } catch (error) {
          // Jika gagal/koneksi putus
          return new Response('', { status: 408, statusText: 'Request timeout' });
        }
      })()
    );
  }
});
