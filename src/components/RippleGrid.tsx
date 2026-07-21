import React, { useEffect, useRef } from "react";
import gsap from "gsap";

interface RippleGridProps {
  baseColor?: string;
  accentColor?: string;
  gridSpacing?: number;
  ringWidth?: number;
  ringSpeed?: number;
  numRings?: number;
  gap?: number;
}

const RippleGrid: React.FC<RippleGridProps> = ({
  baseColor = "rgba(15, 23, 42, 0.12)", // TURUN KONTRAS: Lebih soft (dari 15% ke 12%)
  accentColor = "rgba(30, 58, 138, 0.45)", // TURUN KONTRAS: Spotlight lebih subtil (dari 60% ke 45%)
  gridSpacing = 66,
  ringWidth = 12,   // SEDIKIT DIKURANGI: dari 14 ke 12
  ringSpeed = 7.5,
  numRings = 4,
  gap = 16,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Generate SVG pattern tile (Garis & Titik Sleek)
  const generateSvgPattern = (color: string, isAccent: boolean) => {
    const halfSpacing = gridSpacing / 2;
    const strokeWidth = isAccent ? 0.9 : 0.6; 
    const dotRadius = isAccent ? 1.8 : 1.1;   
    const gapSize = isAccent ? gap * 0.75 : gap; 

    const svgContent = `
      <svg xmlns="http://www.w3.org/2000/svg" width="${gridSpacing}" height="${gridSpacing}">
        <!-- Left horizontal segment -->
        <line 
          x1="0" y1="${halfSpacing}" 
          x2="${halfSpacing - gapSize}" y2="${halfSpacing}" 
          stroke="${color}" stroke-width="${strokeWidth}" stroke-linecap="round"
        />
        <!-- Right horizontal segment -->
        <line 
          x1="${halfSpacing + gapSize}" y1="${halfSpacing}" 
          x2="${gridSpacing}" y2="${halfSpacing}" 
          stroke="${color}" stroke-width="${strokeWidth}" stroke-linecap="round"
        />
        <!-- Top vertical segment -->
        <line 
          x1="${halfSpacing}" y1="0" 
          x2="${halfSpacing}" y2="${halfSpacing - gapSize}" 
          stroke="${color}" stroke-width="${strokeWidth}" stroke-linecap="round"
        />
        <!-- Bottom vertical segment -->
        <line 
          x1="${halfSpacing}" y1="${halfSpacing + gapSize}" 
          x2="${halfSpacing}" y2="${gridSpacing}" 
          stroke="${color}" stroke-width="${strokeWidth}" stroke-linecap="round"
        />
        <!-- Center dot -->
        <circle 
          cx="${halfSpacing}" cy="${halfSpacing}" 
          r="${dotRadius}" fill="${color}"
        />
        ${isAccent ? `
        <!-- Accent glow dot -->
        <circle 
          cx="${halfSpacing}" cy="${halfSpacing}" 
          r="${dotRadius * 2}" fill="${color}" opacity="0.25"
        />
        ` : ''}
      </svg>
    `;

    const encoded = encodeURIComponent(svgContent.trim());
    return `url("data:image/svg+xml,${encoded}")`;
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const ctx = gsap.context(() => {
      const initialProps: Record<string, string> = {};
      for (let i = 0; i < numRings; i++) {
        initialProps[`--ring-radius-${i}`] = "-20%";
      }
      gsap.set(container, initialProps);

      for (let i = 0; i < numRings; i++) {
        const propName = `--ring-radius-${i}`;
        
        gsap.to(container, {
          [propName]: "150%",
          duration: ringSpeed,
          ease: "none",
          repeat: -1,
          delay: (ringSpeed / numRings) * i,
          onRepeat: function() {
            gsap.set(container, { [propName]: "-20%" });
          },
        });
      }
    }, container);

    return () => ctx.revert();
  }, [ringSpeed, numRings]);

  // Generate the mask gradients for rings
  const generateMasks = (width: number) => {
    return Array.from({ length: numRings }, (_, i) => 
      `radial-gradient(circle at center, 
        transparent calc(var(--ring-radius-${i}) - ${width}% - 5%), 
        black calc(var(--ring-radius-${i}) - ${width * 0.2}%), 
        black calc(var(--ring-radius-${i}) + ${width * 0.2}%), 
        transparent calc(var(--ring-radius-${i}) + ${width}% + 5%)
      )`
    );
  };

  const baseSvgPattern = generateSvgPattern(baseColor, false);
  const accentSvgPattern = generateSvgPattern(accentColor, true);
  const baseMasks = generateMasks(ringWidth);
  const accentMasks = generateMasks(ringWidth * 0.65);

  return (
    <div ref={containerRef} className="absolute inset-0 pointer-events-none" style={{ zIndex: -1 }}>
      {/* Layer 1: Base grid */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: baseSvgPattern,
          backgroundSize: `${gridSpacing}px ${gridSpacing}px`,
          backgroundRepeat: "repeat",
          maskImage: baseMasks.join(", "),
          WebkitMaskImage: baseMasks.join(", "),
          maskComposite: "add",
          WebkitMaskComposite: "source-over",
        }}
      />

      {/* Layer 2: Accent grid */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: accentSvgPattern,
          backgroundSize: `${gridSpacing}px ${gridSpacing}px`,
          backgroundRepeat: "repeat",
          maskImage: accentMasks.join(", "),
          WebkitMaskImage: accentMasks.join(", "),
          maskComposite: "add",
          WebkitMaskComposite: "source-over",
        }}
      />
    </div>
  );
};

export default RippleGrid;