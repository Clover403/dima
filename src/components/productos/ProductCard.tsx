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

  const isDark = theme === 'dark'
  const isPhotoLeft = layout === 'left'

  useEffect(() => {
    if (!sectionRef.current) return

    const ctx = gsap.context(() => {
      const el = sectionRef.current!

      /* ─── Image parallax + reveal ─── */
      if (imageRef.current && imageWrapRef.current) {
        // Clip-path reveal — wipe from the side closest to text
        gsap.fromTo(
          imageWrapRef.current,
          { clipPath: isPhotoLeft ? 'inset(0 100% 0 0)' : 'inset(0 0 0 100%)' },
          {
            clipPath: 'inset(0 0% 0 0%)',
            duration: 1.2,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 75%',
            },
          }
        )

        // Parallax on image
        gsap.fromTo(
          imageRef.current,
          { y: 40, scale: 1.08 },
          {
            y: -40,
            scale: 1.02,
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

      /* ─── Background number parallax ─── */
      const bgNum = el.querySelector('.bg-number')
      if (bgNum) {
        gsap.fromTo(
          bgNum,
          { y: 60, opacity: 0 },
          {
            y: -30,
            opacity: 1,
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

      /* ─── Text content stagger ─── */
      const textEls = el.querySelectorAll('.reveal-text')
      gsap.fromTo(
        textEls,
        { opacity: 0, y: 35 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: 'power3.out',
          stagger: 0.12,
          scrollTrigger: {
            trigger: el.querySelector('.text-column'),
            start: 'top 78%',
          },
        }
      )

      /* ─── Features stagger ─── */
      const featureEls = el.querySelectorAll('.feature-item')
      gsap.fromTo(
        featureEls,
        { opacity: 0, x: -20 },
        {
          opacity: 1,
          x: 0,
          duration: 0.5,
          ease: 'power2.out',
          stagger: 0.1,
          scrollTrigger: {
            trigger: el.querySelector('.features-wrap'),
            start: 'top 85%',
          },
        }
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [isPhotoLeft])

  return (
    <section
      ref={sectionRef}
      className={`relative min-h-screen py-24 md:py-32 lg:py-0 overflow-hidden ${
        isDark ? 'bg-navy' : 'bg-cream'
      }`}
    >
      {/* Large background number */}
      <div
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

      {/* Content grid */}
      <div className={`relative z-10 section-padding lg:min-h-screen flex items-center`}>
        <div
          className={`w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-0 items-center ${
            isPhotoLeft ? '' : 'lg:direction-rtl'
          }`}
          style={!isPhotoLeft ? { direction: 'rtl' } : undefined}
        >
          {/* ─── Photo Column ─── */}
          <div
            className={`relative ${isPhotoLeft ? 'lg:pr-12 xl:pr-20' : 'lg:pl-12 xl:pl-20'}`}
            style={!isPhotoLeft ? { direction: 'ltr' } : undefined}
          >
            <div
              ref={imageWrapRef}
              className="relative overflow-hidden aspect-[3/4] md:aspect-[4/5] lg:aspect-[3/4]"
            >
              {/* Overlay gradient */}
              <div
                className={`absolute inset-0 z-10 ${
                  isDark
                    ? 'bg-gradient-to-t from-navy/60 via-navy/20 to-transparent'
                    : 'bg-gradient-to-t from-cream/40 via-transparent to-transparent'
                }`}
              />
              {/* Photo */}
              <img
                ref={imageRef}
                src={image}
                alt={label}
                className="w-full h-full object-cover will-change-transform"
                loading="lazy"
              />
            </div>

            {/* Illustration overlay — subtle decorative element */}
            {illustration && (
              <div
                className={`absolute ${
                  isPhotoLeft ? '-right-8 -bottom-8' : '-left-8 -bottom-8'
                } w-32 h-32 md:w-40 md:h-40 opacity-[0.15] pointer-events-none`}
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
              isPhotoLeft ? 'lg:pl-4 xl:pl-8' : 'lg:pr-4 xl:pr-8'
            }`}
            style={!isPhotoLeft ? { direction: 'ltr' } : undefined}
          >
            {/* Label */}
            <p
              className={`reveal-text font-body text-sm tracking-[0.3em] uppercase mb-4 ${
                isDark ? 'text-bronze' : 'text-bronze'
              }`}
            >
              {label}
            </p>

            {/* Tagline */}
            <p
              className={`reveal-text font-display text-lg md:text-xl italic mb-6 ${
                isDark ? 'text-bronze/80' : 'text-bronze-dark'
              }`}
            >
              &ldquo;{tagline}&rdquo;
            </p>

            {/* Heading */}
            <h2
              className={`reveal-text font-display text-3xl md:text-4xl lg:text-5xl leading-tight mb-8 ${
                isDark ? 'text-white' : 'text-navy'
              }`}
            >
              {heading}
            </h2>

            {/* Divider */}
            <div className="reveal-text w-16 h-px bg-bronze/40 mb-8" />

            {/* Description paragraphs */}
            {description.map((p, i) => (
              <p
                key={i}
                className={`reveal-text font-body text-base md:text-lg leading-relaxed mb-5 ${
                  isDark ? 'text-white/55' : 'text-navy/60'
                }`}
              >
                {p}
              </p>
            ))}

            {/* Features */}
            <div className="features-wrap flex flex-wrap gap-3 mt-8 mb-10">
              {features.map((f) => (
                <span
                  key={f}
                  className={`feature-item inline-flex items-center gap-2 px-4 py-2 text-sm font-body tracking-wide border ${
                    isDark
                      ? 'border-bronze/20 text-bronze/80 bg-bronze/[0.04]'
                      : 'border-bronze/30 text-bronze-dark bg-bronze/[0.06]'
                  }`}
                >
                  <svg viewBox="0 0 12 12" fill="none" className="w-3 h-3 shrink-0">
                    <path
                      d="M6 1L11 6L6 11L1 6Z"
                      stroke="currentColor"
                      strokeWidth="1"
                    />
                  </svg>
                  {f}
                </span>
              ))}
            </div>

            {/* CTA */}
            <motion.div
              className="reveal-text"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <Link
                to={ctaLink}
                className={isDark ? 'btn-bronze' : 'btn-bronze'}
              >
                Solicitar Asesoría
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
