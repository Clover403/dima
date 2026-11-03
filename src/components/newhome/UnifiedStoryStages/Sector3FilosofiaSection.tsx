import { motion, type MotionValue } from 'framer-motion';
import { Link } from 'react-router-dom';
import { type SectorData } from '../newHomeData';
import HybridRevealText from '../../HybridRevealText';

interface Sector3FilosofiaSectionProps {
  phaseRef: (el: HTMLDivElement | null) => void;
  data: SectorData;
  contentY: MotionValue<number>;
  overlayOpacity: MotionValue<number>;
  titleOpacity: MotionValue<number>;
  titleProgress: MotionValue<number>;
  descOpacity: MotionValue<number>;
}

export default function Sector3FilosofiaSection({
  phaseRef,
  data,
  contentY,
  overlayOpacity,
  titleOpacity,
  titleProgress,
  descOpacity,
}: Sector3FilosofiaSectionProps) {
  return (
    <div
      ref={phaseRef}
      className="absolute inset-0 pointer-events-none z-20 will-change-[opacity,transform] [transform:translateZ(0)] [backface-visibility:hidden]"
      style={{ opacity: 0 }}
    >
      {/* Content Block (Judul, Tombol CTA & Paragraf Tunggal Utuh) - Kiri Atas (Diturunkan sedikit agar tidak mepet navbar) */}
      <motion.div
        style={{
          y: contentY,
        }}
        className="absolute left-8 sm:left-12 lg:left-[4.17vw] top-24 sm:top-28 lg:top-[12vh] xl:top-[12.5vh] w-[90%] sm:w-[68%] md:w-[56%] lg:w-[42vw] xl:w-[38vw] lg:max-w-[44vw] text-left pointer-events-auto flex flex-col space-y-2.5 sm:space-y-3 lg:space-y-[0.8vh] z-10"
      >
        {/* Backdrop Fog: Ultra-Smooth, Luas Maksimal & Blur Mendalam (Digeser sedikit ke bawah & ke kanan) */}
        <motion.div
          style={{ opacity: overlayOpacity }}
          className="absolute -top-34 -bottom-30 -left-20 -right-28 sm:-top-40 sm:-bottom-36 sm:-left-28 sm:-right-36 lg:-top-[28vh] lg:-bottom-[24vh] lg:-left-[19vw] lg:-right-[25vw] xl:-left-[21vw] xl:-right-[27vw] pointer-events-none -z-10 rounded-full will-change-[opacity] [transform:translateZ(0)] [isolation:isolate]"
          aria-hidden="true"
        >
          <div
            style={{
              transform: 'var(--overlay-transform, none)',
              transformOrigin: '31% 44%',
            }}
            className="absolute inset-0 pointer-events-none"
          >
            {/* Lapisan 1: Halo atmosferik terluar ekstra luas menyatu ke video (Blur 220px) */}
            <div
              className="absolute -inset-14 sm:-inset-24 rounded-full pointer-events-none"
              style={{
                background: 'radial-gradient(ellipse 135% 120% at 31% 44%, rgba(244, 244, 246, 0.70) 0%, rgba(244, 244, 246, 0.42) 38%, rgba(244, 244, 246, 0.15) 68%, rgba(244, 244, 246, 0.02) 88%, transparent 100%)',
                filter: 'blur(220px)',
              }}
            />

            {/* Lapisan 2: Difusi transisi medium sangat lembut (Blur 150px) */}
            <div
              className="absolute -inset-6 sm:-inset-10 rounded-full pointer-events-none"
              style={{
                background: 'radial-gradient(ellipse 120% 105% at 31% 44%, rgba(242, 242, 245, 0.80) 0%, rgba(242, 242, 245, 0.52) 42%, rgba(242, 242, 245, 0.16) 74%, transparent 100%)',
                filter: 'blur(150px)',
              }}
            />

            {/* Lapisan 3: Penopang bodi kabut halus tanpa batas kontur (Blur 95px) */}
            <div
              className="absolute inset-4 sm:inset-8 lg:inset-10 rounded-full pointer-events-none"
              style={{
                background: 'radial-gradient(ellipse 105% 90% at 31% 44%, rgba(244, 244, 246, 0.88) 0%, rgba(244, 244, 246, 0.62) 50%, rgba(244, 244, 246, 0.20) 80%, transparent 100%)',
                filter: 'blur(95px)',
              }}
            />

            {/* Lapisan 4: Inti putih solid pelindung keterbacaan teks (Blur 58px) */}
            <div
              className="absolute inset-10 sm:inset-16 lg:inset-20 rounded-full pointer-events-none"
              style={{
                background: 'radial-gradient(ellipse 95% 85% at 31% 44%, rgba(248, 248, 250, 0.98) 0%, rgba(246, 246, 248, 0.88) 50%, rgba(244, 244, 246, 0.35) 78%, transparent 100%)',
                filter: 'blur(58px)',
              }}
            />

            {/* Lapisan 5: Penopang organik dari tepi kiri layar (Blur 100px) */}
            <div
              className="absolute -top-18 -bottom-18 -left-14 sm:-left-20 w-[90%] rounded-full pointer-events-none"
              style={{
                background: 'radial-gradient(ellipse 100% 80% at 0% 44%, rgba(244, 244, 246, 0.88) 0%, rgba(244, 244, 246, 0.50) 55%, transparent 100%)',
                filter: 'blur(100px)',
              }}
            />
          </div>
        </motion.div>

        {/* Title (Hilang Kedua, Setelah Deskripsi) */}
        <motion.h2
          style={{ opacity: titleOpacity }}
          className="relative z-10 font-display text-3xl sm:text-4xl md:text-5xl lg:text-[2.6vw] xl:text-[2.85vw] lg:leading-[2.9vw] xl:leading-[3.15vw] text-[#030035] font-normal leading-[1.12] tracking-tight text-left"
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
          className="relative z-10 flex flex-col space-y-2.5 sm:space-y-3 lg:space-y-[0.8vh]"
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

          {/* Paragraphs (Persis 3 paragraf sesuai referensi) */}
          <div className="pt-1 sm:pt-1.5 lg:pt-[0.3vh] flex flex-col space-y-2 sm:space-y-2.5 lg:space-y-[0.7vh]">
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
