import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Link } from 'react-router-dom'

gsap.registerPlugin(ScrollTrigger)

interface Product {
  number: string
  label: string
  tagline: string
  heading: string
  description: string[]
  features: string[]
  image: string
  illustration?: string
  ctaLink: string
}

interface Props {
  products: Product[]
}

export default function ProductosShowcase({ products }: Props) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [activeProduct, setActiveProduct] = useState(0)
  const contentRefs = useRef<(HTMLDivElement | null)[]>([])
  const imageRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    if (!sectionRef.current) return

    const ctx = gsap.context(() => {
      const el = sectionRef.current!

      // Main pinned scroll timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: 'top top',
          end: `+=${products.length * 100}%`,
          pin: true,
          scrub: 1,
          onUpdate: (self) => {
            const p = self.progress
            const segmentSize = 1 / products.length
            const idx = Math.min(
              Math.floor(p / segmentSize),
              products.length - 1
            )
            setActiveProduct(idx)
          },
        },
      })

      // Animate content transitions for each product
      products.forEach((_, i) => {
        if (i === 0) return

        const contentEl = contentRefs.current[i]
        const imageEl = imageRefs.current[i]
        const prevContent = contentRefs.current[i - 1]
        const prevImage = imageRefs.current[i - 1]

        if (prevContent && prevImage) {
          // Exit previous
          tl.to(prevContent, {
            yPercent: -30,
            opacity: 0,
            filter: 'blur(6px)',
            duration: 1,
            ease: 'power3.in',
          }, i * 2 - 0.5)
          tl.to(prevImage, {
            scale: 0.85,
            opacity: 0,
            filter: 'blur(8px)',
            duration: 1,
            ease: 'power3.in',
          }, i * 2 - 0.5)
        }

        if (contentEl && imageEl) {
          // Enter current
          tl.fromTo(contentEl,
            { yPercent: 40, opacity: 0, filter: 'blur(6px)' },
            { yPercent: 0, opacity: 1, filter: 'blur(0px)', duration: 1.2, ease: 'power3.out' },
            i * 2
          )
          tl.fromTo(imageEl,
            { scale: 1.15, opacity: 0, clipPath: 'inset(15% 15% 15% 15% round 12px)' },
            { scale: 1, opacity: 1, clipPath: 'inset(0% 0% 0% 0% round 0px)', duration: 1.2, ease: 'power3.out' },
            i * 2
          )
        }
      })

      // Background marquee animation
      gsap.to('.products-marquee-text', {
        xPercent: -100,
        repeat: -1,
        duration: 60,
        ease: 'none',
      })

      // Moving grid background
      gsap.to('.products-bg-grid', {
        backgroundPosition: '0 200px',
        scrollTrigger: {
          trigger: el,
          scrub: true,
        },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [products.length])

  return (
    <div
      ref={sectionRef}
      className="relative h-screen bg-lightgray overflow-hidden"
    >
      {/* Dynamic grid background */}
      <div
        className="products-bg-grid absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage: `linear-gradient(to right, #030035 1px, transparent 1px), linear-gradient(to bottom, #030035 1px, transparent 1px)`,
          backgroundSize: '80px 80px',
        }}
      />

      {/* Kinetic marquee background */}
      <div className="absolute top-1/2 -translate-y-1/2 left-0 flex whitespace-nowrap opacity-[0.025] select-none pointer-events-none">
        {[...Array(4)].map((_, i) => (
          <span
            key={i}
            className="products-marquee-text font-display text-[18vw] leading-none uppercase pr-24 text-navy"
          >
            Productos Estrategicos &bull; Ingenieria Financiera &bull;
          </span>
        ))}
      </div>

      {/* Main content grid */}
      <div className="relative z-10 h-full flex flex-col lg:flex-row">
        {/* Left side - Product navigation */}
        <div className="lg:w-[38%] h-full flex flex-col justify-center px-8 md:px-12 lg:px-16">
          {/* Section label */}
          <div className="mb-10">
            <p className="font-body text-[10px] tracking-[0.5em] uppercase text-bronze font-medium mb-3">
              Portafolio de Soluciones
            </p>
            <div className="w-16 h-px bg-bronze/40" />
          </div>

          {/* Product list - interactive buttons */}
          <div className="space-y-1">
            {products.map((product, i) => (
              <button
                key={product.number}
                className={`group w-full text-left py-4 px-5 rounded-lg transition-all duration-500 flex items-center gap-5 ${
                  activeProduct === i
                    ? 'bg-navy'
                    : 'bg-transparent hover:bg-navy/[0.04]'
                }`}
                onClick={() => {
                  // Scroll to the correct position within the pinned section
                  const triggers = ScrollTrigger.getAll()
                  const trigger = triggers.find(
                    (st) => st.trigger === sectionRef.current
                  )
                  if (trigger) {
                    const targetProgress = (i + 0.1) / products.length
                    const scrollTarget =
                      trigger.start + targetProgress * (trigger.end - trigger.start)
                    window.scrollTo({
                      top: scrollTarget,
                      behavior: 'smooth',
                    })
                  }
                }}
              >
                {/* Number */}
                <span
                  className={`font-display text-2xl leading-none transition-colors duration-400 ${
                    activeProduct === i ? 'text-bronze' : 'text-navy/20'
                  }`}
                >
                  {product.number}
                </span>

                {/* Label */}
                <div className="flex-1 min-w-0">
                  <span
                    className={`font-display text-lg leading-tight block transition-colors duration-400 ${
                      activeProduct === i ? 'text-white' : 'text-navy/60 group-hover:text-navy'
                    }`}
                  >
                    {product.label}
                  </span>
                  {activeProduct === i && (
                    <span className="font-body text-xs text-white/40 mt-1 block truncate">
                      {product.tagline}
                    </span>
                  )}
                </div>

                {/* Arrow indicator */}
                <svg
                  className={`w-4 h-4 transition-all duration-400 ${
                    activeProduct === i
                      ? 'opacity-100 translate-x-0 text-bronze'
                      : 'opacity-0 -translate-x-2 text-navy/30'
                  }`}
                  viewBox="0 0 16 16"
                  fill="none"
                >
                  <path
                    d="M6 4l4 4-4 4"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            ))}
          </div>

          {/* Progress indicator */}
          <div className="mt-10 flex items-center gap-4">
            <div className="flex-1 h-px bg-navy/10 relative">
              <div
                className="absolute top-0 left-0 h-full bg-bronze transition-all duration-700 ease-out"
                style={{
                  width: `${((activeProduct + 1) / products.length) * 100}%`,
                }}
              />
            </div>
            <span className="font-body text-[10px] tracking-[0.3em] text-navy/40 uppercase">
              {activeProduct + 1}/{products.length}
            </span>
          </div>
        </div>

        {/* Right side - Product detail content */}
        <div className="lg:w-[62%] h-full relative overflow-hidden">
          {products.map((product, i) => (
            <div
              key={product.number}
              ref={(el) => { contentRefs.current[i] = el }}
              className={`absolute inset-0 flex flex-col justify-center px-8 md:px-12 lg:px-16 xl:px-24 ${
                i === 0 ? '' : 'opacity-0'
              }`}
            >
              {/* Image with overlay */}
              <div
                ref={(el) => { imageRefs.current[i] = el }}
                className={`absolute inset-0 ${i === 0 ? '' : 'opacity-0'}`}
              >
                <img
                  src={product.image}
                  alt={product.label}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-navy/75" />
                <div className="absolute inset-0 bg-gradient-to-r from-lightgray via-lightgray/80 to-transparent lg:via-lightgray/40" />
              </div>

              {/* Content overlay */}
              <div className="relative z-10 max-w-xl">
                {/* Tagline */}
                <p className="font-body text-sm italic text-bronze mb-4 tracking-wide">
                  &ldquo;{product.tagline}&rdquo;
                </p>

                {/* Heading */}
                <h2 className="font-display text-3xl md:text-4xl lg:text-5xl text-navy leading-[1.1] mb-6">
                  {product.heading}
                </h2>

                {/* Divider */}
                <div className="w-16 h-px bg-bronze/50 mb-6" />

                {/* Description */}
                {product.description.map((p, j) => (
                  <p
                    key={j}
                    className="font-body text-base text-navy/60 leading-relaxed mb-4"
                  >
                    {p}
                  </p>
                ))}

                {/* Features */}
                <div className="flex flex-wrap gap-2 mt-6 mb-8">
                  {product.features.map((f) => (
                    <span
                      key={f}
                      className="inline-flex items-center gap-2 px-4 py-2 text-xs font-body tracking-wide border border-bronze/30 text-bronze-dark bg-white/60 backdrop-blur-sm rounded-full"
                    >
                      <svg viewBox="0 0 12 12" fill="none" className="w-3 h-3 shrink-0">
                        <path d="M6 1L11 6L6 11L1 6Z" stroke="currentColor" strokeWidth="1.2" />
                      </svg>
                      {f}
                    </span>
                  ))}
                </div>

                {/* CTA */}
                <Link
                  to={product.ctaLink}
                  className="inline-flex items-center gap-3 btn-bronze group"
                >
                  <span>Solicitar Asesoría</span>
                  <svg
                    className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                    viewBox="0 0 16 16"
                    fill="none"
                  >
                    <path
                      d="M3 8h10M9 4l4 4-4 4"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Side counter like DalioPrinciplesSection */}
      <div className="hidden lg:flex absolute left-8 bottom-8 z-30">
        <div className="overflow-hidden h-[100px]">
          <div
            className="transition-transform duration-700 ease-out"
            style={{ transform: `translateY(-${activeProduct * 100}px)` }}
          >
            {products.map((_, i) => (
              <span
                key={i}
                className="block font-display text-8xl text-bronze/20 leading-[100px]"
              >
                0{i + 1}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll hint */}
      <div className="absolute bottom-8 right-12 z-30 flex flex-col items-center gap-2">
        <div className="h-[120px] w-[2px] bg-navy/10 relative">
          <div
            className="absolute top-0 left-0 w-full bg-bronze transition-all duration-500"
            style={{
              height: `${((activeProduct + 1) / products.length) * 100}%`,
            }}
          />
        </div>
        <span className="text-navy font-body text-[10px] [writing-mode:vertical-lr] uppercase tracking-widest opacity-40">
          Scroll to explore
        </span>
      </div>
    </div>
  )
}
