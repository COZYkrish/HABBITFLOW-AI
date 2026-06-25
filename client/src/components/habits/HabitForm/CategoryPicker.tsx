import { cn } from '../../../utils/cn';
import type { Category } from '../../../types/habit.types';

interface CategoryPickerProps {
  categories: Category[];
  value: string;
  onChange: (value: string) => void;
}

const CATEGORY_EMOJI: Record<string, string> = {
  Fitness: '💪', Reading: '📚', Coding: '💻', Meditation: '🧘',
  Health: '❤️', Study: '📖', Work: '💼', Finance: '📈',
  Nutrition: '🥗', Creativity: '🎨', Learning: '🧠', Mindfulness: '🌬️',
  Social: '👥', Sleep: '🌙', General: '⭕',
};

export const CategoryPicker = ({ categories, value, onChange }: CategoryPickerProps) => {
  return (
    <div className="grid grid-cols-3 gap-2" role="listbox" aria-label="Select category">
      {categories.map((cat) => (
        <button
          key={cat.id}
          type="button"
          role="option"
          aria-selected={value === cat.name}
          onClick={() => onChange(cat.name)}
          className={cn(
            'flex flex-col items-center gap-1.5 p-3 rounded-xl border text-xs transition-colors',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/30',
            value === cat.name
              ? 'border-foreground bg-foreground/[0.08] text-foreground'
              : 'border-border text-muted-foreground hover:border-foreground/30 hover:text-foreground'
          )}
        >
          <span className="text-xl" aria-hidden="true">
            {CATEGORY_EMOJI[cat.name] ?? '📌'}
          </span>
          <span className="truncate w-full text-center">{cat.name}</span>
        </button>
      ))}
    </div>
  );
};
