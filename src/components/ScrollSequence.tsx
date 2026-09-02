import { useRef, useEffect } from 'react';
import { MotionValue } from 'framer-motion';
import { sequenceCache } from '../lib/sequenceCache';

interface ScrollSequenceProps {
  progress: MotionValue<number>;
  frameCount: number;
  imagePaths: string[];
  className?: string;
}

export default function ScrollSequence({ progress, frameCount, imagePaths, className }: ScrollSequenceProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<(HTMLImageElement | null)[]>([]);
  const lastDrawnImgRef = useRef<HTMLImageElement | null>(null);
  const requestRef = useRef<number>(0);
  const imagePathsRef = useRef(imagePaths);

  useEffect(() => {
    imagePathsRef.current = imagePaths;
  }, [imagePaths]);

  // Synchronously populate imagesRef from sequenceCache whenever imagePaths change
  useEffect(() => {
    imagesRef.current = new Array(frameCount).fill(null);
    for (let i = 0; i < frameCount; i++) {
      if (imagePaths[i]) {
        const cached = sequenceCache.get(imagePaths[i]);
        if (cached) imagesRef.current[i] = cached;
      }
    }
  }, [imagePaths, frameCount]);

  const drawFrame = (frameIndex: number) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    frameIndex = Math.max(0, Math.min(frameIndex, frameCount - 1));
    let img = imagesRef.current[frameIndex];

    // 1. Coba ambil dari sequenceCache jika belum di-set
    if (!img && imagePathsRef.current[frameIndex]) {
      img = sequenceCache.get(imagePathsRef.current[frameIndex]) || null;
      if (img) imagesRef.current[frameIndex] = img;
    }

    // 2. O(1) Fast Local Radius Search (Mencari frame terdekat di sekitar target)
    if (!img) {
      for (let offset = 1; offset <= 25; offset++) {
        const left = frameIndex - offset;
        if (left >= 0) {
          const candidate = imagesRef.current[left] || sequenceCache.get(imagePathsRef.current[left]) || null;
          if (candidate) { img = candidate; break; }
        }
        const right = frameIndex + offset;
        if (right < frameCount) {
          const candidate = imagesRef.current[right] || sequenceCache.get(imagePathsRef.current[right]) || null;
          if (candidate) { img = candidate; break; }
        }
      }
    }

    // 3. Fallback ke gambar terakhir yang berhasil di-render (Never clear to blank!)
    if (!img) {
      img = lastDrawnImgRef.current;
    }

    if (!img) return;

    lastDrawnImgRef.current = img;

    const imgW = img.naturalWidth || img.width || 1920;
    const imgH = img.naturalHeight || img.height || 1080;

    if (canvas.width !== imgW || canvas.height !== imgH) {
      canvas.width = imgW;
      canvas.height = imgH;
    }

    // JANGAN GUNAKAN ctx.clearRect() - drawImage langsung menimpa pixel tanpa jeda kedip!
    ctx.drawImage(img, 0, 0);
  };

  useEffect(() => {
    if (frameCount === 0) return;

    let isActive = true;

    const loadFrame = async (index: number, priorityTarget: number) => {
      if (!isActive) return;
      const url = imagePathsRef.current[index];
      if (!url) return;

      if (imagesRef.current[index]) {
        const currentFrame = Math.floor(progress.get() * (frameCount - 1));
        if (index === currentFrame) drawFrame(index);
        return;
      }

      const distance = Math.abs(index - priorityTarget);
      const priority = distance <= 15 ? 'high' : 'low';
      const img = await sequenceCache.preloadImage(url, priority);

      if (isActive && img) {
        imagesRef.current[index] = img;
        const currentFrame = Math.floor(progress.get() * (frameCount - 1));
        if (index === currentFrame) drawFrame(index);
      }
    };

    const bootSequence = async () => {
      let currentTargetIndex = Math.floor(progress.get() * (frameCount - 1)) || 0;
      if (window.scrollY === 0) currentTargetIndex = 0;

      // Draw initial frame immediately from cache if available
      drawFrame(currentTargetIndex);

      await loadFrame(currentTargetIndex, currentTargetIndex);

      if (!isActive) return;

      // Load all remaining frames
      const remainingIndexes = Array.from({ length: frameCount }, (_, i) => i)
        .filter(i => !imagesRef.current[i]);

      remainingIndexes.forEach(index => loadFrame(index, currentTargetIndex));
    };

    bootSequence();

    return () => {
      isActive = false;
    };
  }, [frameCount]);

  useEffect(() => {
    drawFrame(Math.floor(progress.get() * (frameCount - 1)) || 0);

    const unsubscribe = progress.on("change", (v) => {
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
    <div className="relative w-full h-full">
      <canvas
        ref={canvasRef}
        className={`absolute inset-0 w-full h-full ${combinedClass}`}
      />
    </div>
  );
}