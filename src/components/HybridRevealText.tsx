import { motion, MotionValue, useTransform } from 'framer-motion';

export default function HybridRevealText({
  text,
  progress,
  className,
  style,
  isLast = false,
  startOffset = 0,
  totalLength,
  targetColor = "#E5E5E5"
}: {
  text: string;
  progress: MotionValue<number>;
  className?: string;
  style?: React.CSSProperties;
  isLast?: boolean;
  startOffset?: number;
  totalLength?: number;
  targetColor?: string;
}) {
  const chars = text.split('');
  
  // Hitung total karakter tanpa spasi agar scroll progress fokus hanya pada huruf
  const validCharsCount = chars.filter(c => c.trim() !== '').length;
  const tLength = totalLength || validCharsCount;
  
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
  const opStart = isLast ? start * 0.7 : start * 0.6;
  const opEnd = isLast ? end * 0.7 : end * 0.6;

  const opacity = useTransform(
    progress,
    [opStart, opEnd],
    [0, 1]
  );

  const colorEnd = Math.min(1, opEnd + 0.015); 

  const color = useTransform(
    progress,
    [0, opEnd, colorEnd, 1],
    ["#E5997B", "#E5997B", targetColor, targetColor]
  );

  return <motion.span style={{ opacity, color }}>{char}</motion.span>;
}