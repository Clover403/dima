// src/lib/videoCache.ts
// High-performance In-Memory Video Blob Cache & Real-Time Byte Preloader

export const TOTAL_HOME_VIDEOS = 10;
export const INITIAL_LOAD_COUNT = 1; // Video 1 lokal (17MB) untuk pembukaan instan (1-2 detik)

// Known exact sizes of all 10 Intra MP4 videos (bytes)
export const KNOWN_VIDEO_SIZES: number[] = [
  17077306, // home1
  29302074, // home2
  25530952, // home3
  28450814, // home4
  30860030, // home5
  28399629, // home6
  22385040, // home7
  13584951, // home8
  12718193, // home9
  21132117  // home10
];

// Ukuran total byte untuk video 1 sampai 8 saja (fase pembukaan awal)
export const INITIAL_VIDEOS_BYTE_SIZE = KNOWN_VIDEO_SIZES.slice(0, INITIAL_LOAD_COUNT).reduce((a, b) => a + b, 0);
export const TOTAL_VIDEOS_BYTE_SIZE = KNOWN_VIDEO_SIZES.reduce((a, b) => a + b, 0);

export function resolveVideoUrl(index: number): string {
  // Video 1 (index 0) & Video 2 (index 1) SELALU disajikan dari direktori lokal (/video/video-home/intra/home{1,2}_intra.mp4), baik di localhost maupun di deployment (ikut ter-deploy ke Vercel)
  if (index === 0 || index === 1) {
    return `/video/video-home/intra/home${index + 1}_intra.mp4`;
  }

  // Video 3-10: SELALU gunakan Cloudflare R2, baik di localhost maupun di deployment
  const r2Base = import.meta.env.VITE_R2_BASE_URL;
  if (r2Base) {
    return `${r2Base}/video/home/home${index + 1}_intra.mp4`;
  }

  return `/video/video-home/intra/home${index + 1}_intra.mp4`;
}

type ProgressListener = (percent: number, loadedBytes: number, totalBytes: number) => void;
type ReadyListener = () => void;

class VideoCacheManager {
  private blobUrls: Map<number, string> = new Map();
  private loadedBytesMap: Map<number, number> = new Map();
  private progressListeners: Set<ProgressListener> = new Set();
  private initialReadyListeners: Set<ReadyListener> = new Set();
  private allReadyListeners: Set<ReadyListener> = new Set();
  private isPreloadingInitial = false;
  private isInitialDone = false;
  private isRemainingPreloading = false;
  private isAllDone = false;

  public getVideoSrc(index: number): string {
    return this.blobUrls.get(index) || resolveVideoUrl(index);
  }

  public isInitialReady(): boolean {
    if (this.isInitialDone) return true;
    // STRICT: Harus benar-benar ada di blobUrls untuk video 0 sampai INITIAL_LOAD_COUNT - 1
    for (let i = 0; i < INITIAL_LOAD_COUNT; i++) {
      if (!this.blobUrls.has(i)) return false;
    }
    return true;
  }

  public isReady(): boolean {
    return this.blobUrls.size === TOTAL_HOME_VIDEOS;
  }

  public onProgress(fn: ProgressListener): () => void {
    this.progressListeners.add(fn);
    return () => this.progressListeners.delete(fn);
  }

  public onInitialReady(fn: ReadyListener): () => void {
    if (this.isInitialReady()) {
      fn();
      return () => {};
    }
    this.initialReadyListeners.add(fn);
    return () => this.initialReadyListeners.delete(fn);
  }

  public onReady(fn: ReadyListener): () => void {
    if (this.isReady()) {
      fn();
      return () => {};
    }
    this.allReadyListeners.add(fn);
    return () => this.allReadyListeners.delete(fn);
  }

  private lastProgressNotifyTime = 0;
  private lastProgressPercent = 0;

  private notifyProgress(force = false) {
    const now = typeof performance !== 'undefined' ? performance.now() : Date.now();
    let totalLoaded = 0;
    for (let i = 0; i < INITIAL_LOAD_COUNT; i++) {
      totalLoaded += this.loadedBytesMap.get(i) || 0;
    }
    const percent = Math.min(99.9, (totalLoaded / INITIAL_VIDEOS_BYTE_SIZE) * 100);

    // Throttle to at most once per 40ms or 0.3% delta to prevent event loop starvation
    if (!force && now - this.lastProgressNotifyTime < 40 && (percent - this.lastProgressPercent < 0.3)) {
      return;
    }

    this.lastProgressNotifyTime = now;
    this.lastProgressPercent = percent;

    for (const fn of this.progressListeners) {
      try {
        fn(percent, totalLoaded, INITIAL_VIDEOS_BYTE_SIZE);
      } catch (err) {
        console.error('Progress listener error:', err);
      }
    }
  }

  private async fetchSingleVideoAsBlob(index: number, url: string, retryCount = 0): Promise<string> {
    if (this.blobUrls.has(index)) {
      return this.blobUrls.get(index)!;
    }

    const CACHE_NAME = 'dima-video-cache-v2';
    const expectedSize = KNOWN_VIDEO_SIZES[index] || 20000000;
    const fallbackUrl = `/video/video-home/intra/home${index + 1}_intra.mp4`;
    const targetUrl = retryCount > 0 ? fallbackUrl : url;

    // 1. Cek Cache API browser (CacheStorage) - Jika sudah pernah di-load, INSTAN tanpa download ulang!
    if (typeof window !== 'undefined' && 'caches' in window) {
      try {
        const cache = await caches.open(CACHE_NAME);
        const cachedResp = (await cache.match(targetUrl)) || (await cache.match(fallbackUrl)) || (await cache.match(url));
        if (cachedResp) {
          const blob = await cachedResp.blob();
          if (blob && blob.size > 500000) {
            const blobUrl = URL.createObjectURL(blob);
            this.blobUrls.set(index, blobUrl);
            this.loadedBytesMap.set(index, blob.size);
            this.notifyProgress();
            return blobUrl;
          }
        }
      } catch (cacheErr) {
        console.warn('Cache API lookup note:', cacheErr);
      }
    }

    try {
      const response = await fetch(targetUrl);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status} fetching ${targetUrl}`);
      }

      const contentLength = +(response.headers.get('content-length') || expectedSize);
      const reader = response.body?.getReader();

      let fullBlob: Blob;
      if (!reader) {
        fullBlob = await response.blob();
        this.loadedBytesMap.set(index, fullBlob.size);
        this.notifyProgress();
      } else {
        const chunks: Uint8Array[] = [];
        let receivedBytes = 0;

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          if (value) {
            chunks.push(value);
            receivedBytes += value.length;
            this.loadedBytesMap.set(index, receivedBytes);
            this.notifyProgress();
          }
        }

        fullBlob = new Blob(chunks as BlobPart[], { type: 'video/mp4' });
      }

      this.loadedBytesMap.set(index, fullBlob.size || contentLength);
      this.notifyProgress(true);

      const blobUrl = URL.createObjectURL(fullBlob);
      this.blobUrls.set(index, blobUrl);

      // Simpan ke Cache API agar reload berikutnya INSTAN tanpa unduh network lagi
      if (typeof window !== 'undefined' && 'caches' in window) {
        caches.open(CACHE_NAME).then((cache) => {
          const responseToStore = new Response(fullBlob, {
            status: 200,
            headers: {
              'Content-Type': 'video/mp4',
              'Content-Length': `${fullBlob.size}`,
              'Cache-Control': 'public, max-age=31536000, immutable',
            },
          });
          cache.put(targetUrl, responseToStore).catch(() => {});
        }).catch(() => {});
      }

      return blobUrl;
    } catch (err) {
      console.warn(`Video ${index + 1} download attempt ${retryCount + 1} failed:`, err);
      if (retryCount < 3) {
        // Coba ulang dengan fallback lokal
        await new Promise((r) => setTimeout(r, 400));
        return this.fetchSingleVideoAsBlob(index, fallbackUrl, retryCount + 1);
      }
      throw err;
    }
  }

  // 1. Fase 1: Preload Video 1 sampai 8 (Prioritas pembukaan web)
  public async preloadInitialVideos(
    concurrency = 2,
    onProgressUpdate?: (percent: number) => void
  ): Promise<void> {
    if (this.isInitialReady()) {
      if (onProgressUpdate) onProgressUpdate(100);
      return;
    }

    if (this.isPreloadingInitial) {
      return new Promise<void>((resolve) => {
        const unsub = this.onInitialReady(() => {
          unsub();
          resolve();
        });
      });
    }

    this.isPreloadingInitial = true;

    if (onProgressUpdate) {
      this.onProgress((pct) => onProgressUpdate(pct));
    }

    const indices = Array.from({ length: INITIAL_LOAD_COUNT }, (_, i) => i);
    let activeWorkers = 0;
    let nextIdx = 0;

    await new Promise<void>((resolve) => {
      const runNext = () => {
        // Hanya selesai jika SEMUA 8 video BENAR-BENAR sudah ada di blobUrls!
        if (this.isInitialReady()) {
          resolve();
          return;
        }

        while (activeWorkers < concurrency && nextIdx < indices.length) {
          const currentIndex = indices[nextIdx++];
          activeWorkers++;

          const url = resolveVideoUrl(currentIndex);
          this.fetchSingleVideoAsBlob(currentIndex, url)
            .then(() => {
              activeWorkers--;
              runNext();
            })
            .catch((err) => {
              console.error(`Error loading video ${currentIndex + 1}, retrying:`, err);
              activeWorkers--;
              // Kembalikan index ke antrian agar TIDAK PERNAH dilewati!
              indices.push(currentIndex);
              setTimeout(runNext, 800);
            });
        }
      };

      runNext();
    });

    this.isInitialDone = true;
    this.isPreloadingInitial = false;

    // Trigger 100% progress
    for (const fn of this.progressListeners) {
      try {
        fn(100, INITIAL_VIDEOS_BYTE_SIZE, INITIAL_VIDEOS_BYTE_SIZE);
      } catch {}
    }

    for (const fn of this.initialReadyListeners) {
      try {
        fn();
      } catch {}
    }
    this.initialReadyListeners.clear();

    window.dispatchEvent(new CustomEvent('videosInitialLoaded', {
      detail: { count: INITIAL_LOAD_COUNT }
    }));

    // Otomatis download video 9 dan 10 di background setelah video 1-8 siap
    setTimeout(() => {
      this.preloadRemainingVideos(2);
    }, 200);
  }

  // 2. Fase 2: Download Video 9 dan 10 di Background setelah web terbuka
  public async preloadRemainingVideos(_concurrency = 2): Promise<void> {
    if (this.isAllDone || this.isRemainingPreloading) return;
    this.isRemainingPreloading = true;

    const remainingIndices = Array.from(
      { length: TOTAL_HOME_VIDEOS - INITIAL_LOAD_COUNT },
      (_, i) => INITIAL_LOAD_COUNT + i
    ); // indices [8, 9] (video 9 & 10)

    for (const idx of remainingIndices) {
      try {
        const url = resolveVideoUrl(idx);
        await this.fetchSingleVideoAsBlob(idx, url);
        // Dispatch update saat video 9 atau 10 berhasil di-cache
        window.dispatchEvent(new CustomEvent('videosFullyLoaded', {
          detail: { count: this.blobUrls.size }
        }));
      } catch (err) {
        console.warn(`Background video ${idx + 1} preload failed, will fallback to stream:`, err);
      }
    }

    this.isAllDone = true;
    this.isRemainingPreloading = false;

    for (const fn of this.allReadyListeners) {
      try {
        fn();
      } catch {}
    }
    this.allReadyListeners.clear();
  }

  public async preloadAllVideos(
    concurrency = 4,
    onProgressUpdate?: (percent: number) => void
  ): Promise<void> {
    return this.preloadInitialVideos(concurrency, onProgressUpdate);
  }
}

export const videoCache = new VideoCacheManager();
