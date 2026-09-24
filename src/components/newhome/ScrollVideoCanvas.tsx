import { useState, useRef, useEffect, useLayoutEffect, useCallback, forwardRef, useImperativeHandle } from 'react';
import { videoCache, TOTAL_HOME_VIDEOS } from '../../lib/videoCache';

export interface ActiveVideoTarget {
  index: number; // 1 to 10
  progress: number; // 0 to 1
  opacity: number; // 0 to 1
}

export interface ScrollVideoCanvasHandle {
  setScrub: (
    activeVidIndex: number, // 1 to 10
    progress: number, // 0 to 1
    shiftX: number, // 0 to 18%
    overlayOpacity: number // 0 to 0.50
  ) => void;
}

interface ScrollVideoCanvasProps {
  targets?: ActiveVideoTarget[];
  className?: string;
  canvasShiftX?: number; // 0 to 42%
  overlayOpacity?: number; // 0 to 0.50
}

const TOTAL_VIDEOS = TOTAL_HOME_VIDEOS;
const KNOWN_DURATIONS = [13.0, 10.0, 10.0, 10.0, 8.0, 10.0, 10.0, 8.0, 8.0, 10.0, 6.0, 10.0];

const ScrollVideoCanvas = forwardRef<ScrollVideoCanvasHandle, ScrollVideoCanvasProps>(
  ({ className = '', canvasShiftX = 0 }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const overlayRef = useRef<HTMLDivElement>(null);
    const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
    const durationsRef = useRef<number[]>([...KNOWN_DURATIONS]);
    const currentTimesRef = useRef<number[]>(new Array(TOTAL_VIDEOS).fill(0));
    const targetTimesRef = useRef<number[]>(new Array(TOTAL_VIDEOS).fill(0));

    // Hardware decoder protection: prevent seek thrashing & pipeline stalls
    const isSeekingRef = useRef<boolean[]>(new Array(TOTAL_VIDEOS).fill(false));
    const pendingSeekRef = useRef<(number | null)[]>(new Array(TOTAL_VIDEOS).fill(null));

    // Track active and previous video indices for foolproof double-buffered layering
    const activeIdxRef = useRef<number>(0);
    const lastActiveIdxRef = useRef<number>(0);
    const rafRef = useRef<number | null>(null);

    // Dynamic video sources: initialized from cache (or URLs), seamlessly swapped to in-memory Blobs
    const [videoSources, setVideoSources] = useState<string[]>(() =>
      Array.from({ length: TOTAL_VIDEOS }, (_, i) => videoCache.getVideoSrc(i))
    );

    // Reset video refs, scrubbing timestamps, and hardware state on mount
    useLayoutEffect(() => {
      activeIdxRef.current = 0;
      lastActiveIdxRef.current = 0;
      currentTimesRef.current.fill(0);
      targetTimesRef.current.fill(0);
      isSeekingRef.current.fill(false);
      pendingSeekRef.current.fill(null);

      if (containerRef.current) {
        containerRef.current.style.transform = canvasShiftX !== 0 ? `translateX(${canvasShiftX}%)` : 'none';
      }
      if (overlayRef.current) {
        overlayRef.current.style.opacity = '0';
      }

      // Prime Video 1 immediately to opening frame (0.001s)
      const v1 = videoRefs.current[0];
      if (v1) {
        try {
          v1.currentTime = 0.001;
        } catch {}
      }
    }, [canvasShiftX]);

    // Subscribe to video cache ready event to upgrade video sources to instant in-memory Blobs
    useEffect(() => {
      const upgradeToBlobs = () => {
        const newSources = Array.from({ length: TOTAL_VIDEOS }, (_, i) => videoCache.getVideoSrc(i));
        setVideoSources(newSources);

        // Sambungkan langsung DOM video element ke in-memory Blob URL
        for (let i = 0; i < TOTAL_VIDEOS; i++) {
          const v = videoRefs.current[i];
          const bSrc = newSources[i];
          if (v && bSrc && v.src !== bSrc) {
            v.src = bSrc;
            v.load();
          }
        }

        // Prime Video 1 immediately
        const v1 = videoRefs.current[0];
        if (v1) {
          try {
            v1.currentTime = 0.001;
          } catch {}
        }
      };

      if (videoCache.isInitialReady()) {
        upgradeToBlobs();
      }

      window.addEventListener('videosInitialLoaded', upgradeToBlobs);
      window.addEventListener('videosFullyLoaded', upgradeToBlobs);
      const unsubInitial = videoCache.onInitialReady(upgradeToBlobs);
      const unsubAll = videoCache.onReady(upgradeToBlobs);

      return () => {
        unsubInitial();
        unsubAll();
        window.removeEventListener('videosInitialLoaded', upgradeToBlobs);
        window.removeEventListener('videosFullyLoaded', upgradeToBlobs);
      };
    }, []);

    // Handle metadata load to refine exact durations and prime frame 0
    const handleLoadedMetadata = useCallback((index: number) => {
      const video = videoRefs.current[index];
      if (video && !isNaN(video.duration) && video.duration > 0) {
        durationsRef.current[index] = video.duration;
      }

      // If Video 1 metadata is loaded and we are at start position, ensure frame 0.001 is decoded
      if (index === 0 && targetTimesRef.current[0] <= 0.02) {
        const v1 = videoRefs.current[0];
        if (v1) {
          try {
            v1.currentTime = 0.001;
          } catch {}
        }
      }
    }, []);

    // On seek completed: unlock decoder and immediately process any pending seek
    const handleSeeked = useCallback((index: number) => {
      isSeekingRef.current[index] = false;
      const pending = pendingSeekRef.current[index];
      if (pending !== null) {
        pendingSeekRef.current[index] = null;
        const video = videoRefs.current[index];
        if (video && Math.abs(video.currentTime - pending) > 0.006) {
          isSeekingRef.current[index] = true;
          try {
            video.currentTime = pending;
          } catch {
            isSeekingRef.current[index] = false;
          }
        }
      }
    }, []);

    // Expose high-performance imperative scrubbing handle (Zero React re-render overhead!)
    useImperativeHandle(ref, () => ({
      setScrub: (activeVidIndex: number, progress: number, shiftX: number, overlayOp: number) => {
        const vidIdx = activeVidIndex - 1;
        if (vidIdx >= 0 && vidIdx < TOTAL_VIDEOS) {
          const duration = durationsRef.current[vidIdx] || KNOWN_DURATIONS[vidIdx] || 10;
          const isAtStart = vidIdx === 0 && progress <= 0.005;
          const safeProgress = isAtStart ? 0.001 : Math.max(0.001, Math.min(0.999, progress));
          const targetTime = safeProgress * duration;
          targetTimesRef.current[vidIdx] = targetTime;

          if (isAtStart) {
            currentTimesRef.current[0] = 0.001;
            const v1 = videoRefs.current[0];
            if (v1 && !v1.seeking && Math.abs(v1.currentTime - 0.001) > 0.02) {
              try {
                v1.currentTime = 0.001;
              } catch {}
            }
          }

          if (vidIdx !== activeIdxRef.current) {
            lastActiveIdxRef.current = activeIdxRef.current;
            activeIdxRef.current = vidIdx;

            // Prime newly active video immediately so it doesn't lerp from stale frame
            currentTimesRef.current[vidIdx] = targetTime;
            const newVid = videoRefs.current[vidIdx];
            if (newVid && !newVid.seeking) {
              try {
                newVid.currentTime = targetTime;
              } catch {
                // Ignore
              }
            }
          }
        }

        // Direct hardware transform update without CSS transition interference
        if (containerRef.current) {
          containerRef.current.style.transform = shiftX !== 0 ? `translateX(${shiftX}%)` : 'none';
        }

        // Direct overlay opacity update
        if (overlayRef.current) {
          overlayRef.current.style.opacity = String(overlayOp);
        }
      },
    }));

    // High-performance RAF animation loop:
    // 1. Hardware seek-locking: never queue seeks while Chromium decoder is actively seeking
    // 2. Active video has z-index 10, opacity 1
    // 3. Last active video has z-index 5, opacity 1 (held underneath as solid buffer)
    // 4. Inactive videos have z-index 1, opacity 0
    // 5. Zero neighbor seeking in RAF loop = zero GPU decoder congestion
    useEffect(() => {
      let active = true;

      const tick = () => {
        if (!active) return;

        const currentActive = activeIdxRef.current;
        const lastActive = lastActiveIdxRef.current;

        for (let i = 0; i < TOTAL_VIDEOS; i++) {
          const video = videoRefs.current[i];
          if (!video) continue;

          if (i === currentActive) {
            if (video.style.zIndex !== '10') video.style.zIndex = '10';
            if (video.style.opacity !== '1') video.style.opacity = '1';

            // Smooth time lerp for silky scrubbing
            const targetTime = targetTimesRef.current[i];
            const currentTime = currentTimesRef.current[i];
            const timeDiff = targetTime - currentTime;

            if (Math.abs(timeDiff) > 0.002) {
              currentTimesRef.current[i] += timeDiff * 0.35;
            } else {
              currentTimesRef.current[i] = targetTime;
            }

            const seekTime = currentTimesRef.current[i];

            // Reset seeking flag if native video finished seeking
            if (!video.seeking) {
              isSeekingRef.current[i] = false;
            }

            // Seek-lock: only seek when decoder is free
            if (!video.seeking && !isSeekingRef.current[i]) {
              const pending = pendingSeekRef.current[i];
              const targetSeek = pending !== null ? pending : seekTime;
              pendingSeekRef.current[i] = null;

              if (Math.abs(video.currentTime - targetSeek) > 0.006) {
                isSeekingRef.current[i] = true;
                try {
                  video.currentTime = targetSeek;
                } catch {
                  isSeekingRef.current[i] = false;
                }
              }
            } else {
              // Store pending seek time for next onSeeked callback
              pendingSeekRef.current[i] = seekTime;
            }
          } else if (i === lastActive) {
            // Keep underneath active video at 100% opacity so there is NEVER a blank/white gap
            if (video.style.zIndex !== '5') video.style.zIndex = '5';
            if (video.style.opacity !== '1') video.style.opacity = '1';
          } else {
            // Offscreen / inactive videos: opacity 0, but NOT visibility: hidden
            if (video.style.zIndex !== '1') video.style.zIndex = '1';
            if (video.style.opacity !== '0') video.style.opacity = '0';
          }
        }

        rafRef.current = requestAnimationFrame(tick);
      };

      rafRef.current = requestAnimationFrame(tick);

      return () => {
        active = false;
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
      };
    }, []);

    return (
      <div
        ref={containerRef}
        className={`fixed inset-0 pointer-events-none z-10 overflow-hidden bg-[#F4F4F5] flex items-center justify-center will-change-transform ${canvasShiftX > 0 ? 'shadow-[-25px_0_50px_rgba(0,0,0,0.12)]' : ''
          } ${className}`}
        style={{
          transform: canvasShiftX !== 0 ? `translateX(${canvasShiftX}%)` : 'none',
        }}
      >
        {/* 10 High-Fidelity Intra Videos - Direct connection, double-buffered, zero gap */}
        {videoSources.map((src, i) => (
          <video
            key={i}
            ref={(el) => {
              videoRefs.current[i] = el;
            }}
            src={src}
            poster={i === 0 ? '/video/video-home/thumbs/thumb1.jpg' : undefined}
            muted
            playsInline
            preload="auto"
            onLoadedMetadata={() => handleLoadedMetadata(i)}
            onSeeked={() => handleSeeked(i)}
            className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none will-change-[transform,opacity] bg-transparent"
            style={{
              zIndex: i === 0 ? 10 : 1,
              opacity: i === 0 ? 1 : 0,
            }}
          />
        ))}

        {/* Dark overlay removed per revision Point 7 */}
        <div
          ref={overlayRef}
          className="hidden absolute inset-0 bg-black pointer-events-none z-[20]"
          style={{ opacity: 0, display: 'none' }}
        />
      </div>
    );
  }
);

export default ScrollVideoCanvas;
