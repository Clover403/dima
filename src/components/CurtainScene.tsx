import { useEffect, useRef } from 'react'
import type { ReactNode } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface CurtainSceneProps {
  hero: ReactNode
  reveal: ReactNode
}

export default function CurtainScene({ hero, reveal }: CurtainSceneProps) {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const heroRef = useRef<HTMLDivElement>(null)
  const revealRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!wrapperRef.current || !heroRef.current || !revealRef.current) return

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: wrapperRef.current,
        start: 'top top',
        end: '+=100vh',
        pin: true,
        pinType: 'fixed',
        pinSpacing: true,
        anticipatePin: 1,
      })

      gsap.to(heroRef.current, {
        yPercent: -100,
        ease: 'none',
        scrollTrigger: {
          trigger: wrapperRef.current,
          start: 'top top',
          end: '+=100vh',
          scrub: 1.5,
          invalidateOnRefresh: true,
        },
      })
    })

    return () => ctx.revert()
  }, [])

  return (
    <div ref={wrapperRef} style={{ position: 'relative' }}>
      {/* Reveal: sudah ada di page 0, di balik hero */}
      <div
        ref={revealRef}
        style={{
          position: 'relative',
          zIndex: 1,
          paddingTop: '10vh',
        }}
      >
        {reveal}
      </div>

      {/* Hero: fixed menutup reveal, lalu naik ke atas */}
      <div
        ref={heroRef}
        style={{
          position: 'fixed',
          inset: 0,
          height: '100dvh',
          minHeight: '100vh',
          zIndex: 50,
          overflow: 'hidden',
          willChange: 'transform',
        }}
      >
        {hero}
      </div>
    </div>
  )
}
