import { cn } from '../../../utils/cn';

const COLORS: { name: string; label: string; bg: string; border: string }[] = [
  { name: 'zinc',    label: 'Zinc',    bg: 'bg-zinc-500',    border: 'border-zinc-400' },
  { name: 'slate',   label: 'Slate',   bg: 'bg-slate-500',   border: 'border-slate-400' },
  { name: 'stone',   label: 'Stone',   bg: 'bg-stone-500',   border: 'border-stone-400' },
  { name: 'neutral', label: 'Neutral', bg: 'bg-neutral-500', border: 'border-neutral-400' },
  { name: 'gray',    label: 'Gray',    bg: 'bg-gray-500',    border: 'border-gray-400' },
  { name: 'red',     label: 'Rose',    bg: 'bg-red-400',     border: 'border-red-300' },
  { name: 'amber',   label: 'Amber',   bg: 'bg-amber-400',   border: 'border-amber-300' },
  { name: 'teal',    label: 'Teal',    bg: 'bg-teal-400',    border: 'border-teal-300' },
  { name: 'sky',     label: 'Sky',     bg: 'bg-sky-400',     border: 'border-sky-300' },
  { name: 'violet',  label: 'Violet',  bg: 'bg-violet-400',  border: 'border-violet-300' },
];

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
}

export const ColorPicker = ({ value, onChange }: ColorPickerProps) => {
  return (
    <div className="flex flex-wrap gap-2" role="listbox" aria-label="Select color">
      {COLORS.map((color) => (
        <button
          key={color.name}
          type="button"
          role="option"
          aria-selected={value === color.name}
          aria-label={color.label}
          onClick={() => onChange(color.name)}
          title={color.label}
          className={cn(
            'w-8 h-8 rounded-full transition-all',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-foreground/30',
            color.bg,
            value === color.name ? `ring-2 ring-offset-2 ring-foreground/60 scale-110` : 'opacity-60 hover:opacity-90 hover:scale-105'
          )}
        />
      ))}
    </div>
  );
};
