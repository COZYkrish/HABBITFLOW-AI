import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { scaleInVariants } from '../../animations/variants';
import { cn } from '../../utils/cn';
import GlassSurface from '../ui/GlassSurface';

interface StatCardProps {
  label: string;
  value: number | string;
  icon?: React.ReactNode;
  subLabel?: string;
  /** If true, animates the numeric value counting up from 0. */
  animateValue?: boolean;
  className?: string;
  delay?: number;
}

/**
 * StatCard — versatile metric card for streaks, scores, and counts.
 * Reusable across dashboard and future analytics pages.
 */
export const StatCard = ({
  label,
  value,
  icon,
  subLabel,
  animateValue = true,
  className,
  delay = 0,
}: StatCardProps) => {
  const valueRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!animateValue || typeof value !== 'number') return;
    const el = valueRef.current;
    if (!el) return;

    const target = value;
    const duration = 1200;
    const startTime = performance.now();

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target).toString();
      if (progress < 1) requestAnimationFrame(tick);
    };

    const raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, animateValue]);

  return (
    <motion.div
      variants={scaleInVariants}
      initial="hidden"
      animate="visible"
      transition={{ delay }}
      whileHover={{ y: -3, transition: { duration: 0.25 } }}
      className={cn(
        'relative z-0 overflow-hidden rounded-2xl p-6 flex flex-col gap-3 cursor-default select-none',
        className
      )}
    >
      <div className="absolute inset-0 z-[-1] pointer-events-none">
        <GlassSurface width="100%" height="100%" borderRadius={16} />
      </div>
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium tracking-[0.15em] uppercase text-muted-foreground">
          {label}
        </span>
        {icon && (
          <span className="text-2xl" aria-hidden="true">
            {icon}
          </span>
        )}
      </div>

      <div className="flex items-end gap-2">
        <span className="text-4xl font-thin tracking-tight text-foreground">
          {typeof value === 'number' && animateValue ? (
            <span ref={valueRef}>0</span>
          ) : (
            value
          )}
        </span>
        {subLabel && (
          <span className="text-sm text-muted-foreground mb-1">{subLabel}</span>
        )}
      </div>
    </motion.div>
  );
};
