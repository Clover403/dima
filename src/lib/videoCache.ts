// src/lib/videoCache.ts
// High-performance In-Memory Video Blob Cache & Real-Time Byte Preloader

export const TOTAL_HOME_VIDEOS = 14;
export const INITIAL_LOAD_COUNT = 4; // Loading awal Video 2 s/d Video 4 (slot index 1, 2, 3) yang disajikan dari file lokal Vercel

// Known exact sizes of all 14 MP4 videos (bytes)
export const KNOWN_VIDEO_SIZES: number[] = [
  0,        // Slot 1 (video1.mp4 - dilewati / tidak digunakan lagi)
  13801324, // Slot 2 (video2.mp4 - Intra CRF 17: 13.16 MB - Navy to Gray Money Flow)
  9561844,  // Slot 3 (video3.mp4 - Intra CRF 17: 9.12 MB - Logo to Hourglass)
  21179286, // Slot 4 (video4.mp4 - Intra CRF 17: 20.20 MB - Hourglass flow & fill)
  22375710, // Slot 5 (video5.mp4 - Intra CRF 17: 21.34 MB - Agro bulir gandum)
  29144861, // Slot 6 (video6.mp4 - Intra CRF 17: 27.79 MB - Agro traktor panen)
  19039491, // Slot 7 (video7.mp4 - Intra CRF 17: 18.16 MB - Konstruksi excavator)
  18675808, // Slot 8 (video8.mp4 - Intra CRF 17: 17.81 MB - Konstruksi rangka luar)
  24239119, // Slot 9 (video9.mp4 - Intra CRF 17: 23.12 MB - Gedung & solar panel)
  16366704, // Slot 10 (video10.mp4 - Intra CRF 17: 15.61 MB - Turbinas de viento y solar)
  18458425, // Slot 11 (video11.mp4 - Intra CRF 17: 17.60 MB - Logistik pelabuhan docks)
  24991744, // Slot 12 (video12.mp4 - Intra CRF 17: 23.83 MB - Supermarket retail)
  11103300, // Slot 13 (video13.mp4 - Intra CRF 17: 10.59 MB - Warehouse interior)
  18905407  // Slot 14 (video14.mp4 - Intra CRF 17: 18.03 MB - Armada truk kontainer)
];

// Ukuran total byte untuk seluruh video Home yang aktif (Video 2 s/d 14)
export const TOTAL_VIDEOS_BYTE_SIZE = KNOWN_VIDEO_SIZES.reduce((a, b) => a + b, 0);
// Ukuran total byte fase awal (Video 2 s/d Video 13) yang menentukan progress loader hingga web terbuka
export const INITIAL_VIDEOS_BYTE_SIZE = KNOWN_VIDEO_SIZES.slice(1, INITIAL_LOAD_COUNT).reduce((a, b) => a + b, 0);

export const VIDEO_VERSION = 'v36';
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
              caches.delete(name).catch(() => { });
            }
          });
        }).catch(() => { });
      }
    }
  } catch (_) { }
}

const R2_BASE_URL = import.meta.env.VITE_R2_BASE_URL || 'https://pub-cb6cb35c3575473bae197e7054f52cee.r2.dev';

export function resolveVideoUrl(index: number): string {
  // Video 1 (index 0) sudah tidak digunakan lagi
  if (index === 0) {
    return '';
  }

  const isLocalhost =
    (typeof window !== 'undefined' &&
      (window.location.hostname === 'localhost' ||
        window.location.hostname === '127.0.0.1' ||
        window.location.hostname.endsWith('.local') ||
        window.location.hostname.startsWith('192.168.') ||
        window.location.hostname.startsWith('10.') ||
        window.location.hostname.startsWith('172.'))) ||
    Boolean(import.meta.env.DEV);

  // Jika sedang testing di localhost: seluruh video yang aktif disajikan dari file lokal agar cepat & instan
  if (isLocalhost) {
    return `/video/video-home/new-video/video${index + 1}.mp4?v=${VIDEO_VERSION}`;
  }

  // Jika di production (Vercel):
  // Video 2, 3, dan 4 (index 1, 2, 3): Disajikan langsung dari file lokal Vercel untuk opening instan & hemat bandwidth R2
  if (index >= 1 && index <= 3) {
    return `/video/video-home/new-video/video${index + 1}.mp4?v=${VIDEO_VERSION}`;
  }

  // Video 5 s/d 14 (index 4 s/d 13): Disajikan dari Cloudflare R2
  return `${R2_BASE_URL}/video/home/video${index + 1}.mp4?v=${VIDEO_VERSION}`;
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
    if (index === 0) return '';
    return this.blobUrls.get(index) || resolveVideoUrl(index);
  }

  public isInitialReady(): boolean {
    if (this.isInitialDone) return true;
    // Harus benar-benar ada di blobUrls untuk video 1 sampai INITIAL_LOAD_COUNT - 1 (Video 1 / index 0 dilewati)
    for (let i = 1; i < INITIAL_LOAD_COUNT; i++) {
      if (!this.blobUrls.has(i)) return false;
    }
    return true;
  }

  public isReady(): boolean {
    return this.blobUrls.size >= TOTAL_HOME_VIDEOS - 1;
  }

  public onProgress(fn: ProgressListener): () => void {
    this.progressListeners.add(fn);
    return () => this.progressListeners.delete(fn);
  }

  public onInitialReady(fn: ReadyListener): () => void {
    if (this.isInitialReady()) {
      fn();
      return () => { };
    }
    this.initialReadyListeners.add(fn);
    return () => this.initialReadyListeners.delete(fn);
  }

  public onReady(fn: ReadyListener): () => void {
    if (this.isReady()) {
      fn();
      return () => { };
    }
    this.allReadyListeners.add(fn);
    return () => this.allReadyListeners.delete(fn);
  }

  private lastProgressNotifyTime = 0;
  private lastProgressPercent = 0;

  private notifyProgress(force = false) {
    const now = typeof performance !== 'undefined' ? performance.now() : Date.now();
    let totalLoaded = 0;
    for (let i = 1; i < INITIAL_LOAD_COUNT; i++) {
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
          cache.put(targetUrl, responseToStore).catch(() => { });
        }).catch(() => { });
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

    // Slot 1 (index 0) sudah tidak digunakan, muat video aktif mulai dari index 1 (Video 2)
    const indices = Array.from({ length: INITIAL_LOAD_COUNT - 1 }, (_, i) => i + 1);
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

    // Trigger 100% progress untuk fase awal (Video 2 s/d Video 12 selesai)
    for (const fn of this.progressListeners) {
      try {
        fn(100, INITIAL_VIDEOS_BYTE_SIZE, INITIAL_VIDEOS_BYTE_SIZE);
      } catch { }
    }

    for (const fn of this.initialReadyListeners) {
      try {
        fn();
      } catch { }
    }
    this.initialReadyListeners.clear();

    console.log('[VIDEO LOADER] Loading awal selesai! Video 2 s/d 4 siap. Tirai loading membuka sekarang...');

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('videosInitialLoaded', {
        detail: { count: INITIAL_LOAD_COUNT }
      }));
    }

    // Begitu loading awal selesai dan web terbuka, otomatis muat video berikutnya (Video 5 s/d 14) di background
    this.preloadRemainingVideosSequentially();
  }

  private isPreloadingRemaining = false;

  // 2. Fase 2: Preload di latar belakang untuk video berikutnya (Video 5 s/d Video 14)
  public async preloadRemainingVideosSequentially(): Promise<void> {
    if (this.isAllDone || this.isPreloadingRemaining) return;
    this.isPreloadingRemaining = true;

    console.log('[BACKGROUND PRELOAD] Web sudah terbuka! Sekarang mengunduh Video 5 s/d 14 di background...');

    // Video 5 s/d 14 (slot index 4 s/d 13)
    const remainingIndices = Array.from(
      { length: TOTAL_HOME_VIDEOS - INITIAL_LOAD_COUNT },
      (_, i) => i + INITIAL_LOAD_COUNT
    );

    for (const currentIndex of remainingIndices) {
      const videoNum = currentIndex + 1;
      if (this.blobUrls.has(currentIndex)) {
        console.log(`[BACKGROUND PRELOAD] Video ${videoNum} sudah ada di cache.`);
        continue;
      }

      const url = resolveVideoUrl(currentIndex);
      console.log(`[BACKGROUND PRELOAD] Mulai mengunduh Video ${videoNum}...`);
      let success = false;
      let attempt = 0;
      while (!success && attempt < 5) {
        attempt++;
        try {
          await this.fetchSingleVideoAsBlob(currentIndex, url);
          success = true;
          console.log(`[BACKGROUND PRELOAD] ✅ Video ${videoNum} SELESAI dimuat 100% ke memori!`);

          // Dispatch event agar ScrollVideoCanvas langsung meng-upgrade video element ke in-memory Blob
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('videoLoaded', { detail: { index: currentIndex } }));
          }
        } catch (err) {
          console.warn(`[Background Video Preload] Video ${videoNum} attempt ${attempt} failed:`, err);
          await new Promise((r) => setTimeout(r, 1000));
        }
      }
    }

    console.log('[BACKGROUND PRELOAD] ✅ Seluruh video (termasuk Video 14) kini 100% lengkap di memori.');

    this.isAllDone = true;
    this.isPreloadingRemaining = false;

    for (const fn of this.allReadyListeners) {
      try {
        fn();
      } catch { }
    }
    this.allReadyListeners.clear();

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('videosFullyLoaded', {
        detail: { count: TOTAL_HOME_VIDEOS }
      }));
    }
  }

  public async preloadRemainingVideos(): Promise<void> {
    return this.preloadRemainingVideosSequentially();
  }

  public async preloadAllVideos(
    concurrency = 3,
    onProgressUpdate?: (percent: number) => void
  ): Promise<void> {
    return this.preloadInitialVideos(concurrency, onProgressUpdate);
  }
}

export const videoCache = new VideoCacheManager();
