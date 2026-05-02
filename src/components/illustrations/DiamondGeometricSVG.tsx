/**
 * Engraving-style diamond/hourglass figure inspired by the DIMA logo.
 * All strokes carry the `.draw-path` class so GSAP can run the
 * stroke-dasharray draw-on effect from the parent timeline.
 */
export default function DiamondGeometricSVG({
  className = '',
  stroke = '#E5997B',
}: {
  className?: string
  stroke?: string
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 600 600"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Outer diamond */}
      <path
        className="draw-path"
        d="M300 40 L560 300 L300 560 L40 300 Z"
        stroke={stroke}
        strokeWidth="1"
      />
      {/* Inner diamond */}
      <path
        className="draw-path"
        d="M300 120 L480 300 L300 480 L120 300 Z"
        stroke={stroke}
        strokeWidth="0.8"
        strokeOpacity="0.7"
      />
      {/* Hourglass crosshatch */}
      <path className="draw-path" d="M40 300 L560 300" stroke={stroke} strokeWidth="0.5" strokeOpacity="0.5" />
      <path className="draw-path" d="M300 40 L300 560" stroke={stroke} strokeWidth="0.5" strokeOpacity="0.5" />
      {/* Inner hourglass triangles */}
      <path
        className="draw-path"
        d="M180 180 L420 180 L300 300 Z"
        stroke={stroke}
        strokeWidth="0.6"
        strokeOpacity="0.6"
      />
      <path
        className="draw-path"
        d="M180 420 L420 420 L300 300 Z"
        stroke={stroke}
        strokeWidth="0.6"
        strokeOpacity="0.6"
      />
      {/* Concentric circle accents */}
      <circle
        className="draw-path"
        cx="300"
        cy="300"
        r="180"
        stroke={stroke}
        strokeWidth="0.4"
        strokeOpacity="0.35"
      />
      <circle
        className="draw-path"
        cx="300"
        cy="300"
        r="90"
        stroke={stroke}
        strokeWidth="0.4"
        strokeOpacity="0.35"
      />
      {/* Corner ticks */}
      <path className="draw-path" d="M300 30 L300 60" stroke={stroke} strokeWidth="1" />
      <path className="draw-path" d="M300 540 L300 570" stroke={stroke} strokeWidth="1" />
      <path className="draw-path" d="M30 300 L60 300" stroke={stroke} strokeWidth="1" />
      <path className="draw-path" d="M540 300 L570 300" stroke={stroke} strokeWidth="1" />
    </svg>
  )
}
