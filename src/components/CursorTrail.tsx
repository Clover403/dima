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
    this.x = x + (Math.random() - 0.5) * 15;
    this.y = y + (Math.random() - 0.5) * 15;
    this.vx = (Math.random() - 0.5) * 0.5;
    this.vy = (Math.random() - 0.5) * 0.5;
    this.size = Math.random() * 12 + 8; // 8 to 20px
    this.angle = Math.random() * Math.PI * 2;
    this.spin = (Math.random() - 0.5) * 0.05;
    this.maxLife = 600 + Math.random() * 200; // 600 to 800ms
    this.life = this.maxLife;

    const shapes: ShapeType[] = ['diamond', 'cross', 'facet', 'triangle', 'lines'];
    this.shape = shapes[Math.floor(Math.random() * shapes.length)];
  }

  update(dt: number, cursorX: number, cursorY: number) {
    // dt is typically ~16ms for 60fps
    const timeScale = dt / 16.66;
    
    // Magnetic/Gravity effect towards cursor
    const dx = cursorX - this.x;
    const dy = cursorY - this.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist > 5 && dist < 250) {
      // Pull gently towards cursor
      const force = 0.015;
      this.vx += (dx / dist) * force * timeScale;
      this.vy += (dy / dist) * force * timeScale;
    }

    // Apply velocity
    this.x += this.vx * timeScale;
    this.y += this.vy * timeScale;
    
    // Slight air friction damping
    this.vx *= Math.pow(0.96, timeScale);
    this.vy *= Math.pow(0.96, timeScale);

    this.angle += this.spin * timeScale;
    this.life -= dt;
  }

  draw(ctx: CanvasRenderingContext2D) {
    const alpha = Math.max(0, this.life / this.maxLife);
    ctx.globalAlpha = alpha;
    
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
        // Half diamond
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
        // Parallel hatching lines
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
      
      // Limit emission rate
      if (now - lastMouseEmitTime > 40) {
        particles.push(new Particle(mouseX, mouseY));
        // Hard cap max elements
        if (particles.length > 20) {
          particles.shift();
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
        ctx.lineWidth = 0.8; // Engraving aesthetic (delicate)
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