import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { AnimatePresence, motion } from 'framer-motion'
import HoverTrailOverlay from '../../HoverTrailOverlay';

gsap.registerPlugin(ScrollTrigger)

const services = [
  {
    number: '01',
    name: 'Reingeniería de Deuda',
    image: '/illustration-compressed/serviceHome/crene.webp',
    description: [
      'Rediseñamos la arquitectura de deuda corporativa para sincronizarla con los ciclos',
      'macroeconómicos actuales. No se trata solo de refinanciar — se trata de posicionar',
      'estratégicamente cada instrumento en el momento correcto del ciclo.',
    ],
  },
  {
    number: '02',
    name: 'Estrategia Financiera Cíclica',
    image: '/illustration-compressed/serviceHome/armilarry.webp',
    description: [
      'Diseñamos estrategias financieras que anticipan los movimientos del ciclo económico.',
      'La diferencia entre rentabilidad y pérdida está en la anticipación — no en la reacción.',
      'Cada decisión se calibra contra el estado actual del ciclo.',
    ],
  },
  {
    number: '03',
    name: 'Tesorería Avanzada',
    image: '/illustration-compressed/serviceHome/jam-air.webp',
    description: [
      'Optimizamos la gestión de tesorería empresarial integrando visión macroeconómica',
      'con las necesidades operativas específicas de cada organización.',
      'Liquidez inteligente, no solo disponible.',
    ],
  },
  {
    number: '04',
    name: 'Valuación Estratégica',
    image: '/illustration-compressed/serviceHome/berlian.webp',
    description: [
      'Determinamos el valor real de activos, empresas e instrumentos financieros con',
      'metodologías que integran contexto macroeconómico y ciclo de mercado.',
      'El valor no es estático — depende del momento del ciclo.',
    ],
  },
  {
    number: '05',
    name: 'Gobernanza Financiera',
    image: '/illustration-compressed/serviceHome/buku.webp',
    description: [
      'Diseñamos estructuras de gobernanza que institucionalizan la toma de decisiones',
      'financieras y crean organizaciones financieramente resilientes.',
      'La disciplina analítica como cultura, no solo como consultoría.',
    ],
  },
]

const easeCurtain: [number, number, number, number] = [0.76, 0, 0.24, 1]

const imageVariants = {
  enter: (direction: number) => ({
    y: direction > 0 ? '0%' : '-100%',
    zIndex: direction > 0 ? 1 : 10,
    transition: { duration: 0.8, ease: easeCurtain }
  }),
  center: {
    y: '0%',
    zIndex: 5,
    transition: { duration: 0.8, ease: easeCurtain }
  },
  exit: (direction: number) => ({
    y: direction > 0 ? '-100%' : '0%',
    zIndex: direction > 0 ? 10 : 1,
    transition: direction > 0 
      ? { duration: 0.8, ease: easeCurtain } 
      : { duration: 0, delay: 0.8 }
  }),
}

export default function ServicesSection() {
  const [activeIdx, setActiveIdx] = useState(0)
  const [direction, setDirection] = useState(1)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.5,
        onUpdate: (self) => {
          const index = Math.min(
            services.length - 1,
            Math.floor(self.progress * services.length)
          )
          setActiveIdx((prevIdx) => {
            if (index !== prevIdx) {
              setDirection(index > prevIdx ? 1 : -1)
            }
            return index
          })
        },
      })
    }, containerRef)

    return () => ctx.revert()
  }, [])

  const scrollToService = (index: number) => {
    if (!containerRef.current) return
    setDirection(index > activeIdx ? 1 : -1)
    const top = containerRef.current.offsetTop
    const height = containerRef.current.offsetHeight
    const targetScroll = top + (height / services.length) * index + 10
    window.scrollTo({ top: targetScroll, behavior: 'smooth' })
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full bg-[#030035]"
      style={{ height: `${services.length * 100}vh` }}
    >
      <div className="sticky top-0 w-full h-screen flex flex-col justify-between overflow-hidden bg-[#030035]">

        {/* === BAGIAN ATAS: GAMBAR (55vh Mobile, 75vh Desktop) === */}
        {/* Supaya di mobile gambar tidak makan tempat terlalu banyak */}
        <div className="relative w-full h-[55vh] md:h-[60vh] lg:h-[75vh] overflow-hidden bg-[#030035] cursor-none shrink-0">
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={services[activeIdx].image}
              custom={direction}
              variants={imageVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="absolute inset-0 w-full h-full overflow-hidden"
            >
              <img
                src={services[activeIdx].image}
                alt={services[activeIdx].name}
                className="w-full h-full object-cover scale-105"
              />
            </motion.div>
          </AnimatePresence>

          {/* HIDE HOVER TRAIL ON MOBILE/TAB (Mencegah bug sentuhan layar) */}
          <div className="hidden lg:block absolute inset-0 z-20 w-full h-full">
            <HoverTrailOverlay theme="lightgray" />
          </div>

          {/* Vertical Progress Line */}
          <div className="absolute top-1/2 -translate-y-1/2 left-4 md:left-8 lg:left-16 flex flex-col items-center z-30">
            {services.map((svc, i) => (
              <div key={svc.number} className="flex flex-col items-center">
                <button
                  onClick={() => scrollToService(i)}
                  className="group py-2 focus:outline-none flex items-center gap-3"
                >
                  <span
                    className={`font-mono text-xs md:text-sm transition-all duration-300 ${
                      activeIdx === i ? 'text-[#E5997B] font-bold scale-125' : 'text-[#F4F4F5]/40 group-hover:text-[#F4F4F5]/80'
                    }`}
                  >
                    {svc.number}
                  </span>
                </button>

                {i < services.length - 1 && (
                  <div className="w-[2px] h-6 md:h-10 bg-[#F4F4F5]/20 relative overflow-hidden">
                    <div
                      className={`w-full bg-[#E5997B] transition-all duration-500 ${
                        activeIdx > i ? 'h-full' : activeIdx === i ? 'h-1/2' : 'h-0'
                      }`}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* === BAGIAN BAWAH: TEKS (Sisa layar agar bebas overlapping) === */}
        {/* Menggunakan flex-1 agar teks mengisi sisa ruang tanpa terpotong */}
        <div className="flex-1 w-full bg-[#030035] text-[#F4F4F5] flex items-center px-6 md:px-12 lg:px-16 border-t border-[#F4F4F5]/10 z-30 py-4 lg:py-0">
          
          <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-3 md:gap-6 lg:gap-8 items-center lg:ml-12">
            
            {/* Kolom Kiri: Judul & Nomor */}
            <div className="lg:col-span-4 flex flex-col justify-center text-left">
              <div className="overflow-hidden mb-1 md:mb-2">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`num-${activeIdx}`}
                    initial={{ y: '100%', opacity: 0 }}
                    animate={{ y: '0%', opacity: 1 }}
                    exit={{ y: '-100%', opacity: 0 }}
                    transition={{ duration: 0.4, ease: easeCurtain }}
                    className="font-display text-lg sm:text-xl md:text-2xl lg:text-3xl text-[#E5997B] font-normal leading-snug tracking-tight"
                  >
                    Servicio / {services[activeIdx].number}
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="overflow-hidden lg:max-w-[320px]">
                <AnimatePresence mode="wait">
                  <motion.h3
                    key={`title-${activeIdx}`}
                    initial={{ y: '100%', opacity: 0 }}
                    animate={{ y: '0%', opacity: 1 }}
                    exit={{ y: '-100%', opacity: 0 }}
                    transition={{ duration: 0.5, delay: 0.05, ease: easeCurtain }}
                    className="font-display text-2xl sm:text-3xl md:text-4xl text-[#F4F4F5] font-normal leading-[1.1] tracking-tight line-clamp-2"
                  >
                    {services[activeIdx].name}
                  </motion.h3>
                </AnimatePresence>
              </div>
            </div>

            {/* Kolom Kanan: Deskripsi (Digabung jadi 1 paragraf agar fluid) */}
            <div className="lg:col-span-8 flex flex-col justify-between text-left lg:pl-4 mt-2 lg:mt-0">
              <div className="flex flex-col overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.p
                    key={`desc-${activeIdx}`}
                    initial={{ y: '100%', opacity: 0 }}
                    animate={{ y: '0%', opacity: 1 }}
                    exit={{ y: '-100%', opacity: 0 }}
                    transition={{ duration: 0.5, delay: 0.1, ease: easeCurtain }}
                    // Teks lebih kecil sedikit di mobile, membesar di desktop
                    className="font-body text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-[#F4F4F5]/80 leading-snug md:leading-relaxed font-light"
                  >
                    {/* Menggabungkan array agar responsive wrap-nya sempurna di mobile */}
                    {services[activeIdx].description.join(' ')}
                  </motion.p>
                </AnimatePresence>
              </div>

              <div className="mt-4 md:mt-6 flex justify-start">
                <Link
                  to="/servicios"
                  className="group inline-flex items-center gap-3 text-[10px] md:text-xs font-mono tracking-[0.2em] md:tracking-[0.25em] uppercase text-[#F4F4F5] hover:text-[#E5997B] transition-colors duration-300 py-1"
                >
                  <span>Explorar Servicios</span>
                  <span className="w-6 md:w-8 h-[1px] bg-[#E5997B] group-hover:w-12 md:group-hover:w-16 transition-all duration-500 ease-out" />
                </Link>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  )
}