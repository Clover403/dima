/**
 * Engraving-style classical facade with columns — institutional, formal.
 * Strokes use the `.draw-path` class for GSAP draw-on animation.
 */
export default function ArchitecturalColumnSVG({
  className = '',
  stroke = '#E5997B',
}: {
  className?: string
  stroke?: string
}) {
  const columnXs = [90, 170, 250, 330, 410]
  return (
    <svg
      className={className}
      viewBox="0 0 500 700"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Pediment */}
      <path
        className="draw-path"
        d="M40 160 L250 40 L460 160 Z"
        stroke={stroke}
        strokeWidth="1.2"
      />
      <path className="draw-path" d="M80 160 L250 80 L420 160" stroke={stroke} strokeWidth="0.6" strokeOpacity="0.6" />
      {/* Entablature */}
      <path className="draw-path" d="M40 160 L460 160" stroke={stroke} strokeWidth="1" />
      <path className="draw-path" d="M50 180 L450 180" stroke={stroke} strokeWidth="0.6" strokeOpacity="0.6" />
      <path className="draw-path" d="M50 200 L450 200" stroke={stroke} strokeWidth="1" />
      {/* Capitals */}
      {columnXs.map((x, i) => (
        <path
          key={`cap-${i}`}
          className="draw-path"
          d={`M${x - 22} 200 L${x + 22} 200 L${x + 18} 215 L${x - 18} 215 Z`}
          stroke={stroke}
          strokeWidth="0.8"
        />
      ))}
      {/* Column shafts with flute hatching */}
      {columnXs.map((x, i) => (
        <g key={`col-${i}`}>
          <path
            className="draw-path"
            d={`M${x - 15} 215 L${x - 15} 580`}
            stroke={stroke}
            strokeWidth="0.9"
          />
          <path
            className="draw-path"
            d={`M${x + 15} 215 L${x + 15} 580`}
            stroke={stroke}
            strokeWidth="0.9"
          />
          {/* Flutes */}
          <path
            className="draw-path"
            d={`M${x - 8} 220 L${x - 8} 575`}
            stroke={stroke}
            strokeWidth="0.3"
            strokeOpacity="0.5"
          />
          <path
            className="draw-path"
            d={`M${x} 220 L${x} 575`}
            stroke={stroke}
            strokeWidth="0.3"
            strokeOpacity="0.5"
          />
          <path
            className="draw-path"
            d={`M${x + 8} 220 L${x + 8} 575`}
            stroke={stroke}
            strokeWidth="0.3"
            strokeOpacity="0.5"
          />
          {/* Base */}
          <path
            className="draw-path"
            d={`M${x - 22} 580 L${x + 22} 580 L${x + 22} 595 L${x - 22} 595 Z`}
            stroke={stroke}
            strokeWidth="0.8"
          />
        </g>
      ))}
      {/* Stylobate (steps) */}
      <path className="draw-path" d="M30 595 L470 595" stroke={stroke} strokeWidth="1" />
      <path className="draw-path" d="M20 615 L480 615" stroke={stroke} strokeWidth="1" />
      <path className="draw-path" d="M10 640 L490 640" stroke={stroke} strokeWidth="1.2" />
      {/* Horizontal lines on pediment face */}
      <path
        className="draw-path"
        d="M130 140 L370 140"
        stroke={stroke}
        strokeWidth="0.4"
        strokeOpacity="0.4"
      />
      <path
        className="draw-path"
        d="M110 150 L390 150"
        stroke={stroke}
        strokeWidth="0.4"
        strokeOpacity="0.4"
      />
    </svg>
  )
}
