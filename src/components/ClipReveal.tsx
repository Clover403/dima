import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface Props {
  children: React.ReactNode;
  className?: string;
  direction?: 'up' | 'down' | 'left' | 'right';
}

export default function ClipReveal({ children, className = '', direction = 'right' }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    let clipPathStart = '';
    const clipPathEnd = 'inset(0% 0% 0% 0%)';

    switch (direction) {
      case 'right':
        clipPathStart = 'inset(0% 100% 0% 0%)';
        break;
      case 'left':
        clipPathStart = 'inset(0% 0% 0% 100%)';
        break;
      case 'down':
        clipPathStart = 'inset(0% 0% 100% 0%)';
        break;
      case 'up':
        clipPathStart = 'inset(100% 0% 0% 0%)';
        break;
    }

    gsap.fromTo(
      containerRef.current,
      { clipPath: clipPathStart },
      {
        clipPath: clipPathEnd,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 85%',
          end: 'bottom 20%',
          scrub: 1, // Tie it to scroll position
        },
      }
    );
  }, [direction]);

  return (
    <div ref={containerRef} className={`overflow-hidden ${className}`}>
      {children}
    </div>
  );
}
