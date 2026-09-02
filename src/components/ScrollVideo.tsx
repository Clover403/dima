import { useRef, useEffect, useState } from 'react';
import { MotionValue } from 'framer-motion';

interface ScrollVideoProps {
  progress: MotionValue<number>;
  src: string;
  className?: string;
}

export default function ScrollVideo({ progress, src, className }: ScrollVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isReady, setIsReady] = useState(false);
  const targetProgressRef = useRef<number>(progress.get());
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.pause();

    const handleLoadedMetadata = () => {
      setIsReady(true);
      if (video.duration) {
        video.currentTime = targetProgressRef.current * video.duration;
      }
    };

    const handleCanPlay = () => {
      setIsReady(true);
    };

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('canplay', handleCanPlay);

    if (video.readyState >= 1) {
      setIsReady(true);
    }

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
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('canplay', handleCanPlay);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [progress, src]);

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
