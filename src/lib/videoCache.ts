// src/lib/videoCache.ts
// High-performance In-Memory Video Blob Cache & Real-Time Byte Preloader

export const TOTAL_HOME_VIDEOS = 15;
export const INITIAL_LOAD_COUNT = TOTAL_HOME_VIDEOS; // Seluruh 15 video Home wajib selesai dimuat sebelum loader terbuka

// Known exact sizes of all 15 Intra MP4 videos (bytes)
export const KNOWN_VIDEO_SIZES: number[] = [
  5593666,  // Slot 1 (home13_intra.mp4 - Lokal: 5.33 MB - Opening Logo DIMA)
  8170961,  // Slot 2 (home14_intra.mp4 - Lokal: 7.79 MB - Logo to Hourglass)
  12730145, // Slot 3 (home15_intra.mp4 - Lokal: 12.14 MB - Hourglass filling)
  16974313, // Slot 4 (home16_intra.mp4 - Lokal: 16.19 MB - Hourglass flow & Hero text)
  30606460, // Slot 5 (home17_intra.mp4 - R2: 29.19 MB - Agro bulir gandum)
  25088461, // Slot 6 (home18_intra.mp4 - R2: 23.93 MB - Agro traktor panen)
  28450814, // Slot 7 (home4_intra.mp4 - R2: 27.13 MB - Konstruksi excavator pondasi)
  21908836, // Slot 8 (home5_intra.mp4 - R2: 20.89 MB - Konstruksi rangka luar baru)
  21575923, // Slot 9 (home6_intra.mp4 - R2: 20.58 MB - Konstruksi rangka dalam interior)
  28399629, // Slot 10 (home7_intra.mp4 - R2: 27.08 MB - Expansión gedung pencakar langit kota)
  22385040, // Slot 11 (home8_intra.mp4 - R2: 21.35 MB - Energi turbin & solar)
  21594403, // Slot 12 (home9_intra.mp4 - R2: 20.59 MB - Logistik pelabuhan loading docks)
  28833242, // Slot 13 (home10_intra.mp4 - R2: 27.50 MB - Logistik rak supermarket retail)
  12718193, // Slot 14 (home11_intra.mp4 - R2: 12.13 MB - Logistik warehouse interior)
  21132117  // Slot 15 (home12_intra.mp4 - R2: 20.15 MB - Logistik armada truk kontainer)
];

// Ukuran total byte untuk seluruh 15 video Home
export const TOTAL_VIDEOS_BYTE_SIZE = KNOWN_VIDEO_SIZES.reduce((a, b) => a + b, 0);
export const INITIAL_VIDEOS_BYTE_SIZE = TOTAL_VIDEOS_BYTE_SIZE;

export const VIDEO_VERSION = 'v11';
export const CURRENT_VIDEO_CACHE_NAME = `dima-video-cache-${VIDEO_VERSION}`;

// Auto cache migration: berjalan 100% otomatis di browser klien tanpa perlu tombol/shortcut apa pun
if (typeof window !== 'undefined') {
  try {
    const savedVersion = localStorage.getItem('dima_vid_ver');
    if (savedVersion !== VIDEO_VERSION) {
      localStorage.setItem('dima_vid_ver', VIDEO_VERSION);
      if ('caches' in window) {
        caches.keys().then((names) => {
          names.forEach((name) => {
            if (name.startsWith('dima-video-cache') && name !== CURRENT_VIDEO_CACHE_NAME) {
              caches.delete(name).catch(() => {});
            }
          });
        }).catch(() => {});
      }
    }
  } catch (_) {}
}

export function resolveVideoUrl(index: number): string {
  // Slot 1 s/d 4 (index 0, 1, 2, 3): Video 13, 14, 15, 16 SELALU disajikan dari direktori lokal (/video/video-home/intra/)
  if (index >= 0 && index <= 3) {
    return `/video/video-home/intra/home${index + 13}_intra.mp4?v=${VIDEO_VERSION}`;
  }

  const r2Base = import.meta.env.VITE_R2_BASE_URL || 'https://pub-cb6cb35c3575473bae197e7054f52cee.r2.dev';

  // Slot 5 & 6 (index 4, 5): Video 17 & 18 dari Cloudflare R2
  if (index === 4 || index === 5) {
    return `${r2Base}/video/home/home${index + 13}_intra.mp4?v=${VIDEO_VERSION}`;
  }

  // Slot 7 s/d 15 (index 6 s/d 14): Video 4 s/d 12 dari Cloudflare R2
  return `${r2Base}/video/home/home${index - 2}_intra.mp4?v=${VIDEO_VERSION}`;
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

    const CACHE_NAME = CURRENT_VIDEO_CACHE_NAME;
    const expectedSize = KNOWN_VIDEO_SIZES[index] || 20000000;
    const targetUrl = url;
    const requestUrl = targetUrl;

    // 1. Cek Cache API browser (CacheStorage) - Jika sudah pernah di-load, INSTAN tanpa download ulang!
    if (typeof window !== 'undefined' && 'caches' in window) {
      try {
        const cache = await caches.open(CACHE_NAME);
        const cachedResp = (await cache.match(targetUrl)) || (await cache.match(url));
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
      const response = await fetch(requestUrl);
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
        await new Promise((r) => setTimeout(r, 600));
        return this.fetchSingleVideoAsBlob(index, url, retryCount + 1);
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
    this.isAllDone = true;
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

    for (const fn of this.allReadyListeners) {
      try {
        fn();
      } catch {}
    }
    this.allReadyListeners.clear();

    window.dispatchEvent(new CustomEvent('videosInitialLoaded', {
      detail: { count: INITIAL_LOAD_COUNT }
    }));
    window.dispatchEvent(new CustomEvent('videosFullyLoaded', {
      detail: { count: TOTAL_HOME_VIDEOS }
    }));
  }

  // 2. Fase 2: Preload sisa video jika ada yang belum terunduh
  public async preloadRemainingVideos(): Promise<void> {
    if (this.isAllDone) return;
    await this.preloadInitialVideos();
  }

  public async preloadAllVideos(
    concurrency = 4,
    onProgressUpdate?: (percent: number) => void
  ): Promise<void> {
    return this.preloadInitialVideos(concurrency, onProgressUpdate);
  }
}

export const videoCache = new VideoCacheManager();
