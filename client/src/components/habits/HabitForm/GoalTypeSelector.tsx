import { cn } from '../../../utils/cn';
import type { GoalType } from '../../../types/habit.types';

const GOAL_TYPES: { value: GoalType; label: string; description: string; icon: string }[] = [
  { value: 'boolean',  label: 'Yes / No',  description: 'Done or not done',         icon: '✓' },
  { value: 'duration', label: 'Duration',  description: 'Track time in minutes',    icon: '⏱' },
  { value: 'count',    label: 'Count',     description: 'Track a numeric target',   icon: '#' },
];

interface GoalTypeSelectorProps {
  value: GoalType;
  targetValue: number;
  onChange: (type: GoalType) => void;
  onTargetChange: (val: number) => void;
}

export const GoalTypeSelector = ({ value, targetValue, onChange, onTargetChange }: GoalTypeSelectorProps) => {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-2" role="radiogroup" aria-label="Goal type">
        {GOAL_TYPES.map((g) => (
          <button
            key={g.value}
            type="button"
            role="radio"
            aria-checked={value === g.value}
            onClick={() => onChange(g.value)}
            className={cn(
              'flex flex-col items-center gap-1.5 p-3 rounded-xl border text-xs transition-colors',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/30',
              value === g.value
                ? 'border-foreground bg-foreground/[0.08] text-foreground'
                : 'border-border text-muted-foreground hover:border-foreground/30 hover:text-foreground'
            )}
          >
            <span className="text-lg" aria-hidden="true">{g.icon}</span>
            <span className="font-medium">{g.label}</span>
            <span className="text-[10px] text-center leading-tight opacity-60">{g.description}</span>
          </button>
        ))}
      </div>

      {/* Target value input for non-boolean */}
      {value !== 'boolean' && (
        <div className="flex items-center gap-3">
          <label className="text-xs text-muted-foreground whitespace-nowrap">
            Target {value === 'duration' ? '(minutes)' : '(count)'}
          </label>
          <input
            type="number"
            min={1}
            value={targetValue}
            onChange={(e) => onTargetChange(Number(e.target.value))}
            className="w-24 px-3 py-1.5 rounded-lg bg-white/10 dark:bg-black/20 backdrop-blur-md border border-white/20 text-foreground text-sm
                       transition-colors hover:bg-white/20 dark:hover:bg-white/5
                       focus:outline-none focus:ring-1 focus:ring-primary/30 focus:border-primary/30 tabular-nums"
            aria-label="Target value"
          />
        </div>
      )}
    </div>
  );
};
