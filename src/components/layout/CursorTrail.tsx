import { useEffect, useRef } from 'react';

type ShapeType = 'diamond' | 'cross' | 'facet' | 'triangle' | 'lines';

class Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  angle: number;
  spin: number;
  life: number;
  maxLife: number;
  shape: ShapeType;

  constructor(x: number, y: number) {
    this.x = x + (Math.random() - 0.5) * 18;
    this.y = y + (Math.random() - 0.5) * 18;
    this.vx = (Math.random() - 0.5) * 2.8;
    this.vy = (Math.random() - 0.5) * 2.8;
    this.size = Math.random() * 16 + 12; // 12 to 28px
    this.angle = Math.random() * Math.PI * 2;
    this.spin = (Math.random() - 0.5) * 0.10;
    this.maxLife = 900 + Math.random() * 400; // 900 to 1300ms
    this.life = this.maxLife;

    const shapes: ShapeType[] = ['diamond', 'cross', 'facet', 'triangle', 'lines'];
    this.shape = shapes[Math.floor(Math.random() * shapes.length)];
  }

  update(dt: number, cursorX: number, cursorY: number) {
    const timeScale = dt / 16.66;

    const dx = cursorX - this.x;
    const dy = cursorY - this.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    // Magnetic pull lebih kuat, radius lebih jauh
    if (dist > 5 && dist < 320) {
      const force = 0.04;
      this.vx += (dx / dist) * force * timeScale;
      this.vy += (dy / dist) * force * timeScale;
    }

    this.x += this.vx * timeScale;
    this.y += this.vy * timeScale;

    // Friction lebih ringan agar partikel lebih lama melayang
    this.vx *= Math.pow(0.98, timeScale);
    this.vy *= Math.pow(0.98, timeScale);

    this.angle += this.spin * timeScale;
    this.life -= dt;
  }

  draw(ctx: CanvasRenderingContext2D) {
    const progress = this.life / this.maxLife;
    // Fade in cepat (0→0.3 life), fade out lambat (0.3→0)
    const alpha = progress > 0.85
      ? ((1 - progress) / 0.15)        // fade in
      : Math.pow(progress / 0.85, 0.6) // fade out lebih lambat
    ctx.globalAlpha = Math.max(0, Math.min(1, alpha)) * 0.85;

    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);
    ctx.beginPath();

    const s = this.size / 2;

    switch (this.shape) {
      case 'diamond':
        ctx.moveTo(0, -s);
        ctx.lineTo(s * 0.6, 0);
        ctx.lineTo(0, s);
        ctx.lineTo(-s * 0.6, 0);
        ctx.closePath();
        break;
      case 'cross':
        ctx.moveTo(-s * 0.8, -s * 0.8);
        ctx.lineTo(s * 0.8, s * 0.8);
        ctx.moveTo(s * 0.8, -s * 0.8);
        ctx.lineTo(-s * 0.8, s * 0.8);
        break;
      case 'facet':
        ctx.moveTo(0, -s);
        ctx.lineTo(s * 0.6, 0);
        ctx.lineTo(0, s);
        break;
      case 'triangle':
        ctx.moveTo(0, -s);
        ctx.lineTo(s * 0.8, s * 0.6);
        ctx.lineTo(-s * 0.8, s * 0.6);
        ctx.closePath();
        break;
      case 'lines':
        ctx.moveTo(-s * 0.5, -s * 0.8);
        ctx.lineTo(s * 0.5, -s * 0.4);
        ctx.moveTo(-s * 0.5, -s * 0.2);
        ctx.lineTo(s * 0.5, s * 0.2);
        ctx.moveTo(-s * 0.5, s * 0.4);
        ctx.lineTo(s * 0.5, s * 0.8);
        break;
    }

    ctx.stroke();
    ctx.restore();
  }
}

export default function CursorTrail() {
  // return
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let lastTime = performance.now();
    let mouseX = -1000;
    let mouseY = -1000;
    const particles: Particle[] = [];
    let lastMouseEmitTime = 0;
    let currentColor = '#E5997B'; // default bronze
    let lastColorCheckTime = 0;

    const updateSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    updateSize();
    window.addEventListener('resize', updateSize);

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      
      const now = performance.now();
      
      // Periodically check background color context to update stroke color
      if (now - lastColorCheckTime > 150) {
        lastColorCheckTime = now;
        
        const el = document.elementFromPoint(mouseX, mouseY);
        let isLight = false;
        let currentEl = el as HTMLElement | null;
        
        while (currentEl && currentEl !== document.body && currentEl !== document.documentElement) {
          const style = window.getComputedStyle(currentEl);
          const bg = style.backgroundColor;
          
          if (bg && bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent') {
            const match = bg.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
            if (match) {
              const r = parseInt(match[1]);
              const g = parseInt(match[2]);
              const b = parseInt(match[3]);
              // Perceived brightness formula
              const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
              if (luminance > 0.5) {
                isLight = true;
              }
              break; // Found a solid background, stop traversing
            }
          }
          currentEl = currentEl.parentElement;
        }
        
        // Bronze on dark, Navy on light
        currentColor = isLight ? '#030035' : '#E5997B';
      }
      
      if (now - lastMouseEmitTime > 22) {
        // Emit 2 partikel sekaligus saat mouse bergerak cepat
        particles.push(new Particle(mouseX, mouseY));
        if (now - lastMouseEmitTime < 12) {
          particles.push(new Particle(mouseX, mouseY));
        }
        if (particles.length > 40) {
          particles.splice(0, particles.length - 40);
        }
        lastMouseEmitTime = now;
      }
    };

    window.addEventListener('mousemove', handleMouseMove);

    const render = (time: number) => {
      // Calculate delta time in ms
      const dt = time - lastTime;
      lastTime = time;

      // Clear the canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (particles.length > 0) {
        ctx.strokeStyle = currentColor;
        ctx.lineWidth = 1.3;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        for (let i = particles.length - 1; i >= 0; i--) {
          const p = particles[i];
          p.update(dt, mouseX, mouseY);
          p.draw(ctx);
          
          if (p.life <= 0) {
            particles.splice(i, 1);
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', updateSize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 9999,
      }}
    />
  );
}
