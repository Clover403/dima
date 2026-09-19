import { useCallback, useRef, useLayoutEffect } from 'react';
import PageTransition from '../components/layout/PageTransition';
import CTA from '../components/layout/CTA';
import ScrollVideoCanvas, { type ScrollVideoCanvasHandle } from '../components/newhome/ScrollVideoCanvas';
import HeroInitialView, { type HeroInitialViewHandle } from '../components/newhome/HeroInitialView';
import SectorProgressNav, { type SectorProgressNavHandle } from '../components/newhome/SectorProgressNav';
import UnifiedStoryStage, { type UnifiedStoryStageHandle } from '../components/newhome/UnifiedStoryStage';
import { getLenis } from '../hooks/useLenis';

export default function NewHome() {
  const videoCanvasRef = useRef<ScrollVideoCanvasHandle>(null);
  const heroInitialRef = useRef<HeroInitialViewHandle>(null);
  const progressNavRef = useRef<SectorProgressNavHandle>(null);
  const storyStageRef = useRef<UnifiedStoryStageHandle>(null);

  // Synchronously reset scroll to top before any child measurements or layout calculations occur
  useLayoutEffect(() => {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
    const lenis = getLenis();
    if (lenis) {
      lenis.scrollTo(0, { immediate: true });
    }
  }, []);

  // Directly handle scroll updates from UnifiedStoryStage: ZERO React re-renders!
  const handleProgressUpdate = useCallback((
    progress: number,
    activeVidIndex: number,
    activeVidProgress: number,
    shiftX: number,
    overlayOpacity: number,
    heroProgress: number
  ) => {
    videoCanvasRef.current?.setScrub(activeVidIndex, activeVidProgress, shiftX, overlayOpacity);
    heroInitialRef.current?.setProgress(heroProgress);
    progressNavRef.current?.setProgress(progress * 100);
    progressNavRef.current?.setVisible(shiftX === 0 && progress >= 0.03);
  }, []);

  return (
    <PageTransition>
      <div className="relative w-full bg-lightgray text-white min-h-screen selection:bg-[#E5997B]/30 selection:text-white">
        
        {/* 1. Underlying Initial Split View (z-[5]): Logo & text on left, covered by sliding canvas */}
        <HeroInitialView ref={heroInitialRef} />

        {/* 2. Fixed Video Scrub Canvas Layer (z-10): Glides from right to left OVER HeroInitialView */}
        <ScrollVideoCanvas ref={videoCanvasRef} />

        {/* 3. Floating Side Telemetry & Section Indicator (z-30): Hidden initially, fades in when video starts */}
        <SectorProgressNav ref={progressNavRef} />

        {/* 4. Complete Unified Narrative Stage (z-[25]): ALL chapters in ONE sticky container (Identical to Nosotros) */}
        {/* Teks 100% diam di tempat dan muncul per huruf, TIDAK PERNAH menggulir ke atas! */}
        <UnifiedStoryStage ref={storyStageRef} onProgressUpdate={handleProgressUpdate} />

        {/* 5. Closing CTA with transparent background and dark glassmorphic form */}
        <div className="relative z-20 bg-transparent text-white">
          <CTA transparentBg={true} />
        </div>
      </div>
    </PageTransition>
  );
}
