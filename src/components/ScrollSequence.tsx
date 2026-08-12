import { useRef, useEffect } from 'react';
import { MotionValue } from 'framer-motion';

interface ScrollSequenceProps {
  progress: MotionValue<number>;
  frameCount: number;
  imagePaths: string[];
  className?: string;
}

export default function ScrollSequence({ progress, frameCount, imagePaths, className }: ScrollSequenceProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<(HTMLImageElement | null)[]>(new Array(frameCount).fill(null));
  const requestRef = useRef<number>(0);

  const imagePathsRef = useRef(imagePaths);
  useEffect(() => {
    imagePathsRef.current = imagePaths;
  }, [imagePaths]);

  const drawFrame = (frameIndex: number) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) {
      console.log("[ScrollSequence] drawFrame aborted: no canvas or ctx");
      return;
    }

    frameIndex = Math.max(0, Math.min(frameIndex, frameCount - 1));
    let img = imagesRef.current[frameIndex];

    if (!img) {
      for (let i = frameIndex - 1; i >= 0; i--) if (imagesRef.current[i]) { img = imagesRef.current[i]; break; }
      if (!img) for (let i = frameIndex + 1; i < frameCount; i++) if (imagesRef.current[i]) { img = imagesRef.current[i]; break; }
    }

    if (!img) {
      console.log(`[ScrollSequence] drawFrame(${frameIndex}) aborted: no img found`);
      return;
    }

    const imgW = img.naturalWidth || img.width;
    const imgH = img.naturalHeight || img.height;
    
    console.log(`[ScrollSequence] Drawing frame ${frameIndex}. Image size: ${imgW}x${imgH}`);

    if (canvas.width !== imgW || canvas.height !== imgH) {
      canvas.width = imgW;
      canvas.height = imgH;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0);
  };

  useEffect(() => {
    if (frameCount === 0) return;

    let isActive = true;
    const pendingImages = new Set<HTMLImageElement>();
    const unloadedFrames = new Set(Array.from({ length: frameCount }, (_, i) => i));

    // MENGGUNAKAN ONLOAD (Stabil di Windows/Chromium)
    const loadFrame = (index: number, priorityTarget: number) => {
      return new Promise<void>((resolve) => {
        if (!isActive) return resolve();

        const img = new Image();
        pendingImages.add(img);

        const distance = Math.abs(index - priorityTarget);
        if (distance <= 15) {
          (img as any).fetchPriority = "high";
        } else {
          (img as any).fetchPriority = "low";
        }

        const cleanupAndResolve = () => {
          pendingImages.delete(img);
          resolve();
        };

        img.onload = async () => {
          if (isActive) {
            try {
              await img.decode();
            } catch (e) {
              // Ignore decode errors, fallback to raw draw
            }
            imagesRef.current[index] = img;
            const currentFrame = Math.floor(progress.get() * (frameCount - 1));
            if (index === currentFrame) {
              drawFrame(index);
            }
          }
          cleanupAndResolve();
        };

        img.onerror = () => cleanupAndResolve();

        img.src = imagePathsRef.current[index];
      });
    };

const bootSequence = async () => {
      let currentTargetIndex = Math.floor(progress.get() * (frameCount - 1)) || 0;
      if (window.scrollY === 0) currentTargetIndex = 0;

      // 1. Prioritaskan Frame Pertama agar canvas tidak kosong
      await new Promise<void>((resolve) => {
        const firstImg = new Image();
        pendingImages.add(firstImg);
        (firstImg as any).fetchPriority = 'high';

        firstImg.onload = async () => {
          if (isActive) {
            try { await firstImg.decode(); } catch (e) {}
            imagesRef.current[currentTargetIndex] = firstImg;
            unloadedFrames.delete(currentTargetIndex);
            drawFrame(currentTargetIndex);
          }
          pendingImages.delete(firstImg);
          resolve();
        };

        firstImg.onerror = () => resolve();
        firstImg.src = imagePathsRef.current[currentTargetIndex];
      });

      if (!isActive) return;

      // 2. HAJAR SEMUA SISA FRAME SEKALIGUS (Aggressive Load)
      // Hapus tunggu loaderFinished, hapus cek koneksi, hapus sistem batch
      const remainingFrames = Array.from(unloadedFrames);
      
      Promise.all(remainingFrames.map(index => {
        unloadedFrames.delete(index);
        return loadFrame(index, currentTargetIndex);
      }));
    };

    bootSequence();

    return () => {
      isActive = false;

      pendingImages.forEach(img => {
        img.onload = null;
        img.onerror = null;
      });
      pendingImages.clear();

      imagesRef.current = new Array(frameCount).fill(null);

      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    };
  }, [frameCount]);

  useEffect(() => {
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

  return (
    <canvas
      ref={canvasRef}
      className={`w-full h-full ${className?.includes('object-contain') ? 'object-contain' : 'object-cover'} ${className?.includes('object-') ? '' : 'object-center'} ${className || ''}`}
    />
  );
}