import { useEffect } from 'react';
import { sequenceCache } from '../lib/sequenceCache';
import { videoCache } from '../lib/videoCache';
import { nosotrosSequenceFrames, modelSequenceFrames } from '../lib/sequences';

export default function RouteSequencePreloader() {
  // 1. Begitu Video 1 & 2 lokal selesai terpasang dan loader awal selesai,
  // mulai cicil download frame Nosotros & Model di background idle
  useEffect(() => {
    let isCancelled = false;

    const startBackgroundSequencePreload = () => {
      // Prioritaskan Nosotros terlebih dahulu (frame 0 sampai selesai)
      const queue = [
        ...nosotrosSequenceFrames.filter((url) => !sequenceCache.has(url)),
        ...modelSequenceFrames.filter((url) => !sequenceCache.has(url))
      ];

      if (queue.length === 0 || isCancelled) return;

      let idx = 0;
      const batchSize = 6; // Unduh 6 frame per batch secara asinkron

      const loadNextBatch = () => {
        if (isCancelled || idx >= queue.length) return;
        const batch = queue.slice(idx, idx + batchSize);
        idx += batchSize;

        Promise.all(batch.map((url) => sequenceCache.preloadImage(url, 'low'))).then(() => {
          if (!isCancelled && idx < queue.length) {
            if ('requestIdleCallback' in window) {
              (window as any).requestIdleCallback(() => {
                setTimeout(loadNextBatch, 80);
              }, { timeout: 1000 });
            } else {
              setTimeout(loadNextBatch, 100);
            }
          }
        });
      };

      // Mulai saat browser sedang idle agar tidak mengganggu rendering animasi Home
      if ('requestIdleCallback' in window) {
        (window as any).requestIdleCallback(loadNextBatch, { timeout: 2500 });
      } else {
        setTimeout(loadNextBatch, 1000);
      }
    };

    // Jalankan setelah loader pembuka selesai agar bandwidth awal fokus ke Video 1 & 2
    if (videoCache.isInitialReady()) {
      startBackgroundSequencePreload();
    } else {
      const unsub = videoCache.onInitialReady(startBackgroundSequencePreload);
      window.addEventListener('loaderFinished', startBackgroundSequencePreload, { once: true });
      return () => {
        isCancelled = true;
        unsub();
        window.removeEventListener('loaderFinished', startBackgroundSequencePreload);
      };
    }

    return () => {
      isCancelled = true;
    };
  }, []);

  return null;
}
