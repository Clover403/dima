import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { motion } from 'framer-motion'

gsap.registerPlugin(ScrollTrigger)

interface ServiceSectionProps {
  number: string
  label: string
  heading: string[]
  descriptor: string
  paragraphs: string[]
  deliverables: string[]
  image: string
  layout: 'photo-left' | 'photo-right'
  theme: 'dark' | 'light'
  ctaLink: string
}

export default function ServiceSection({
  number,
  label,
  heading,
  descriptor,
  paragraphs,
  deliverables,
  image,
  layout,
  theme,
  ctaLink,
}: ServiceSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)
  const imageWrapRef = useRef<HTMLDivElement>(null)

  const isDark = theme === 'dark'
  const isPhotoLeft = layout === 'photo-left'

  useEffect(() => {
    if (!sectionRef.current) return

    const ctx = gsap.context(() => {
      const el = sectionRef.current!

      /* ─── Image clip-path reveal + parallax ─── */
      if (imageWrapRef.current && imageRef.current) {
        gsap.fromTo(
          imageWrapRef.current,
          {
            clipPath: isPhotoLeft
              ? 'inset(0 100% 0 0)'
              : 'inset(0 0 0 100%)',
          },
          {
            clipPath: 'inset(0 0% 0 0%)',
            duration: 1.2,
            ease: 'expo.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 75%',
            },
          }
        )

        gsap.fromTo(
          imageRef.current,
          { y: 40, scale: 1.08 },
          {
            y: -40,
            scale: 1.0,
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

      /* ─── Background number ─── */
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

      /* ─── Label clip-path reveal ─── */
      const labelEl = el.querySelector('.service-label')
      if (labelEl) {
        gsap.fromTo(
          labelEl,
          { clipPath: 'inset(0 100% 0 0)' },
          {
            clipPath: 'inset(0 0% 0 0)',
            duration: 0.6,
            ease: 'power2.inOut',
            scrollTrigger: {
              trigger: el.querySelector('.text-column'),
              start: 'top 80%',
            },
          }
        )
      }

      /* ─── Heading word-by-word reveal ─── */
      const words = el.querySelectorAll('.heading-word')
      gsap.fromTo(
        words,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          stagger: 0.1,
          scrollTrigger: {
            trigger: el.querySelector('.text-column'),
            start: 'top 78%',
          },
        }
      )

      /* ─── Descriptor + paragraphs + CTA stagger ─── */
      const textEls = el.querySelectorAll('.reveal-text')
      gsap.fromTo(
        textEls,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: 'power3.out',
          stagger: 0.12,
          scrollTrigger: {
            trigger: el.querySelector('.text-column'),
            start: 'top 75%',
          },
        }
      )

      /* ─── Deliverable tags stagger ─── */
      const tags = el.querySelectorAll('.tag-item')
      gsap.fromTo(
        tags,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: 'power2.out',
          stagger: 0.12,
          scrollTrigger: {
            trigger: el.querySelector('.tags-wrap'),
            start: 'top 85%',
          },
        }
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [isPhotoLeft])

  /* Split heading into words for animation */
  const renderHeading = () => {
    const [whitePart, bronzePart] = heading
    const whiteWords = whitePart.split(' ')
    const bronzeWords = bronzePart.split(' ')

    return (
      <h2
        className={`font-display text-3xl md:text-4xl lg:text-5xl leading-tight mb-6 ${
          isDark ? 'text-white' : 'text-navy'
        }`}
      >
        {whiteWords.map((word, i) => (
          <span key={`w-${i}`} className="heading-word inline-block mr-[0.3em] will-change-transform">
            {word}
          </span>
        ))}
        <br />
        {bronzeWords.map((word, i) => (
          <span
            key={`b-${i}`}
            className="heading-word inline-block mr-[0.3em] text-bronze italic will-change-transform"
          >
            {word}
          </span>
        ))}
      </h2>
    )
  }

  return (
    <section
      ref={sectionRef}
      id={`servicio-${number}`}
      className={`relative min-h-screen py-24 md:py-32 lg:py-0 overflow-hidden ${
        isDark ? 'bg-navy' : 'bg-cream'
      }`}
    >
      {/* Large background number */}
      <div
        className={`bg-number absolute pointer-events-none select-none font-display leading-none ${
          isPhotoLeft ? 'right-8 md:right-16 lg:right-24' : 'left-8 md:left-16 lg:left-24'
        } top-1/2 -translate-y-1/2 text-[14rem] md:text-[20rem] lg:text-[26rem] ${
          isDark ? 'text-white/[0.03]' : 'text-navy/[0.03]'
        }`}
      >
        {number}
      </div>

      {/* Content grid */}
      <div className="relative z-10 section-padding lg:min-h-screen flex items-center">
        <div
          className={`w-full grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-0 items-center ${
            !isPhotoLeft ? 'lg:[direction:rtl]' : ''
          }`}
        >
          {/* ─── Photo Column (60%) ─── */}
          <div
            className={`lg:col-span-3 relative ${
              isPhotoLeft ? 'lg:pr-12 xl:pr-20' : 'lg:pl-12 xl:pl-20'
            }`}
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
                    ? 'bg-gradient-to-t from-navy/50 via-navy/10 to-transparent'
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

            {/* Bronze border accent */}
            <div
              className={`absolute top-8 ${
                isPhotoLeft ? '-left-0 w-px' : '-right-0 w-px'
              } h-2/3 bg-bronze/30 hidden lg:block`}
            />
          </div>

          {/* ─── Text Column (40%) ─── */}
          <div
            className={`text-column lg:col-span-2 ${
              isPhotoLeft ? 'lg:pl-4 xl:pl-8' : 'lg:pr-4 xl:pr-8'
            }`}
            style={!isPhotoLeft ? { direction: 'ltr' } : undefined}
          >
            {/* Label */}
            <p className="service-label text-bronze font-body text-sm tracking-[0.3em] uppercase mb-4 will-change-transform">
              {label}
            </p>

            {/* Heading */}
            {renderHeading()}

            {/* Short descriptor */}
            <p
              className={`reveal-text font-display text-base md:text-lg italic mb-8 ${
                isDark ? 'text-bronze/70' : 'text-bronze-dark/80'
              }`}
            >
              &ldquo;{descriptor}&rdquo;
            </p>

            {/* Divider */}
            <div className="reveal-text w-16 h-px bg-bronze/40 mb-8" />

            {/* Body paragraphs */}
            {paragraphs.map((p, i) => (
              <p
                key={i}
                className={`reveal-text font-body text-base md:text-lg leading-relaxed mb-5 ${
                  isDark ? 'text-white/55' : 'text-navy/60'
                }`}
              >
                {p}
              </p>
            ))}

            {/* Deliverable tags */}
            <div className="tags-wrap flex flex-wrap gap-3 mt-8 mb-10">
              {deliverables.map((d) => (
                <span
                  key={d}
                  className={`tag-item inline-flex items-center gap-2 px-4 py-2 text-sm font-body tracking-wide border will-change-transform ${
                    isDark
                      ? 'border-bronze/20 text-bronze/80 bg-bronze/[0.04]'
                      : 'border-bronze/30 text-bronze-dark bg-bronze/[0.06]'
                  }`}
                >
                  <svg viewBox="0 0 12 12" fill="none" className="w-3 h-3 shrink-0">
                    <path d="M6 1L11 6L6 11L1 6Z" stroke="currentColor" strokeWidth="1" />
                  </svg>
                  {d}
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
                Solicitar Consulta
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
