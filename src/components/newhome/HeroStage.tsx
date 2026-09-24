import { useRef, useState } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { ChevronRight, Minus } from 'lucide-react';
import { HERO_STAGE_DATA } from './newHomeData';
import HybridRevealText from '../HybridRevealText';

interface HeroStageProps {
  onScrollProgress?: (progress: number) => void;
}

export default function HeroStage({ onScrollProgress }: HeroStageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHeroExpanded, setIsHeroExpanded] = useState<boolean>(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  scrollYProgress.on('change', (val) => {
    if (onScrollProgress) onScrollProgress(val);
  });

  // Phases of Hero Scroll:
  // 0.00 - 0.16: Full-screen background canvas glides from right to center.
  // 0.16 - 0.22: Left text fades out cleanly after the canvas arrives at center.
  // 0.22 - 0.35: Phrase 1 (Left Center): Character reveal letter-by-letter
  // 0.35 - 0.49: Phrase 2 (Right Center): Character reveal letter-by-letter
  // 0.49 - 0.64: Phrase 3 (Bottom Center): Character reveal letter-by-letter
  // 0.64 - 0.66: Seamless transition into Main Hero Block
  // 0.66 - 0.94: Main Hero Section (Kanan-Kiri Immersive on dark canvas)
  // 0.94 - 1.00: Fade out into Sector 1

  // Phrase 1 (Kiri Tengah): 01 — Premisa: "La economía no es caos."
  const phrase1Progress = useTransform(scrollYProgress, [0.16, 0.27], [0, 1]);
  const phrase1BlockOpacity = useTransform(scrollYProgress, [0.15, 0.18, 0.33, 0.36], [0, 1, 1, 0]);

  // Phrase 2 (Kanan Tengah): 02 — Mecánica: "Es un mecanismo predecible, medible, replicable."
  const phrase2Progress = useTransform(scrollYProgress, [0.34, 0.44], [0, 1]);
  const phrase2BlockOpacity = useTransform(scrollYProgress, [0.33, 0.36, 0.50, 0.53], [0, 1, 1, 0]);

  // Phrase 3 (Tengah Bawah): 03 — Escala: "Adaptamos esa misma lógica a la escala de tu empresa."
  const phrase3Progress = useTransform(scrollYProgress, [0.51, 0.59], [0, 1]);
  const phrase3HookProgress = useTransform(scrollYProgress, [0.55, 0.63], [0, 1]);
  const phrase3BlockOpacity = useTransform(scrollYProgress, [0.50, 0.53, 0.66, 0.69], [0, 1, 1, 0]);

  // Main Hero Block (Phase 3: Kanan-Kiri Immersive over dark canvas)
  const heroMainOpacity = useTransform(scrollYProgress, [0.60, 0.66, 0.98, 1.00], [0, 1, 1, 0]);
  const heroTitleProgress = useTransform(scrollYProgress, [0.62, 0.72], [0, 1]);

  // Overall exit opacity: guarantees zero overlap when transitioning to Sector 1
  const heroStageOverallOpacity = useTransform(scrollYProgress, [0.0, 0.98, 1.0], [1, 1, 0]);

  return (
    <div ref={containerRef} className="relative h-[320vh] w-full pointer-events-none" id="hero-stage">
      {/* Sticky Viewport at z-20 (above video canvas) */}
      <motion.div
        style={{ opacity: heroStageOverallOpacity }}
        className="sticky top-0 h-screen w-full relative flex items-center justify-center overflow-hidden pointer-events-none z-20"
      >

        {/* ================================================================ */}
        {/* Phase 2: Opening Phrases (HybridRevealText letter-by-letter)     */}
        {/* Position: 01 (Kiri Tengah), 02 (Kanan Tengah), 03 (Tengah Bawah) */}
        {/* Stationary in place, revealing character-by-character            */}
        {/* ================================================================ */}
        <div className="absolute inset-0 z-10 pointer-events-none">
          
          {/* Phrase 1 (Kiri Tengah) */}
          <div className="absolute top-1/2 -translate-y-1/2 left-8 sm:left-12 md:left-16 lg:left-20 xl:left-24 w-[88%] sm:w-[75%] md:w-[60%] lg:w-[48%] max-w-2xl text-left pointer-events-none">
            <motion.div
              style={{ opacity: phrase1BlockOpacity }}
              className="flex flex-col items-start"
            >
              <p className="font-body text-xs sm:text-sm tracking-[0.25em] text-[#E5997B] font-semibold uppercase mb-2 sm:mb-3">
                01 — Premisa
              </p>
              <h2 className="leading-[1.12] tracking-tight w-full block break-words drop-shadow-md text-left">
                <HybridRevealText
                  text={HERO_STAGE_DATA.openingPhrases[0]}
                  progress={phrase1Progress}
                  className="font-display font-medium text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-[3.6rem] inline break-words text-white"
                  targetColor="#FFFFFF"
                />
              </h2>
            </motion.div>
          </div>

          {/* Phrase 2 (Kanan Tengah) */}
          <div className="absolute top-1/2 -translate-y-1/2 right-8 sm:right-12 md:right-16 lg:right-20 xl:right-24 w-[88%] sm:w-[75%] md:w-[60%] lg:w-[48%] max-w-2xl text-right pointer-events-none">
            <motion.div
              style={{ opacity: phrase2BlockOpacity }}
              className="flex flex-col items-end text-right"
            >
              <p className="font-body text-xs sm:text-sm tracking-[0.25em] text-[#E5997B] font-semibold uppercase mb-2 sm:mb-3">
                02 — Mecánica
              </p>
              <h2 className="leading-[1.12] tracking-tight w-full block break-words drop-shadow-md text-right">
                <HybridRevealText
                  text={HERO_STAGE_DATA.openingPhrases[1]}
                  progress={phrase2Progress}
                  className="font-display font-medium text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-[3.6rem] inline break-words text-white"
                  targetColor="#FFFFFF"
                />
              </h2>
            </motion.div>
          </div>

          {/* Phrase 3 (Tengah Bawah: 100% centered horizontally at bottom) */}
          <div className="absolute bottom-12 sm:bottom-16 md:bottom-20 lg:bottom-24 inset-x-0 mx-auto w-[92%] sm:w-[85%] md:w-[75%] lg:w-[65%] max-w-4xl px-4 text-center pointer-events-none">
            <motion.div
              style={{ opacity: phrase3BlockOpacity }}
              className="flex flex-col items-center text-center"
            >
              <p className="font-body text-xs sm:text-sm tracking-[0.25em] text-[#E5997B] font-semibold uppercase mb-2 sm:mb-3">
                03 — Escala
              </p>
              <h2 className="leading-[1.14] tracking-tight w-full block break-words drop-shadow-md text-center">
                <HybridRevealText
                  text={HERO_STAGE_DATA.openingPhrases[2]}
                  progress={phrase3Progress}
                  className="font-display font-medium text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-[3.6rem] inline break-words text-white"
                  targetColor="#FFFFFF"
                />
              </h2>
              <div className="mt-3 sm:mt-4">
                <HybridRevealText
                  text={`— ${HERO_STAGE_DATA.openingPhrases[3]}`}
                  progress={phrase3HookProgress}
                  className="font-display text-lg sm:text-xl md:text-2xl lg:text-3xl text-[#E5997B] font-normal italic tracking-wide inline break-words drop-shadow"
                  targetColor="#E5997B"
                />
              </div>
            </motion.div>
          </div>
        </div>

        {/* ================================================================ */}
        {/* Phase 3: Main Hero Block (Side Perimeter: Left Title, Right Desc) */}
        {/* Stationary in place                                              */}
        {/* ================================================================ */}
        <motion.div
          style={{ opacity: heroMainOpacity }}
          className="relative w-full h-full max-w-[1620px] mx-auto px-6 sm:px-10 lg:px-12 xl:px-14 pointer-events-auto flex flex-col lg:block justify-center gap-8 z-20"
        >
          {/* Title Block (Left Side) */}
          <div className="w-full flex flex-col space-y-3 sm:space-y-4 lg:absolute lg:left-0 lg:top-1/2 lg:-translate-y-1/2 lg:max-w-xl xl:max-w-2xl items-start text-left">
            {/* Eyebrow */}
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E5997B]" />
              <span className="font-body text-xs sm:text-[13px] tracking-[0.25em] text-[#E5997B] font-semibold uppercase">
                Sistema Operativo // Principio Directriz
              </span>
            </div>

            {/* DIMA Playfair Display Heading with letter-by-letter reveal */}
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem] xl:text-[3.9rem] text-white font-normal leading-[1.08] tracking-tight drop-shadow-md">
              <HybridRevealText
                text={HERO_STAGE_DATA.title}
                progress={heroTitleProgress}
                className="inline break-words text-white"
                targetColor="#FFFFFF"
              />
            </h2>

            {/* Subtitle / Short Description with Inline Trailing Chevron Icon */}
            <p className="font-body text-lg sm:text-xl md:text-2xl lg:text-[1.4rem] xl:text-[1.55rem] text-white/95 font-light leading-relaxed border-l-4 border-[#E5997B] pl-5 sm:pl-6 max-w-2xl xl:max-w-3xl">
              {(() => {
                const words = HERO_STAGE_DATA.subtitle.trim().split(/\s+/);
                const main = words.slice(0, -1).join(' ');
                const last = words[words.length - 1];
                return (
                  <>
                    <span>{main} </span>
                    <span className="inline-flex items-center whitespace-nowrap">
                      <span>{last}</span>
                      <motion.button
                        type="button"
                        onClick={() => setIsHeroExpanded(prev => !prev)}
                        className="inline-flex items-center justify-center align-middle ml-2.5 w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-white/25 hover:border-[#E5997B] bg-white/[0.08] hover:bg-white/[0.18] text-white hover:text-[#E5997B] transition-all duration-300 cursor-pointer pointer-events-auto shrink-0 shadow-sm"
                        animate={{ rotate: isHeroExpanded ? 180 : 0 }}
                        transition={{ duration: 0.35, ease: 'easeInOut' }}
                        title={isHeroExpanded ? "Ocultar descripción" : "Mostrar descripción"}
                        aria-label={isHeroExpanded ? "Ocultar descripción" : "Mostrar descripción"}
                      >
                        <ChevronRight className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-[#E5997B]" strokeWidth={2.5} />
                      </motion.button>
                    </span>
                  </>
                );
              })()}
            </p>

            {/* CTA Action Button: Positioned DIRECTLY BELOW the Small Description */}
            <div className="pt-2">
              <a
                href="#sector-modelo"
                className="inline-flex items-center justify-center px-6 py-2.5 rounded-full border border-white/30 hover:border-[#E5997B] bg-white/[0.04] hover:bg-white/[0.1] font-body text-xs tracking-[0.2em] uppercase text-white hover:text-[#E5997B] transition-all duration-300 pointer-events-auto shadow-sm"
              >
                Explorar los Sectores
              </a>
            </div>
          </div>

          {/* Description Block (Right Side) */}
          <div className="w-full flex flex-col space-y-4 lg:absolute lg:right-0 lg:top-1/2 lg:-translate-y-1/2 lg:max-w-xl xl:max-w-2xl items-start text-left lg:items-end lg:text-right">
            {/* Expandable Large Description */}
            <AnimatePresence>
              {isHeroExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0, y: -8 }}
                  animate={{ height: 'auto', opacity: 1, y: 0 }}
                  exit={{ height: 0, opacity: 0, y: -8 }}
                  transition={{ duration: 0.35, ease: 'easeInOut' }}
                  className="w-full max-h-[75vh] overflow-y-auto custom-scrollbar pr-1 text-left lg:text-right"
                >
                  <div className="space-y-4 sm:space-y-5 text-lg sm:text-xl md:text-2xl lg:text-[1.38rem] xl:text-[1.48rem] text-white/95 font-body leading-relaxed font-light py-1">
                    {HERO_STAGE_DATA.body.map((p, idx) => (
                      <p key={idx}>{p}</p>
                    ))}
                  </div>

                  {/* Minimize Button in Expanded Description */}
                  <div className="pt-3 flex items-center justify-start lg:justify-end">
                    <button
                      type="button"
                      onClick={() => setIsHeroExpanded(false)}
                      className="group inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 hover:border-[#E5997B] bg-white/[0.06] hover:bg-white/[0.14] font-body text-xs tracking-[0.2em] uppercase text-white/85 hover:text-[#E5997B] transition-all duration-300 cursor-pointer pointer-events-auto shadow-sm"
                    >
                      <Minus className="w-3.5 h-3.5 text-[#E5997B]" />
                      <span>Minimizar</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

      </motion.div>
    </div>
  );
}
