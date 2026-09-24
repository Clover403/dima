import { useRef, useState } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Minus } from 'lucide-react';
import type { SectorData } from './newHomeData';
import CreditArchitectureDiagram from './CreditArchitectureDiagram';
import HybridRevealText from '../HybridRevealText';

interface SectorStorySectionProps {
  sector: SectorData;
  index?: number;
  total?: number;
  onScrollProgress?: (sectorId: string, progress: number) => void;
}

// Side perimeter layout configuration per sector (leaving center clear for video)
const SECTOR_LAYOUTS: Record<string, {
  titlePosition: string;
  titleAlign: string;
  descPosition: string;
  descAlign: string;
}> = {
  modelo: {
    // 01: Kiri Bawah (Title) & Kanan Bawah (Desc)
    titlePosition: 'lg:absolute lg:left-0 lg:bottom-16 lg:xl:bottom-20 lg:max-w-lg xl:max-w-xl',
    titleAlign: 'items-start text-left',
    descPosition: 'lg:absolute lg:right-0 lg:bottom-16 lg:xl:bottom-20 lg:max-w-xl xl:max-w-2xl',
    descAlign: 'items-start text-left lg:items-end lg:text-right',
  },
  proceso: {
    // 02: Kanan Tengah (Title) & Kiri Bawah (Desc)
    titlePosition: 'lg:absolute lg:right-0 lg:top-1/2 lg:-translate-y-1/2 lg:max-w-lg xl:max-w-xl',
    titleAlign: 'items-start text-left lg:items-end lg:text-right',
    descPosition: 'lg:absolute lg:left-0 lg:bottom-16 lg:xl:bottom-20 lg:max-w-xl xl:max-w-2xl',
    descAlign: 'items-start text-left',
  },
  filosofia: {
    // 03: Kiri Bawah (Title) & Kanan Atas (Desc) - agar tidak sama dengan sector 04
    titlePosition: 'lg:absolute lg:left-0 lg:bottom-16 lg:xl:bottom-20 lg:max-w-lg xl:max-w-xl',
    titleAlign: 'items-start text-left',
    descPosition: 'lg:absolute lg:right-0 lg:top-24 lg:xl:top-28 lg:max-w-xl xl:max-w-2xl',
    descAlign: 'items-start text-left lg:items-end lg:text-right',
  },
  productos: {
    // 04: Kiri Atas (Title) & Kanan Bawah (Table / Diagram)
    titlePosition: 'lg:absolute lg:left-0 lg:top-24 lg:xl:top-28 lg:max-w-lg xl:max-w-xl',
    titleAlign: 'items-start text-left',
    descPosition: 'lg:absolute lg:right-0 lg:bottom-6 lg:xl:bottom-10 lg:w-full lg:max-w-[560px] xl:max-w-[620px]',
    descAlign: 'items-start text-left',
  },
  servicios: {
    // 05: Tengah Bawah (Title) & Deskripsi inline di antara subtitle & CTA
    titlePosition: 'lg:absolute lg:inset-x-0 lg:bottom-8 lg:xl:bottom-12 lg:mx-auto lg:max-w-3xl xl:max-w-4xl',
    titleAlign: 'items-center text-center',
    descPosition: '',
    descAlign: 'items-center text-center',
  },
};

export default function SectorStorySection({
  sector,
  onScrollProgress,
}: SectorStorySectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const layout = SECTOR_LAYOUTS[sector.id] || SECTOR_LAYOUTS.modelo;
  const isRightSide = layout.titlePosition.includes('lg:right-0');
  const isCentered = layout.titlePosition.includes('lg:inset-x-0') || layout.titleAlign.includes('text-center');

  // Measure scroll progress across the ENTIRE active duration of this sector container (from entering to exiting the top)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });

  scrollYProgress.on('change', (val) => {
    if (onScrollProgress) {
      onScrollProgress(sector.id, val);
    }
  });

  // Text stays completely stationary in place (NO vertical y sliding/scrolling)
  // It emerges cleanly at its coordinates, reveals per-letter (Nosotros style), and is HELD through 0.96
  const sectionOpacity = useTransform(
    scrollYProgress,
    [0.00, 0.04, 0.96, 1.00],
    [0, 1, 1, 0]
  );

  // Progressive letter-by-letter reveal for title (Nosotros style: in place)
  const titleProgress = useTransform(
    scrollYProgress,
    [0.02, 0.26],
    [0, 1]
  );

  // Subtitle, CTA, and Diagram fade in smoothly in place as the title completes (0.12 to 0.22)
  const subContentOpacity = useTransform(
    scrollYProgress,
    [0.12, 0.22],
    [0, 1]
  );

  // Compact height: eliminates long empty scrolling between sectors
  const containerHeightClass =
    sector.videoIndices.length >= 4
      ? 'min-h-[350vh]'
      : sector.videoIndices.length === 3
      ? 'min-h-[280vh]'
      : sector.videoIndices.length === 2
      ? 'min-h-[210vh]'
      : 'min-h-[165vh]';

  // Parse subtitle words so the chevron can be glued directly adjacent to the text with zero gap separation
  const subtitleWords = (sector.subtitle || '').trim().split(/\s+/);
  const subtitleMain = subtitleWords.slice(0, -1).join(' ');
  const subtitleLast = subtitleWords[subtitleWords.length - 1] || '';
  const subtitleFirst = subtitleWords[0] || '';
  const subtitleRest = subtitleWords.slice(1).join(' ');

  return (
    <div
      ref={sectionRef}
      id={`sector-${sector.id}`}
      className={`relative ${containerHeightClass} w-full`}
    >
      {/* Sticky Viewport: Leaves the center clear for video animation */}
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden pointer-events-none z-10">
        
        <motion.div
          style={{ opacity: sectionOpacity }}
          className="relative w-full h-full max-w-[1620px] mx-auto px-6 sm:px-10 lg:px-12 xl:px-14 pointer-events-auto flex flex-col lg:block justify-center gap-8"
        >
          {/* ============================================================ */}
          {/* TITLE BLOCK (Placed at designated perimeter side)            */}
          {/* ============================================================ */}
          <div className={`w-full flex flex-col space-y-3 sm:space-y-4 ${layout.titlePosition} ${layout.titleAlign}`}>
            {/* Title with letter-by-letter reveal animation (Nosotros style) */}
            <h3 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem] xl:text-[3.9rem] text-white font-normal leading-[1.08] tracking-tight drop-shadow-md">
              <HybridRevealText
                text={sector.title}
                progress={titleProgress}
                className="inline break-words text-white"
                targetColor="#FFFFFF"
              />
            </h3>

            {/* Subtitle / Short Description with Dynamic Inline Chevron */}
            {sector.subtitle && (
              <motion.div style={{ opacity: subContentOpacity }}>
                {isCentered ? (
                  <p className="max-w-3xl xl:max-w-4xl mx-auto font-body text-lg sm:text-xl md:text-2xl lg:text-[1.4rem] xl:text-[1.55rem] text-white/95 font-light leading-relaxed text-center px-4">
                    <span>{subtitleMain} </span>
                    <span className="inline-flex items-center whitespace-nowrap">
                      <span>{subtitleLast}</span>
                      <motion.button
                        type="button"
                        onClick={() => setIsExpanded((prev) => !prev)}
                        className="inline-flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-white/25 hover:border-[#E5997B] bg-white/[0.08] hover:bg-white/[0.18] text-white hover:text-[#E5997B] transition-all duration-300 cursor-pointer pointer-events-auto shrink-0 shadow-sm ml-2.5 align-middle"
                        animate={{ rotate: isExpanded ? 90 : 0 }}
                        transition={{ duration: 0.35, ease: 'easeInOut' }}
                        title={isExpanded ? 'Ocultar descripción' : 'Mostrar descripción'}
                        aria-label={isExpanded ? 'Ocultar descripción' : 'Mostrar descripción'}
                      >
                        <ChevronRight className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-[#E5997B]" strokeWidth={2.5} />
                      </motion.button>
                    </span>
                  </p>
                ) : (
                  <p
                    className={`max-w-xl xl:max-w-2xl font-body text-lg sm:text-xl md:text-2xl lg:text-[1.4rem] xl:text-[1.55rem] text-white/95 font-light leading-relaxed border-l-4 border-[#E5997B] pl-5 sm:pl-6 text-left ${
                      isRightSide
                        ? 'lg:border-l-0 lg:border-r-4 lg:border-[#E5997B] lg:pl-0 lg:pr-5 sm:lg:pr-6 lg:text-right'
                        : ''
                    }`}
                  >
                    {isRightSide ? (
                      <>
                        {/* On Desktop for Right Side: Chevron placed at the LEFT, facing LEFT (rotates to RIGHT when open) */}
                        <span className="hidden lg:inline">
                          <span className="inline-flex items-center whitespace-nowrap">
                            <motion.button
                              type="button"
                              onClick={() => setIsExpanded((prev) => !prev)}
                              className="inline-flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-white/25 hover:border-[#E5997B] bg-white/[0.08] hover:bg-white/[0.18] text-white hover:text-[#E5997B] transition-all duration-300 cursor-pointer pointer-events-auto shrink-0 shadow-sm mr-2.5 align-middle"
                              animate={{ rotate: isExpanded ? 180 : 0 }}
                              transition={{ duration: 0.35, ease: 'easeInOut' }}
                              title={isExpanded ? 'Ocultar descripción' : 'Mostrar descripción'}
                              aria-label={isExpanded ? 'Ocultar descripción' : 'Mostrar descripción'}
                            >
                              <ChevronLeft className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-[#E5997B]" strokeWidth={2.5} />
                            </motion.button>
                            <span>{subtitleFirst}</span>
                          </span>
                          <span> {subtitleRest}</span>
                        </span>

                        {/* On Mobile fallback for Right Side: Chevron placed at the end for standard left-aligned reading */}
                        <span className="inline lg:hidden">
                          <span>{subtitleMain} </span>
                          <span className="inline-flex items-center whitespace-nowrap">
                            <span>{subtitleLast}</span>
                            <motion.button
                              type="button"
                              onClick={() => setIsExpanded((prev) => !prev)}
                              className="inline-flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-white/25 hover:border-[#E5997B] bg-white/[0.08] hover:bg-white/[0.18] text-white hover:text-[#E5997B] transition-all duration-300 cursor-pointer pointer-events-auto shrink-0 shadow-sm ml-2.5 align-middle"
                              animate={{ rotate: isExpanded ? 180 : 0 }}
                              transition={{ duration: 0.35, ease: 'easeInOut' }}
                              title={isExpanded ? 'Ocultar descripción' : 'Mostrar descripción'}
                              aria-label={isExpanded ? 'Ocultar descripción' : 'Mostrar descripción'}
                            >
                              <ChevronRight className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-[#E5997B]" strokeWidth={2.5} />
                            </motion.button>
                          </span>
                        </span>
                      </>
                    ) : (
                      <>
                        <span>{subtitleMain} </span>
                        <span className="inline-flex items-center whitespace-nowrap">
                          <span>{subtitleLast}</span>
                          <motion.button
                            type="button"
                            onClick={() => setIsExpanded((prev) => !prev)}
                            className="inline-flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-white/25 hover:border-[#E5997B] bg-white/[0.08] hover:bg-white/[0.18] text-white hover:text-[#E5997B] transition-all duration-300 cursor-pointer pointer-events-auto shrink-0 shadow-sm ml-2.5 align-middle"
                            animate={{ rotate: isExpanded ? 180 : 0 }}
                            transition={{ duration: 0.35, ease: 'easeInOut' }}
                            title={isExpanded ? 'Ocultar descripción' : 'Mostrar descripción'}
                            aria-label={isExpanded ? 'Ocultar descripción' : 'Mostrar descripción'}
                          >
                            <ChevronRight className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-[#E5997B]" strokeWidth={2.5} />
                          </motion.button>
                        </span>
                      </>
                    )}
                  </p>
                )}
              </motion.div>
            )}

            {/* KHUSUS TEKS TERAKHIR (Sector 05 / Servicios): Deskripsi muncul DI ANTARA deskripsi kecil dan tombol CTA */}
            {sector.id === 'servicios' && (
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0, y: -6 }}
                    animate={{ height: 'auto', opacity: 1, y: 0 }}
                    exit={{ height: 0, opacity: 0, y: -6 }}
                    transition={{ duration: 0.35, ease: 'easeInOut' }}
                    className="w-full max-w-2xl mx-auto overflow-hidden text-center my-1"
                  >
                    <div className="space-y-4 text-lg sm:text-xl md:text-2xl text-white/95 font-body leading-relaxed font-light py-2 max-h-[46vh] overflow-y-auto custom-scrollbar px-3">
                      {sector.body.map((p, pIdx) => (
                        <p key={pIdx}>{p}</p>
                      ))}
                    </div>

                    {/* Minimize Button */}
                    <div className="pt-1.5 pb-1 flex items-center justify-center">
                      <button
                        type="button"
                        onClick={() => setIsExpanded(false)}
                        className="group inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 hover:border-[#E5997B] bg-white/[0.06] hover:bg-white/[0.14] font-body text-xs tracking-[0.2em] uppercase text-white/85 hover:text-[#E5997B] transition-all duration-300 cursor-pointer pointer-events-auto shadow-sm"
                      >
                        <Minus className="w-3.5 h-3.5 text-[#E5997B]" />
                        <span>Minimizar</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            )}

            {/* CTA Action Button: Positioned DIRECTLY BELOW the Small Description (or below Large Description when open in Sector 05) */}
            <motion.div
              style={{ opacity: subContentOpacity }}
              className={`pt-2 ${isCentered ? 'flex justify-center' : ''}`}
            >
              <Link
                to={sector.linkTo}
                className="inline-flex items-center justify-center px-6 py-2.5 rounded-full border border-white/30 hover:border-[#E5997B] bg-white/[0.04] hover:bg-white/[0.1] font-body text-xs tracking-[0.2em] uppercase text-white hover:text-[#E5997B] transition-all duration-300 pointer-events-auto shadow-sm"
              >
                {sector.linkText}
              </Link>
            </motion.div>
          </div>

          {/* ============================================================ */}
          {/* DESCRIPTION BLOCK (Placed at opposite perimeter side for sectors 01-04) */}
          {/* ============================================================ */}
          {sector.id !== 'servicios' && (
            <div className={`w-full flex flex-col space-y-4 ${layout.descPosition} ${layout.descAlign}`}>
              {/* Expandable Large Description */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0, y: -8 }}
                    animate={{ height: 'auto', opacity: 1, y: 0 }}
                    exit={{ height: 0, opacity: 0, y: -8 }}
                    transition={{ duration: 0.35, ease: 'easeInOut' }}
                    className="w-full max-h-[75vh] overflow-y-auto custom-scrollbar pr-1"
                  >
                    <div className="space-y-4 sm:space-y-5 text-lg sm:text-xl md:text-2xl lg:text-[1.38rem] xl:text-[1.48rem] text-white/95 font-body leading-relaxed font-light py-1">
                      {sector.body.map((p, pIdx) => (
                        <p key={pIdx}>{p}</p>
                      ))}
                    </div>

                    {/* Minimize Button in Expanded Description */}
                    <div className={`pt-3 flex items-center ${layout.descAlign.includes('lg:items-end') ? 'justify-start lg:justify-end' : 'justify-start'}`}>
                      <button
                        type="button"
                        onClick={() => setIsExpanded(false)}
                        className="group inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 hover:border-[#E5997B] bg-white/[0.06] hover:bg-white/[0.14] font-body text-xs tracking-[0.2em] uppercase text-white/85 hover:text-[#E5997B] transition-all duration-300 cursor-pointer pointer-events-auto shadow-sm"
                      >
                        <Minus className="w-3.5 h-3.5 text-[#E5997B]" />
                        <span>Minimizar</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Interactive Credit Elements Diagram for Sector 4 (Productos) */}
              {sector.hasDiagram && (
                <motion.div
                  style={{ opacity: subContentOpacity }}
                  className="pt-2 w-full"
                >
                  <CreditArchitectureDiagram />
                </motion.div>
              )}
            </div>
          )}

        </motion.div>

      </div>
    </div>
  );
}
