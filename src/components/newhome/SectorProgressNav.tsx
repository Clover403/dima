import { forwardRef, useImperativeHandle, useRef } from 'react';

export interface SectorProgressNavHandle {
  setProgress: (progress: number) => void;
  setVisible: (visible: boolean) => void;
}

interface SectorProgressNavProps {
  initialVisible?: boolean;
}

const SectorProgressNav = forwardRef<SectorProgressNavHandle, SectorProgressNavProps>(
  ({ initialVisible = false }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const barRef = useRef<HTMLDivElement>(null);

    useImperativeHandle(ref, () => ({
      setProgress: (progress: number) => {
        if (barRef.current) {
          const clamped = Math.min(100, Math.max(0, progress));
          barRef.current.style.height = `${clamped}%`;
        }
      },
      setVisible: (visible: boolean) => {
        if (containerRef.current) {
          containerRef.current.style.opacity = visible ? '1' : '0';
        }
      },
    }));

    return (
      <div
        ref={containerRef}
        className="fixed right-6 sm:right-8 md:right-10 top-1/2 -translate-y-1/2 z-30 hidden lg:flex flex-col items-center pointer-events-none transition-opacity duration-300 ease-out"
        style={{ opacity: initialVisible ? 1 : 0 }}
      >
        {/* Minimalist Bronze Scroll Status Bar: Elegant vertical line filled downwards */}
        <div className="relative w-[2.5px] sm:w-[3px] h-40 sm:h-48 md:h-52 rounded-full bg-white/20 overflow-hidden shadow-sm">
          {/* Bronze bar filling downwards according to scroll */}
          <div
            ref={barRef}
            className="w-full bg-[#E5997B] rounded-full shadow-[0_0_10px_rgba(229,153,123,0.7)]"
            style={{ height: '0%' }}
          />
        </div>
      </div>
    );
  }
);

export default SectorProgressNav;
