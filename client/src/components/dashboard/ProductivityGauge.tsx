import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { scaleInVariants } from '../../animations/variants';
import { cn } from '../../utils/cn';

interface ProductivityGaugeProps {
  score: number;
  className?: string;
}

const SCORE_LABELS: [number, string][] = [
  [0, 'Getting Started'],
  [20, 'Building Up'],
  [40, 'Progressing'],
  [60, 'Consistent'],
  [80, 'Excellent'],
  [95, 'Exceptional'],
];

const getLabel = (score: number) => {
  let label = SCORE_LABELS[0][1];
  for (const [threshold, text] of SCORE_LABELS) {
    if (score >= threshold) label = text;
  }
  return label;
};

/**
 * ProductivityGauge — animated semi-circular gauge (0–100).
 * Derives a qualitative label from the score.
 */
export const ProductivityGauge = ({ score, className }: ProductivityGaugeProps) => {
  const [displayScore, setDisplayScore] = useState(0);
  const rafRef = useRef<number>(0);

  const size = 200;
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = Math.PI * radius; // half-circle
  const offset = circumference - (score / 100) * circumference;

  useEffect(() => {
    const duration = 1400;
    const startTime = performance.now();
    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayScore(Math.round(eased * score));
      if (progress < 1) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [score]);

  return (
    <motion.div
      variants={scaleInVariants}
      initial="hidden"
      animate="visible"
      className={cn('glass-card rounded-2xl p-6 flex flex-col items-center gap-2', className)}
    >
      <span className="text-xs font-medium tracking-[0.15em] uppercase text-muted-foreground self-start">
        Productivity Score
      </span>

      <div className="relative mt-2" style={{ width: size, height: size / 2 + 20 }}>
        <svg
          width={size}
          height={size / 2 + strokeWidth}
          viewBox={`0 0 ${size} ${size / 2 + strokeWidth}`}
          className="overflow-visible"
        >
          {/* Track */}
          <path
            d={`M ${strokeWidth / 2} ${size / 2} A ${radius} ${radius} 0 0 1 ${size - strokeWidth / 2} ${size / 2}`}
            fill="none"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            className="stroke-border"
          />
          {/* Gauge fill */}
          <motion.path
            d={`M ${strokeWidth / 2} ${size / 2} A ${radius} ${radius} 0 0 1 ${size - strokeWidth / 2} ${size / 2}`}
            fill="none"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            className="stroke-foreground"
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
            style={{ strokeDasharray: circumference }}
          />
        </svg>

        {/* Score display */}
        <div className="absolute bottom-0 inset-x-0 flex flex-col items-center">
          <span className="text-5xl font-thin tabular-nums">{displayScore}</span>
          <span className="text-xs uppercase tracking-widest text-muted-foreground mt-1">
            {getLabel(displayScore)}
          </span>
        </div>
      </div>
    </motion.div>
  );
};
