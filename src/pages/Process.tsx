// src/pages/Process.tsx
// Updated to use ProcesoIntro + ProcesodiagramaInteractivo
// ModeloProceso removed — it belongs to the Modelo page, not here.

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import PageTransition from '../components/layout/PageTransition';
import SharedHeroSection from '../components/layout/SharedHeroSection';

// ── NEW imports ──────────────────────────────────────────────────────────────
import ProcesoIntro from '../components/Proceso/ProcesoIntro';
import ProcesodiagramaInteractivo from '../components/Proceso/diagram';
import CTA from '../components/layout/CTA';

gsap.registerPlugin(ScrollTrigger);

export default function Process() {
  const pageRef = useRef<HTMLDivElement>(null);

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

  return (
    <PageTransition>
      <div ref={pageRef} className="relative bg-[#030035]">

        <SharedHeroSection
          eyebrowText="Nuestro Proceso"
          titleTop="Ingeniería"
          titleBottom="Financiera."
          description="Un enfoque metodológico y disciplinado para la estructuración de soluciones de crédito empresarial."
        />
        
        {/* Intro section flows directly out of hero */}
        <ProcesoIntro />

        {/* Interactive diagram — full dark section */}
        <ProcesodiagramaInteractivo />

        {/* CTA — render plainly without curtain/slide effects */}
        <CTA />
      </div>
    </PageTransition>
  );
}