import { motion, MotionValue, useTransform } from 'framer-motion';

export default function HybridRevealText({
  text = '',
  progress,
  className,
  style,
  isLast = false,
  startOffset = 0,
  totalLength,
  targetColor = "#E5E5E5"
}: {
  text?: string;
  progress: MotionValue<number>;
  className?: string;
  style?: React.CSSProperties;
  isLast?: boolean;
  startOffset?: number;
  totalLength?: number;
  targetColor?: string;
}) {
  const safeText = text || '';
  const chars = safeText.split('');
  
  // Hitung total karakter tanpa spasi agar scroll progress fokus hanya pada huruf
  const validCharsCount = chars.filter(c => c.trim() !== '').length;
  const tLength = totalLength || validCharsCount || 1;
  
  let validCharIndex = 0;

  return (
    <span className={`whitespace-pre-wrap ${className || ''}`} style={style}>
      {chars.map((char, i) => {
        // Render spasi biasa tanpa animasi framer-motion (Sangat menghemat memori)
        if (char.trim() === '') {
          return <span key={i}>{char}</span>; 
        }

        const start = (startOffset + validCharIndex) / tLength;
        const end = (startOffset + validCharIndex + 1) / tLength;
        
        validCharIndex++; // Increment hanya untuk huruf
        
        return (
          <HybridChar 
            key={i} 
            char={char} 
            progress={progress} 
            start={start} 
            end={end} 
            isLast={isLast} 
            targetColor={targetColor} 
          />
        );
      })}
    </span>
  );
}

function HybridChar({
  char,
  progress,
  start,
  end,
  isLast,
  targetColor,
}: {
  char: string;
  progress: MotionValue<number>;
  start: number;
  end: number;
  isLast?: boolean;
  targetColor: string;
}) {
  const opStart = Math.min(0.85, isLast ? start * 0.7 : start * 0.6);
  const opEnd = Math.max(opStart + 0.005, Math.min(0.90, isLast ? end * 0.7 : end * 0.6));

  const opacity = useTransform(progress, (p) => {
    if (typeof p !== 'number' || isNaN(p)) return 1;
    if (p <= opStart) return 0;
    if (p >= opEnd) return 1;
    return (p - opStart) / (opEnd - opStart);
  });

  const safeColorEnd = Math.min(0.98, opEnd + 0.02);

  const color = useTransform(progress, (p) => {
    if (typeof p !== 'number' || isNaN(p) || p >= safeColorEnd) return targetColor;
    if (p <= opEnd) return "#E5997B";
    return targetColor;
  });

  return <motion.span style={{ opacity, color }}>{char}</motion.span>;
}