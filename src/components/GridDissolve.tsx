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
  pinDistance = '+=150%',
  className,
}: GridDissolveProps) {
  const transitionRef = useRef<HTMLDivElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)
  const heroLayerRef = useRef<HTMLDivElement>(null)

  const childArray = Children.toArray(children)
  if (childArray.length < 2) {
    return <>{children}</>
  }

  const heroSection = childArray[0]
  const followingSections = childArray.slice(1)

  useLayoutEffect(() => {
    if (!transitionRef.current || !overlayRef.current || !heroLayerRef.current) return

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
      const cols = Math.ceil(width / cellSize)
      const rows = Math.ceil(height / cellSize)

      overlay.innerHTML = ''
      overlay.style.height = `${rows * cellSize}px`

      const fragment = document.createDocumentFragment()
      const cells: HTMLDivElement[] = []

      for (let row = 0; row < rows; row += 1) {
        for (let col = 0; col < cols; col += 1) {
          const cell = document.createElement('div')
          cell.style.position = 'absolute'
          cell.style.left = `${col * cellSize}px`
          cell.style.top = `${row * cellSize}px`
          cell.style.width = `${cellSize}px`
          cell.style.height = `${cellSize}px`
          cell.style.background = '#030035'
          cell.style.transform = 'scale(1)'
          cell.style.opacity = '1'
          cell.style.willChange = 'opacity, transform'
          fragment.appendChild(cell)
          cells.push(cell)
        }
      }

      overlay.appendChild(fragment)

      const randomCells = shuffle(cells)

      const heroContent = heroLayer.querySelector('.hero-content')

      gsap.set(overlay, { autoAlpha: 0 })
      gsap.set(heroLayer, { autoAlpha: 1 })
      gsap.set(randomCells, { opacity: 1, scale: 1 })
      if (heroContent) {
        gsap.set(heroContent, { autoAlpha: 1 })
      }

      timeline = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: transitionRef.current,
          start: 'top top',
          end: pinDistance,
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      })

      // Fade out hero content first
      if (heroContent) {
        timeline.to(heroContent, { autoAlpha: 0, scale: 0.95, duration: 0.2 }, 0)
      }

      // CRITICAL FIX: Hide the solid heroLayer perfectly as the grid takes over.
      // If heroLayer stys visible, the dissolving grid just reveals the solid navy background behind it!
      timeline
        .set(overlay, { autoAlpha: 1 }, 0.2)
        .set(heroLayer, { autoAlpha: 0 }, 0.2)
        .to(
          randomCells,
          {
            opacity: 0,
            scale: 0, // Shrink to nothing
            borderRadius: "50%", // Turn into smooth circles/bubbles as they melt
            stagger: {
              amount: 1.5,
              from: "random",
            },
            ease: "power2.inOut",
            duration: 0.6,
          },
          0.2
        )
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
      <div data-dissolve-container="true" ref={transitionRef} className="relative">
        {followingSections}

        <div
          ref={heroLayerRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-30 overflow-hidden"
        >
          {heroSection}
        </div>

        <div
          ref={overlayRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 z-40 overflow-hidden"
        />
      </div>
    </div>
  )
}
