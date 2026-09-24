import { useCallback, useRef, useLayoutEffect } from 'react';
import PageTransition from '../components/layout/PageTransition';
import CTA from '../components/layout/CTA';
import ScrollVideoCanvas, { type ScrollVideoCanvasHandle } from '../components/newhome/ScrollVideoCanvas';
import SectorProgressNav, { type SectorProgressNavHandle } from '../components/newhome/SectorProgressNav';
import UnifiedStoryStage, { type UnifiedStoryStageHandle } from '../components/newhome/UnifiedStoryStage';
import { getLenis } from '../hooks/useLenis';

export default function NewHome() {
  const videoCanvasRef = useRef<ScrollVideoCanvasHandle>(null);
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
    overlayOpacity: number
  ) => {
    videoCanvasRef.current?.setScrub(activeVidIndex, activeVidProgress, shiftX, overlayOpacity);
    progressNavRef.current?.setProgress(progress * 100);
    progressNavRef.current?.setVisible(progress >= 0.03);
  }, []);

  return (
    <PageTransition>
      <div className="relative w-full bg-[#F4F4F5] text-[#030035] min-h-screen selection:bg-[#E5997B]/30 selection:text-[#030035]">
        
        {/* 1. Fixed Video Scrub Canvas Layer (z-10): Full screen, centered */}
        <ScrollVideoCanvas ref={videoCanvasRef} canvasShiftX={0} />

        {/* 2. Floating Side Telemetry & Section Indicator (z-30): Hidden initially, fades in when video starts */}
        <SectorProgressNav ref={progressNavRef} />

        {/* 3. Complete Unified Narrative Stage (z-[25]): ALL chapters in ONE sticky container */}
        <UnifiedStoryStage ref={storyStageRef} onProgressUpdate={handleProgressUpdate} />

        {/* 5. Closing CTA with transparent background and navy text, button text white */}
        <div className="relative z-20 bg-transparent text-[#030035]">
          <CTA transparentBg={true} textColor="navy" buttonTextColor="white" />
        </div>
      </div>
    </PageTransition>
  );
}
