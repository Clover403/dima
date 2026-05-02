import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface Props {
  text: string;
  className?: string;
}

const chars = '!<>-_\\\\/[]{}—=+*^?#________';

export default function TextScramble({ text, className = '' }: Props) {
  const elRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!elRef.current) return;

    let frame = 0;
    const queue: { from: string, to: string, start: number, end: number, char?: string }[] = [];
    const length = text.length;
    for (let i = 0; i < length; i++) {
        queue.push({
            from: chars[Math.floor(Math.random() * chars.length)],
            to: text[i],
            start: Math.floor(Math.random() * 40),
            end: Math.floor(Math.random() * 40) + 40
        });
    }

    let animationFrameId: number;
    let isAnimating = false;

    const update = () => {
        let output = '';
        let complete = 0;
        for (let i = 0, n = queue.length; i < n; i++) {
            let { from, to, start, end, char } = queue[i];
            if (frame >= end) {
                complete++;
                output += to;
            } else if (frame >= start) {
                if (!char || Math.random() < 0.28) {
                    char = chars[Math.floor(Math.random() * chars.length)];
                    queue[i].char = char;
                }
                output += `<span class="text-navy/30">${char}</span>`;
            } else {
                output += from;
            }
        }
        
        if (elRef.current) {
            elRef.current.innerHTML = output;
        }

        if (complete === queue.length) {
            isAnimating = false;
        } else {
            animationFrameId = requestAnimationFrame(update);
            frame++;
        }
    };

    ScrollTrigger.create({
        trigger: elRef.current,
        start: 'top 85%',
        onEnter: () => {
            if (!isAnimating) {
                isAnimating = true;
                frame = 0;
                update();
            }
        }
    });

    return () => {
        cancelAnimationFrame(animationFrameId);
    };
  }, [text]);

    return <span ref={elRef} className={className}>{text}</span>;
}
