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

  const drawFrame = (frameIndex: number) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    frameIndex = Math.max(0, Math.min(frameIndex, frameCount - 1));
    let img = imagesRef.current[frameIndex];
    
    if (!img) {
      for (let i = frameIndex - 1; i >= 0; i--) if (imagesRef.current[i]) { img = imagesRef.current[i]; break; }
      if (!img) for (let i = frameIndex + 1; i < frameCount; i++) if (imagesRef.current[i]) { img = imagesRef.current[i]; break; }
    }
    
    if (!img) return;

    if (canvas.width !== img.width || canvas.height !== img.height) {
      canvas.width = img.width;
      canvas.height = img.height;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0);
  };

  useEffect(() => {
    if (frameCount === 0) return;
    
    let isActive = true;
    const pendingImages = new Set<HTMLImageElement>();
    const unloadedFrames = new Set(Array.from({ length: frameCount }, (_, i) => i));

    const loadFrame = (index: number, priorityTarget: number) => {
      return new Promise<void>((resolve) => {
        if (!isActive) return resolve();
        
        const img = new Image();
        pendingImages.add(img);
        
        img.decoding = "async";
        
        // Priority loading logic for Chromium (Chrome/Edge)
        // Berikan prioritas "high" pada batch terdekat dari titik scroll user (radius 15 frame)
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

        img.src = imagePaths[index];

        img.decode().then(() => {
          if (isActive) imagesRef.current[index] = img;
          cleanupAndResolve();
        }).catch(() => {
          // Fallback jika decode gagal
          if (isActive && img.complete && img.naturalWidth > 0) {
            imagesRef.current[index] = img;
          }
          cleanupAndResolve();
        });
      });
    };

    const bootSequence = async () => {
      // 1. Dapatkan index pertama berdasarkan posisi scroll user SAT INI (jangan selalu 0)
      const currentTargetIndex = Math.floor(progress.get() * (frameCount - 1)) || 0;

      // Render frame pertama dengan prioritas sangat tinggi
      const firstImg = new Image();
      pendingImages.add(firstImg);
      (firstImg as any).fetchPriority = 'high';
      firstImg.src = imagePaths[currentTargetIndex];
      await firstImg.decode().catch(() => {});
      
      pendingImages.delete(firstImg);
      if (!isActive) return;
      
      imagesRef.current[currentTargetIndex] = firstImg;
      unloadedFrames.delete(currentTargetIndex);
      drawFrame(currentTargetIndex);

      // 2. Tunggu loader utama selesai
      await new Promise<void>((resolve) => {
        const proceed = () => {
          if (!isActive) return resolve();
          setTimeout(resolve, 2000);
        };
        
        if ((window as any).isLoaderFinished) {
          proceed();
        } else {
          const onFinished = () => {
            window.removeEventListener('loaderFinished', onFinished);
            proceed();
          };
          window.addEventListener('loaderFinished', onFinished);
        }
      });

      if (!isActive) return;

      // 3. Dynamic Adaptive Batching berdasarkan kualitas network
      const connection = (navigator as any).connection;
      const isSlowConnection = connection ? (
        connection.saveData || 
        connection.effectiveType === 'slow-2g' || 
        connection.effectiveType === '2g' || 
        connection.effectiveType === '3g'
      ) : false;
      
      const baseChunkSize = isSlowConnection ? 15 : 40;

      const loadNextBatch = async () => {
        if (!isActive || unloadedFrames.size === 0) return;

        // Ambil target index TERBARU (update real-time setiap mulai load batch baru)
        const currentTarget = Math.floor(progress.get() * (frameCount - 1));

        // Sortir frame yang tersisa berdasarkan Jarak Terdekat ke frame yg user lihat sekarang
        const sortedUnloaded = Array.from(unloadedFrames).sort((a, b) => {
          return Math.abs(a - currentTarget) - Math.abs(b - currentTarget);
        });

        const batch = sortedUnloaded.slice(0, baseChunkSize);
        batch.forEach(i => unloadedFrames.delete(i));

        const startTime = import.meta.env.DEV ? performance.now() : 0;

        await Promise.all(batch.map(index => loadFrame(index, currentTarget)));

        if (import.meta.env.DEV) {
          console.log(`[ScrollSequence] Loaded chunk of ${batch.length} frames in ${Math.round(performance.now() - startTime)}ms`);
        }

        if (isActive) {
          // Force redraw in case the correct frame for current progress just finished loading
          // but the user hasn't scrolled yet to trigger a redraw.
          if (requestRef.current) cancelAnimationFrame(requestRef.current);
          requestRef.current = requestAnimationFrame(() => {
            drawFrame(Math.floor(progress.get() * (frameCount - 1)));
          });
        }

        if (isActive && unloadedFrames.size > 0) {
          // requestIdleCallback mencegah freezing di main thread Chromium / Edge saat decoding WebP
          if ('requestIdleCallback' in window) {
            (window as any).requestIdleCallback(() => loadNextBatch(), { timeout: 2000 });
          } else {
            setTimeout(loadNextBatch, 10);
          }
        }
      };

      loadNextBatch();
    };

    bootSequence();

    // 4. Memory Safety Cleanup yang Brutal & Ekstensif
    return () => {
      isActive = false;
      
      // A. Batalkan semua request image in-flight & lepas referensi memory-nya
      pendingImages.forEach(img => { 
        img.src = ''; 
        img.onload = null;
        img.onerror = null;
      });
      pendingImages.clear();

      // B. Hancurkan referensi frame yang sudah beres ter-load di array
      imagesRef.current.forEach(img => { 
        if (img) {
          img.src = '';
          img.onload = null;
          img.onerror = null;
        }
      });
      imagesRef.current = new Array(frameCount).fill(null);

      // C. Bebaskan backing store dari element canvas itu sendiri
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
        canvas.width = 0;
        canvas.height = 0;
      }
    };
  }, [imagePaths, frameCount, progress]);

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
      className={`w-full h-full object-cover ${className?.includes('object-') ? '' : 'object-center'} ${className || ''}`} 
    />
  );
}