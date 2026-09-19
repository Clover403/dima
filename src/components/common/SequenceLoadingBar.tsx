import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useTransform, useMotionValue, MotionValue } from 'framer-motion';

interface SequenceLoadingBarProps {
  progress: number; // 0 to 100
  isLoaded: boolean;
  label?: string;
  className?: string;
  isVisible?: boolean;
  theme?: 'light' | 'dark';
  overlayOpacity?: MotionValue<number>;
  scrollYProgress?: MotionValue<number>;
}

export default function SequenceLoadingBar({
  progress,
  isLoaded,
  label = 'Cargando animación',
  className = '',
  isVisible = true,
  theme = 'light',
  overlayOpacity,
  scrollYProgress,
}: SequenceLoadingBarProps) {
  const [show, setShow] = useState(isVisible && !isLoaded && progress < 100);

  useEffect(() => {
    if (!isVisible || isLoaded || progress >= 100) {
      const timer = setTimeout(() => {
        setShow(false);
      }, 400);
      return () => clearTimeout(timer);
    } else {
      setShow(true);
    }
  }, [isVisible, isLoaded, progress]);

  // Fallback motion value jika overlayOpacity/scrollYProgress tidak dipassing
  const fallbackMotion = useMotionValue(theme === 'dark' ? 1 : 0);
  const activeMotion = overlayOpacity || scrollYProgress || fallbackMotion;

  // Jika overlay muncul (> 0.05) atau di dark theme, teks otomatis berubah menjadi putih bersih
  const textColor = useTransform(
    activeMotion,
    [0, 0.12],
    [theme === 'dark' ? '#FFFFFF' : '#030035', '#FFFFFF']
  );

  const trackBg = useTransform(
    activeMotion,
    [0, 0.12],
    [theme === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(3, 0, 53, 0.14)', 'rgba(255, 255, 255, 0.25)']
  );

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8, transition: { duration: 0.3, ease: 'easeOut' } }}
          className={`fixed bottom-8 left-[calc(50%-100px)] -translate-x-1/2 z-50 pointer-events-none ${className}`}
        >
          {/* Minimalist container: Teks di tengah-tengah icon, presisi disesuaikan sedikit ke kiri */}
          <div className="flex flex-col items-center select-none">
            {/* Teks persis di tengah-tengah di atas icon, ukuran diperkecil sedikit menjadi 9px dengan tracking elegan */}
            <motion.span
              style={{ color: textColor }}
              className="text-[9px] md:text-[9.5px] font-sans font-medium tracking-[0.25em] uppercase text-center transition-colors duration-200 drop-shadow-[0_1px_3px_rgba(0,0,0,0.5)]"
            >
              {label}
            </motion.span>

            {/* Icon loading (bar) tepat di tengah layar, angka di kanan secara absolut */}
            <div className="relative flex items-center justify-center mt-1.5">
              {/* Progress bar (icon loading) */}
              <motion.div
                style={{ backgroundColor: trackBg }}
                className="w-44 sm:w-52 h-[2.5px] rounded-full overflow-hidden transition-colors duration-200"
              >
                <div
                  className="h-full bg-gradient-to-r from-[#E5997B] to-[#F5B49B] rounded-full transition-all duration-150 ease-out shadow-[0_0_8px_rgba(229,153,123,0.5)]"
                  style={{ width: `${Math.max(2, Math.min(100, progress))}%` }}
                />
              </motion.div>

              {/* Angka persentase di sisi kanan bar */}
              <span
                className="absolute left-[calc(100%+8px)] text-[10.5px] font-mono font-medium tabular-nums text-[#E5997B] whitespace-nowrap drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]"
              >
                {Math.round(progress)}%
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
