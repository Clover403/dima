import { useRef, useEffect, useState } from 'react';
import { MotionValue } from 'framer-motion';

interface ScrollVideoProps {
  progress: MotionValue<number>;
  src: string;
  className?: string;
  onLoadedChange?: (isLoaded: boolean) => void;
  onProgress?: (progress: number) => void;
}

export default function ScrollVideo({ 
  progress, 
  src, 
  className,
  onLoadedChange,
  onProgress
}: ScrollVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isReady, setIsReady] = useState(false);
  const targetProgressRef = useRef<number>(progress.get());
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.pause();

    const checkAndReportProgress = () => {
      if (!video) return false;
      if (video.duration && video.buffered.length > 0) {
        let maxBuffered = 0;
        for (let i = 0; i < video.buffered.length; i++) {
          if (video.buffered.end(i) > maxBuffered) {
            maxBuffered = video.buffered.end(i);
          }
        }
        const pct = Math.min(100, Math.round((maxBuffered / video.duration) * 100));
        onProgress?.(pct);
        if (pct >= 95 || video.readyState >= 4) {
          setIsReady(true);
          onLoadedChange?.(true);
          onProgress?.(100);
          return true;
        }
      } else if (video.readyState >= 3) {
        setIsReady(true);
        onLoadedChange?.(true);
        onProgress?.(100);
        return true;
      }
      return false;
    };

    const handleLoadedMetadata = () => {
      if (video.duration) {
        video.currentTime = targetProgressRef.current * video.duration;
      }
      checkAndReportProgress();
    };

    const handleCanPlay = () => {
      setIsReady(true);
      onLoadedChange?.(true);
      onProgress?.(100);
    };

    const handleProgress = () => {
      checkAndReportProgress();
    };

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('canplaythrough', handleCanPlay);
    video.addEventListener('progress', handleProgress);

    if (video.readyState >= 3) {
      setIsReady(true);
      onLoadedChange?.(true);
      onProgress?.(100);
    } else {
      onProgress?.(15);
    }

    const interval = setInterval(() => {
      const isDone = checkAndReportProgress();
      if (isDone) clearInterval(interval);
    }, 250);

    const renderLoop = () => {
      if (video && video.duration && !isNaN(video.duration) && video.readyState >= 2) {
        const targetTime = Math.max(0, Math.min(video.duration, targetProgressRef.current * video.duration));
        if (Math.abs(video.currentTime - targetTime) > 0.005) {
          video.currentTime = targetTime;
        }
      }
      rafRef.current = requestAnimationFrame(renderLoop);
    };

    rafRef.current = requestAnimationFrame(renderLoop);

    const unsubscribe = progress.on('change', (v) => {
      targetProgressRef.current = Math.max(0, Math.min(1, v));
    });

    return () => {
      unsubscribe();
      clearInterval(interval);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('canplaythrough', handleCanPlay);
      video.removeEventListener('progress', handleProgress);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [progress, src, onLoadedChange, onProgress]);

  return (
    <video
      ref={videoRef}
      src={src}
      muted
      playsInline
      preload="auto"
      className={`w-full h-full object-cover pointer-events-none ${className || ''}`}
      style={{
        opacity: isReady ? 1 : 0,
        transition: 'opacity 0.4s ease-out'
      }}
    />
  );
}
