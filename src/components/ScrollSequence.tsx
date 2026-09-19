import { useRef, useEffect, useState } from 'react';
import { MotionValue } from 'framer-motion';
import { sequenceCache } from '../lib/sequenceCache';

interface ScrollSequenceProps {
  progress: MotionValue<number>;
  frameCount: number;
  imagePaths: string[];
  className?: string;
  initialPreviewFrames?: number;
  onLoadedChange?: (isLoaded: boolean) => void;
  onProgress?: (progress: number, loaded: number, total: number) => void;
}

export default function ScrollSequence({ 
  progress, 
  frameCount, 
  imagePaths, 
  className,
  initialPreviewFrames = 24,
  onLoadedChange,
  onProgress
}: ScrollSequenceProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<(HTMLImageElement | null)[]>([]);
  const lastDrawnImgRef = useRef<HTMLImageElement | null>(null);
  const requestRef = useRef<number>(0);
  const imagePathsRef = useRef(imagePaths);
  const isFullyLoadedRef = useRef(false);
  const [isFullyLoaded, setIsFullyLoaded] = useState(false);

  // Batas frame awal (gambar-gambar pertama) yang diutamakan jika sequence belum selesai di-load
  const FIRST_IMAGES_LIMIT = Math.max(1, Math.min(initialPreviewFrames, frameCount));

  useEffect(() => {
    imagePathsRef.current = imagePaths;
  }, [imagePaths]);

  // Synchronously populate imagesRef from sequenceCache whenever imagePaths change
  useEffect(() => {
    imagesRef.current = new Array(frameCount).fill(null);
    let cachedCount = 0;
    for (let i = 0; i < frameCount; i++) {
      if (imagePaths[i]) {
        const cached = sequenceCache.get(imagePaths[i]);
        if (cached) {
          imagesRef.current[i] = cached;
          cachedCount++;
        }
      }
    }
    // Jika semua frame sudah ada di cache sebelumnya (misal reload atau navigasi ulang)
    const initialPercent = frameCount > 0 ? Math.min(100, Math.round((cachedCount / frameCount) * 100)) : 0;
    onProgress?.(initialPercent, cachedCount, frameCount);

    if (cachedCount >= Math.floor(frameCount * 0.95) && frameCount > 0) {
      isFullyLoadedRef.current = true;
      setIsFullyLoaded(true);
      onLoadedChange?.(true);
      onProgress?.(100, frameCount, frameCount);
    } else {
      isFullyLoadedRef.current = false;
      setIsFullyLoaded(false);
      onLoadedChange?.(false);
    }
  }, [imagePaths, frameCount, onLoadedChange, onProgress]);

  const drawFrame = (frameIndex: number) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    frameIndex = Math.max(0, Math.min(frameIndex, frameCount - 1));

    let img = imagesRef.current[frameIndex];

    // 1. Coba ambil dari sequenceCache jika belum di-set di array ref
    if (!img && imagePathsRef.current[frameIndex]) {
      img = sequenceCache.get(imagePathsRef.current[frameIndex]) || null;
      if (img) imagesRef.current[frameIndex] = img;
    }

    // 2. Monotonic Backwards Search ONLY:
    // Cari frame sebelumnya yang sudah siap mundur ke arah frame 0.
    if (!img) {
      for (let i = frameIndex - 1; i >= 0; i--) {
        const candidate = imagesRef.current[i] || sequenceCache.get(imagePathsRef.current[i]) || null;
        if (candidate) {
          img = candidate;
          break;
        }
      }
    }

    // 3. Fallback ke gambar terakhir yang berhasil dirender atau frame 0
    if (!img) {
      img = lastDrawnImgRef.current || imagesRef.current[0] || sequenceCache.get(imagePathsRef.current[0]) || null;
    }

    if (!img) return;

    lastDrawnImgRef.current = img;

    const imgW = img.naturalWidth || img.width || 1920;
    const imgH = img.naturalHeight || img.height || 1080;

    if (canvas.width !== imgW || canvas.height !== imgH) {
      canvas.width = imgW;
      canvas.height = imgH;
    }

    // drawImage langsung menimpa pixel tanpa jeda kedip
    ctx.drawImage(img, 0, 0);
  };

  useEffect(() => {
    if (frameCount === 0) return;

    let isActive = true;

    let loadedCount = 0;
    for (let i = 0; i < frameCount; i++) {
      if (imagesRef.current[i] || sequenceCache.has(imagePathsRef.current[i])) {
        loadedCount++;
      }
    }

    const reportProgress = () => {
      if (frameCount <= 0) return;
      const pct = Math.min(100, Math.round((loadedCount / frameCount) * 100));
      onProgress?.(pct, loadedCount, frameCount);
    };

    reportProgress();

    const loadFrame = async (index: number, priority: 'high' | 'low' = 'low') => {
      if (!isActive) return null;
      const url = imagePathsRef.current[index];
      if (!url) return null;

      if (imagesRef.current[index]) {
        return imagesRef.current[index];
      }

      const cached = sequenceCache.get(url);
      if (cached) {
        imagesRef.current[index] = cached;
        return cached;
      }

      const img = await sequenceCache.preloadImage(url, priority);
      if (isActive && img) {
        imagesRef.current[index] = img;
        loadedCount++;
        reportProgress();
        return img;
      }
      return null;
    };

      const bootSequence = async () => {
        // 1. Gambar frame 0 pada canvas di background
        drawFrame(0);

        // 2. PRIORITAS UTAMA: Download frame-frame pertama
        const initialPromises = [];
        for (let i = 0; i < FIRST_IMAGES_LIMIT; i++) {
          if (!imagesRef.current[i] && imagePathsRef.current[i]) {
            initialPromises.push(loadFrame(i, 'high'));
          }
        }
        if (initialPromises.length > 0) {
          await Promise.all(initialPromises);
        }

        if (!isActive) return;

        // Periksa apakah semua frame sudah siap (misal dari cache)
        const isComplete = () => {
          let loaded = 0;
          for (let i = 0; i < frameCount; i++) {
            if (imagesRef.current[i] || sequenceCache.has(imagePathsRef.current[i])) {
              loaded++;
            }
          }
          return loaded >= Math.floor(frameCount * 0.95);
        };

        if (isComplete()) {
          isFullyLoadedRef.current = true;
          setIsFullyLoaded(true);
          onLoadedChange?.(true);
          onProgress?.(100, frameCount, frameCount);
          const currentPos = Math.floor(progress.get() * (frameCount - 1)) || 0;
          drawFrame(currentPos);
          return;
        }

        // 3. PRIORITAS KEDUA: Load sisa frame di background secara berurutan
        const remainingIndexes: number[] = [];
        for (let i = FIRST_IMAGES_LIMIT; i < frameCount; i++) {
          if (!imagesRef.current[i] && !sequenceCache.has(imagePathsRef.current[i])) {
            remainingIndexes.push(i);
          } else if (!imagesRef.current[i]) {
            imagesRef.current[i] = sequenceCache.get(imagePathsRef.current[i]) || null;
          }
        }

        if (remainingIndexes.length === 0) {
          isFullyLoadedRef.current = true;
          setIsFullyLoaded(true);
          onLoadedChange?.(true);
          onProgress?.(100, frameCount, frameCount);
          const currentPos = Math.floor(progress.get() * (frameCount - 1)) || 0;
          drawFrame(currentPos);
          return;
        }

        // Gunakan 6 worker paralel untuk mendownload sisa frame dari R2 secara berurutan
        const concurrency = 6;
        let qIdx = 0;
        const worker = async () => {
          while (isActive && qIdx < remainingIndexes.length) {
            const idx = remainingIndexes[qIdx++];
            await loadFrame(idx, 'low');
          }
        };

        await Promise.all(Array.from({ length: concurrency }, worker));

        if (isActive) {
          isFullyLoadedRef.current = true;
          setIsFullyLoaded(true);
          onLoadedChange?.(true);
          onProgress?.(100, frameCount, frameCount);
          // Buka kunci seluruh scrub animasi setelah semua frame terdownload 100%
          const finalPos = Math.floor(progress.get() * (frameCount - 1)) || 0;
          drawFrame(finalPos);
        }
      };

      bootSequence();

      return () => {
        isActive = false;
      };
    }, [frameCount, FIRST_IMAGES_LIMIT, onLoadedChange, onProgress]);

  useEffect(() => {
    // Render awal
    if (isFullyLoadedRef.current) {
      drawFrame(Math.floor(progress.get() * (frameCount - 1)) || 0);
    }

    const unsubscribe = progress.on("change", (v) => {
      // JIKA BELUM TERLOAD SEMUAAA: Cukup statis blank dengan grid, jangan gerakkan animasi frame!
      if (!isFullyLoadedRef.current) return;

      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      requestRef.current = requestAnimationFrame(() => {
        drawFrame(Math.floor(v * (frameCount - 1)));
      });
    });

    return () => {
      unsubscribe();
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [progress, frameCount]);

  const objectFitClass = className?.includes('object-contain') ? 'object-contain' : 'object-cover';
  const objectPositionClass = className?.includes('object-') ? '' : 'object-center';
  const combinedClass = `${objectFitClass} ${objectPositionClass} ${className || ''}`;

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Canvas Animasi Sequence: Fade in hanya saat semua frame sudah 100% siap */}
      <canvas
        ref={canvasRef}
        className={`absolute inset-0 w-full h-full block ${combinedClass} transition-opacity duration-1000 ${
          isFullyLoaded ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      />
    </div>
  );
}