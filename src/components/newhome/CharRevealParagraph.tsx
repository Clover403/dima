import { useMemo, type FC } from 'react';
import { motion, type MotionValue, useTransform } from 'framer-motion';

interface CharRevealParagraphProps {
  text: string;
  progress: MotionValue<number>;
  className?: string;
  targetColor?: string;
  ghostOpacity?: number;
}

const CharSpan: FC<{
  char: string;
  progress: MotionValue<number>;
  start: number;
  end: number;
  targetColor: string;
  ghostOpacity: number;
}> = ({ char, progress, start, end, targetColor, ghostOpacity }) => {
  const opacity = useTransform(progress, (p) => {
    if (typeof p !== 'number' || isNaN(p)) return ghostOpacity;
    if (p <= start) return ghostOpacity;
    if (p >= end) return 1;
    return ghostOpacity + (1 - ghostOpacity) * ((p - start) / (end - start));
  });

  return (
    <motion.span
      style={{ opacity, color: targetColor }}
      className="inline will-change-[opacity]"
    >
      {char}
    </motion.span>
  );
};

export default function CharRevealParagraph({
  text,
  progress,
  className = '',
  targetColor = '#030035',
  ghostOpacity = 0.18,
}: CharRevealParagraphProps) {
  // Pre-calculate word and character tokens with normalized progress thresholds [start, end]
  // Grouping characters by word with inline-block guarantees that lines wrap gracefully without cutting words
  const words = useMemo(() => {
    const rawWords = text.split(' ');
    const totalChars = text.length || 1;
    let globalCharIndex = 0;

    return rawWords.map((word) => {
      const chars = word.split('').map((char) => {
        const idx = globalCharIndex++;
        return {
          char,
          start: idx / totalChars,
          end: Math.min(1, (idx + 1) / totalChars),
        };
      });
      globalCharIndex++; // account for space separator
      return chars;
    });
  }, [text]);

  return (
    <p className={className}>
      {words.map((wordChars, wordIdx) => (
        <span key={wordIdx} className="inline-block">
          {wordChars.map((item, charIdx) => (
            <CharSpan
              key={charIdx}
              char={item.char}
              progress={progress}
              start={item.start}
              end={item.end}
              targetColor={targetColor}
              ghostOpacity={ghostOpacity}
            />
          ))}
          {/* Add natural word separation */}
          {wordIdx < words.length - 1 && <span className="inline">&nbsp;</span>}
        </span>
      ))}
    </p>
  );
}
