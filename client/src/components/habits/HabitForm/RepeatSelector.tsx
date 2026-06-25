import { cn } from '../../../utils/cn';

const PRESETS = [
  { label: 'Daily',    value: 'daily' },
  { label: 'Weekdays', value: 'weekdays' },
  { label: 'Weekends', value: 'weekends' },
  { label: 'Custom',   value: 'custom' },
];

const DAY_LABELS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

interface RepeatSelectorProps {
  type: string;
  days: number[];
  onTypeChange: (type: string) => void;
  onDaysChange: (days: number[]) => void;
}

export const RepeatSelector = ({ type, days, onTypeChange, onDaysChange }: RepeatSelectorProps) => {
  const toggleDay = (day: number) => {
    onDaysChange(days.includes(day) ? days.filter((d) => d !== day) : [...days, day]);
  };

  return (
    <div className="space-y-3">
      {/* Preset buttons */}
      <div className="flex flex-wrap gap-2" role="group" aria-label="Repeat frequency">
        {PRESETS.map((p) => (
          <button
            key={p.value}
            type="button"
            onClick={() => onTypeChange(p.value)}
            aria-pressed={type === p.value}
            className={cn(
              'px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/30',
              type === p.value
                ? 'bg-foreground text-background border-foreground'
                : 'border-border text-muted-foreground hover:border-foreground/30 hover:text-foreground'
            )}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Custom day picker */}
      {type === 'custom' && (
        <div className="flex gap-1.5" role="group" aria-label="Custom days">
          {DAY_LABELS.map((label, day) => (
            <button
              key={day}
              type="button"
              aria-pressed={days.includes(day)}
              onClick={() => toggleDay(day)}
              className={cn(
                'w-9 h-9 rounded-full text-xs font-medium transition-colors',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/30',
                days.includes(day)
                  ? 'bg-foreground text-background'
                  : 'border border-border text-muted-foreground hover:border-foreground/30'
              )}
            >
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
