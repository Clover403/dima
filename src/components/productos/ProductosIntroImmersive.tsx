import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// ─── SVG Pattern RippleGrid Component (SEKARANG STATIS & RINGAN) ───
interface RippleGridProps {
  baseColor?: string;
  gridSpacing?: number;
  gap?: number;
}

function RippleGrid({
  baseColor = "rgba(3, 0, 53, 0.12)", // Navy (#030035) transparan halus
  gridSpacing = 66,
  gap = 16,
}: RippleGridProps) {
  
  const generateSvgPattern = (color: string) => {
    const halfSpacing = gridSpacing / 2;
    const strokeWidth = 0.6; 
    const dotRadius = 1.1;   
    const gapSize = gap; 

    const svgContent = `
      <svg xmlns="http://www.w3.org/2000/svg" width="${gridSpacing}" height="${gridSpacing}">
        <line x1="0" y1="${halfSpacing}" x2="${halfSpacing - gapSize}" y2="${halfSpacing}" stroke="${color}" stroke-width="${strokeWidth}" stroke-linecap="round"/>
        <line x1="${halfSpacing + gapSize}" y1="${halfSpacing}" x2="${gridSpacing}" y2="${halfSpacing}" stroke="${color}" stroke-width="${strokeWidth}" stroke-linecap="round"/>
        <line x1="${halfSpacing}" y1="0" x2="${halfSpacing}" y2="${halfSpacing - gapSize}" stroke="${color}" stroke-width="${strokeWidth}" stroke-linecap="round"/>
        <line x1="${halfSpacing}" y1="${halfSpacing + gapSize}" x2="${halfSpacing}" y2="${gridSpacing}" stroke="${color}" stroke-width="${strokeWidth}" stroke-linecap="round"/>
        <circle cx="${halfSpacing}" cy="${halfSpacing}" r="${dotRadius}" fill="${color}"/>
      </svg>
    `;

    return `url("data:image/svg+xml,${encodeURIComponent(svgContent.trim())}")`;
  };

  const baseSvgPattern = generateSvgPattern(baseColor);

  return (
    <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 1 }}>
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: baseSvgPattern,
          backgroundSize: `${gridSpacing}px ${gridSpacing}px`,
          backgroundRepeat: "repeat",
        }}
      />
    </div>
  );
}

// ─── Main Immersive Section Component ─────────────────────────────────────
export default function ProductosIntroImmersive() {
  const sectionRef = useRef<HTMLDivElement>(null)
  
  // Memecah teks per kata dulu, supaya "crecimiento." gak kepisah hurufnya
  const words1 = "No vendemos créditos.".split(" ")
  const words2 = "Estructuramos crecimiento.".split(" ")

  useEffect(() => {
    if (!sectionRef.current) return

    const ctx = gsap.context(() => {
      const chars1 = sectionRef.current!.querySelectorAll('.char-line-1')
      const chars2 = sectionRef.current!.querySelectorAll('.char-line-2')

      // Set warna awal (transparan) agar yang terlihat hanya efek strokenya
      gsap.set(chars1, { color: 'transparent' })
      gsap.set(chars2, { color: 'transparent' })

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'center center', 
          end: '+=150%',          
          pin: true,
          scrub: 1,
        },
      })

      // Animasikan perubahan warna dari transparan ke warna solid secara berurutan
      tl.to(chars1, { 
        color: '#030035', 
        duration: 1, 
        stagger: 0.1, 
        ease: 'none' 
      })
      tl.to(chars2, { 
        color: '#E5997B', 
        duration: 1, 
        stagger: 0.1, 
        ease: 'none' 
      }, "+=0.2") 

      const accentLine = sectionRef.current!.querySelector('.accent-line')
      if (accentLine) {
        tl.fromTo(accentLine, { scaleX: 0 }, { scaleX: 1, duration: 1.5, ease: 'expo.out' }, "-=0.5")
      }

    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen w-full flex items-center justify-center bg-[#E5E5E5] z-20 overflow-hidden"
    >
      {/* ── Layer RippleGrid Background (Statis & Ringan) ── */}
      <RippleGrid />

      {/* ── Cekungan Atas (Statis Permanen) ── */}
      <div className="absolute top-0 left-0 w-full z-50 pointer-events-none text-[#030035]">
        <div className="relative w-full h-[250px] md:h-[400px]">
          <svg viewBox="0 0 1440 400" fill="none" preserveAspectRatio="none" className="w-full h-full">
            <path
              d="M0,0 L0,400 C320,400 480,180 720,180 C960,180 1120,400 1440,400 L1440,0 Z"
              fill="currentColor"
            />
          </svg>
        </div>
      </div>

      {/* ── Cekungan Bawah (Statis Permanen) ── */}
      <div className="absolute bottom-0 left-0 w-full z-50 pointer-events-none text-[#030035]">
        <div className="relative w-full h-[250px] md:h-[400px]">
          <svg
            viewBox="0 0 1440 400"
            fill="none"
            preserveAspectRatio="none"
            className="w-full h-full"
            style={{ transform: 'scaleY(-1)' }}
          >
            <path
              d="M0,0 L0,400 C320,400 480,180 720,180 C960,180 1120,400 1440,400 L1440,0 Z"
              fill="currentColor"
            />
          </svg>
        </div>
      </div>

      {/* ── Konten Teks ── */}
      <div className="relative z-10 max-w-6xl mx-auto text-center px-8 py-20 flex flex-col items-center">
        <p className="font-body text-[#E5997B] text-sm tracking-[0.4em] uppercase mb-12 font-bold">
          Nuestros Productos
        </p>

        {/* ── Baris Teks 1 ── */}
        <h2 
          className="font-display font-normal leading-tight tracking-tight mb-4 flex flex-wrap justify-center text-5xl md:text-7xl lg:text-8xl"
          style={{ WebkitTextStroke: '2px #030035' }}
        >
          {words1.map((word, wIndex) => (
            // Bungkus per kata pakai inline-block supaya gak putus di tengah jalan
            <span key={wIndex} className="inline-block whitespace-nowrap mr-[0.25em]">
              {word.split("").map((char, cIndex) => (
                <span key={cIndex} className="char-line-1">{char}</span>
              ))}
            </span>
          ))}
        </h2>

        {/* ── Baris Teks 2 ── */}
        <h2 
          className="font-display font-normal leading-tight tracking-tight flex flex-wrap justify-center text-5xl md:text-7xl lg:text-8xl"
          style={{ WebkitTextStroke: '2px #E5997B' }}
        >
          {words2.map((word, wIndex) => (
            <span key={wIndex} className="inline-block whitespace-nowrap mr-[0.25em]">
              {word.split("").map((char, cIndex) => (
                <span key={cIndex} className="char-line-2">{char}</span>
              ))}
            </span>
          ))}
        </h2>

        <p className="font-body text-[#030035]/70 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto mt-12 font-medium">
          Cada producto está diseñado como una pieza di ingeniería financiera.
          La mayoría de los créditos pueden adaptarse a las circunstancias y
          necesidades di cada cliente.
        </p>

        <div className="accent-line w-24 h-px bg-[#E5997B] mx-auto mt-12 origin-center" />
      </div>
    </section>
  )
}