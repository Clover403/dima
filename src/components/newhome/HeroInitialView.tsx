import { forwardRef, useImperativeHandle, useRef } from 'react';
import { ArrowDown } from 'lucide-react';
import RippleGrid from '../RippleGrid';

export interface HeroInitialViewHandle {
  setProgress: (progress: number) => void;
}

interface HeroInitialViewProps {
  initialProgress?: number;
}

const HeroInitialView = forwardRef<HeroInitialViewHandle, HeroInitialViewProps>(
  ({ initialProgress = 0 }, ref) => {
    const panelRef = useRef<HTMLDivElement>(null);
    const hintRef = useRef<HTMLDivElement>(null);

    useImperativeHandle(ref, () => ({
      setProgress: (progress: number) => {
        if (panelRef.current) {
          const factor = Math.min(1, Math.max(0, progress / 0.16));
          const shiftPercent = -factor * 100;
          const isCovered = progress >= 0.18;
          panelRef.current.style.transform = `translateX(${shiftPercent}%)`;
          panelRef.current.style.opacity = isCovered ? '0' : '1';
          panelRef.current.style.pointerEvents = isCovered ? 'none' : 'auto';
        }
        if (hintRef.current) {
          hintRef.current.style.opacity = progress > 0.03 ? '0' : '1';
        }
      },
    }));

    const transitionPhase = 0.16;
    const initialFactor = Math.min(1, Math.max(0, initialProgress / transitionPhase));
    const initialShift = -initialFactor * 100;
    const initialCovered = initialProgress >= 0.18;
    const initialHintHidden = initialProgress > 0.03;

    return (
      <>
        {/* Definition for the elegant streamlined chevron with mathematically tangent smooth apex */}
        <svg className="absolute w-0 h-0 pointer-events-none" aria-hidden="true">
          <defs>
            <clipPath id="cone-right-clip" clipPathUnits="objectBoundingBox">
              <path d="M 0,0 L 0.78,0 L 0.945,0.375 Q 1.0,0.50 0.945,0.625 L 0.78,1.0 L 0,1.0 Z" />
            </clipPath>
          </defs>
        </svg>

        {/* Outer Wrapper with Drop Shadow that traces the triangular contour */}
        <div
          ref={panelRef}
          className="fixed inset-y-0 left-0 z-20 w-[90vw] sm:w-[82vw] md:w-[70vw] lg:w-[56vw] xl:w-[48vw] 2xl:w-[42vw] max-w-[760px] pointer-events-auto will-change-transform filter drop-shadow-[24px_0_40px_rgba(0,0,0,0.11)] drop-shadow-[8px_0_16px_rgba(0,0,0,0.05)]"
          style={{
            opacity: initialCovered ? 0 : 1,
            transform: `translateX(${initialShift}%)`,
            pointerEvents: initialCovered ? 'none' : 'auto',
          }}
        >
          {/* Clipped Clean Triangular Panel */}
          <div
            className="relative w-full h-full flex flex-col justify-center overflow-hidden"
            style={{
              clipPath: 'url(#cone-right-clip)',
              WebkitClipPath: 'url(#cone-right-clip)',
            }}
          >
            {/* Solid Background Color */}
            <div className="absolute inset-0 bg-[#F4F4F5] -z-20" />

            {/* RippleGrid Animated Grid Layer */}
            <div className="absolute inset-0 pointer-events-none z-0">
              <RippleGrid
                baseColor="rgba(3, 0, 53, 0.08)"
                accentColor="rgba(229, 153, 123, 0.40)"
                gridSpacing={60}
                ringWidth={12}
                ringSpeed={7.5}
                numRings={5}
                gap={15}
              />
            </div>

            {/* Elegant Minimalist Bronze Accent Line: perfectly tangent and silky smooth */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none z-10"
              preserveAspectRatio="none"
              viewBox="0 0 100 100"
            >
              <path
                d="M 78,0 L 94.5,37.5 Q 100,50 94.5,62.5 L 78,100"
                fill="none"
                stroke="rgba(229, 153, 123, 0.55)"
                strokeWidth="1.5"
                vectorEffect="non-scaling-stroke"
              />
            </svg>

            {/* Content Layer: DIMA FINANCE Brand Lockup centered in panel */}
            <div className="relative z-20 flex flex-col items-center justify-center w-full h-full pr-[12%] sm:pr-[14%] md:pr-[16%]">
              <div className="flex flex-col items-center">
                <img
                  src="/logo/Imagen 1.png"
                  alt="Logo DIMA"
                  className="w-40 sm:w-48 md:w-56 lg:w-64 xl:w-68 h-auto mb-5 sm:mb-6 md:mb-7"
                />

                <div className="flex flex-col items-center">
                  <h1
                    className="relative -left-0.5 lg:-left-1 leading-[0.85] tracking-tighter font-normal text-5xl sm:text-6xl md:text-7xl lg:text-[6rem] xl:text-[6.8rem] text-navy"
                    style={{ fontFamily: "'Gill Sans MT', 'Montserrat', sans-serif", letterSpacing: '0.02em' }}
                  >
                    DIMA
                  </h1>
                  
                  <h1
                    className="leading-[0.85] tracking-normal font-medium text-2xl sm:text-3xl md:text-4xl lg:text-[3.5rem] xl:text-[3.9rem] text-navy mt-2 sm:mt-2.5 md:mt-3"
                    style={{ fontFamily: "'Gill Sans MT', 'Montserrat', sans-serif", letterSpacing: '0.05em' }}
                  >
                    FINANCE
                  </h1>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Minimalist Bottom Scroll Hint in Spanish */}
        <div
          ref={hintRef}
          className="fixed bottom-8 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 pointer-events-none transition-opacity duration-300"
          style={{ opacity: initialHintHidden ? 0 : 1 }}
        >
          <span className="font-body text-[11px] tracking-[0.25em] text-navy uppercase font-medium">
            Desplaza para continuar
          </span>
          <ArrowDown className="w-3.5 h-3.5 text-navy animate-bounce" />
        </div>
      </>
    );
  }
);

export default HeroInitialView;
