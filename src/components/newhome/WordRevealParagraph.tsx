import { motion, MotionValue, useTransform } from 'framer-motion';

interface WordRevealParagraphProps {
  text: string;
  progress: MotionValue<number>;
  className?: string;
  targetColor?: string;
  highlightColor?: string;
}

export default function WordRevealParagraph({
  text,
  progress,
  className = '',
  targetColor = '#030035',
  highlightColor = '#E5997B',
}: WordRevealParagraphProps) {
  const words = text.trim().split(/\s+/);
  const total = words.length || 1;

  return (
    <p className={className}>
      {words.map((word, idx) => {
        const start = idx / total;
        const end = (idx + 1) / total;
        return (
          <WordSpan
            key={idx}
            word={word}
            progress={progress}
            start={start}
            end={end}
            targetColor={targetColor}
            highlightColor={highlightColor}
          />
        );
      })}
    </p>
  );
}

function WordSpan({
  word,
  progress,
  start,
  end,
  targetColor,
  highlightColor,
}: {
  word: string;
  progress: MotionValue<number>;
  start: number;
  end: number;
  targetColor: string;
  highlightColor: string;
}) {
  const fadeInWindow = Math.max(0.005, (end - start) * 0.45);
  const opStart = start;
  const opEnd = start + fadeInWindow;

  const opacity = useTransform(progress, (p) => {
    if (typeof p !== 'number' || isNaN(p)) return 1;
    if (p <= opStart) return 0;
    if (p >= opEnd) return 1;
    return (p - opStart) / (opEnd - opStart);
  });

  const color = useTransform(progress, (p) => {
    if (typeof p !== 'number' || isNaN(p) || p >= end) return targetColor;
    if (p >= opStart) return highlightColor;
    return targetColor;
  });

  return (
    <motion.span
      style={{ opacity, color }}
      className="inline-block mr-[0.28em] will-change-[opacity,color]"
    >
      {word}
    </motion.span>
  );
}
