import { cn } from '../../utils/cn';
import type { HabitStatus } from '../../types/habit.types';

const STATUS_CONFIG: Record<HabitStatus, { label: string; className: string }> = {
  active: { label: 'Active', className: 'bg-foreground/[0.08] text-foreground' },
  paused: { label: 'Paused', className: 'bg-foreground/[0.05] text-muted-foreground' },
  archived: { label: 'Archived', className: 'bg-foreground/[0.04] text-muted-foreground/70' },
  completed: { label: 'Completed', className: 'bg-foreground/[0.08] text-foreground' },
  deleted: { label: 'Deleted', className: 'bg-foreground/[0.03] text-muted-foreground/50' },
};

interface StatusBadgeProps {
  status: HabitStatus;
  className?: string;
}

export const StatusBadge = ({ status, className }: StatusBadgeProps) => {
  const config = STATUS_CONFIG[status] ?? STATUS_CONFIG.active;
  return (
    <span
      className={cn(
        'inline-flex items-center text-[10px] uppercase tracking-[0.12em] font-medium px-2 py-0.5 rounded-full',
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  );
};
