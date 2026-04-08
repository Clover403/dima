import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { motion } from 'framer-motion'

gsap.registerPlugin(ScrollTrigger)

interface ProductCardProps {
  number: string
  label: string
  tagline: string
  heading: string
  description: string[]
  features: string[]
  image: string
  illustration?: string
  layout: 'left' | 'right'
  theme: 'dark' | 'light'
  ctaLink: string
}

export default function ProductCard({
  number,
  label,
  tagline,
  heading,
  description,
  features,
  image,
  illustration,
  layout,
  theme,
  ctaLink,
}: ProductCardProps) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)
  const imageWrapRef = useRef<HTMLDivElement>(null)
  const bgNumberRef = useRef<HTMLDivElement>(null)
  const illustrationRef = useRef<HTMLDivElement>(null)

  const isDark = theme === 'dark'
  const isPhotoLeft = layout === 'left'

  useEffect(() => {
    if (!sectionRef.current) return

    const ctx = gsap.context(() => {
      const el = sectionRef.current!

      /* ─── 1. Image Organic Masking & Parallax (Scrubbing) ─── */
      if (imageRef.current && imageWrapRef.current) {
        // Gaya Corn Revolution: Masking terbuka perlahan berbasis scroll
        gsap.fromTo(
          imageWrapRef.current,
          { 
            clipPath: isPhotoLeft 
              ? 'inset(10% 100% 10% 0% round 20px)' 
              : 'inset(10% 0% 10% 100% round 20px)',
            scale: 0.95
          },
          {
            clipPath: 'inset(0% 0% 0% 0% round 0px)',
            scale: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: el,
              start: 'top 85%',
              end: 'center center',
              scrub: 1.2, // Memberikan efek "tertinggal" yang mulus
            },
          }
        )

        // Parallax zoom out pada gambar itu sendiri
        gsap.fromTo(
          imageRef.current,
          { scale: 1.3, y: 50 },
          {
            scale: 1,
            y: -50,
            ease: 'none',
            scrollTrigger: {
              trigger: el,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          }
        )
      }

      /* ─── 2. Premium Text Reveal (Masked Stagger) ─── */
      const textEls = el.querySelectorAll('.reveal-text-inner')
      gsap.fromTo(
        textEls,
        { y: '130%', rotation: 2, opacity: 0 },
        {
          y: '0%',
          rotation: 0,
          opacity: 1,
          duration: 1.4,
          ease: 'expo.out', // Easing tajam tapi mulus di akhir (khas premium web)
          stagger: 0.08,
          scrollTrigger: {
            trigger: el.querySelector('.text-column'),
            start: 'top 80%',
          },
        }
      )

      /* ─── 3. Background Number Depth Parallax ─── */
      if (bgNumberRef.current) {
        gsap.fromTo(
          bgNumberRef.current,
          { y: 150, rotation: -5, opacity: 0 },
          {
            y: -100,
            rotation: 5,
            opacity: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: el,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1.5,
            },
          }
        )
      }

      /* ─── 4. Features Stagger ─── */
      const featureEls = el.querySelectorAll('.feature-item')
      gsap.fromTo(
        featureEls,
        { opacity: 0, scale: 0.8, y: 20 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.8,
          ease: 'back.out(1.2)', // Sedikit membal agar tidak kaku
          stagger: 0.05,
          scrollTrigger: {
            trigger: el.querySelector('.features-wrap'),
            start: 'top 85%',
          },
        }
      )

      /* ─── 5. Continuous Floating Illustration ─── */
      if (illustrationRef.current) {
        gsap.to(illustrationRef.current, {
          y: -20,
          rotation: 3,
          duration: 4,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
        })
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [isPhotoLeft])

  return (
    <section
      ref={sectionRef}
      className={`relative min-h-[110vh] flex items-center py-24 md:py-32 overflow-hidden ${
        isDark ? 'bg-navy' : 'bg-white'
      }`}
    >
      {/* Background Number */}
      <div
        ref={bgNumberRef}
        className={`bg-number absolute pointer-events-none select-none font-display leading-none ${
          isPhotoLeft
            ? 'right-8 md:right-16 lg:right-24'
            : 'left-8 md:left-16 lg:left-24'
        } top-1/2 -translate-y-1/2 text-[14rem] md:text-[20rem] lg:text-[26rem] ${
          isDark ? 'text-white/[0.03]' : 'text-navy/[0.03]'
        }`}
      >
        {number}
      </div>

      <div className="relative z-10 w-full px-6 md:px-12 lg:px-24 mx-auto max-w-[1600px]">
        <div
          className={`grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center ${
            isPhotoLeft ? '' : 'lg:direction-rtl'
          }`}
          style={!isPhotoLeft ? { direction: 'rtl' } : undefined}
        >
          {/* ─── Photo Column ─── */}
          <div
            className={`relative ${isPhotoLeft ? 'lg:pr-12' : 'lg:pl-12'}`}
            style={!isPhotoLeft ? { direction: 'ltr' } : undefined}
          >
            <div
              ref={imageWrapRef}
              className="relative overflow-hidden aspect-[3/4] md:aspect-[4/5] lg:aspect-[4/5] rounded-sm will-change-transform"
            >
              <div
                className={`absolute inset-0 z-10 mix-blend-overlay ${
                  isDark
                    ? 'bg-gradient-to-tr from-navy/80 via-transparent to-navy/40'
                    : 'bg-gradient-to-tr from-black/20 via-transparent to-transparent'
                }`}
              />
              <img
                ref={imageRef}
                src={image}
                alt={label}
                className="w-full h-full object-cover origin-center will-change-transform"
                loading="lazy"
              />
            </div>

            {illustration && (
              <div
                ref={illustrationRef}
                className={`absolute ${
                  isPhotoLeft ? '-right-12 -bottom-12' : '-left-12 -bottom-12'
                } w-40 h-40 md:w-48 md:h-48 opacity-[0.2] pointer-events-none z-20`}
              >
                <img
                  src={illustration}
                  alt=""
                  className={`w-full h-full object-contain ${isDark ? 'invert' : ''}`}
                  loading="lazy"
                />
              </div>
            )}
          </div>

          {/* ─── Text Column ─── */}
          <div
            className={`text-column ${
              isPhotoLeft ? 'lg:pl-8' : 'lg:pr-8'
            }`}
            style={!isPhotoLeft ? { direction: 'ltr' } : undefined}
          >
            {/* Trik Overflow Hidden untuk Mask Reveal */}
            <div className="overflow-hidden mb-4 py-1">
              <p
                className={`reveal-text-inner inline-block font-body text-sm tracking-[0.3em] uppercase ${
                  isDark ? 'text-bronze' : 'text-bronze'
                }`}
              >
                {label}
              </p>
            </div>

            <div className="overflow-hidden mb-6 py-1">
              <p
                className={`reveal-text-inner font-display text-lg md:text-2xl italic ${
                  isDark ? 'text-bronze/80' : 'text-bronze-dark'
                }`}
              >
                &ldquo;{tagline}&rdquo;
              </p>
            </div>

            <div className="overflow-hidden mb-8 py-2">
              <h2
                className={`reveal-text-inner font-display text-4xl md:text-5xl lg:text-6xl leading-[1.1] ${
                  isDark ? 'text-white' : 'text-navy'
                }`}
              >
                {heading}
              </h2>
            </div>

            <div className="overflow-hidden mb-8">
              <div className="reveal-text-inner w-20 h-px bg-bronze/50" />
            </div>

            {description.map((p, i) => (
              <div key={i} className="overflow-hidden mb-5 py-1">
                <p
                  className={`reveal-text-inner font-body text-base md:text-lg leading-relaxed ${
                    isDark ? 'text-white/60' : 'text-navy/70'
                  }`}
                >
                  {p}
                </p>
              </div>
            ))}

            <div className="features-wrap flex flex-wrap gap-3 mt-10 mb-12">
              {features.map((f) => (
                <span
                  key={f}
                  className={`feature-item inline-flex items-center gap-2 px-5 py-2.5 text-sm font-body tracking-wide border rounded-full ${
                    isDark
                      ? 'border-bronze/30 text-bronze/90 bg-bronze/[0.02] backdrop-blur-sm'
                      : 'border-bronze/40 text-bronze-dark bg-bronze/[0.04]'
                  }`}
                >
                  <svg viewBox="0 0 12 12" fill="none" className="w-3.5 h-3.5 shrink-0">
                    <path
                      d="M6 1L11 6L6 11L1 6Z"
                      stroke="currentColor"
                      strokeWidth="1.2"
                    />
                  </svg>
                  {f}
                </span>
              ))}
            </div>

            <div className="overflow-hidden py-2">
              <motion.div
                className="reveal-text-inner inline-block"
                whileHover={{ scale: 1.05, x: 5 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 400, damping: 10 }}
              >
                <Link
                  to={ctaLink}
                  className={`inline-flex items-center gap-3 ${
                    isDark ? 'btn-bronze' : 'btn-bronze'
                  }`}
                >
                  <span>Solicitar Asesoría</span>
                  <motion.span
                    initial={{ x: 0 }}
                    whileHover={{ x: 5 }}
                    transition={{ type: 'spring' }}
                  >
                    →
                  </motion.span>
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}