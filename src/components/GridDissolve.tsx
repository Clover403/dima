import { Children, type ReactNode, useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

type GridDissolveProps = {
  children: ReactNode
  cellSize?: number
  pinDistance?: string | number
  className?: string
}

const shuffle = <T,>(items: T[]) => {
  const arr = [...items]
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

export default function GridDissolve({
  children,
  cellSize = 60,
  pinDistance = '+=120%',
  className,
}: GridDissolveProps) {
  const pinContainerRef = useRef<HTMLDivElement>(null)  // hanya hero — di-pin
  const overlayRef      = useRef<HTMLDivElement>(null)  // grid sel dissolve
  const heroLayerRef    = useRef<HTMLDivElement>(null)  // layer hero di atas

  const childArray = Children.toArray(children)

  // Kurang dari 2 child → tidak ada yang bisa di-reveal, render langsung
  if (childArray.length < 2) {
    return <>{children}</>
  }

  const heroSection      = childArray[0]
  const followingSections = childArray.slice(1)  // render DI LUAR container pin

  useLayoutEffect(() => {
    if (!pinContainerRef.current || !overlayRef.current || !heroLayerRef.current) return

    const overlay   = overlayRef.current
    const heroLayer = heroLayerRef.current
    let resizeTimer: number | null = null
    let timeline: gsap.core.Timeline | null = null

    const setup = () => {
      if (timeline) { timeline.kill(); timeline = null }

      const width  = window.innerWidth
      const height = window.innerHeight
      const cols   = Math.ceil(width  / cellSize)
      const rows   = Math.ceil(height / cellSize)

      overlay.innerHTML = ''

      const fragment = document.createDocumentFragment()
      const cells: HTMLDivElement[] = []

      for (let row = 0; row < rows; row += 1) {
        for (let col = 0; col < cols; col += 1) {
          const cell = document.createElement('div')
          cell.style.cssText = `
            position: absolute;
            left: ${col * cellSize}px;
            top: ${row * cellSize}px;
            width: ${cellSize}px;
            height: ${cellSize}px;
            background: #030035;
            will-change: opacity, transform;
          `
          fragment.appendChild(cell)
          cells.push(cell)
        }
      }
      overlay.appendChild(fragment)

      const randomCells   = shuffle(cells)
      const heroContent   = heroLayer.querySelector('.hero-content')

      // State awal: overlay tersembunyi, hero terlihat
      gsap.set(overlay,    { autoAlpha: 0 })
      gsap.set(heroLayer,  { autoAlpha: 1 })
      gsap.set(randomCells, { opacity: 1, scale: 1, borderRadius: '0%' })
      if (heroContent) gsap.set(heroContent, { autoAlpha: 1, scale: 1 })

      timeline = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: pinContainerRef.current,
          start: 'top top',
          end: pinDistance,
          scrub: 1,
          pin: true,             // hanya pinContainerRef (h-screen) yang di-pin
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      })

      // 1. Hero content fade + scale out
      if (heroContent) {
        timeline.to(heroContent, { autoAlpha: 0, scale: 0.96, duration: 0.15 }, 0)
      }

      // 2. Swap: sembunyikan solid heroLayer, tampilkan overlay grid
      timeline
        .set(overlay,   { autoAlpha: 1 }, 0.15)
        .set(heroLayer, { autoAlpha: 0 }, 0.15)

      // 3. Sel-sel dissolve secara acak
        .to(randomCells, {
          opacity: 0,
          scale: 0,
          borderRadius: '50%',
          stagger: { amount: 1.4, from: 'random' },
          ease: 'power2.inOut',
          duration: 0.6,
        }, 0.15)

      // 4. Sembunyikan overlay saat selesai
        .set(overlay, { autoAlpha: 0 })
    }

    setup()

    const handleResize = () => {
      if (resizeTimer) window.clearTimeout(resizeTimer)
      resizeTimer = window.setTimeout(() => {
        setup()
        ScrollTrigger.refresh()
      }, 180)
    }
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      if (resizeTimer) window.clearTimeout(resizeTimer)
      if (timeline) timeline.kill()
    }
  }, [cellSize, pinDistance])

  return (
    <div className={className}>

      {/*
        ┌─────────────────────────────────────────┐
        │  pinContainerRef — h-screen, di-pin     │
        │  ┌───────────────────────────────────┐  │
        │  │ heroLayerRef (absolute inset-0)   │  │
        │  │   └─ heroSection                  │  │
        │  ├───────────────────────────────────┤  │
        │  │ overlayRef (grid sel dissolve)    │  │
        │  └───────────────────────────────────┘  │
        └─────────────────────────────────────────┘
        followingSections — di LUAR pin, flow normal
        ┌─────────────────────────────────────────┐
        │  formSection                            │
        │  contactSection                         │
        └─────────────────────────────────────────┘
      */}

      {/* Container yang di-pin — hanya setinggi viewport */}
      <div
        ref={pinContainerRef}
        className="relative overflow-hidden"
        style={{ height: '100vh' }}
      >
        {/* Layer hero */}
        <div
          ref={heroLayerRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-30"
        >
          {heroSection}
        </div>

        {/* Overlay grid sel dissolve */}
        <div
          ref={overlayRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-40 overflow-hidden"
        />
      </div>

      {/* Following sections — di luar container pin, scroll normal */}
      {followingSections}

    </div>
  )
}