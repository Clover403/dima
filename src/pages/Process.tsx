// src/pages/Process.tsx
// Updated to use ProcesoIntro + ProcesodiagramaInteractivo
// ModeloProceso removed — it belongs to the Modelo page, not here.

import { useEffect, useRef, type MouseEvent } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import PageTransition from '../components/PageTransition';
import ProcessCTASection from '../components/ProcessCTASection';
import UnifiedMagmaGrid from '../components/UnifiedMagmaGrid';
import InteractiveConstellationText from '../components/InteractiveConstellationText';

// ── NEW imports ──────────────────────────────────────────────────────────────
import ProcesoIntro from '../components/Proceso/ProcesoIntro';
import ProcesodiagramaInteractivo from '../components/Proceso/Procesodiagramainteractivo';

gsap.registerPlugin(ScrollTrigger);

export default function Process() {
  const pageRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothMouseX = useSpring(mouseX, { stiffness: 60, damping: 18, mass: 0.4 });
  const smoothMouseY = useSpring(mouseY, { stiffness: 60, damping: 18, mass: 0.4 });

  const bgX = useTransform(smoothMouseX, [-0.5, 0.5], [18, -18]);
  const bgY = useTransform(smoothMouseY, [-0.5, 0.5], [18, -18]);
  const contentX = useTransform(smoothMouseX, [-0.5, 0.5], [12, -12]);
  const contentY = useTransform(smoothMouseY, [-0.5, 0.5], [12, -12]);

  const handleHeroMouseMove = (e: MouseEvent<HTMLElement>) => {
    const rect = heroRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleHeroMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    const timeout = setTimeout(() => ScrollTrigger.refresh(), 100);
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (!pageRef.current) return;
    const ctx = gsap.context(() => {
      // Marquee scroll
      gsap.to('.proceso-marquee', {
        xPercent: -100,
        repeat: -1,
        duration: 55,
        ease: 'none',
      });
    }, pageRef);
    return () => ctx.revert();
  }, []);

  const heroSection = (
    <section
      ref={heroRef}
      onMouseMove={handleHeroMouseMove}
      onMouseLeave={handleHeroMouseLeave}
      className="relative h-screen flex items-center justify-center overflow-hidden bg-[#030035]"
    >
      {/* Base static grid */}
      <motion.div
        className="absolute inset-0 z-[1] pointer-events-none opacity-[0.05]"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(229,153,123,1) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(229,153,123,1) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
          x: bgX,
          y: bgY,
        }}
      />

      {/* Unified Magma Engine */}
      <UnifiedMagmaGrid cellSize={60} color="229,153,123" />

      {/* Static CSS grid overlay */}
      <motion.div
        className="absolute inset-0 opacity-[0.04] pointer-events-none z-[5]"
        style={{
          backgroundImage:
            'linear-gradient(to right, #F4F4F5 1px, transparent 1px), linear-gradient(to bottom, #F4F4F5 1px, transparent 1px)',
          backgroundSize: '60px 60px',
          x: bgX,
          y: bgY,
        }}
      />

      {/* Marquee */}
      <motion.div className="absolute top-[12%] w-full overflow-hidden opacity-[0.04] pointer-events-none select-none z-[6]" style={{ x: contentX }}>
        <div
          className="proceso-marquee flex whitespace-nowrap font-display text-[14vw] text-[#F4F4F5] uppercase"
          style={{ WebkitTextStroke: '2px #F4F4F5' }}
        >
          <span className="flex-shrink-0">Proceso&nbsp;•&nbsp;Ingeniería&nbsp;•&nbsp;Crédito&nbsp;•&nbsp;Iteración&nbsp;•&nbsp;</span>
          <span className="flex-shrink-0">Proceso&nbsp;•&nbsp;Ingeniería&nbsp;•&nbsp;Crédito&nbsp;•&nbsp;Iteración&nbsp;•&nbsp;</span>
        </div>
      </motion.div>

      {/* Corner decorations */}
      {(['top-8 left-8', 'top-8 right-8', 'bottom-8 left-8', 'bottom-8 right-8'] as const).map((pos, i) => (
        <svg key={i} className={`absolute ${pos} w-10 h-10 pointer-events-none z-[7]`} viewBox="0 0 40 40" fill="none">
          <path
            d={['M0 20 L0 0 L20 0','M40 20 L40 0 L20 0','M0 20 L0 40 L20 40','M40 20 L40 40 L20 40'][i]}
            stroke="#E5997B" strokeWidth="0.8" strokeOpacity="0.35"
          />
        </svg>
      ))}

      {/* Hero content */}
      <motion.div className="hero-content relative z-[20] text-center max-w-6xl w-full px-8 pointer-events-none flex flex-col items-center" style={{ x: contentX, y: contentY }}>
        <div className="flex items-center justify-center gap-4 mb-6">
          <div className="w-8 h-px bg-[#E5997B]/50" />
          <p className="font-mono text-[#E5997B] text-[10px] tracking-[0.6em] uppercase">
            Nuestro Proceso
          </p>
          <div className="w-8 h-px bg-[#E5997B]/50" />
        </div>

        <InteractiveConstellationText
          lines={[
            { text: 'Ingeniería', y: 115, color: '#F4F4F5' },
            { text: 'Financiera.', y: 265, fontStyle: 'italic', color: '#E5997B' },
          ]}
          viewBox="0 0 1350 310"
          defaultFontSize={150}
          fontFamily="'Playfair Display', serif"
          containerClassName="pointer-events-auto w-full"
        />

        <p className="font-body text-[#F4F4F5]/40 text-base md:text-lg max-w-xl mx-auto leading-relaxed mt-4 mb-12">
          Un enfoque metodológico y disciplinado para la estructuración de
          soluciones de crédito empresarial.
        </p>

        <div className="flex flex-col items-center gap-2">
          <span className="text-[#F4F4F5]/20 text-[9px] tracking-[0.5em] uppercase font-mono">Scroll</span>
          <div className="w-px h-8 bg-gradient-to-b from-[#E5997B]/40 to-transparent" />
        </div>
      </motion.div>

      {/* Footer bar */}
      <div className="absolute bottom-0 left-0 right-0 border-t border-[#F4F4F5]/5 py-4 px-8 md:px-16 flex items-center justify-between pointer-events-none z-[8]">
        <span className="font-mono text-[8px] tracking-[0.4em] uppercase text-[#F4F4F5]/12">SOFOM E.N.R. — México</span>
        <span className="font-mono text-[8px] tracking-[0.4em] uppercase text-[#E5997B]/20">Arquitectos de Equilibrio</span>
      </div>
    </section>
  );

  return (
    <PageTransition>
      <div ref={pageRef} className="relative bg-[#030035]">
        
        {/* Hero dirender secara native, tidak di-pin atau di-dissolve */}
        {heroSection}
        
        {/* Intro section flows directly out of hero */}
        <ProcesoIntro />

        {/* Interactive diagram — full dark section */}
        <ProcesodiagramaInteractivo />

        {/* CTA — render plainly without curtain/slide effects */}
        <ProcessCTASection />
      </div>
    </PageTransition>
  );
}