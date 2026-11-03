import { useState, useRef, useEffect, useLayoutEffect, useCallback, forwardRef, useImperativeHandle } from 'react';
import { videoCache, TOTAL_HOME_VIDEOS } from '../../lib/videoCache';

export interface ActiveVideoTarget {
  index: number; // 1 to 10
  progress: number; // 0 to 1
  opacity: number; // 0 to 1
}

export interface ScrollVideoCanvasHandle {
  setScrub: (
    activeVidIndex: number, // 1 to 14
    progress: number, // 0 to 1
    shiftX: number, // 0 to 18%
    overlayOpacity: number, // 0 to 0.50
    overallProgress?: number
  ) => void;
}

interface ScrollVideoCanvasProps {
  targets?: ActiveVideoTarget[];
  className?: string;
  canvasShiftX?: number; // 0 to 42%
  overlayOpacity?: number; // 0 to 0.50
}

const TOTAL_VIDEOS = TOTAL_HOME_VIDEOS;
const KNOWN_DURATIONS = [16.0, 8.0, 8.0, 8.63, 10.0, 10.0, 8.0, 10.0, 13.47, 8.0, 8.0, 10.0, 6.0, 10.0];

const ScrollVideoCanvas = forwardRef<ScrollVideoCanvasHandle, ScrollVideoCanvasProps>(
  ({ className = '', canvasShiftX = 0 }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
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

    // Track whether Video 1 is currently in continuous autoplay loop mode at top
    const isLoopingRef = useRef<boolean>(false);
    // Track whether user has initiated scroll from top
    const hasScrolledRef = useRef<boolean>(false);
    // Capture the exact running timestamp of Video 1 at the moment scroll begins
    const capturedStartRef = useRef<number | null>(null);

    // Dynamic video sources: initialized from cache (or URLs), seamlessly swapped to in-memory Blobs
    const [videoSources, setVideoSources] = useState<string[]>(() =>
      Array.from({ length: TOTAL_VIDEOS }, (_, i) => videoCache.getVideoSrc(i))
    );

    // Helper to start continuous looping of Video 1 at top
    const startVideo1Loop = useCallback(() => {
      const v1 = videoRefs.current[0];
      if (!v1) return;
      isLoopingRef.current = true;
      capturedStartRef.current = null;
      v1.loop = true;
      v1.muted = true;
      if (v1.paused) {
        v1.play().catch(() => {});
      }
    }, []);

    // Helper to transition Video 1 from autoplay loop to scroll-driven scrubbing
    const stopVideo1Loop = useCallback(() => {
      if (!isLoopingRef.current) return;
      isLoopingRef.current = false;
      const v1 = videoRefs.current[0];
      if (v1) {
        v1.loop = false;
        v1.pause();
        const v1Dur = durationsRef.current[0] || KNOWN_DURATIONS[0] || 16.0;
        let currentPlay = v1.currentTime;
        // If it was within the last 0.5s before EOF, wrap smoothly to start
        if (currentPlay >= v1Dur - 0.5) {
          currentPlay = 0.001;
        }
        capturedStartRef.current = currentPlay;
        currentTimesRef.current[0] = currentPlay;
      }
    }, []);

    // Reset video refs, scrubbing timestamps, and hardware state on mount
    useLayoutEffect(() => {
      activeIdxRef.current = 1; // Video 2 langsung aktif (video 1 tidak dipakai)
      lastActiveIdxRef.current = 1;
      currentTimesRef.current.fill(0);
      targetTimesRef.current.fill(0);
      isSeekingRef.current.fill(false);
      pendingSeekRef.current.fill(null);
      isLoopingRef.current = false;
      hasScrolledRef.current = false;

      if (containerRef.current) {
        containerRef.current.style.transform = canvasShiftX !== 0 ? `translateX(${canvasShiftX}%)` : 'none';
      }

      // Pastikan seluruh video paused & hidden saat posisi scroll 0
      for (let i = 0; i < TOTAL_VIDEOS; i++) {
        const v = videoRefs.current[i];
        if (v) {
          v.pause();
          v.style.opacity = '0';
        }
      }

      // Prime ALL active videos (Video 2 through Video 14) to 0.001s so frame 0 is decoded in GPU memory
      for (let i = 1; i < TOTAL_VIDEOS; i++) {
        const v = videoRefs.current[i];
        if (v) {
          try {
            v.currentTime = 0.001;
          } catch {}
        }
      }
    }, [canvasShiftX]);

    // Ensure Video 1 loop plays when scrolling begins even under strict browser autoplay policies
    useEffect(() => {
      const handleUserInteraction = () => {
        if (hasScrolledRef.current && isLoopingRef.current) {
          const v1 = videoRefs.current[0];
          if (v1 && v1.paused) {
            v1.play().catch(() => {});
          }
        }
      };

      window.addEventListener('touchstart', handleUserInteraction, { passive: true });
      window.addEventListener('mousedown', handleUserInteraction);
      window.addEventListener('wheel', handleUserInteraction, { passive: true });

      return () => {
        window.removeEventListener('touchstart', handleUserInteraction);
        window.removeEventListener('mousedown', handleUserInteraction);
        window.removeEventListener('wheel', handleUserInteraction);
      };
    }, []);

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
            const wasLooping = (i === 0 && isLoopingRef.current);
            const savedTime = currentTimesRef.current[i] || 0.001;
            v.src = bSrc;
            v.load();
            const onMeta = () => {
              v.removeEventListener('loadedmetadata', onMeta);
              try {
                v.currentTime = savedTime;
              } catch {}
            };
            v.addEventListener('loadedmetadata', onMeta, { once: true });
            if (wasLooping) {
              v.loop = true;
              v.play().catch(() => {});
            }
          }
        }
      };

      if (videoCache.isInitialReady()) {
        upgradeToBlobs();
      }

      window.addEventListener('videosInitialLoaded', upgradeToBlobs);
      window.addEventListener('videosFullyLoaded', upgradeToBlobs);
      window.addEventListener('videoLoaded', upgradeToBlobs);
      const unsubInitial = videoCache.onInitialReady(upgradeToBlobs);
      const unsubAll = videoCache.onReady(upgradeToBlobs);

      return () => {
        unsubInitial();
        unsubAll();
        window.removeEventListener('videosInitialLoaded', upgradeToBlobs);
        window.removeEventListener('videosFullyLoaded', upgradeToBlobs);
        window.removeEventListener('videoLoaded', upgradeToBlobs);
      };
    }, []);

    // Handle metadata load to refine exact durations and prime frame 0
    const handleLoadedMetadata = useCallback((index: number) => {
      const video = videoRefs.current[index];
      if (video && !isNaN(video.duration) && video.duration > 0) {
        durationsRef.current[index] = video.duration;
      }
      if (index === 0 && hasScrolledRef.current && isLoopingRef.current) {
        startVideo1Loop();
      } else if (index >= 1 && index < TOTAL_VIDEOS && targetTimesRef.current[index] <= 0.02) {
        const v = videoRefs.current[index];
        if (v) {
          try {
            v.currentTime = 0.001;
          } catch {}
        }
      }
    }, [startVideo1Loop]);

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
      setScrub: (
        activeVidIndex: number,
        progress: number,
        shiftX: number,
        _overlayOp: number,
        overallProgress?: number
      ) => {
        const vidIdx = activeVidIndex - 1;
        const isAtScrollZero = (overallProgress !== undefined ? overallProgress === 0 : progress === 0) &&
          (typeof window === 'undefined' || window.scrollY <= 10);

        if (isAtScrollZero) {
          hasScrolledRef.current = false;
          if (isLoopingRef.current) {
            isLoopingRef.current = false;
          }
          for (let i = 0; i < TOTAL_VIDEOS; i++) {
            const v = videoRefs.current[i];
            if (v) {
              if (!v.paused) v.pause();
              if (v.style.opacity !== '0') v.style.opacity = '0';
            }
          }
          return;
        }

        hasScrolledRef.current = true;
        const isAtTop = vidIdx === 0 && progress <= 0.005;

        // Transition between continuous autoplay loop and scroll-driven scrubbing
        if (isAtTop) {
          if (!isLoopingRef.current) {
            startVideo1Loop();
          }
        } else {
          if (isLoopingRef.current) {
            stopVideo1Loop();
          }
        }

        if (vidIdx >= 0 && vidIdx < TOTAL_VIDEOS) {
          const duration = durationsRef.current[vidIdx] || KNOWN_DURATIONS[vidIdx] || 10;
          const maxSeek = Math.max(0, duration - 0.04);

          let targetTime: number;

          if (vidIdx === 0) {
            if (isLoopingRef.current) {
              const v1 = videoRefs.current[0];
              targetTime = v1 ? v1.currentTime : 0.001;
            } else {
              // Directly continue from the frame that was running to the last frame!
              const startTime = capturedStartRef.current !== null ? capturedStartRef.current : 0.001;
              const endTime = maxSeek;
              const normProg = Math.max(0, Math.min(1, (progress - 0.005) / (0.999 - 0.005)));
              targetTime = startTime + normProg * (endTime - startTime);
            }
          } else {
            const safeProgress = Math.max(0.001, Math.min(0.999, progress));
            targetTime = Math.min(maxSeek, safeProgress * duration);
          }

          targetTimesRef.current[vidIdx] = targetTime;

          if (vidIdx !== activeIdxRef.current) {
            lastActiveIdxRef.current = activeIdxRef.current;
            activeIdxRef.current = vidIdx;

            // Prime newly active video immediately so it doesn't lerp from stale frame
            currentTimesRef.current[vidIdx] = targetTime;
            const newVid = videoRefs.current[vidIdx];
            if (newVid && !newVid.seeking && Math.abs(newVid.currentTime - targetTime) > 0.01) {
              try {
                newVid.currentTime = targetTime;
              } catch {
                // Ignore
              }
            }
          }

          // Adjacent video pre-seeking for seamless cross-clip continuity across ALL 14 videos:
          const safeProg = Math.max(0.001, Math.min(0.999, progress));

          // 1. Forward pre-seeking: when halfway through current video (> 40%), ensure next video is warmed at frame 0
          if (safeProg > 0.40 && vidIdx < TOTAL_VIDEOS - 1) {
            const nextVid = videoRefs.current[vidIdx + 1];
            if (nextVid && !nextVid.seeking && nextVid.currentTime > 0.05) {
              try { nextVid.currentTime = 0.001; } catch {}
            }
          }

          // 2. Backward holding: when scrolling backwards near start of current video (< 40%), ensure previous video holds its last frame
          if (safeProg < 0.40 && vidIdx >= 1) {
            const prevIdx = vidIdx - 1;
            const prevDur = durationsRef.current[prevIdx] || KNOWN_DURATIONS[prevIdx] || 8.0;
            const prevVid = videoRefs.current[prevIdx];
            const endPrev = Math.max(0, prevDur - 0.04);
            if (prevVid && !prevVid.seeking && Math.abs(prevVid.currentTime - endPrev) > 0.06) {
              try { prevVid.currentTime = endPrev; } catch {}
            }
          }
        }

        // Direct hardware transform update without CSS transition interference
        if (containerRef.current) {
          containerRef.current.style.transform = shiftX !== 0 ? `translateX(${shiftX}%)` : 'none';
        }
      },
    }), [startVideo1Loop, stopVideo1Loop]);

    // High-performance RAF animation loop:
    // 1. Hardware seek-locking: never queue seeks while Chromium decoder is actively seeking
    // 2. Active video has z-index 10, opacity 1
    // 3. Last active video has z-index 5, opacity 1 (held underneath as solid buffer)
    // 4. Inactive videos have z-index 1, opacity 0
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

            // Keep active video strictly hidden (opacity 0) at scroll position 0
            if (!hasScrolledRef.current) {
              if (video.style.opacity !== '0') video.style.opacity = '0';
              continue;
            }

            if (video.style.opacity !== '1') video.style.opacity = '1';

            // When Video 1 is auto-playing continuously in loop at top:
            if (i === 0 && isLoopingRef.current) {
              currentTimesRef.current[0] = video.currentTime;
              continue;
            }

            // Smooth time lerp for silky scrubbing
            const targetTime = targetTimesRef.current[i];
            const currentTime = currentTimesRef.current[i];
            const timeDiff = targetTime - currentTime;

            if (Math.abs(timeDiff) > 0.002) {
              currentTimesRef.current[i] += timeDiff * 0.25;
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
        {/* 14 High-Fidelity Intra Videos - Direct connection, double-buffered, zero gap */}
        {videoSources.map((src, i) => (
          <video
            key={i}
            ref={(el) => {
              videoRefs.current[i] = el;
            }}
            src={src || undefined}
            poster={undefined}
            autoPlay={false}
            loop={false}
            muted
            playsInline
            preload={i === 0 ? 'none' : 'auto'}
            onLoadedMetadata={() => handleLoadedMetadata(i)}
            onSeeked={() => handleSeeked(i)}
            className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none will-change-[transform,opacity] bg-transparent"
            style={{
              zIndex: i === 0 ? 10 : 1,
              opacity: 0,
            }}
          />
        ))}
      </div>
    );
  }
);

export default ScrollVideoCanvas;
