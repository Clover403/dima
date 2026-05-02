import { useLayoutEffect, useRef, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function HeroCurtain({ children }: { children: ReactNode }) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const curtainRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const wrapper = wrapperRef.current;
    const curtain = curtainRef.current;
    if (!wrapper || !curtain) return;

    gsap.set(curtain, { y: 0, visibility: "visible", force3D: true });

    
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: wrapper,
        start: "top top",
        end: "+=100%",
        scrub: true,          // instant follow scroll, no lag
        invalidateOnRefresh: true,
      },
    });

    tl.to(curtain, { y: "-100vh", ease: "none", duration: 1 });

    const hideST = ScrollTrigger.create({
      trigger: wrapper,
      start: "bottom top",
      onEnter: () => gsap.set(curtain, { visibility: "hidden" }),
      onLeaveBack: () => gsap.set(curtain, { visibility: "visible" }),
    });

    let resizeTimer: ReturnType<typeof setTimeout>;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => ScrollTrigger.refresh(), 150);
    };
    window.addEventListener("resize", onResize);

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
      hideST.kill();
      window.removeEventListener("resize", onResize);
      clearTimeout(resizeTimer);
    };
  }, []);

  return (
    <div ref={wrapperRef} style={{ height: "200vh", position: "relative", zIndex: 50 }}>
      <div
        ref={curtainRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          zIndex: 50,
          willChange: "transform",
          pointerEvents: "none",
          backfaceVisibility: "hidden",
          transform: "translateZ(0)",
        }}
      >
        {children}
      </div>
    </div>
  );
}