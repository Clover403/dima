import { motion, type MotionValue } from 'framer-motion';
import { Link } from 'react-router-dom';
import { type SectorData } from '../newHomeData';
import HybridRevealText from '../../HybridRevealText';

interface Sector1ModeloSectionProps {
  phaseRef: (el: HTMLDivElement | null) => void;
  data: SectorData;
  contentY: MotionValue<number>;
  overlayOpacity: MotionValue<number>;
  titleOpacity: MotionValue<number>;
  titleProgress: MotionValue<number>;
  descOpacity: MotionValue<number>;
}

export default function Sector1ModeloSection({
  phaseRef,
  data,
  contentY,
  overlayOpacity,
  titleOpacity,
  titleProgress,
  descOpacity,
}: Sector1ModeloSectionProps) {
  return (
    <div
      ref={phaseRef}
      className="absolute inset-0 pointer-events-none z-20 will-change-[opacity,transform] [transform:translateZ(0)] [backface-visibility:hidden]"
      style={{ opacity: 0 }}
    >
      {/* Content Block (Judul, Tombol CTA & Seluruh Deskripsi Utuh) - Disesuaikan agak ke kiri dan agak ke atas */}
      <motion.div
        style={{
          y: contentY,
        }}
        className="absolute left-8 sm:left-12 md:left-16 lg:left-[6vw] xl:left-[6.5vw] bottom-28 sm:bottom-32 md:bottom-40 lg:bottom-[25.5vh] xl:bottom-[27vh] w-[90%] sm:w-[65%] md:w-[52%] lg:w-[34vw] xl:w-[32vw] lg:max-w-[35vw] xl:max-w-[33vw] text-left pointer-events-auto flex flex-col space-y-3 sm:space-y-4 lg:space-y-[1.0vh] z-10"
      >
        {/* SINGLE OVERLAY (1 animated div, visual sama persis dengan aslinya): Atmosferik + penopang teks */}
        <motion.div
          style={{ opacity: overlayOpacity, position: 'absolute', inset: 0 }}
          className="pointer-events-none -z-20 will-change-[opacity] [transform:translateZ(0)] [isolation:isolate]"
          aria-hidden="true"
        >
          <div
            style={{
              transform: 'var(--overlay-transform, none)',
              transformOrigin: '22% 50%',
              left: 'clamp(24px, 4.2vw, 72px)',
              right: 'calc(-1 * clamp(24px, 4.2vw, 72px))',
              top: 'clamp(16px, 3.2vh, 38px)',
              bottom: 'calc(-1 * clamp(16px, 3.2vh, 38px))',
            }}
            className="absolute pointer-events-none"
          >
            {/* === BAGIAN BAWAH: Wilayah Luas Atmosferik === */}
            {/* Lapisan 1: Halo atmosferik terluar ekstra luas menyatu ke video (Blur 450px) */}
            <div
              className="absolute -top-[42vh] -bottom-[40vh] -left-[36vw] -right-[34vw] sm:-top-[46vh] sm:-bottom-[44vh] sm:-left-[40vw] sm:-right-[38vw] lg:-top-[50vh] lg:-bottom-[48vh] lg:-left-[42vw] lg:-right-[40vw] xl:-left-[44vw] xl:-right-[42vw] rounded-full pointer-events-none"
              style={{
                background: 'radial-gradient(ellipse 140% 120% at 22% 50%, rgba(244, 244, 246, 0.45) 0%, rgba(244, 244, 246, 0.22) 42%, rgba(244, 244, 246, 0.04) 72%, transparent 100%)',
                filter: 'blur(450px)',
              }}
            />
            {/* Lapisan 2: Transisi medium sangat lembut (Blur 340px) */}
            <div
              className="absolute -top-[46vh] -bottom-[44vh] -left-[38vw] -right-[36vw] sm:-top-[46vh] sm:-bottom-[44vh] sm:-left-[40vw] sm:-right-[38vw] lg:-top-[50vh] lg:-bottom-[48vh] lg:-left-[42vw] lg:-right-[40vw] rounded-full pointer-events-none"
              style={{
                background: 'radial-gradient(ellipse 120% 105% at 20% 50%, rgba(242, 242, 245, 0.55) 0%, rgba(242, 242, 245, 0.28) 45%, rgba(242, 242, 245, 0.06) 75%, transparent 100%)',
                filter: 'blur(340px)',
              }}
            />
            {/* Lapisan 3: Penopang bodi kabut luas (Blur 260px) */}
            <div
              className="absolute -top-[44vh] -bottom-[42vh] -left-[36vw] -right-[34vw] lg:-top-[50vh] lg:-bottom-[48vh] lg:-left-[42vw] lg:-right-[40vw] rounded-full pointer-events-none"
              style={{
                background: 'radial-gradient(ellipse 105% 90% at 18% 50%, rgba(244, 244, 246, 0.65) 0%, rgba(244, 244, 246, 0.32) 48%, rgba(244, 244, 246, 0.08) 75%, transparent 100%)',
                filter: 'blur(260px)',
              }}
            />

            {/* === BAGIAN ATAS: Di Atas Blur Atmosferik, Menjaga Keterbacaan Teks === */}
            {/* Lapisan 4: Difusi tepi (Blur 160px) */}
            <div
              className="absolute -top-[14vh] -bottom-[16vh] -left-[14vw] -right-[14vw] sm:-top-[15vh] sm:-bottom-[17vh] sm:-left-[16vw] sm:-right-[16vw] lg:-top-[16vh] lg:-bottom-[18vh] lg:-left-[15vw] lg:-right-[15vw] rounded-full pointer-events-none"
              style={{
                background: 'radial-gradient(ellipse 120% 105% at 22% 50%, rgba(244, 244, 246, 0.90) 0%, rgba(244, 244, 246, 0.60) 50%, rgba(244, 244, 246, 0.20) 80%, transparent 100%)',
                filter: 'blur(160px)',
              }}
            />
            {/* Lapisan 5: Inti putih tebal terbaur organik (Blur 100px) */}
            <div
              className="absolute -top-[13vh] -bottom-[15vh] -left-[13vw] -right-[13vw] sm:-top-[14vh] sm:-bottom-[16vh] sm:-left-[15vw] sm:-right-[15vw] lg:-top-[15vh] lg:-bottom-[17vh] lg:-left-[14vw] lg:-right-[14vw] rounded-full pointer-events-none"
              style={{
                background: 'radial-gradient(ellipse 100% 88% at 20% 50%, rgba(250, 250, 252, 0.98) 0%, rgba(246, 246, 248, 0.88) 50%, rgba(244, 244, 246, 0.35) 78%, transparent 100%)',
                filter: 'blur(100px)',
              }}
            />
            {/* Lapisan 6: Penopang dari tepi kiri layar (Blur 130px) */}
            <div
              className="absolute -top-[14vh] -bottom-[16vh] -left-[15vw] sm:-left-[17vw] -right-[12vw] lg:-left-[16vw] rounded-full pointer-events-none"
              style={{
                background: 'radial-gradient(ellipse 100% 80% at 0% 50%, rgba(246, 246, 248, 0.95) 0%, rgba(244, 244, 246, 0.65) 55%, transparent 100%)',
                filter: 'blur(130px)',
              }}
            />
          </div>
        </motion.div>

        {/* Title (Hilang Kedua, Setelah Deskripsi) */}
        <motion.h2
          style={{ opacity: titleOpacity }}
          className="relative z-10 font-display text-3xl sm:text-4xl md:text-5xl lg:text-[2.6vw] xl:text-[2.85vw] lg:leading-[2.9vw] xl:leading-[3.15vw] text-[#030035] font-normal leading-[1.12] tracking-tight"
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
          className="relative z-10 flex flex-col space-y-3 sm:space-y-4 lg:space-y-[1.0vh]"
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

          {/* United Description Paragraphs */}
          <div className="space-y-2.5 sm:space-y-3.5 lg:space-y-[1.0vh] pt-1 sm:pt-1.5">
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
