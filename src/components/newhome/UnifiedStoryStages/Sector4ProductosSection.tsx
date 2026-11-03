import { useState } from 'react';
import { motion, type MotionValue } from 'framer-motion';
import { Link } from 'react-router-dom';
import { type SectorData } from '../newHomeData';
import HybridRevealText from '../../HybridRevealText';
import CreditArchitectureDiagram from '../CreditArchitectureDiagram';

interface Sector4ProductosSectionProps {
  phaseRef: (el: HTMLDivElement | null) => void;
  data: SectorData;
  contentY: MotionValue<number>;
  overlayOpacity: MotionValue<number>;
  titleOpacity: MotionValue<number>;
  titleProgress: MotionValue<number>;
  descOpacity: MotionValue<number>;
}

{/* Helper Backdrop Fog untuk Setiap Paragraf Deskripsi (Mengikuti panjang teks & sedikit melebihi, efek blur seragam dengan judul) */}
function ParagraphFogBackdrop({ overlayOpacity }: { overlayOpacity: MotionValue<number> }) {
  return (
    <motion.div
      style={{ opacity: overlayOpacity }}
      className="absolute inset-0 pointer-events-none -z-10 will-change-[opacity] [transform:translateZ(0)] [isolation:isolate]"
      aria-hidden="true"
    >
      {/* Layer 1: Ambient diffusion lebih blur seragam dengan judul (Blur 200px) */}
      <div
        className="absolute -top-[12vh] -bottom-[12vh] -left-[10vw] -right-[10vw] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 120% 105% at 50% 50%, rgba(244, 244, 246, 0.60) 0%, rgba(244, 244, 246, 0.35) 45%, rgba(244, 244, 246, 0.08) 75%, transparent 100%)',
          filter: 'blur(200px)',
        }}
      />

      {/* Layer 2: Difusi transisi medium lebih blur seragam dengan judul (Blur 140px) */}
      <div
        className="absolute -top-[7vh] -bottom-[7vh] -left-[6vw] -right-[6vw] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 110% 95% at 50% 50%, rgba(244, 244, 246, 0.78) 0%, rgba(244, 244, 246, 0.46) 50%, rgba(244, 244, 246, 0.12) 80%, transparent 100%)',
          filter: 'blur(140px)',
        }}
      />

      {/* Layer 3: Penopang bodi kabut halus lebih blur seragam dengan judul (Blur 90px) */}
      <div
        className="absolute -top-7 -bottom-7 -left-8 -right-8 sm:-top-9 sm:-bottom-9 sm:-left-10 sm:-right-10 rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 100% 88% at 50% 50%, rgba(246, 246, 248, 0.90) 0%, rgba(246, 246, 248, 0.68) 55%, rgba(246, 246, 248, 0.25) 82%, transparent 100%)',
          filter: 'blur(90px)',
        }}
      />

      {/* Layer 4: Inti pelindung kontras teks seragam dengan judul (Blur 55px) */}
      <div
        className="absolute -inset-3 sm:-inset-4 rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 95% 82% at 50% 50%, rgba(248, 248, 250, 0.98) 0%, rgba(246, 246, 248, 0.88) 55%, rgba(244, 244, 246, 0.28) 80%, transparent 100%)',
          filter: 'blur(55px)',
        }}
      />
    </motion.div>
  );
}

export default function Sector4ProductosSection({
  phaseRef,
  data,
  contentY,
  overlayOpacity,
  titleOpacity,
  titleProgress,
  descOpacity,
}: Sector4ProductosSectionProps) {
  const [showDiagram, setShowDiagram] = useState(false);

  return (
    <div
      key={data.id}
      ref={phaseRef}
      className="absolute inset-0 pointer-events-none z-20 will-change-[opacity,transform] [transform:translateZ(0)] [backface-visibility:hidden]"
      style={{ opacity: 0 }}
    >
      {/* Title Block - Atas Tengah */}
      <motion.div
        style={{
          y: contentY,
        }}
        className="absolute inset-x-4 sm:inset-x-8 lg:inset-x-0 top-16 sm:top-20 lg:top-[9vh] xl:top-[9.5vh] mx-auto w-[92%] sm:w-[82%] md:w-[70%] lg:w-[54vw] max-w-4xl pointer-events-auto flex flex-col items-center space-y-3 sm:space-y-3.5 lg:space-y-[1.0vh] z-10 text-center"
      >
        {/* Backdrop Fog Pas di Area Judul & CTA (Dikecilkan Sedikit Sesuai Permintaan) */}
        <motion.div
          style={{ opacity: overlayOpacity }}
          className="absolute inset-0 pointer-events-none -z-10 will-change-[opacity] [transform:translateZ(0)] [isolation:isolate]"
          aria-hidden="true"
        >
          <div
            style={{
              transform: 'var(--overlay-transform, none)',
              transformOrigin: '50% 50%',
            }}
            className="absolute inset-0 pointer-events-none"
          >
            {/* Layer 1: Ambient diffusion lebih blur */}
            <div
              className="absolute -top-[18vh] -bottom-[18vh] -left-[16vw] -right-[16vw] rounded-full pointer-events-none"
              style={{
                background: 'radial-gradient(ellipse 120% 105% at 50% 50%, rgba(244, 244, 246, 0.60) 0%, rgba(244, 244, 246, 0.35) 45%, rgba(244, 244, 246, 0.08) 75%, transparent 100%)',
                filter: 'blur(220px)',
              }}
            />

            {/* Layer 2: Difusi transisi medium lebih blur */}
            <div
              className="absolute -top-[10vh] -bottom-[10vh] -left-[9vw] -right-[9vw] rounded-full pointer-events-none"
              style={{
                background: 'radial-gradient(ellipse 110% 95% at 50% 50%, rgba(244, 244, 246, 0.78) 0%, rgba(244, 244, 246, 0.46) 50%, rgba(244, 244, 246, 0.12) 80%, transparent 100%)',
                filter: 'blur(150px)',
              }}
            />

            {/* Layer 3: Penopang bodi kabut halus lebih blur */}
            <div
              className="absolute -top-10 -bottom-10 -left-10 -right-10 sm:-top-12 sm:-bottom-12 sm:-left-12 sm:-right-12 rounded-full pointer-events-none"
              style={{
                background: 'radial-gradient(ellipse 100% 88% at 50% 50%, rgba(246, 246, 248, 0.90) 0%, rgba(246, 246, 248, 0.68) 55%, rgba(246, 246, 248, 0.25) 82%, transparent 100%)',
                filter: 'blur(95px)',
              }}
            />

            {/* Layer 4: Inti pelindung kontras teks yang pas di judul */}
            <div
              className="absolute -inset-4 sm:-inset-5 rounded-full pointer-events-none"
              style={{
                background: 'radial-gradient(ellipse 95% 82% at 50% 50%, rgba(248, 248, 250, 0.98) 0%, rgba(246, 246, 248, 0.88) 55%, rgba(244, 244, 246, 0.28) 80%, transparent 100%)',
                filter: 'blur(60px)',
              }}
            />
          </div>
        </motion.div>

        {/* Title & CTA (Title hilang kedua, CTA hilang bersama deskripsi) */}
        <div className="flex flex-col items-center space-y-3 sm:space-y-3.5 lg:space-y-[1.0vh] w-full">
          <motion.h2
            style={{ opacity: titleOpacity }}
            className="relative z-10 font-display text-3xl sm:text-4xl md:text-5xl lg:text-[2.6vw] xl:text-[2.85vw] lg:leading-[2.9vw] xl:leading-[3.15vw] text-[#030035] font-normal leading-[1.12] tracking-tight text-center w-full"
          >
            <HybridRevealText
              text={data.title}
              progress={titleProgress}
              className="inline break-words text-[#030035]"
              targetColor="#030035"
            />
          </motion.h2>

          {/* CTA Link (Mengikuti durasi judul) */}
          <motion.div
            style={{ opacity: titleOpacity }}
            className="relative z-10 pt-0.5 sm:pt-1 lg:pt-[0.2vh] flex justify-center w-full"
          >
            <Link
              to={data.linkTo}
              className="inline-flex items-center justify-center px-6 py-2.5 lg:px-[1.25vw] lg:py-[0.9vh] rounded-full border border-[#030035]/20 hover:border-[#E5997B] bg-transparent hover:bg-[#030035]/5 font-body text-xs lg:text-[0.68vw] lg:leading-[1vw] tracking-[0.2em] uppercase text-[#030035] hover:text-[#E5997B] transition-all duration-300 pointer-events-auto shadow-sm"
            >
              {data.linkText}
            </Link>
          </motion.div>
        </div>
      </motion.div>

      {/* Description Text Block - Hierarki Teks Paling Atas (z-20, Digeser Agak ke Bawah, Gap Dikurangi) */}
      <motion.div
        style={{
          y: contentY,
        }}
        className="absolute inset-x-4 sm:inset-x-8 lg:inset-x-0 bottom-5 sm:bottom-7 md:bottom-8 lg:bottom-[4.5vh] xl:bottom-[4.8vh] mx-auto w-[96%] sm:w-[92%] md:w-[86%] lg:w-[64vw] xl:w-[58vw] max-w-4xl lg:max-w-5xl text-center pointer-events-none z-20 flex flex-col items-center"
      >
        {/* Tiered / Berundak natural alignment: P1 ringkas (teks atas lebih pendek), P2 sedang (tidak terlalu lebar), P3 lebih lebar */}
        <div className="relative z-20 w-full max-w-[96%] sm:max-w-[92%] md:max-w-[88%] lg:max-w-[54vw] xl:max-w-[50vw] max-w-5xl flex flex-col items-center space-y-2.5 sm:space-y-3.5 lg:space-y-[1.1vh]">
          {/* Paragraf 1 (Pertama): 2 baris berundak dengan strip (promo-) agar panjang baris seimbang & tidak jomplang */}
          <div className="relative w-full max-w-[90%] sm:max-w-[80%] md:max-w-[72%] lg:max-w-[36vw] xl:max-w-[33vw] flex justify-center items-center">
            <ParagraphFogBackdrop overlayOpacity={overlayOpacity} />
            <motion.p
              lang="es"
              style={{ opacity: descOpacity }}
              className="relative z-10 w-full font-body font-normal text-[15px] sm:text-base md:text-[17px] lg:text-[0.98vw] xl:text-[1.04vw] lg:leading-[1.52vw] xl:leading-[1.60vw] text-[#030035] leading-relaxed tracking-[-0.01em] text-center"
            >
              <span className="block">Como parte de nuestra filosofía operativa promo-</span>
              <span className="block">vemos la educación financiera tanto interna y como externa.</span>
            </motion.p>
          </div>

          {/* Paragraf 2 (Tengah): Jangan terlalu lebar */}
          <div className="relative w-full max-w-[90%] sm:max-w-[82%] md:max-w-[72%] lg:max-w-[42vw] xl:max-w-[39vw] max-w-3xl flex justify-center items-center">
            <ParagraphFogBackdrop overlayOpacity={overlayOpacity} />
            <motion.p
              lang="es"
              style={{ opacity: descOpacity }}
              className="relative z-10 w-full font-body font-normal text-[15px] sm:text-base md:text-[17px] lg:text-[0.98vw] xl:text-[1.04vw] lg:leading-[1.52vw] xl:leading-[1.60vw] text-[#030035] leading-relaxed tracking-[-0.01em] text-center [text-wrap:balance]"
            >
              {data.body[1]}
            </motion.p>
          </div>

          {/* Paragraf 3 (Akhir): Dibuat lebih lebar + 2 overlay kecil di ujung kiri dan kanan bawah */}
          <div className="relative w-full max-w-[96%] sm:max-w-[92%] md:max-w-[86%] lg:max-w-[51vw] xl:max-w-[47vw] max-w-4xl flex justify-center items-center">
            <ParagraphFogBackdrop overlayOpacity={overlayOpacity} />

            {/* Corner Fog Kiri Bawah (Ultra-soft blur tinggi menyatu alami ke lantai/rak tanpa garis tepi) */}
            <motion.div
              style={{ opacity: overlayOpacity }}
              className="absolute -left-12 sm:-left-20 lg:-left-[6.5vw] xl:-left-[7vw] -bottom-12 sm:-bottom-16 lg:-bottom-[7vh] xl:-bottom-[7.5vh] w-56 sm:w-72 lg:w-[20vw] xl:w-[19vw] h-24 sm:h-32 lg:h-[11vh] xl:h-[11.5vh] pointer-events-none -z-10 will-change-[opacity] [transform:translateZ(0)] [isolation:isolate]"
              aria-hidden="true"
            >
              <div
                className="absolute -inset-6 sm:-inset-10 lg:-inset-[2vw] rounded-full pointer-events-none"
                style={{
                  background: 'radial-gradient(ellipse 110% 90% at 50% 50%, rgba(244, 244, 246, 0.55) 0%, rgba(244, 244, 246, 0.28) 45%, rgba(244, 244, 246, 0.05) 75%, transparent 100%)',
                  filter: 'blur(130px)',
                }}
              />
              <div
                className="absolute -inset-2 sm:-inset-4 rounded-full pointer-events-none"
                style={{
                  background: 'radial-gradient(ellipse 100% 85% at 50% 50%, rgba(246, 246, 248, 0.75) 0%, rgba(246, 246, 248, 0.42) 50%, transparent 100%)',
                  filter: 'blur(85px)',
                }}
              />
              <div
                className="absolute inset-2 sm:inset-3 rounded-full pointer-events-none"
                style={{
                  background: 'radial-gradient(ellipse 95% 80% at 50% 50%, rgba(248, 248, 250, 0.85) 0%, rgba(248, 248, 250, 0.50) 50%, transparent 100%)',
                  filter: 'blur(55px)',
                }}
              />
            </motion.div>

            {/* Corner Fog Kanan Bawah (Ultra-soft blur tinggi menyatu alami ke lantai/rak tanpa garis tepi) */}
            <motion.div
              style={{ opacity: overlayOpacity }}
              className="absolute -right-12 sm:-right-20 lg:-right-[6.5vw] xl:-right-[7vw] -bottom-12 sm:-bottom-16 lg:-bottom-[7vh] xl:-bottom-[7.5vh] w-56 sm:w-72 lg:w-[20vw] xl:w-[19vw] h-24 sm:h-32 lg:h-[11vh] xl:h-[11.5vh] pointer-events-none -z-10 will-change-[opacity] [transform:translateZ(0)] [isolation:isolate]"
              aria-hidden="true"
            >
              <div
                className="absolute -inset-6 sm:-inset-10 lg:-inset-[2vw] rounded-full pointer-events-none"
                style={{
                  background: 'radial-gradient(ellipse 110% 90% at 50% 50%, rgba(244, 244, 246, 0.55) 0%, rgba(244, 244, 246, 0.28) 45%, rgba(244, 244, 246, 0.05) 75%, transparent 100%)',
                  filter: 'blur(130px)',
                }}
              />
              <div
                className="absolute -inset-2 sm:-inset-4 rounded-full pointer-events-none"
                style={{
                  background: 'radial-gradient(ellipse 100% 85% at 50% 50%, rgba(246, 246, 248, 0.75) 0%, rgba(246, 246, 248, 0.42) 50%, transparent 100%)',
                  filter: 'blur(85px)',
                }}
              />
              <div
                className="absolute inset-2 sm:inset-3 rounded-full pointer-events-none"
                style={{
                  background: 'radial-gradient(ellipse 95% 80% at 50% 50%, rgba(248, 248, 250, 0.85) 0%, rgba(248, 248, 250, 0.50) 50%, transparent 100%)',
                  filter: 'blur(55px)',
                }}
              />
            </motion.div>

            <motion.p
              lang="es"
              style={{ opacity: descOpacity }}
              className="relative z-10 w-full font-body font-normal text-[15px] sm:text-base md:text-[17px] lg:text-[0.98vw] xl:text-[1.04vw] lg:leading-[1.52vw] xl:leading-[1.60vw] text-[#030035] leading-relaxed tracking-[-0.01em] text-center [text-wrap:balance]"
            >
              {data.body[2]}
            </motion.p>
          </div>
        </div>
      </motion.div>

      {/* Architecture Diagram (Sector 4 only - Note for dev: small diagram presenting credit elements) */}
      {data.hasDiagram && (
        <motion.div
          style={{ opacity: descOpacity }}
          className="absolute right-8 sm:right-12 lg:right-[4.17vw] bottom-6 sm:bottom-8 lg:bottom-[4.5vh] pointer-events-auto flex flex-col items-end z-30"
        >
          {showDiagram && (
            <motion.div
              initial={{ opacity: 0, y: 15, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 15, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="mb-3 w-full max-w-[640px] lg:max-w-[34vw]"
            >
              <CreditArchitectureDiagram />
            </motion.div>
          )}
          <button
            type="button"
            onClick={() => setShowDiagram((prev) => !prev)}
            className="inline-flex items-center gap-2 px-4 py-2 lg:px-[1.1vw] lg:py-[0.75vh] rounded-full border border-[#030035]/20 hover:border-[#E5997B] bg-white/80 backdrop-blur-sm hover:bg-[#030035]/5 text-xs lg:text-[0.68vw] font-mono tracking-wider text-[#030035] uppercase shadow-sm transition-all duration-200 cursor-pointer pointer-events-auto"
          >
            <span>{showDiagram ? 'Ocultar Arquitectura' : 'Ver Arquitectura del Crédito'}</span>
            <span className="text-[#E5997B] font-bold text-sm leading-none">{showDiagram ? '✕' : '+'}</span>
          </button>
        </motion.div>
      )}
    </div>
  );
}
