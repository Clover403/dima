import React, { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import RippleGrid from "../RippleGrid";

gsap.registerPlugin(ScrollTrigger);

const words = ["Modelo", "de", "Equilibrio", "Financiero"];

export default function ScrollMEF() {
  const containerRef = useRef<HTMLElement | null>(null);
  const bgRef = useRef<HTMLDivElement | null>(null);
  const prefixRef = useRef<HTMLSpanElement | null>(null);
  const acronymRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const targetRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const dotRef = useRef<HTMLSpanElement | null>(null);

  // Spotlight Grid Refs (mirip SharedHeroSection)
  const spotlightGridRef = useRef<HTMLDivElement | null>(null);
  const spotlightDotsRef = useRef<HTMLDivElement | null>(null);
  const spotlightContainerRef = useRef<HTMLDivElement | null>(null);

  const nonAcronymWordsRefs = useRef<HTMLSpanElement[][]>([]);
  nonAcronymWordsRefs.current = words.map(() => []);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // 1. ANIMASI SPOTLIGHT GRID (Rotasi dari SharedHeroSection)
      const gridAngleProxy = { angle: 0 };
      const dotsAngleProxy = { angle: 0 };

      gsap.set(spotlightGridRef.current, { "--grid-angle": "0deg" });
      gsap.set(spotlightDotsRef.current, { "--dots-angle": "0deg" });

      gsap.to(gridAngleProxy, {
        angle: "+=360",
        duration: 7,
        ease: "none",
        repeat: -1,
        onUpdate: () => {
          if (spotlightGridRef.current) {
            spotlightGridRef.current.style.setProperty(
              "--grid-angle",
              `${gridAngleProxy.angle}deg`
            );
          }
        },
      });

      gsap.to(dotsAngleProxy, {
        angle: "-=360",
        duration: 7,
        ease: "none",
        repeat: -1,
        onUpdate: () => {
          if (spotlightDotsRef.current) {
            spotlightDotsRef.current.style.setProperty(
              "--dots-angle",
              `${dotsAngleProxy.angle}deg`
            );
          }
        },
      });

      // 2. TIMELINE SCROLL MEF
      const coords = acronymRefs.current.map((el, i) => {
        if (!el || !targetRefs.current[i]) return { dx: 0, dy: 0, scale: 1 };
        const start = el.getBoundingClientRect();
        const end = targetRefs.current[i]!.getBoundingClientRect();

        const dx =
          end.left + end.width / 2 - (start.left + start.width / 2);
        const dy =
          end.top + end.height / 2 - (start.top + start.height / 2);
        const scale = end.height / start.height;

        return { dx, dy, scale };
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=250%",
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      // --- PHASE 1 (0% - 35%): Pudar huruf non-akronim DARI KANAN KE KIRI PER KATA ---
      nonAcronymWordsRefs.current.forEach((wordChars) => {
        if (wordChars.length > 0) {
          tl.to(
            wordChars,
            {
              opacity: 0,
              // stagger from "end" biar animasi mulai dari huruf paling kanan di SETIAP kata
              stagger: {
                each: 0.05,
                from: "end",
              },
              duration: 1.2,
              ease: "power1.out",
            },
            0
          );
        }
      });

      // Huruf MEF sedikit membesar di awal
      tl.to(
        acronymRefs.current,
        {
          scale: 1.08,
          duration: 2,
          ease: "power2.out",
        },
        0
      );

      // --- PHASE 2 (35% - 60%): MEF Menyatu ke tengah ---
      acronymRefs.current.forEach((el, i) => {
        tl.to(
          el,
          {
            x: coords[i].dx,
            y: coords[i].dy,
            scale: coords[i].scale,
            color: "#E5E5E5",
            duration: 1.8,
            ease: "power4.in",
          },
          1.5
        );
      });

      // --- PHASE 3: BG Navy + Grid Spotlight + DIMA + Nuestro ---
      tl.to(
        [bgRef.current, spotlightContainerRef.current],
        {
          opacity: 1,
          duration: 0.03,
          ease: "none",
        },
        3.3
      )
        .to(
          prefixRef.current,
          {
            color: "#E5E5E5",
            opacity: 0.9,
            // Hapus textShadow biar ga ada cahaya/glow sisa
            textShadow: "none",
            duration: 0.03,
            ease: "none",
          },
          3.3
        )
        .fromTo(
          dotRef.current,
          {
            opacity: 0,
            scale: 0,
          },
          {
            opacity: 1,
            scale: 1,
            duration: 0.3,
            ease: "power4.out",
          },
          3.3
        );

      // --- PHASE 4: Final MEF (TANPA GLOW/CAHAYA SAMA SEKALI) ---
      tl.to(
        acronymRefs.current,
        {
          // Sengaja dikosongkan/diubah ke none agar cahaya di MEF hilang total
          textShadow: "none",
          duration: 1.5,
        },
        3.8
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative w-full h-screen bg-lightgray text-[#030035] flex flex-col items-center justify-center overflow-hidden select-none font-serif"
    >
      {/* RIPPLE GRID BAWAAN - z-index: 0 */}
      <RippleGrid />

      {/* Layer Background Navy - z-index: 1 */}
      <div
        ref={bgRef}
        className="absolute inset-0 bg-[#030035] opacity-0 pointer-events-none"
        style={{ zIndex: 1 }}
      />

      {/* --- SPOTLIGHT GRID DI ATAS BG NAVY (z-index: 2) --- */}
      <div
        ref={spotlightContainerRef}
        className="absolute inset-0 w-full h-full opacity-0 pointer-events-none"
        style={{ zIndex: 2 }}
      >
        {/* Spotlight Grid Layer */}
        <div
          ref={spotlightGridRef}
          className="absolute inset-0 w-full h-full"
          style={
            {
              maskImage:
                "radial-gradient(circle at center, transparent 8%, rgba(0,0,0,0.65) 22%, black 36%, rgba(0,0,0,0.5) 58%, transparent 95%), conic-gradient(from calc(var(--grid-angle) - 180deg) at center, transparent 30deg, rgba(0,0,0,0.02) 70deg, rgba(0,0,0,0.4) 170deg, black 230deg, rgba(0,0,0,0.4) 290deg, rgba(0,0,0,0.02) 330deg, transparent 360deg)",
              WebkitMaskImage:
                "radial-gradient(circle at center, transparent 8%, rgba(0,0,0,0.65) 22%, black 36%, rgba(0,0,0,0.5) 58%, transparent 95%), conic-gradient(from calc(var(--grid-angle) - 180deg) at center, transparent 30deg, rgba(0,0,0,0.02) 70deg, rgba(0,0,0,0.4) 170deg, black 230deg, rgba(0,0,0,0.4) 290deg, rgba(0,0,0,0.02) 330deg, transparent 360deg)",
              maskComposite: "intersect",
              WebkitMaskComposite: "intersect",
              "--grid-angle": "0deg",
            } as React.CSSProperties
          }
        >
          <div
            className="absolute inset-0 transform -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 w-screen h-screen"
            style={{
              backgroundImage: `
                linear-gradient(to right, rgba(211,211,211,0.35) 1px, transparent 1px), 
                linear-gradient(to bottom, rgba(211,211,211,0.35) 1px, transparent 1px)
              `,
              backgroundSize: "72px 72px",
              backgroundPosition: "36px 36px",
              maskImage:
                "radial-gradient(circle at center, transparent 8px, black 12px)",
              WebkitMaskImage:
                "radial-gradient(circle at center, transparent 8px, black 12px)",
              maskSize: "72px 72px",
              WebkitMaskSize: "72px 72px",
              opacity: 0.85,
            }}
          />
        </div>

        {/* Spotlight Dots Layer */}
        <div
          ref={spotlightDotsRef}
          className="absolute inset-0 w-full h-full"
          style={
            {
              maskImage:
                "radial-gradient(circle at center, transparent 15%, rgba(0,0,0,0.5) 25%, black 40%, rgba(0,0,0,0.5) 55%, transparent 70%), conic-gradient(from calc(var(--dots-angle) - 180deg) at center, transparent 30deg, rgba(0,0,0,0.02) 70deg, rgba(0,0,0,0.4) 170deg, black 230deg, rgba(0,0,0,0.4) 290deg, rgba(0,0,0,0.02) 330deg, transparent 360deg)",
              WebkitMaskImage:
                "radial-gradient(circle at center, transparent 15%, rgba(0,0,0,0.5) 25%, black 40%, rgba(0,0,0,0.5) 55%, transparent 70%), conic-gradient(from calc(var(--dots-angle) - 180deg) at center, transparent 30deg, rgba(0,0,0,0.02) 70deg, rgba(0,0,0,0.4) 170deg, black 230deg, rgba(0,0,0,0.4) 290deg, rgba(0,0,0,0.02) 330deg, transparent 360deg)",
              maskComposite: "intersect",
              WebkitMaskComposite: "intersect",
              "--dots-angle": "0deg",
            } as React.CSSProperties
          }
        >
          <div
            className="absolute inset-0 transform -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 w-screen h-screen"
            style={{
              backgroundImage: `
                radial-gradient(circle at 36px 36px, rgba(211,211,211,0.35) 1.5px, transparent 1.5px)
              `,
              backgroundSize: "72px 72px",
              backgroundPosition: "0px 0px",
            }}
          />
        </div>
      </div>

      {/* Prefix "Nuestro" - z-index: 10 */}
      <span
        ref={prefixRef}
        className="text-sm md:text-base uppercase tracking-[0.4em] text-[#030035]/80 mb-16 font-light transition-colors"
        style={{ zIndex: 10, position: "relative" }}
      >
        Nuestro
      </span>

      {/* Main Sentence Container - z-index: 10 */}
      <h1
        className="text-5xl md:text-7xl lg:text-8xl font-light flex flex-nowrap justify-center items-center gap-x-4 max-w-full text-center px-4 leading-tight whitespace-nowrap"
        style={{ zIndex: 10, position: "relative" }}
      >
        {words.map((word, wIdx) => (
          <span key={wIdx} className="inline-flex whitespace-nowrap">
            {word.split("").map((char, cIdx) => {
              const isM = word === "Modelo" && cIdx === 0;
              const isE = word === "Equilibrio" && cIdx === 0;
              const isF = word === "Financiero" && cIdx === 0;

              return (
                <span
                  key={cIdx}
                  ref={(el) => {
                    if (!el) return;
                    if (isM) acronymRefs.current[0] = el;
                    else if (isE) acronymRefs.current[1] = el;
                    else if (isF) acronymRefs.current[2] = el;
                    else nonAcronymWordsRefs.current[wIdx].push(el);
                  }}
                  className="inline-block origin-center will-change-transform"
                >
                  {char}
                </span>
              );
            })}
          </span>
        ))}
      </h1>

      {/* Target Container: MEF - z-index: 5 */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        style={{ zIndex: 5 }}
      >
        <div className="flex items-start text-[4rem] md:text-[6rem] lg:text-[8rem] font-normal tracking-wide gap-x-6 md:gap-x-10 lg:gap-x-12">
          <span ref={(el) => { targetRefs.current[0] = el }} className="opacity-0">
            M
          </span>
          <span ref={(el) => { targetRefs.current[1] = el }} className="opacity-0">
            E
          </span>
          <span ref={(el) => { targetRefs.current[2] = el }} className="opacity-0">
            F
          </span>

          {/* DIMA */}
          <span
            ref={dotRef}
            className="text-lg md:text-2xl lg:text-3xl text-[#E5E5E5] -ml-2 md:-ml-4 lg:-ml-4 mt-4 md:mt-6 lg:mt-8 opacity-0 scale-0 font-sans font-medium tracking-normal uppercase"
          >
            DIMA
          </span>
        </div>
      </div>
    </section>
  );
}