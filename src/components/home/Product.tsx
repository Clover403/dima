import { useRef, useState, useEffect } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
} from "framer-motion";
import HoverTrailOverlay from "../HoverTrailOverlay";

const items = [
  {
    num: "01",
    title: "Capital para crecer",
    desc: "Financia proyectos específicos sin afectar tu flujo de caja.",
    image: "/illustration-compressed/products/menara.webp"
  },
  {
    num: "02",
    title: "Financiamiento al ritmo de obra",
    desc: "Cubre los costos de construcción mientras llega el pago esperado.",
    image: "/illustration-compressed/products/bridge.webp"
  },
  {
    num: "03",
    title: "Liquidez que se adapta",
    desc: "Disponibilidad que se restablece sola, sin nuevas gestiones.",
    image: "/illustration-compressed/products/tabung.webp"
  },
  {
    num: "04",
    title: "Respeta los ciclos de la tierra",
    desc: "Pagos alineados a tu cosecha o venta de ganado.",
    image: "/illustration-compressed/products/cycle.webp"
  },
  {
    num: "05",
    title: "El activo se paga solo",
    desc: "Úsalo hoy, decide si lo compras al final del contrato.",
    image: "/illustration-compressed/products/gear-machine.webp"
  },
  {
    num: "06",
    title: "Cuentas por cobrar hoy",
    desc: "Anticipo inmediato sobre tus facturas, sin esperar el pago.",
    image: "/illustration-compressed/products/invoice.webp"
  }
];

interface ScrollTextItemProps {
  item: typeof items[0];
  innerRef: (el: HTMLDivElement | null) => void;
}

function ScrollTextItem({ item, innerRef }: ScrollTextItemProps) {
  const [opacity, setOpacity] = useState(0.2);

  useEffect(() => {
    const handleScroll = () => {
      const el = document.getElementById(`text-item-${item.num}`);
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const elementCenter = rect.top + rect.height / 2;
      const elementCenterPercent = (elementCenter / viewportHeight) * 100;

      if (elementCenterPercent <= 55) {
        setOpacity(1);
      } else if (elementCenterPercent > 55 && elementCenterPercent <= 75) {
        const t = (elementCenterPercent - 55) / 20;
        setOpacity(1 - t * 0.8);
      } else {
        setOpacity(0.2);
      }
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [item.num]);

  return (
    <motion.div
      id={`text-item-${item.num}`}
      ref={innerRef}
      animate={{ opacity }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="py-10 md:py-14 border-b border-[#F4F4F5]/10"
    >
      <div className="w-full flex items-start gap-6 md:gap-9 text-left">
        <div className="flex-1 pr-6 md:pr-12">
          <h3 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-[3.2rem] text-[#F4F4F5] font-normal leading-[1.2] tracking-tight mb-4">
            {item.title}
          </h3>
          <p className="font-['Inter_Tight'] text-[#F4F4F5]/70 text-2xl md:text-2xl font-light leading-relaxed">
            {item.desc}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

function ScrollImageItem({ image, isActive }: { image: string; isActive: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: isActive ? 1 : 0 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className="absolute inset-0 w-full h-full overflow-hidden bg-[#030035]"
    >
      <img
        src={image}
        alt="Visual"
        className="w-full h-full object-cover object-center contrast-105"
      />
    </motion.div>
  );
}

export default function ProductsToPhotoSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [activeNumber, setActiveNumber] = useState(items[0].num);
  const [activeIndex, setActiveIndex] = useState(0);
  const [mobileImageIndex, setMobileImageIndex] = useState(0);

  // Hook Scroll (Tetap berjalan, tapi efeknya hanya terlihat di desktop)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const textTrackY = useTransform(scrollYProgress, [0, 1], ["30vh", "-135vh"]);
  const cutoutTop = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const cutoutY = useTransform(scrollYProgress, [0, 1], ["0%", "-100%"]);

  useEffect(() => {
    // Sinkronisasi teks dan gambar hanya untuk layout desktop
    if (window.innerWidth < 1024) return;

    const syncImageWithText = () => {
      const viewportHeight = window.innerHeight;
      let closestIndex = activeIndex;
      let closestDistance = Infinity;

      itemRefs.current.forEach((el, index) => {
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const elementCenter = rect.top + rect.height / 2;
        const elementCenterPercent = (elementCenter / viewportHeight) * 100;

        const targetPoint = 50;
        const distance = Math.abs(elementCenterPercent - targetPoint);

        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = index;
        }
      });

      if (closestIndex !== activeIndex) {
        const el = itemRefs.current[closestIndex];
        if (el) {
          const rect = el.getBoundingClientRect();
          const elementCenter = rect.top + rect.height / 2;
          const elementCenterPercent = (elementCenter / viewportHeight) * 100;

          if (elementCenterPercent >= 40 && elementCenterPercent <= 60) {
            setActiveIndex(closestIndex);
            setActiveNumber(items[closestIndex].num);
          }
        }
      }
    };

    window.addEventListener("scroll", syncImageWithText);
    window.addEventListener("resize", syncImageWithText);
    syncImageWithText();

    return () => {
      window.removeEventListener("scroll", syncImageWithText);
      window.removeEventListener("resize", syncImageWithText);
    };
  }, [activeIndex]);

  return (
    <section className="relative bg-[#030035] w-full">

      {/* HEADER SECTION - Jarak pb-10 untuk mobile agar lebih dekat ke gambar */}
      <div className="w-full flex flex-col items-center justify-center text-center px-6 pt-24 pb-10 lg:pt-32 lg:pb-32">
        <p className="text-[#F4F4F5]/70 text-xs md:text-sm tracking-[0.2em] uppercase mb-4 md:mb-6">
          NUESTROS PRODUCTOS
        </p>
        <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl text-[#F4F4F5] leading-[1.1] font-medium tracking-tight">
          Soluciones Estratégicas
        </h2>
        <p className="mt-6 md:mt-8 text-[#F4F4F5]/80 text-lg md:text-xl lg:text-2xl max-w-2xl md:max-w-3xl leading-relaxed font-light">
          Diseñamos estructuras de capital que transforman el potencial de tu empresa en crecimiento sostenido y máxima eficiencia operativa.
        </p>
      </div>

      {/* ============================== */}
      {/* TAMPILAN MOBILE & TABLET       */}
      {/* Normal flow, scroll cepat      */}
      {/* ============================== */}
      <div className="block lg:hidden relative w-full px-4 pb-24 md:px-12 md:pb-32">

        {/* Container Gambar Mobile */}
        <div className="relative w-full h-[55vh] sm:h-[65vh] rounded-2xl overflow-hidden cursor-none shadow-2xl mb-8">
          <AnimatePresence mode="wait">
            <motion.img
              key={mobileImageIndex}
              src={items[mobileImageIndex].image}
              alt={items[mobileImageIndex].title}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 w-full h-full object-cover contrast-105"
            />
          </AnimatePresence>

          <HoverTrailOverlay theme="lightgray" className="absolute inset-0 z-10 w-full h-full" />

          {/* Navigasi Mobile */}
          <div className="absolute bottom-4 right-4 flex gap-3 z-20">
            <button
              type="button"
              onClick={() => setMobileImageIndex((p) => (p === 0 ? items.length - 1 : p - 1))}
              className="w-12 h-12 rounded-full bg-[#030035]/80 backdrop-blur-md border border-[#F4F4F5]/20 flex items-center justify-center text-[#F4F4F5] pointer-events-auto active:scale-95 transition-transform"
            >
              <svg width="18" height="18" viewBox="0 0 14 14" fill="none">
                <path d="M9 2L4 7L9 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => setMobileImageIndex((p) => (p === items.length - 1 ? 0 : p + 1))}
              className="w-12 h-12 rounded-full bg-[#030035]/80 backdrop-blur-md border border-[#F4F4F5]/20 flex items-center justify-center text-[#F4F4F5] pointer-events-auto active:scale-95 transition-transform"
            >
              <svg width="18" height="18" viewBox="0 0 14 14" fill="none">
                <path d="M5 2L10 7L5 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>

        {/* Teks Mobile */}
        <div className="w-full flex items-start gap-4">
          <span className="font-mono text-lg text-[#F4F4F5]/50 font-semibold tracking-widest shrink-0 mt-1">
            {items[mobileImageIndex].num}
          </span>
          <div className="flex-1 text-left">
            <AnimatePresence mode="wait">
              <motion.div
                key={mobileImageIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <h3 className="font-display text-3xl md:text-4xl text-[#F4F4F5] font-normal leading-[1.2] tracking-tight mb-3">
                  {items[mobileImageIndex].title}
                </h3>
                <p className="font-['Inter_Tight'] text-lg md:text-xl text-[#F4F4F5]/70 font-light leading-relaxed">
                  {items[mobileImageIndex].desc}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

      </div>

      {/* ============================== */}
      {/* TAMPILAN DESKTOP (LG ke atas)  */}
      {/* Sticky Scroll (650vh)          */}
      {/* ============================== */}
      <div ref={sectionRef} className="hidden lg:block relative w-full h-[650vh]">
        <div className="sticky top-0 h-screen w-full overflow-hidden flex items-start">
          <div className="relative z-10 w-full h-full grid grid-cols-[1.15fr_1.2fr] gap-8 lg:gap-20 items-center pl-8 md:pl-16 lg:pl-24 pr-10 md:pr-14 lg:pr-20 py-6 md:py-10">

            <div className="relative h-screen flex items-center gap-8 md:gap-14">
              <div className="w-12 md:w-16 shrink-0 z-20 flex justify-center">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={activeNumber}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="font-mono text-lg md:text-xl text-[#F4F4F5]/50 font-semibold tracking-widest absolute"
                  >
                    {activeNumber}
                  </motion.span>
                </AnimatePresence>
              </div>

              <div className="relative w-full h-screen flex items-start overflow-hidden">
                <motion.div style={{ y: textTrackY }} className="w-full flex flex-col gap-32 md:gap-44">
                  {items.map((item, index) => (
                    <ScrollTextItem
                      key={item.num}
                      item={item}
                      innerRef={(el) => { itemRefs.current[index] = el; }}
                    />
                  ))}
                </motion.div>
              </div>
            </div>

            {/* Container Gambar Desktop */}
            <div className="relative w-full h-[85vh] rounded-2xl md:rounded-3xl overflow-hidden isolation-isolate -translate-y-6 cursor-none">
              {items.map((item, index) => (
                <ScrollImageItem
                  key={item.num}
                  image={item.image}
                  isActive={activeIndex === index}
                />
              ))}

              <HoverTrailOverlay theme="lightgray" className="absolute inset-0 z-20 w-full h-full" />

              <motion.div
                style={{ top: cutoutTop, y: cutoutY }}
                className="absolute left-0 w-20 md:w-28 h-[400px] md:h-[500px] z-30 pointer-events-none -translate-x-[1px]"
              >
                <svg
                  viewBox="0 0 100 100"
                  className="w-full h-full text-[#030035]"
                  fill="currentColor"
                  preserveAspectRatio="none"
                >
                  <path d="M0,0 L0,100 C0,75 50,65 50,50 C50,35 0,25 0,0 Z" />
                </svg>
              </motion.div>
            </div>

          </div>
        </div>
      </div>

    </section>
  );
}