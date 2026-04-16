/**
 * Engraving-style balance scale. Strokes use the `.draw-path` class
 * so a parent GSAP timeline can run the stroke-dasharray draw-on effect.
 */
export default function BalanceScaleSVG({
  className = '',
  stroke = '#E5997B',
}: {
  className?: string
  stroke?: string
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 500 600"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Central column */}
      <path className="draw-path" d="M250 120 L250 500" stroke={stroke} strokeWidth="1.2" />
      {/* Base */}
      <path className="draw-path" d="M170 500 L330 500" stroke={stroke} strokeWidth="1.2" />
      <path className="draw-path" d="M200 500 L200 530" stroke={stroke} strokeWidth="0.8" />
      <path className="draw-path" d="M300 500 L300 530" stroke={stroke} strokeWidth="0.8" />
      <path className="draw-path" d="M160 530 L340 530" stroke={stroke} strokeWidth="1" />
      {/* Crown */}
      <circle className="draw-path" cx="250" cy="110" r="10" stroke={stroke} strokeWidth="1" />
      {/* Horizontal beam */}
      <path className="draw-path" d="M70 150 L430 150" stroke={stroke} strokeWidth="1.2" />
      {/* Chains */}
      <path className="draw-path" d="M100 150 L100 260" stroke={stroke} strokeWidth="0.6" strokeOpacity="0.7" />
      <path className="draw-path" d="M140 150 L140 260" stroke={stroke} strokeWidth="0.6" strokeOpacity="0.7" />
      <path className="draw-path" d="M360 150 L360 260" stroke={stroke} strokeWidth="0.6" strokeOpacity="0.7" />
      <path className="draw-path" d="M400 150 L400 260" stroke={stroke} strokeWidth="0.6" strokeOpacity="0.7" />
      {/* Left pan */}
      <path
        className="draw-path"
        d="M60 260 C60 310 180 310 180 260"
        stroke={stroke}
        strokeWidth="1"
      />
      <path className="draw-path" d="M60 260 L180 260" stroke={stroke} strokeWidth="1" />
      {/* Right pan */}
      <path
        className="draw-path"
        d="M320 260 C320 310 440 310 440 260"
        stroke={stroke}
        strokeWidth="1"
      />
      <path className="draw-path" d="M320 260 L440 260" stroke={stroke} strokeWidth="1" />
      {/* Pan hatching */}
      {[0, 1, 2, 3, 4].map((i) => (
        <path
          key={`l-${i}`}
          className="draw-path"
          d={`M${75 + i * 22} 262 L${90 + i * 22} 295`}
          stroke={stroke}
          strokeWidth="0.4"
          strokeOpacity="0.5"
        />
      ))}
      {[0, 1, 2, 3, 4].map((i) => (
        <path
          key={`r-${i}`}
          className="draw-path"
          d={`M${335 + i * 22} 262 L${350 + i * 22} 295`}
          stroke={stroke}
          strokeWidth="0.4"
          strokeOpacity="0.5"
        />
      ))}
      {/* Decorative crest */}
      <path className="draw-path" d="M230 60 L250 30 L270 60 Z" stroke={stroke} strokeWidth="0.8" />
      <path className="draw-path" d="M250 60 L250 100" stroke={stroke} strokeWidth="0.6" strokeOpacity="0.6" />
    </svg>
  )
}
