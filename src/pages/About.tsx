import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import PageTransition from '../components/PageTransition';

import AboutHeroSection from '../components/about/AboutHeroSection';
import AboutPinnedNarrativeSection from '../components/about/AboutPinnedNarrativeSection';
import AboutOriginSection from '../components/about/AboutOriginSection';
import AboutPillarsSection from '../components/about/AboutPillarsSection';
import AboutManifestoSection from '../components/about/AboutManifestoSection';
import AboutStatsSection from '../components/about/AboutStatsSection';
import AboutCTASection from '../components/about/AboutCTASection';
import AboutDissolveSection from '../components/about/AboutDissolveSection';

gsap.registerPlugin(ScrollTrigger);

export default function About() {
  const pageRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const pinnedRef = useRef<HTMLDivElement>(null);
  const pillarsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);

    const ctx = gsap.context(() => {

      // ==========================================
      // 1. HERO ANIMATIONS
      // ==========================================

      gsap.fromTo(".hero-marquee-text",
        { xPercent: 0 },
        { xPercent: -50, repeat: -1, duration: 40, ease: "none" }
      );
      gsap.fromTo(".hero-word",
        { y: 100, opacity: 0, filter: "blur(15px)" },
        { y: 0, opacity: 1, filter: "blur(0px)", stagger: 0.1, duration: 1.5, ease: "power4.out", delay: 0.2 }
      );
      gsap.fromTo(".hero-subtext",
        { y: 24, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.2, ease: "power3.out", delay: 0.6 }
      );

      // ==========================================
      // 2. PINNED NARRATIVE + SVG STROKE DRAW
      // ==========================================

      gsap.set(".p-text-2, .p-text-3, .p-text-4", { autoAlpha: 0, y: 80 });

      const pinnedTl = gsap.timeline({
        scrollTrigger: {
          trigger: pinnedRef.current,
          start: "top top",
          end: "+=850%",
          pin: true,
          pinSpacing: true,
          anticipatePin: 1,
          scrub: 2,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const digit = document.querySelector('.scroll-progress-digit');
            if (digit) digit.textContent = (self.progress * 100).toFixed(0).padStart(3, '0');
          }
        }
      });

      pinnedTl
        .to(".svg-d-ring1", { strokeDashoffset: 0, duration: 3, ease: "none" }, 0)
        .to(".svg-d-ring2", { strokeDashoffset: 0, duration: 3, ease: "none" }, 0.8)
        .to(".svg-d-bot1", { strokeDashoffset: 0, duration: 2, ease: "none" }, 1.5)
        .to(".svg-d-bot2", { strokeDashoffset: 0, duration: 2, ease: "none" }, 2)
        .to(".svg-d-col", { strokeDashoffset: 0, duration: 2.5, stagger: 0.15, ease: "none" }, 2.5)
        .to(".svg-d-top1", { strokeDashoffset: 0, duration: 2, ease: "none" }, 3.5)
        .to(".svg-d-top2", { strokeDashoffset: 0, duration: 2, ease: "none" }, 4)
        .to(".svg-d-beam", { strokeDashoffset: 0, duration: 1.5, ease: "none" }, 4.5)
        .to(".svg-d-pan", { strokeDashoffset: 0, duration: 1.5, stagger: 0.3, ease: "none" }, 5.5)
        .to(".svg-d-dot", { strokeDashoffset: 0, duration: 1, ease: "none" }, 6.5)
        .to(".p-text-1", { autoAlpha: 0, y: -80, duration: 3 }, 1)
        .to(".p-text-2", { autoAlpha: 1, y: 0, duration: 3 }, 2)
        .to(".p-text-2", { autoAlpha: 0, y: -80, duration: 3 }, 6)
        .to(".p-text-3", { autoAlpha: 1, y: 0, duration: 3 }, 7)
        .to(".p-text-3", { autoAlpha: 0, y: -80, duration: 3 }, 11)
        .to(".p-text-4", { autoAlpha: 1, y: 0, duration: 3 }, 12)
        .to(".svg-d-dot", { strokeDashoffset: 25, duration: 1, ease: "none" }, 9)
        .to(".svg-d-pan", { strokeDashoffset: 60, duration: 1.5, stagger: 0.3, ease: "none" }, 9.5)
        .to(".svg-d-beam", { strokeDashoffset: 100, duration: 1.5, ease: "none" }, 10)
        .to(".svg-d-top2", { strokeDashoffset: 310, duration: 1.5, ease: "none" }, 10.5)
        .to(".svg-d-top1", { strokeDashoffset: 350, duration: 1.5, ease: "none" }, 11)
        .to(".svg-d-col", { strokeDashoffset: 295, duration: 2, stagger: { each: 0.15, from: "end" }, ease: "none" }, 11)
        .to(".svg-d-bot2", { strokeDashoffset: 310, duration: 1.5, ease: "none" }, 11.5)
        .to(".svg-d-bot1", { strokeDashoffset: 350, duration: 1.5, ease: "none" }, 12)
        .to(".svg-d-ring2", { strokeDashoffset: 692, duration: 2, ease: "none" }, 12.5)
        .to(".svg-d-ring1", { strokeDashoffset: 880, duration: 2, ease: "none" }, 13);

      // ==========================================
      // 3. ABOUT ORIGIN
      // ── Animasi origin section dihandle sepenuhnya
      //    di dalam AboutOriginSection.tsx sendiri
      //    untuk menghindari konflik GSAP context.
      //    JANGAN tambahkan originTl di sini.
      // ==========================================

      // ==========================================
      // 4. PILLARS REVEAL
      // ==========================================

      gsap.fromTo('.pillar-panel-reveal',
        { y: 100, opacity: 0 },
        {
          y: 0, opacity: 1, stagger: 0.2,
          scrollTrigger: { trigger: pillarsRef.current, start: 'top 85%' }
        }
      );

    }, pageRef);

    const refreshTimeout = window.setTimeout(() => ScrollTrigger.refresh(), 100);

    return () => {
      window.clearTimeout(refreshTimeout);
      ctx.revert();
    };
  }, []);

  return (
    <PageTransition>
      <div ref={pageRef}>
        <AboutHeroSection heroRef={heroRef} />
        <AboutPinnedNarrativeSection pinnedRef={pinnedRef} />
         {/* <AboutOriginSection /> */}
        {/* <AboutPillarsSection pillarsRef={pillarsRef} /> */}
        <AboutDissolveSection />
        <AboutManifestoSection />
        <AboutStatsSection />
        <AboutCTASection />
      </div>
    </PageTransition>
  );
}