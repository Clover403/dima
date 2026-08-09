import { useRef, useState } from "react";
import GeometryParticles from "../GeometryParticles";
import HoverTrailOverlay from "../HoverTrailOverlay";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useMotionValueEvent,
} from "framer-motion";

const items = [
  {
    num: "01",
    title:
      "Una transacción es el intercambio de dinero o crédito por bienes y servicios",
    body: "Una transacción ocurre simplemente cuando un comprador intercambia dinero o crédito por bienes, servicios o activos financieros con un vendedor. Es decir, cuando alguien gasta y alguien más recibe.",
    image:
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1600&auto=format&fit=crop",
  },
  {
    num: "02",
    title:
      "El gasto de una persona se convierte en el ingreso de otra, y ese ciclo mueve toda la economía",
    body: "El gasto es la fuerza motriz de la economía. Cuando una persona gasta más, otra persona gana más — y al ganar más, tiene más para gastar. Este ciclo es el que impulsa todo el sistema económico.",
    image:
      "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?q=80&w=1600&auto=format&fit=crop",
  },
  {
    num: "03",
    title:
      "Más ingreso da capacidad de pago, y el crédito amplifica cuánto puede gastar la economía",
    body: "Cuando el ingreso de alguien aumenta, obtiene capacidad de pago. Un mayor ingreso permite endeudarse, y endeudarse permite gastar más — y más gasto significa más ingreso. El crédito amplifica la economía.",
    image:
      "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=1600&auto=format&fit=crop",
  },
];

function ScrollTextItem({
  item,
  index,
  scrollYProgress,
  isOpen,
  onToggle,
}: {
  item: (typeof items)[0];
  index: number;
  scrollYProgress: any;
  isOpen: boolean;
  onToggle: (i: number) => void;
}) {
  const step = 1 / items.length;
  const center = (index + 0.35) * step;

  const opacity = useTransform(
    scrollYProgress,
    [Math.max(0, center - step * 0.5), center, 1],
    [0.2, 1, 1],
  );

  return (
    <motion.div
      style={{ opacity }}
      className="py-14 md:py-20 border-b border-lightgray/10"
    >
      <button
        type="button"
        onClick={() => onToggle(index)}
        className="w-full flex items-start md:items-center gap-6 md:gap-9 text-left group"
      >
        <span className="flex-1 font-display text-3xl sm:text-4xl md:text-5xl lg:text-[3.2rem] text-lightgray font-normal leading-[1.2] tracking-tight pr-6 md:pr-12">
          {item.title}
        </span>

        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="shrink-0 flex items-center justify-center w-10 h-10 md:w-12 md:h-12 text-lightgray/50 group-hover:text-lightgray transition-colors duration-300 mt-2 md:mt-0"
        >
          <svg width="16" height="16" viewBox="0 0 14 14" fill="none">
            <path
              d="M2 5L7 10L12 5"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.65, 0, 0.35, 1] }}
            className="overflow-hidden"
          >
            <p className="pt-5 pr-8 md:pr-14 text-xl md:text-2xl lg:text-[1.7rem] text-lightgray/55 leading-relaxed max-w-none">
              {item.body}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}



function ScrollImageItem({
  image,
  index,
  scrollYProgress,
}: {
  image: string;
  index: number;
  scrollYProgress: any;
}) {
  let opacityRange: number[] = [];
  let opacityValues: number[] = [];

  if (index === 0) {
    opacityRange = [0, 0.25, 0.45];
    opacityValues = [1, 1, 0];
  } else if (index === 1) {
    opacityRange = [0.2, 0.35, 0.6, 0.75];
    opacityValues = [0, 1, 1, 0];
  } else {
    opacityRange = [0.55, 0.75, 1];
    opacityValues = [0, 1, 1];
  }

  const opacity = useTransform(scrollYProgress, opacityRange, opacityValues);
  const scale = useTransform(scrollYProgress, [0, 1], [1.08, 1]);

  return (
    <motion.div
      style={{ opacity }}
      className="absolute inset-0 w-full h-full overflow-hidden bg-navy rounded-2xl md:rounded-3xl cursor-none"
    >
      <motion.img
        style={{ scale }}
        src={image}
        alt="Visual Ekonomi"
        className="w-full h-full object-cover object-center contrast-105"
      />
      <HoverTrailOverlay theme="navy" className="absolute inset-0 z-20 w-full h-full" />
    </motion.div>
  );
}

export default function ModeloProtitas() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeNumber, setActiveNumber] = useState(items[0].num);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [mobileImageIndex, setMobileImageIndex] = useState(0);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });


  const textTrackY = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    ["30vh", "0vh", "-30vh"],
  );

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (latest < 0.33) {
      setActiveNumber(items[0].num);
      setMobileImageIndex(0);
    } else if (latest < 0.66) {
      setActiveNumber(items[1].num);
      setMobileImageIndex(1);
    } else {
      setActiveNumber(items[2].num);
      setMobileImageIndex(2);
    }
  });

  const handleToggle = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  const handleMobilePrev = () => {
    setMobileImageIndex((prev) => (prev === 0 ? items.length - 1 : prev - 1));
  };

  const handleMobileNext = () => {
    setMobileImageIndex((prev) => (prev === items.length - 1 ? 0 : prev + 1));
  };

  return (
    <section ref={sectionRef} className="relative bg-navy w-full h-[350vh]">
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-start">
        <div className="absolute inset-0 z-0 pointer-events-none">
          <GeometryParticles particleCount={150} opacity={0.1} />
        </div>

        {/* ========== DESKTOP LAYOUT ========== */}
        <div className="relative z-10 w-full h-full hidden lg:grid grid-cols-[1.15fr_1.2fr] gap-8 lg:gap-20 items-center pl-8 md:pl-16 lg:pl-24 pr-10 md:pr-14 lg:pr-20 py-6 md:py-10">
          {/* SISI KIRI — Nomor Statis + Teks Berjalan */}
          <div className="relative h-screen flex items-center gap-8 md:gap-14">
            {/* NOMOR STATIS */}
            <div className="w-12 md:w-16 shrink-0 z-20 flex justify-center">
              <span className="font-mono text-lg md:text-xl text-lightgray/50 font-semibold tracking-widest transition-all duration-300">
                {activeNumber}
              </span>
            </div>

            {/* TRACK TEKS */}
            <div className="relative w-full h-screen flex items-center overflow-hidden">
              <motion.div
                style={{ y: textTrackY }}
                className="w-full flex flex-col gap-52 md:gap-60 py-50"
              >
                {items.map((item, index) => (
                  <ScrollTextItem
                    key={item.num}
                    item={item}
                    index={index}
                    scrollYProgress={scrollYProgress}
                    isOpen={openIndex === index}
                    onToggle={handleToggle}
                  />
                ))}
              </motion.div>
            </div>
          </div>

          {/* SISI KANAN — Gambar dengan rounded */}
          <div className="relative w-full h-[85vh] rounded-2xl md:rounded-3xl overflow-hidden">
            {items.map((item, index) => (
              <ScrollImageItem
                key={item.num}
                image={item.image}
                index={index}
                scrollYProgress={scrollYProgress}
              />
            ))}
          </div>
        </div>

        {/* ========== MOBILE LAYOUT ========== */}
        <div className="relative z-10 w-full h-full flex flex-col lg:hidden">
          {/* GAMBAR FULL WIDTH DI ATAS */}
          <div className="relative w-full h-[68vh] shrink-0 overflow-hidden cursor-none">
            <AnimatePresence mode="wait">
              <motion.img
                key={mobileImageIndex}
                src={items[mobileImageIndex].image}
                alt="Visual Ekonomi"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 w-full h-full object-cover contrast-105"
              />
            </AnimatePresence>

            {/* Hover Trail Overlay */}
            <HoverTrailOverlay theme="navy" className="absolute inset-0 z-20 w-full h-full" />

            {/* NAVIGASI PANAH */}
            <div className="absolute bottom-4 right-4 flex gap-2 z-20">
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleMobilePrev();
                }}
                className="w-10 h-10 rounded-full bg-navy/70 backdrop-blur-sm border border-lightgray/20 flex items-center justify-center text-lightgray/70 active:bg-navy/90 transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path
                    d="M9 2L4 7L9 12"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleMobileNext();
                }}
                className="w-10 h-10 rounded-full bg-navy/70 backdrop-blur-sm border border-lightgray/20 flex items-center justify-center text-lightgray/70 active:bg-navy/90 transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path
                    d="M5 2L10 7L5 12"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* AREA TEKS DI BAWAH */}
          <div className="flex-1 w-full overflow-y-auto px-6 py-6">
            {/* NOMOR + TITLE */}
            <div className="flex items-start gap-4 mb-4">
              <span className="font-mono text-[1rem] text-lightgray/50 font-semibold tracking-widest shrink-0 mt-1">
                {items[mobileImageIndex].num}
              </span>
              <button
                type="button"
                onClick={() => handleToggle(mobileImageIndex)}
                className="flex-1 text-left"
              >
                <h3 className="font-display text-2xl text-lightgray font-normal leading-[1.2] tracking-tight">
                  {items[mobileImageIndex].title}
                </h3>
              </button>
            </div>

            {/* BODY TEXT — tanpa AnimatePresence biar ga blank */}
            <div
              className="overflow-hidden transition-all duration-400"
              style={{
                maxHeight: openIndex === mobileImageIndex ? "500px" : "0px",
                opacity: openIndex === mobileImageIndex ? 1 : 0,
                transition: "max-height 0.4s ease, opacity 0.4s ease",
              }}
            >
              <p className="pb-4 text-lg text-lightgray/55 leading-relaxed">
                {items[mobileImageIndex].body}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
