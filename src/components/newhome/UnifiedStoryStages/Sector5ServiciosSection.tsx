import { motion, type MotionValue } from 'framer-motion';
import { Link } from 'react-router-dom';
import { type SectorData } from '../newHomeData';
import HybridRevealText from '../../HybridRevealText';

interface Sector5ServiciosSectionProps {
  phaseRef: (el: HTMLDivElement | null) => void;
  data: SectorData;
  contentY: MotionValue<number>;
  overlayOpacity: MotionValue<number>;
  titleOpacity: MotionValue<number>;
  titleProgress: MotionValue<number>;
  descOpacity: MotionValue<number>;
}

export default function Sector5ServiciosSection({
  phaseRef,
  data,
  contentY,
  overlayOpacity,
  titleOpacity,
  titleProgress,
  descOpacity,
}: Sector5ServiciosSectionProps) {
  return (
    <div
      ref={phaseRef}
      className="absolute inset-0 pointer-events-none z-20 will-change-[opacity,transform] [transform:translateZ(0)] [backface-visibility:hidden]"
      style={{ opacity: 0 }}
    >
      {/* Overlay kiri bawah Sector 5 (Digeser Lebih ke Atas Sesuai Permintaan) */}
      <motion.div
        style={{ opacity: overlayOpacity }}
        className="absolute bottom-0 left-0 w-[98%] sm:w-[94%] md:w-[86%] lg:w-[65.5vw] xl:w-[62.5vw] lg:max-w-[67vw] xl:max-w-[64vw] h-[720px] sm:h-[800px] md:h-[870px] lg:h-[95vh] xl:h-[95.5vh] pointer-events-none z-0 will-change-[opacity] [transform:translateZ(0)] [isolation:isolate]"
        aria-hidden="true"
      >
        <div
          style={{
            transform: 'var(--overlay-transform, none)',
            transformOrigin: '0% 86%',
          }}
          className="absolute inset-0 pointer-events-none"
        >
          {/* Lapisan 1: Kabut transisi halus terluar (Difusi Ultra Halus) */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse 120% 110% at 0% 86%, rgba(244, 244, 246, 0.98) 0%, rgba(244, 244, 246, 0.88) 50%, rgba(244, 244, 246, 0.48) 75%, rgba(244, 244, 246, 0.12) 90%, transparent 100%)',
              filter: 'blur(80px)',
            }}
          />
          {/* Lapisan 2: Inti padat menopang seluruh area teks */}
          <div
            className="absolute bottom-0 left-0 w-[96%] h-[95%] pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse 110% 100% at 0% 86%, rgba(236, 236, 242, 0.98) 0%, rgba(240, 240, 245, 0.92) 52%, rgba(240, 240, 245, 0.40) 80%, transparent 100%)',
              filter: 'blur(48px)',
            }}
          />
          {/* Lapisan 3: Vignette solid di bawah blok teks */}
          <div
            className="absolute bottom-0 left-0 w-[90%] h-[90%] pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse 98% 88% at 0% 86%, rgba(242, 242, 247, 0.99) 0%, rgba(242, 242, 247, 0.92) 62%, rgba(242, 242, 247, 0.30) 88%, transparent 100%)',
              filter: 'blur(28px)',
            }}
          />
        </div>
      </motion.div>

      {/* Content Block (Judul, Tombol CTA & Seluruh Deskripsi Utuh) - Kiri Bawah (Format Kotak Rata Kiri-Kanan) */}
      <motion.div
        style={{
          y: contentY,
        }}
        className="absolute left-8 sm:left-12 lg:left-[5.5vw] xl:left-[6vw] bottom-12 sm:bottom-16 lg:bottom-[8.5vh] xl:bottom-[9.5vh] w-[88%] sm:w-[72%] md:w-[58%] lg:w-[33.5vw] xl:w-[31.5vw] lg:max-w-[34.5vw] xl:max-w-[32.5vw] text-left pointer-events-auto flex flex-col space-y-3 sm:space-y-4 lg:space-y-[0.9vh] z-10"
      >
        {/* Title (Hilang Kedua, Setelah Deskripsi) */}
        <motion.h2
          style={{ opacity: titleOpacity }}
          className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-[2.6vw] xl:text-[2.85vw] lg:leading-[2.9vw] xl:leading-[3.15vw] text-[#030035] font-normal leading-[1.12] tracking-tight [text-wrap:balance]"
        >
          <HybridRevealText
            text={data.title}
            progress={titleProgress}
            className="inline break-words text-[#030035]"
            targetColor="#030035"
          />
        </motion.h2>

        {/* Description & CTA (Hilang Pertama Sebelum Judul & Overlay) */}
        <motion.div
          style={{ opacity: descOpacity }}
          className="flex flex-col space-y-3 sm:space-y-4 lg:space-y-[0.9vh]"
        >
          {/* CTA Button */}
          <div className="pt-0.5 sm:pt-1 lg:pt-[0.2vh]">
            <Link
              to={data.linkTo}
              className="inline-flex items-center justify-center px-6 py-2.5 lg:px-[1.25vw] lg:py-[0.9vh] rounded-full border border-[#030035]/20 hover:border-[#E5997B] bg-transparent hover:bg-[#030035]/5 font-body text-xs lg:text-[0.68vw] lg:leading-[1vw] tracking-[0.2em] uppercase text-[#030035] hover:text-[#E5997B] transition-all duration-300 pointer-events-auto shadow-sm"
            >
              {data.linkText}
            </Link>
          </div>

          {/* United Description Paragraphs - Left Aligned */}
          <div className="space-y-2.5 sm:space-y-3 lg:space-y-[0.85vh] pt-1">
            {data.body.map((paragraphText, idx) => (
              <p
                key={idx}
                lang="es"
                className="font-body font-normal text-[15px] sm:text-base md:text-[17px] lg:text-[0.98vw] xl:text-[1.04vw] lg:leading-[1.52vw] xl:leading-[1.60vw] text-[#030035] leading-relaxed tracking-[-0.01em] body-justified"
              >
                {paragraphText}
              </p>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
