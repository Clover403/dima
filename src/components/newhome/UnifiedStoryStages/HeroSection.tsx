import { useState, useLayoutEffect, useRef, type RefObject } from 'react';
import { motion, type MotionValue } from 'framer-motion';

interface HeroSectionProps {
  initialLogoRef: RefObject<HTMLDivElement | null>;
  initialLogoOpacity: MotionValue<number>;
  heroLogoHeight?: number;
  heroTextColRef: RefObject<HTMLDivElement | null>;
  scrollPromptRef: RefObject<HTMLDivElement | null>;
}

export default function HeroSection({
  initialLogoRef,
  initialLogoOpacity,
  heroLogoHeight,
  heroTextColRef,
  scrollPromptRef,
}: HeroSectionProps) {
  const titleRef = useRef<HTMLHeadingElement | null>(null);
  const [titleWidth, setTitleWidth] = useState<number | undefined>(undefined);

  // Ukur lebar aktual baris terpanjang judul agar deskripsi pas sama persis dengan panjang judul
  useLayoutEffect(() => {
    if (!titleRef.current) return;
    const el = titleRef.current;
    const update = () => {
      const spans = el.querySelectorAll('span');
      let maxW = 0;
      spans.forEach(span => {
        const range = document.createRange();
        range.selectNodeContents(span);
        const w = range.getBoundingClientRect().width;
        if (w > maxW) maxW = w;
      });
      if (maxW > 0) {
        setTitleWidth(Math.ceil(maxW));
      }
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    window.addEventListener('resize', update);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', update);
    };
  }, []);
  return (
    <motion.div
      ref={initialLogoRef}
      style={{ opacity: initialLogoOpacity }}
      className="fixed inset-0 z-20 flex items-center justify-center pointer-events-none transition-opacity duration-150 overflow-hidden bg-[#030035]"
    >
      {/* Hero Content (Logo DIMA & Teks) - Presisi di semua skala 100%, 125%, 150% */}
      <div className="hero-container-box relative z-20 w-full max-w-[1620px] 2xl:max-w-[1760px] mx-auto px-6 sm:px-10 lg:px-12 xl:px-14 pt-3 sm:pt-4 md:pt-6 lg:pt-3 pb-1 sm:pb-2 md:pb-3 lg:pb-1 flex flex-col lg:flex-row items-center lg:items-start justify-center gap-8 lg:gap-12 xl:gap-16 pointer-events-auto">

        {/* Kolom Kiri: Logo DIMA FINANCE - Menggunakan teks putih agar kontras tajam di atas background navy */}
        <div className="w-full lg:w-[42%] xl:w-[40%] flex items-center justify-center lg:justify-end shrink-0 min-w-0 lg:pr-6 xl:pr-8">
          <img
            src="/logo/logo-teks-bawah-white.png"
            alt="DIMA FINANCE"
            style={{
              height: heroLogoHeight ? `${heroLogoHeight}px` : undefined,
              maxHeight: '82vh',
            }}
            className="w-auto max-w-[220px] sm:max-w-[260px] lg:max-w-[620px] xl:max-w-[680px] object-contain select-none transition-[height] duration-75"
          />
        </div>

        {/* Kolom Kanan: Teks Deskripsi Pertama Sesuai Gambar */}
        <div
          ref={heroTextColRef}
          className="w-full lg:w-[58%] xl:w-[60%] flex flex-col text-left lg:pl-2 min-w-0"
        >
          {/* Judul Utama (4 Baris Persis Referensi Gambar) */}
          <h1
            ref={titleRef}
            className="hero-compact-title font-display leading-[1.14] text-white font-normal tracking-tight text-left mb-3 sm:mb-4 lg:mb-[2.0vh] xl:mb-[2.2vh] w-fit"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 'clamp(1.75rem, 2.50vw, 3.45rem)',
            }}
          >
            <span className="block whitespace-nowrap hero-compact-nowrap">Donde la ingeniería financiera y los</span>
            <span className="block whitespace-nowrap hero-compact-nowrap">fundamentos económicos convergen</span>
            <span className="block whitespace-nowrap hero-compact-nowrap">para transformar el financiamiento</span>
            <span className="block whitespace-nowrap hero-compact-nowrap">en crecimiento sostenible.</span>
          </h1>

          {/* 3 Paragraf Deskripsi (Lebar disamakan persis dengan judul, gap antarkata & antarparagraf proporsional sejajar tinggi logo) */}
          <div
            style={{ maxWidth: titleWidth ? `${titleWidth}px` : undefined }}
            className="hero-compact-body w-full max-w-full lg:max-w-[39.5vw] xl:max-w-[39.2vw] space-y-3 sm:space-y-3.5 lg:space-y-[1.65vh] xl:space-y-[1.85vh] text-white/90 font-body text-[14.5px] sm:text-[15.5px] md:text-[16.5px] lg:text-[1.14vw] xl:text-[1.22vw] 2xl:text-[1.28vw] leading-[1.48] lg:leading-[1.52]"
          >
            {/* Paragraf 1 */}
            <p lang="es" className="font-normal text-white/90 body-justified">
              Concebidos bajo la misma lógica de equilibrio y sostenibilidad que mantiene estable a la economía global,{' '}
              <strong className="font-bold text-white">
                somos una organización de brokeraje financiero especializada en crédito.
              </strong>
            </p>

            {/* Paragraf 2 */}
            <p lang="es" className="font-normal text-white/90 body-justified">
              Trasladamos los principios macroeconómicos que rigen a las naciones a nivel microeconómico fundacional; individuos, negocios y empresas, fusionando teoría económica, análisis de riesgo y práctica crediticia en un mismo sistema operativo.
            </p>

            {/* Paragraf 3 (Spasi antarkata rapat alami tanpa gap renggang, kata terbawah terserap ke atas) */}
            <p
              lang="es"
              className="font-normal text-white/90 body-justified tracking-[-0.02em] [hyphens:auto] [-webkit-hyphens:auto]"
            >
              No operamos bajo el modelo de corretaje tradicional. Más allá de gestionar y asesorar, nos enfocamos en impulsar el desarrollo, demostrando día a día que el crédito bien estructurado no genera deuda, genera progreso
            </p>
          </div>
        </div>
      </div>

      {/* Desliza para explorar - Teks Bronze Presisi di Bawah Layar */}
      <div
        ref={scrollPromptRef}
        className="hero-compact-prompt absolute bottom-6 sm:bottom-7 md:bottom-8 lg:bottom-[4.2vh] xl:bottom-[4.6vh] inset-x-0 mx-auto flex flex-col items-center justify-center text-center pointer-events-none select-none transition-[opacity,transform] duration-200 ease-out z-30 gap-1.5 sm:gap-2"
        style={{ opacity: 1, transform: 'translateY(0px)' }}
      >
        <p className="hero-prompt-text font-body text-[12.5px] sm:text-[13px] md:text-[13.5px] lg:text-[0.76vw] xl:text-[0.72vw] tracking-[0.26em] uppercase text-[#E5997B] font-medium drop-shadow-sm">
          Desliza para explorar
        </p>
        <div className="hero-prompt-bar w-[2px] sm:w-[2.5px] h-3 sm:h-3.5 bg-[#E5997B] rounded-full opacity-90 shadow-[0_0_8px_rgba(229,153,123,0.4)] animate-pulse" />
      </div>
    </motion.div>
  );
}
