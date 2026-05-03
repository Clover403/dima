import type { RefObject } from 'react'
import UnifiedMagmaGrid from '../UnifiedMagmaGrid' // Pastikan file ini dibuat dari kode sebelumnya
import InteractiveConstellationText from '../InteractiveConstellationText'

type Props = {
  heroRef: RefObject<HTMLDivElement | null>
}

export default function AboutHeroSection({ heroRef }: Props) {
  // Kita tetap simpan ref, tapi logika mouse sekarang dihandle 
  // langsung oleh komponen UnifiedMagmaGrid agar tidak terjadi re-render di React.

  return (
    <section
      ref={heroRef}
      className="relative w-full h-screen flex items-center justify-center overflow-hidden bg-[#030035]"
    >
      {/* ── 1. BASE STATIC GRID (Sangat redup, untuk tekstur dasar) ── */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none opacity-[0.05]"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(229,153,123,1) 1px, transparent 1px), 
            linear-gradient(to bottom, rgba(229,153,123,1) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />

      {/* ── 2. UNIFIED MAGMA ENGINE (Efek Cahaya Sela Kotak + Snakes) ── */}
      {/* Komponen ini menggantikan ProximityGrid dan AnimatedGrid sekaligus */}
      <UnifiedMagmaGrid 
        cellSize={60} 
        color="229,153,123" 
      />

      {/* ── 3. STATIC CSS GRID OVERLAY (Garis Putih Tipis untuk kontras) ── */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none z-[5]"
        style={{
          backgroundImage:
            'linear-gradient(to right, #F4F4F5 1px, transparent 1px), linear-gradient(to bottom, #F4F4F5 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      {/* ── 4. MARQUEE (Tetap Sama) ── */}
      <div
        className="absolute top-[18%] w-full overflow-hidden opacity-[0.04] pointer-events-none select-none z-[6]"
      >
        <div
          className="hero-marquee-text flex whitespace-nowrap font-display text-[14vw] text-[#F4F4F5] uppercase"
          style={{ WebkitTextStroke: '2px #F4F4F5' }}
        >
          <span className="flex-shrink-0">DIMA Finance&nbsp;•&nbsp;Ingeniería Financiera&nbsp;•&nbsp;Equilibrio&nbsp;•&nbsp;</span>
          <span className="flex-shrink-0">DIMA Finance&nbsp;•&nbsp;Ingeniería Financiera&nbsp;•&nbsp;Equilibrio&nbsp;•&nbsp;</span>
        </div>
      </div>

      {/* ── 5. HERO CONTENT (Tetap Sama) ── */}
      <div
        className="hero-content relative text-center max-w-6xl px-8 pointer-events-none flex flex-col items-center z-[20]"
      >
        <div className="flex items-center justify-center gap-4 mb-8">
          <div className="w-8 h-px bg-[#E5997B]/50" />
          <p className="font-mono text-[#E5997B] text-[10px] tracking-[0.6em] uppercase">
            Nosotros — DIMA Finance
          </p>
          <div className="w-8 h-px bg-[#E5997B]/50" />
        </div>

        <InteractiveConstellationText
          lines={[
            { text: 'Arquitectos del', y: 155, color: '#F4F4F5' },
            { text: 'equilibrio', y: 285, fontStyle: 'italic', color: '#E5997B' },
          ]}
          viewBox="0 0 900 320"
          defaultFontSize={150}
          fontFamily="'Playfair Display', serif"
          containerClassName="pointer-events-auto mb-10 w-full"
        />

        <p className="hero-subtext text-[#F4F4F5]/40 max-w-xl text-lg md:text-xl font-light leading-relaxed">
          Somos una Institución de Ingeniería Financiera fundada sobre la ideología
          y filosofìa del economista filantrópico Raymond Thomas Dalio.
        </p>

        <div className="mt-12 flex flex-col items-center gap-2">
          <span className="text-[#F4F4F5]/20 text-[9px] tracking-[0.5em] uppercase font-mono">Scroll</span>
          <div className="w-px h-8 bg-gradient-to-b from-[#E5997B]/40 to-transparent" />
        </div>
      </div>
    </section>
  )
}