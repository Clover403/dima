import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';

// ─── HOOK ANIMASI ENVELOPE DOTS ───
function useEnvelopeDots(canvasRef: React.RefObject<HTMLCanvasElement | null>) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const RAW_SEGMENTS: [number, number][][] = [
      [[0, 0], [10, 14], [20, 28], [30, 42], [40, 56],
       [42.5, 57.75], [45, 59], [47.5, 59.75], [50, 60], [52.5, 59.75], [55, 59], [57.5, 57.75], [60, 56],
       [70, 42], [80, 28], [90, 14], [100, 0]],
      [[0, 100], [17.5, 74.5], [35, 49]],
      [[100, 100], [82.5, 74.5], [65, 49]],
    ];

    const segments = RAW_SEGMENTS.map(points => {
      const dist: number[] = [0];
      for (let i = 1; i < points.length; i++) {
        const [ax, ay] = points[i - 1];
        const [bx, by] = points[i];
        dist.push(dist[i - 1] + Math.hypot(bx - ax, by - ay));
      }
      return { points, dist, total: dist[dist.length - 1] };
    });

    const pointAt = (seg: typeof segments[0], d: number) => {
      const { points, dist, total } = seg;
      const clamped = Math.max(0, Math.min(total, d));
      let i = 1;
      while (i < dist.length && dist[i] < clamped) i++;
      const d0 = dist[i - 1], d1 = dist[i];
      const t = d1 === d0 ? 0 : (clamped - d0) / (d1 - d0);
      const [ax, ay] = points[i - 1];
      const [bx, by] = points[i];
      return { x: ax + (bx - ax) * t, y: ay + (by - ay) * t };
    };

    interface Dot {
      segIndex: number; pos: number; dir: 1 | -1;
      speed: number; trail: number; opacity: number;
      dead: boolean; deadAge: number;
    }
    const dots: Dot[] = [];

    const spawnDot = (segIndex: number) => {
      const seg = segments[segIndex];
      const dir: 1 | -1 = Math.random() < 0.5 ? 1 : -1;
      dots.push({
        segIndex, pos: dir === 1 ? 0 : seg.total, dir,
        speed: 0.7 + Math.random() * 0.3,
        trail: 1.5,
        opacity: 0.6,
        dead: false, deadAge: 0,
      });
    };

    segments.forEach((_, i) => spawnDot(i));
    const spawnInterval = setInterval(() => {
      segments.forEach((_, segIndex) => {
        if (dots.filter(d => d.segIndex === segIndex).length === 0) {
          spawnDot(segIndex);
        }
      });
    }, 1500);

    let raf = 0;
    // Menggunakan warna Lightgray (229, 229, 229) agar serasi
    const color = '229,229,229'; 

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const scaleX = canvas.width / 100;
      const scaleY = canvas.height / 100;
      const lineW = 1.5;

      for (let i = dots.length - 1; i >= 0; i--) {
        const dot = dots[i];
        const seg = segments[dot.segIndex];

        if (dot.dead) {
          dot.deadAge++;
          if (dot.deadAge > 20) { 
            const sIdx = dot.segIndex;
            dots.splice(i, 1);
            spawnDot(sIdx); 
            continue; 
          }
        } else {
          dot.pos += dot.dir * dot.speed;
          if (dot.pos <= 0 || dot.pos >= seg.total) dot.dead = true;
        }

        const fade = dot.dead ? Math.max(0, 1 - dot.deadAge / 20) : 1;
        const head = pointAt(seg, dot.pos);
        const tail = pointAt(seg, dot.pos - dot.dir * dot.trail);
        const hx = head.x * scaleX, hy = head.y * scaleY;
        const tx = tail.x * scaleX, ty = tail.y * scaleY;

        const cx = (hx + tx) / 2;
        const cy = (hy + ty) / 2;
        const glowRadius = 45; 
        const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, glowRadius);
        glow.addColorStop(0, `rgba(${color},${0.02 * fade})`); 
        glow.addColorStop(1, `rgba(${color},0)`);
        
        ctx.beginPath();
        ctx.fillStyle = glow;
        ctx.arc(cx, cy, glowRadius, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(tx, ty);
        ctx.lineTo(hx, hy);
        ctx.strokeStyle = `rgba(${color},${dot.opacity * fade})`;
        ctx.lineWidth = lineW;
        ctx.lineCap = 'round';
        ctx.stroke();
      }
      raf = requestAnimationFrame(draw);
    };

    draw(); 

    return () => {
      cancelAnimationFrame(raf);
      clearInterval(spawnInterval);
      ro.disconnect();
    };
  }, [canvasRef]);
}
// ──────────────────────────────────────────

export default function Loader() {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  
  const svgPathRef = useRef<SVGPathElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLImageElement>(null);
  const dotsCanvasRef = useRef<HTMLCanvasElement>(null);

  useEnvelopeDots(dotsCanvasRef);

  useEffect(() => {
    // Animasi logo muncul dari kanan ke kiri saat komponen di-mount
    gsap.fromTo(logoRef.current, 
      { x: 100, opacity: 0 }, 
      { x: 0, opacity: 1, duration: 1.2, ease: "power3.out", delay: 0.2 }
    );



    let isLoadTriggered = false;
    const R2_BASE_URL = import.meta.env.VITE_R2_BASE_URL || '';
    
    // The frames we absolutely must wait for
    const priority1 = [
      "/logo/white.svg",
      "/logo/Imagen 1.png"
    ];
    
    const priority2 = R2_BASE_URL ? [`${R2_BASE_URL}/hero1_re/ezgif-frame-001.webp`] : [];
    
    const priority3 = [
      "/illustration-compressed/home/temple6.webp",
      "/illustration-compressed/home/temple9.webp",
      "/illustration-compressed/home/jembatan3.webp",
      "/illustration-compressed/home/timbangan1.webp",
      "/illustration-compressed/serviceHome/crene.webp",
      "/illustration-compressed/serviceHome/armilarry.webp",
      "/illustration-compressed/serviceHome/jam-air.webp",
      "/illustration-compressed/serviceHome/berlian.webp",
      "/illustration-compressed/serviceHome/buku.webp",
      "/illustration-compressed/products/menara.webp",
      "/illustration-compressed/products/bridge.webp",
      "/illustration-compressed/products/tabung.webp",
      "/illustration-compressed/products/cycle.webp",
      "/illustration-compressed/products/gear-machine.webp",
      "/illustration-compressed/products/invoice.webp"
    ];

    const essentialItems = [...priority1, ...priority2, ...priority3];
    let loadedItemsCount = 0;

    const checkReadyToFinish = () => {
      if (isLoadTriggered) return;
      if (loadedItemsCount >= essentialItems.length) {
        isLoadTriggered = true;
        setProgress(100);
        setTimeout(startExitAnimation, 600);
      }
    };

    const preloadImage = (src: string): Promise<void> => {
      return new Promise((resolve) => {
        const img = new Image();
        img.fetchPriority = 'high';
        img.onload = () => {
          loadedItemsCount++;
          setProgress((loadedItemsCount / essentialItems.length) * 100);
          resolve();
        };
        img.onerror = () => {
          loadedItemsCount++;
          setProgress((loadedItemsCount / essentialItems.length) * 100);
          resolve();
        };
        img.src = src;
      });
    };

    const loadSequentially = async () => {
      // 1. Logo di loading
      await Promise.all(priority1.map(preloadImage));
      
      // 2. Frame awal hero home
      await Promise.all(priority2.map(preloadImage));
      
      // 3. Semua gambar di halaman home
      await Promise.all(priority3.map(preloadImage));
      
      checkReadyToFinish();

      // Background loading for other priorities (Phase 2)
      // 4. Frame awal sequences
      const priority4 = R2_BASE_URL ? [
        `${R2_BASE_URL}/hero2_re/ezgif-frame-001.webp`,
        `${R2_BASE_URL}/models1_re/ezgif-frame-001.webp`,
        `${R2_BASE_URL}/models2_re/ezgif-frame-001.webp`,
        `${R2_BASE_URL}/models3_re/ezgif-frame-001.webp`,
        `${R2_BASE_URL}/nosotros1_re/ezgif-frame-001.webp`,
        `${R2_BASE_URL}/nosotros2_re/ezgif-frame-001.webp`,
        `${R2_BASE_URL}/nosotros3_re/ezgif-frame-001.webp`
      ] : [];

      // 5. Di modelo harus gambar biasa nya dulu sebelum sequences di load
      const priority5 = [
        "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1600&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?q=80&w=1600&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=1600&auto=format&fit=crop",
        "/illustration-compressed/home/3rodaekonomi.webp",
        "/foto/brand-corporate.jpg",
        "/illustration-compressed/models/penggiling.webp",
        "/illustration-compressed/models/balon2.webp"
      ];

      // Load background assets sequentially to avoid killing the network
      const backgroundPreload = (src: string) => {
        return new Promise<void>((resolve) => {
          const img = new Image();
          img.fetchPriority = 'low';
          img.onload = () => resolve();
          img.onerror = () => resolve();
          img.src = src;
        });
      };
      
      // Load Priority 4 (First frames of other sequences)
      await Promise.all(priority4.map(backgroundPreload));
      // Load Priority 5 (Modelo images)
      await Promise.all(priority5.map(backgroundPreload));
    };

    loadSequentially();

    // Failsafe timeout (dipercepat jadi 8 detik max)
    const timeout = setTimeout(() => {
      if (!isLoadTriggered) {
        loadedItemsCount = essentialItems.length;
        checkReadyToFinish();
      }
    }, 8000);

    return () => {
      clearTimeout(timeout);
    };
  }, []);

  // Mencegah scroll saat loading
  useEffect(() => {
    document.body.style.overflow = isLoading ? 'hidden' : 'auto';
    return () => { document.body.style.overflow = 'auto'; };
  }, [isLoading]);

  const startExitAnimation = () => {
    const tl = gsap.timeline({
      onComplete: () => {
        setIsLoading(false);
        (window as any).isLoaderFinished = true;
        window.dispatchEvent(new Event('loaderFinished'));
      }
    });

    // 1. Konten (Logo, Progress, Canvas) memudar duluan
    tl.to(contentRef.current, {
      opacity: 0,
      scale: 0.95,
      filter: "blur(10px)",
      duration: 0.6,
      ease: "power2.inOut"
    }, 0);

    const band = { insetX: 50, openY: 0, depth: 0 };
    
    const updatePath = () => {
      if (!svgPathRef.current) return;
      
      const xStart = 1440 * (band.insetX / 100);
      const xEnd   = 1440 * (1 - (band.insetX / 100));
      const yTop   = 500 - band.openY;
      const yBottom = 500 + band.openY;
      const depth  = band.depth;

      const cp1X = xStart + (720 - xStart) * 0.35;
      const cp2X = 720 - (720 - xStart) * 0.35;
      const cp3X = 720 + (xEnd - 720) * 0.35;
      const cp4X = xEnd - (xEnd - 720) * 0.35;

      const outer = `M0,0 L1440,0 L1440,1000 L0,1000 Z`;
      const inner = `
        M ${xStart},500 
        L ${xStart},${yTop} 
        C ${cp1X},${yTop} ${cp2X},${yTop + depth} 720,${yTop + depth} 
        C ${cp3X},${yTop + depth} ${cp4X},${yTop} ${xEnd},${yTop} 
        L ${xEnd},${yBottom} 
        C ${cp4X},${yBottom} ${cp3X},${yBottom - depth} 720,${yBottom - depth} 
        C ${cp2X},${yBottom - depth} ${cp1X},${yBottom} ${xStart},${yBottom} 
        Z
      `;

      svgPathRef.current.setAttribute('d', `${outer} ${inner}`);
    };

    tl.to(band, {
      insetX: 0,
      openY: 2,
      duration: 1.2,
      ease: "power2.inOut",
      onUpdate: updatePath
    }, 0.6);

    tl.to(band, {
      depth: 150, 
      duration: 0.8,
      ease: "power2.inOut",
      onUpdate: updatePath
    }, 1.2); 

    tl.to(band, {
      openY: 600,
      depth: 0, 
      duration: 2.2,
      ease: "power3.inOut",
      onUpdate: updatePath
    }, 1.6);
  };

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-[10000] pointer-events-none bg-transparent">
      
      {/* ── LAYER 1: SVG Tirai Animasi (Bronze) ── */}
      <svg 
        viewBox="0 0 1440 1000" 
        preserveAspectRatio="none" 
        className="absolute inset-0 w-full h-full pointer-events-auto z-10"
      >
        <path 
          ref={svgPathRef} 
          fill="#E5997B" 
          fillRule="evenodd" 
          d="M0,0 L1440,0 L1440,1000 L0,1000 Z" 
        />
      </svg>

      {/* ── LAYER 2: Envelope Garis Statis & Canvas Animasi ── */}
      <div ref={contentRef} className="absolute inset-0 z-20 pointer-events-none flex flex-col items-center justify-center">
        
        {/* Garis statis amplop di background diubah menjadi Lightgray */}
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="absolute inset-0 w-full h-full pointer-events-none text-[#E5E5E5] opacity-20 z-0"
          aria-hidden="true"
        >
          <path
            d="M0,0 L40,56 Q50,64 60,56 L100,0 M0,100 L35,49 M100,100 L65,49"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        {/* Titik animasi amplop */}
        <canvas
          ref={dotsCanvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none z-0"
        />

        {/* ── LAYER 3: Logo & Progress ── */}
        <div className="relative z-10 flex flex-col items-center">
          
          {/* Logo Diperbesar dan di tengah */}
          <img 
            ref={logoRef}
            src="/logo/white.svg" 
            alt="Logo" 
            className="w-48 md:w-64 lg:w-80 h-auto mb-10 opacity-100" 
          />
          
          {/* Progress Bar (diubah ke Lightgray) */}
          <div className="w-64 md:w-80 lg:w-96 h-[2px] bg-[#E5E5E5]/20 rounded-full overflow-hidden relative">
            <div 
              className="absolute left-0 top-0 bottom-0 bg-[#E5E5E5] transition-all duration-200 ease-linear"
              style={{ width: `${Math.min(100, progress)}%` }}
            />
          </div>
          
          {/* Percentage (diubah ke Lightgray) */}
          <div 
            className="mt-5 text-[0.7rem] md:text-sm font-mono tracking-[0.3em] text-[#E5E5E5]/70"
          >
            {Math.floor(Math.min(100, progress))}%
          </div>
        </div>
      </div>

    </div>
  );
}