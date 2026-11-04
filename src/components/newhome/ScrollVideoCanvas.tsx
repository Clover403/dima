import { useRef, useEffect, useLayoutEffect, useCallback, forwardRef, useImperativeHandle } from 'react';
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
    const activeIdxRef = useRef<number>(1);
    const lastActiveIdxRef = useRef<number>(1);
    const rafRef = useRef<number | null>(null);

    // Track which videos currently have active hardware decoders attached
    // macOS VideoToolbox and Windows DXVA have a hard limit of 4-5 hardware decoders.
    // Keeping at most 3 videos attached guarantees 100% hardware decode without crashing or freezing.
    const attachedIndicesRef = useRef<Set<number>>(new Set([1, 2]));

    // Track whether user has initiated scroll from top
    const hasScrolledRef = useRef<boolean>(false);

    // Attach decoder to a video element
    const attachVideo = useCallback((idx: number, seekTarget = 0.001) => {
      if (idx < 1 || idx >= TOTAL_VIDEOS) return;
      const v = videoRefs.current[idx];
      if (!v) return;

      const targetSrc = videoCache.getVideoSrc(idx);
      if (!targetSrc) return;

      if (v.src && (v.src === targetSrc || v.src.endsWith(targetSrc))) {
        return;
      }

      v.src = targetSrc;
      v.preload = 'auto';
      v.load();

      const onMeta = () => {
        v.removeEventListener('loadedmetadata', onMeta);
        if (!isNaN(v.duration) && v.duration > 0) {
          durationsRef.current[idx] = v.duration;
        }
        try {
          v.currentTime = seekTarget;
        } catch {}
      };
      v.addEventListener('loadedmetadata', onMeta, { once: true });
    }, []);

    // Detach decoder from a video element to release OS hardware decoder session
    const detachVideo = useCallback((idx: number) => {
      if (idx < 1 || idx >= TOTAL_VIDEOS) return;
      const v = videoRefs.current[idx];
      if (!v) return;

      if (v.src) {
        try {
          v.pause();
          v.removeAttribute('src');
          v.load(); // Immediately frees hardware decoder session in WebKit and Chromium
        } catch {}
        v.style.opacity = '0';
        v.style.zIndex = '1';
        isSeekingRef.current[idx] = false;
        pendingSeekRef.current[idx] = null;
      }
    }, []);

    // Smart decoder sync: ensures only active, buffer, and immediate neighbors have decoders open
    const syncAttachedDecoders = useCallback((currentActive: number) => {
      const desired = new Set<number>();
      desired.add(currentActive);
      if (lastActiveIdxRef.current >= 1 && lastActiveIdxRef.current < TOTAL_VIDEOS) {
        desired.add(lastActiveIdxRef.current);
      }
      if (currentActive + 1 < TOTAL_VIDEOS) {
        desired.add(currentActive + 1);
      }
      if (currentActive - 1 >= 1) {
        desired.add(currentActive - 1);
      }

      // Detach any video that is no longer desired
      for (let i = 1; i < TOTAL_VIDEOS; i++) {
        if (!desired.has(i) && attachedIndicesRef.current.has(i)) {
          detachVideo(i);
          attachedIndicesRef.current.delete(i);
        }
      }

      // Attach any newly desired video
      for (const idx of desired) {
        if (!attachedIndicesRef.current.has(idx)) {
          const seekTarget = idx < currentActive
            ? Math.max(0, (durationsRef.current[idx] || KNOWN_DURATIONS[idx] || 8.0) - 0.04)
            : 0.001;
          attachVideo(idx, seekTarget);
          attachedIndicesRef.current.add(idx);
        }
      }
    }, [attachVideo, detachVideo]);

    // Reset video refs, scrubbing timestamps, and hardware state on mount
    useLayoutEffect(() => {
      activeIdxRef.current = 1; // Video 2 langsung aktif (video 1 tidak dipakai)
      lastActiveIdxRef.current = 1;
      currentTimesRef.current.fill(0);
      targetTimesRef.current.fill(0);
      isSeekingRef.current.fill(false);
      pendingSeekRef.current.fill(null);
      hasScrolledRef.current = false;
      attachedIndicesRef.current = new Set([1, 2]);

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

      // Prime only initial active videos (Video 2 and Video 3)
      for (const idx of [1, 2]) {
        const v = videoRefs.current[idx];
        if (v) {
          try {
            v.currentTime = 0.001;
          } catch {}
        }
      }
    }, [canvasShiftX]);

    // Upgrade attached videos when Blob cache becomes ready in background
    useEffect(() => {
      const handleVideoLoaded = (e: Event) => {
        const customEvent = e as CustomEvent<{ index?: number }>;
        const idx = customEvent.detail?.index;
        if (typeof idx === 'number' && attachedIndicesRef.current.has(idx)) {
          const v = videoRefs.current[idx];
          const blobSrc = videoCache.getVideoSrc(idx);
          if (v && blobSrc && v.src !== blobSrc) {
            const savedTime = currentTimesRef.current[idx] || 0.001;
            v.src = blobSrc;
            v.load();
            const onMeta = () => {
              v.removeEventListener('loadedmetadata', onMeta);
              try { v.currentTime = savedTime; } catch {}
            };
            v.addEventListener('loadedmetadata', onMeta, { once: true });
          }
        }
      };

      const handleBatchUpgrade = () => {
        for (const idx of attachedIndicesRef.current) {
          const v = videoRefs.current[idx];
          const blobSrc = videoCache.getVideoSrc(idx);
          if (v && blobSrc && v.src !== blobSrc) {
            const savedTime = currentTimesRef.current[idx] || 0.001;
            v.src = blobSrc;
            v.load();
            const onMeta = () => {
              v.removeEventListener('loadedmetadata', onMeta);
              try { v.currentTime = savedTime; } catch {}
            };
            v.addEventListener('loadedmetadata', onMeta, { once: true });
          }
        }
      };

      window.addEventListener('videoLoaded', handleVideoLoaded);
      window.addEventListener('videosInitialLoaded', handleBatchUpgrade);
      window.addEventListener('videosFullyLoaded', handleBatchUpgrade);

      return () => {
        window.removeEventListener('videoLoaded', handleVideoLoaded);
        window.removeEventListener('videosInitialLoaded', handleBatchUpgrade);
        window.removeEventListener('videosFullyLoaded', handleBatchUpgrade);
      };
    }, []);

    // Handle metadata load to refine exact durations and prime frame 0
    const handleLoadedMetadata = useCallback((index: number) => {
      const video = videoRefs.current[index];
      if (video && !isNaN(video.duration) && video.duration > 0) {
        durationsRef.current[index] = video.duration;
      }
      if (index >= 1 && index < TOTAL_VIDEOS && targetTimesRef.current[index] <= 0.02) {
        const v = videoRefs.current[index];
        if (v) {
          try {
            v.currentTime = 0.001;
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

        if (vidIdx >= 0 && vidIdx < TOTAL_VIDEOS) {
          const duration = durationsRef.current[vidIdx] || KNOWN_DURATIONS[vidIdx] || 10;
          const maxSeek = Math.max(0, duration - 0.04);
          const safeProgress = Math.max(0.001, Math.min(0.999, progress));
          const targetTime = Math.min(maxSeek, safeProgress * duration);

          targetTimesRef.current[vidIdx] = targetTime;

          if (vidIdx !== activeIdxRef.current) {
            lastActiveIdxRef.current = activeIdxRef.current;
            activeIdxRef.current = vidIdx;

            // Sync decoder allocation so hardware limit is never exceeded
            syncAttachedDecoders(vidIdx);

            // Prime newly active video immediately so it doesn't lerp from stale frame
            currentTimesRef.current[vidIdx] = targetTime;
            const newVid = videoRefs.current[vidIdx];
            if (newVid && !newVid.seeking && Math.abs(newVid.currentTime - targetTime) > 0.01) {
              try {
                newVid.currentTime = targetTime;
              } catch {}
            }
          }

          // Adjacent video pre-seeking for seamless cross-clip continuity across videos
          const safeProg = Math.max(0.001, Math.min(0.999, progress));

          // 1. Forward pre-seeking: when halfway through current video (> 40%), ensure next video is warmed at frame 0
          if (safeProg > 0.40 && vidIdx < TOTAL_VIDEOS - 1) {
            const nextIdx = vidIdx + 1;
            if (attachedIndicesRef.current.has(nextIdx)) {
              const nextVid = videoRefs.current[nextIdx];
              if (nextVid && !nextVid.seeking && nextVid.currentTime > 0.05) {
                try { nextVid.currentTime = 0.001; } catch {}
              }
            }
          }

          // 2. Backward holding: when scrolling backwards near start of current video (< 40%), ensure previous video holds its last frame
          if (safeProg < 0.40 && vidIdx >= 1) {
            const prevIdx = vidIdx - 1;
            if (attachedIndicesRef.current.has(prevIdx)) {
              const prevDur = durationsRef.current[prevIdx] || KNOWN_DURATIONS[prevIdx] || 8.0;
              const prevVid = videoRefs.current[prevIdx];
              const endPrev = Math.max(0, prevDur - 0.04);
              if (prevVid && !prevVid.seeking && Math.abs(prevVid.currentTime - endPrev) > 0.06) {
                try { prevVid.currentTime = endPrev; } catch {}
              }
            }
          }
        }

        // Direct hardware transform update without CSS transition interference
        if (containerRef.current) {
          containerRef.current.style.transform = shiftX !== 0 ? `translateX(${shiftX}%)` : 'none';
        }
      },
    }), [syncAttachedDecoders]);

    // High-performance RAF animation loop:
    // 1. Hardware seek-locking: never queue seeks while Chromium decoder is actively seeking
    // 2. Active video has z-index 10, opacity 1
    // 3. Last active video has z-index 5, opacity 1 (held underneath as solid buffer)
    // 4. Inactive attached videos have z-index 1, opacity 0
    // 5. Unattached videos have z-index 1, opacity 0, no decoders running!
    useEffect(() => {
      let active = true;

      const tick = () => {
        if (!active) return;

        const currentActive = activeIdxRef.current;
        const lastActive = lastActiveIdxRef.current;

        for (let i = 0; i < TOTAL_VIDEOS; i++) {
          const video = videoRefs.current[i];
          if (!video) continue;

          // If video decoder is not attached, keep completely hidden and skip seek lerp
          if (!attachedIndicesRef.current.has(i)) {
            if (video.style.opacity !== '0') video.style.opacity = '0';
            if (video.style.zIndex !== '1') video.style.zIndex = '1';
            continue;
          }

          if (i === currentActive) {
            if (video.style.zIndex !== '10') video.style.zIndex = '10';

            // Keep active video strictly hidden (opacity 0) at scroll position 0
            if (!hasScrolledRef.current) {
              if (video.style.opacity !== '0') video.style.opacity = '0';
              continue;
            }

            if (video.style.opacity !== '1') video.style.opacity = '1';

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
            // Offscreen / inactive videos in warm set: opacity 0
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
        className={`fixed inset-0 pointer-events-none z-10 overflow-hidden bg-[#F4F4F5] flex items-center justify-center will-change-transform ${
          canvasShiftX > 0 ? 'shadow-[-25px_0_50px_rgba(0,0,0,0.12)]' : ''
        } ${className}`}
        style={{
          transform: canvasShiftX !== 0 ? `translateX(${canvasShiftX}%)` : 'none',
        }}
      >
        {/* 14 High-Fidelity Intra Videos - Sliding window decoder pool, zero gap */}
        {Array.from({ length: TOTAL_VIDEOS }).map((_, i) => (
          <video
            key={i}
            ref={(el) => {
              videoRefs.current[i] = el;
            }}
            src={i === 1 || i === 2 ? videoCache.getVideoSrc(i) : undefined}
            poster={undefined}
            autoPlay={false}
            loop={false}
            muted
            playsInline
            preload={i === 1 || i === 2 ? 'auto' : 'none'}
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
