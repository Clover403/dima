// src/lib/sequenceCache.ts
// High-performance In-Memory + Persistent Disk Cache (CacheStorage API) for image sequences

const SEQUENCE_CACHE_NAME = 'dima-sequence-cache-v2';

class SequenceCache {
  private cache = new Map<string, HTMLImageElement>();
  private activePreloads = new Set<string>();
  private diskCachePromise: Promise<Cache | null> | null = null;

  private async getDiskCache(): Promise<Cache | null> {
    if (typeof window === 'undefined' || !('caches' in window)) return null;
    if (!this.diskCachePromise) {
      this.diskCachePromise = caches.open(SEQUENCE_CACHE_NAME).catch(() => null);
    }
    return this.diskCachePromise;
  }

  public get(url: string): HTMLImageElement | undefined {
    return this.cache.get(url);
  }

  public has(url: string): boolean {
    return this.cache.has(url);
  }

  public set(url: string, img: HTMLImageElement): void {
    this.cache.set(url, img);
  }

  public async preloadImage(url: string, priority: 'high' | 'low' = 'low'): Promise<HTMLImageElement> {
    // 1. Cek cache in-memory RAM jika sudah ter-load di sesi ini
    if (this.cache.has(url)) {
      return this.cache.get(url)!;
    }

    if (this.activePreloads.has(url)) {
      return new Promise((resolve) => {
        const check = () => {
          if (this.cache.has(url)) {
            resolve(this.cache.get(url)!);
          } else if (!this.activePreloads.has(url)) {
            resolve(new Image());
          } else {
            setTimeout(check, 40);
          }
        };
        check();
      });
    }

    this.activePreloads.add(url);

    // 2. Cek CacheStorage persisten di disk (sama seperti videoCache pada Home)
    const diskCache = await this.getDiskCache();
    if (diskCache) {
      try {
        const cachedResp = await diskCache.match(url);
        if (cachedResp) {
          const blob = await cachedResp.blob();
          if (blob && blob.size > 0) {
            const blobUrl = URL.createObjectURL(blob);
            const img = new Image();
            img.src = blobUrl;
            try {
              await img.decode();
            } catch {}
            this.cache.set(url, img);
            this.activePreloads.delete(url);
            return img;
          }
        }
      } catch {
        // Lanjut ke network jika pembacaan disk gagal
      }
    }

    // 3. Ambil dari network, simpan ke CacheStorage persisten di disk, lalu buat objek Image
    return new Promise((resolve) => {
      fetch(url)
        .then(async (res) => {
          if (res.ok) {
            const blob = await res.blob();
            // Simpan copy ke disk CacheStorage secara permanen
            if (diskCache) {
              const resToStore = new Response(blob, {
                headers: {
                  'Content-Type': 'image/webp',
                  'Cache-Control': 'public, max-age=31536000, immutable',
                },
              });
              diskCache.put(url, resToStore).catch(() => {});
            }

            const blobUrl = URL.createObjectURL(blob);
            const img = new Image();
            img.src = blobUrl;
            try {
              await img.decode();
            } catch {}
            this.cache.set(url, img);
            this.activePreloads.delete(url);
            resolve(img);
            return;
          }
          throw new Error('Network fetch failed');
        })
        .catch(() => {
          // Fallback ke standar Image() loading jika fetch dibatasi
          const img = new Image();
          (img as any).fetchPriority = priority;

          img.onload = async () => {
            try {
              await img.decode();
            } catch {}
            this.cache.set(url, img);
            this.activePreloads.delete(url);
            resolve(img);
          };

          img.onerror = () => {
            this.activePreloads.delete(url);
            resolve(img);
          };

          img.src = url;
        });
    });
  }

  public async preloadSequence(urls: string[], concurrency: number = 6): Promise<void> {
    const queue = [...urls];
    const workers = Array.from({ length: concurrency }, async () => {
      while (queue.length > 0) {
        const url = queue.shift();
        if (url && !this.cache.has(url)) {
          await this.preloadImage(url, 'low');
        }
      }
    });
    await Promise.all(workers);
  }
}

export const sequenceCache = new SequenceCache();
