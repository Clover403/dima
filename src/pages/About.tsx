import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import PageTransition from '../components/PageTransition';

// Import all sections
import AboutHeroSection from '../components/about/AboutHeroSection';
import AboutPinnedNarrativeSection from '../components/about/AboutPinnedNarrativeSection';
import AboutOriginSection from '../components/about/AboutOriginSection';
import AboutPillarsSection from '../components/about/AboutPillarsSection';
import AboutManifestoSection from '../components/about/AboutManifestoSection';
import AboutStatsSection from '../components/about/AboutStatsSection';
import AboutCTASection from '../components/about/AboutCTASection';

gsap.registerPlugin(ScrollTrigger);

export default function About() {
  const pageRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const pinnedRef = useRef<HTMLDivElement>(null);
  const pillarsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Force scroll to top on refresh
    window.scrollTo(0, 0);

    const ctx = gsap.context(() => {
      
      // ==========================================
      // 1. HERO ANIMATIONS (The Fixed Spin Logic)
      // ==========================================
      
      // Rotate Base SVG
      gsap.to(".hero-ghost-svg", {
        rotation: 360,
        duration: 120,
        repeat: -1,
        ease: "none",
        transformOrigin: "center center"
      });

      // Rotate Diamond Counter-Clockwise
      gsap.to(".hero-svg-diamond", {
        rotation: -360,
        duration: 70,
        repeat: -1,
        ease: "none",
        transformOrigin: "center center"
      });

      // Rotate Needle Fast
      gsap.to(".hero-svg-needle", {
        rotation: 360,
        duration: 15,
        repeat: -1,
        ease: "none",
        transformOrigin: "center center"
      });

      // Background Marquee Text
      gsap.to(".hero-marquee-text", {
        xPercent: -50,
        repeat: -1,
        duration: 50,
        ease: "none",
      });

      // Entrance Text Blur Reveal
      gsap.fromTo(".hero-word-anim", 
        { y: 100, opacity: 0, filter: "blur(15px)" },
        { 
          y: 0, 
          opacity: 1, 
          filter: "blur(0px)", 
          stagger: 0.1, 
          duration: 1.5, 
          ease: "power4.out",
          delay: 0.2
        }
      );

      // ==========================================
      // 2. PINNED NARRATIVE (Engineered Slowness)
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
        .to(".p-text-1", { autoAlpha: 0, y: -80, duration: 3 }, 1)
        .to(".p-text-2", { autoAlpha: 1, y: 0, duration: 3 }, 2)
        .to(".p-text-2", { autoAlpha: 0, y: -80, duration: 3 }, 6)
        .to(".p-text-3", { autoAlpha: 1, y: 0, duration: 3 }, 7)
        .to(".p-text-3", { autoAlpha: 0, y: -80, duration: 3 }, 11)
        .to(".p-text-4", { autoAlpha: 1, y: 0, duration: 3 }, 12);

      // ==========================================
      // 3. ABOUT ORIGIN (Bronze Parallax Reveal)
      // ==========================================
      
      const originTl = gsap.timeline({
        scrollTrigger: {
          trigger: ".origin-section",
          start: "top bottom", 
          end: "bottom top",
          scrub: 1.5, // Sync animations with scroll position
        }
      });

      originTl
        // Bronze Graphic Scales Up and Brightens
        .to(".origin-scale-wrapper", {
          scale: 1.25,
          opacity: 0.35,
          ease: "none"
        }, 0)
        // Mechanical Sensation: Plates sway as you scroll
        .to(".origin-left-plate", { y: -20, duration: 1 }, 0)
        .to(".origin-right-plate", { y: 20, duration: 1 }, 0)
        // Content Reveal
        .to(".origin-reveal", {
          opacity: 1,
          y: 0,
          stagger: 0.2,
          duration: 0.5
        }, 0.1)
        // Title Parallax
        .from(".origin-title", {
          scale: 0.9,
          filter: "blur(20px)",
          opacity: 0,
          duration: 1
        }, 0.2)
        // Exit effect: Fade out as it leaves the viewport
        .to(".origin-title", {
          opacity: 0,
          y: -100,
          filter: "blur(10px)",
          ease: "none"
        }, 0.8);

      // Pillars animation is handled inside AboutPillarsSection to avoid ScrollTrigger conflicts.

    }, pageRef);

    const refreshTimeout = window.setTimeout(() => ScrollTrigger.refresh(), 100);

    return () => {
      window.clearTimeout(refreshTimeout);
      ctx.revert();
    };
  }, []);

  return (
    <PageTransition>
      <div ref={pageRef} className="bg-[#F4F4F5] text-[#030035] font-sans overflow-x-hidden">
        {/* SECTION 1: HERO */}
        <AboutHeroSection heroRef={heroRef} />
        
        {/* SECTION 2: THE PROCESS (PINNED) */}
        <AboutPinnedNarrativeSection pinnedRef={pinnedRef} />
        
        {/* SECTION 3: THE ORIGIN (BRONZE INDUSTRIAL) */}
        <AboutOriginSection />
        
        {/* SECTION 4: PILLARS */}
        <AboutPillarsSection pillarsRef={pillarsRef} />
        
        {/* SECTION 5: MANIFESTO */}
        <AboutManifestoSection />
        
        {/* SECTION 6: STATS */}
        <AboutStatsSection />
        
        {/* SECTION 7: CALL TO ACTION */}
        <AboutCTASection />
      </div>
    </PageTransition>
  );
}