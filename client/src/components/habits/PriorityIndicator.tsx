import { cn } from '../../utils/cn';
import type { HabitPriority } from '../../types/habit.types';

const PRIORITY_CONFIG: Record<HabitPriority, { label: string; dots: number; className: string }> = {
  low:      { label: 'Low',      dots: 1, className: 'text-muted-foreground/40' },
  medium:   { label: 'Medium',   dots: 2, className: 'text-muted-foreground/70' },
  high:     { label: 'High',     dots: 3, className: 'text-foreground/80' },
  critical: { label: 'Critical', dots: 4, className: 'text-foreground' },
};

interface PriorityIndicatorProps {
  priority: HabitPriority;
  showLabel?: boolean;
  className?: string;
}

export const PriorityIndicator = ({ priority, showLabel = false, className }: PriorityIndicatorProps) => {
  const config = PRIORITY_CONFIG[priority];
  return (
    <span
      className={cn('inline-flex items-center gap-1', className)}
      aria-label={`Priority: ${config.label}`}
      title={`Priority: ${config.label}`}
    >
      {Array.from({ length: 4 }).map((_, i) => (
        <span
          key={i}
          className={cn(
            'block w-1 h-1 rounded-full',
            i < config.dots ? 'bg-current' : 'bg-current opacity-15'
          )}
          style={{ color: 'inherit' }}
          aria-hidden="true"
        />
      ))}
      {showLabel && (
        <span className={cn('text-[10px] uppercase tracking-wider ml-1', config.className)}>
          {config.label}
        </span>
      )}
    </span>
  );
};
