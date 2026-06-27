import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';
import GlassSurface from '../ui/GlassSurface';

interface ProgressRingProps {
  /** Value 0–max */
  value: number;
  max?: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  subLabel?: string;
  className?: string;
}

/**
 * ProgressRing — animated SVG circular progress ring.
 * Reusable for any percentage-based stat: daily completion, goals, etc.
 */
export const ProgressRing = ({
  value,
  max = 100,
  size = 160,
  strokeWidth = 10,
  label,
  subLabel,
  className,
}: ProgressRingProps) => {
  const [displayValue, setDisplayValue] = useState(0);
  const rafRef = useRef<number>(0);

  const percentage = max > 0 ? Math.min(value / max, 1) : 0;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - percentage * circumference;

  // Animate count-up
  useEffect(() => {
    const target = Math.round(percentage * 100);
    const duration = 1400;
    const startTime = performance.now();

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(Math.round(eased * target));
      if (progress < 1) rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [percentage]);

  return (
    <div
      className={cn('flex flex-col items-center gap-3', className)}
      role="img"
      aria-label={`Progress: ${displayValue}%`}
    >
      <div className="absolute inset-0 z-[-1] pointer-events-none">
        <GlassSurface width="100%" height="100%" borderRadius={16} />
      </div>
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="-rotate-90"
        >
          {/* Track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            strokeWidth={strokeWidth}
            className="stroke-border"
          />
          {/* Progress arc */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
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

        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-0.5">
          <span className="text-3xl font-thin tabular-nums">{displayValue}%</span>
          {label && (
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
              {label}
            </span>
          )}
        </div>
      </div>

      {subLabel && (
        <p className="text-sm text-muted-foreground text-center">{subLabel}</p>
      )}
    </div>
  );
};
