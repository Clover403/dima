import { Children, type ReactNode, useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

type TriangleDissolveProps = {
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

export default function TriangleDissolve({
  children,
  cellSize = 150,
  pinDistance = '+=120%',
  className,
}: TriangleDissolveProps) {
  const pinContainerRef = useRef<HTMLDivElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)
  const heroLayerRef = useRef<HTMLDivElement>(null)

  const childArray = Children.toArray(children)

  if (childArray.length < 2) {
    return <>{children}</>
  }

  const heroSection = childArray[0]
  const followingSections = childArray.slice(1)

  useLayoutEffect(() => {
    if (!pinContainerRef.current || !overlayRef.current || !heroLayerRef.current) return

    const overlay = overlayRef.current
    const heroLayer = heroLayerRef.current
    let resizeTimer: number | null = null
    let timeline: gsap.core.Timeline | null = null

    const setup = () => {
      if (timeline) {
        timeline.kill()
        timeline = null
      }

      const width = window.innerWidth
      const height = window.innerHeight

      // Low-poly mesh dengan variasi
      let seed = 12345
      const rand = () => {
        seed = (seed * 16807) % 2147483647
        return (seed - 1) / 2147483646
      }

      // Grid lebih sparse = triangle lebih gede
      const baseCols = Math.max(6, Math.floor(width / cellSize))
      const baseRows = Math.max(4, Math.floor(height / cellSize))
      const cX = width / baseCols
      const cY = height / baseRows

      // Generate points dengan noise
      const pts: Array<Array<[number, number]>> = []
      for (let r = 0; r <= baseRows; r++) {
        pts[r] = []
        for (let c = 0; c <= baseCols; c++) {
          const noiseX = (c === 0 || c === baseCols) ? 0 : (rand() - 0.5) * cX * 0.45
          const noiseY = (r === 0 || r === baseRows) ? 0 : (rand() - 0.5) * cY * 0.45
          pts[r][c] = [
            (c / baseCols) * 100 + (noiseX / width) * 100,
            (r / baseRows) * 100 + (noiseY / height) * 100,
          ]
        }
      }

      overlay.innerHTML = ''
      const cells: HTMLDivElement[] = []

      // Base color #030035
      const baseR = 3
      const baseG = 0
      const baseB = 53

      for (let r = 0; r < baseRows; r++) {
        for (let c = 0; c < baseCols; c++) {
          const p1 = pts[r][c]
          const p2 = pts[r][c + 1]
          const p3 = pts[r + 1][c]
          const p4 = pts[r + 1][c + 1]

          // Triangle 1 (atas-kiri ke bawah-kanan)
          const shade1 = 0.85 + rand() * 0.15

          const tri1 = document.createElement('div')
          tri1.style.cssText = `
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background: rgb(${Math.round(baseR * shade1)}, ${Math.round(baseG * shade1)}, ${Math.round(baseB * shade1)});
            clip-path: polygon(${p1[0]}% ${p1[1]}%, ${p2[0]}% ${p2[1]}%, ${p3[0]}% ${p3[1]}%);
            will-change: opacity, transform;
          `
          overlay.appendChild(tri1)
          cells.push(tri1)

          // Triangle 2 (bawah-kanan)
          const shade2 = 0.85 + rand() * 0.15

          const tri2 = document.createElement('div')
          tri2.style.cssText = `
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background: rgb(${Math.round(baseR * shade2)}, ${Math.round(baseG * shade2)}, ${Math.round(baseB * shade2)});
            clip-path: polygon(${p2[0]}% ${p2[1]}%, ${p4[0]}% ${p4[1]}%, ${p3[0]}% ${p3[1]}%);
            will-change: opacity, transform;
          `
          overlay.appendChild(tri2)
          cells.push(tri2)
        }
      }

      const randomCells = shuffle(cells)
      const heroContent = heroLayer.querySelector('.hero-content')

      // State awal
      gsap.set(overlay, { autoAlpha: 0 })
      gsap.set(heroLayer, { autoAlpha: 1 })
      gsap.set(randomCells, { opacity: 1, scale: 1 })
      if (heroContent) gsap.set(heroContent, { autoAlpha: 1, scale: 1 })

      timeline = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: pinContainerRef.current,
          start: 'top top',
          end: pinDistance,
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      })

      // 1. Hero fade
      if (heroContent) {
        timeline.to(heroContent, { autoAlpha: 0, scale: 0.96, duration: 0.15 }, 0)
      }

      // 2. Swap
      timeline
        .set(overlay, { autoAlpha: 1 }, 0.15)
        .set(heroLayer, { autoAlpha: 0 }, 0.15)

      // 3. Dissolve acak
        .to(randomCells, {
          opacity: 0,
          scale: 0,
          stagger: { amount: 1.4, from: 'random' },
          ease: 'power2.inOut',
          duration: 0.6,
        }, 0.15)

      // 4. Cleanup
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
      <div
        ref={pinContainerRef}
        className="relative overflow-hidden"
        style={{ height: '100vh' }}
      >
        <div
          ref={heroLayerRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-30"
        >
          {heroSection}
        </div>

        <div
          ref={overlayRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-40 overflow-hidden"
        />
      </div>

      {followingSections}
    </div>
  )
}