import { useState } from 'react';
import { cn } from '../../../utils/cn';

// Curated set of 40 relevant Lucide icon names
const ICONS = [
  '🏃','💪','📚','💻','🧘','❤️','💤','📈','🎵','🎨',
  '✍️','🍎','💧','🌱','🧠','🌟','🎯','🔥','⚡','🏆',
  '📝','🎶','🌍','🏠','🚴','🧹','🍳','☕','🎮','📷',
  '🎸','🌿','🏊','🛒','📅','⏰','🎤','🏋️','📐','⭕',
];

interface IconPickerProps {
  value: string;
  onChange: (icon: string) => void;
}

export const IconPicker = ({ value, onChange }: IconPickerProps) => {
  const [search, setSearch] = useState('');

  // Emojis don't have text to search, so we filter by index-based labels
  const filtered = search ? ICONS.filter((_, i) => String(i).includes(search)) : ICONS;

  return (
    <div className="space-y-3">
      <input
        type="text"
        placeholder="Search icons..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full px-3 py-2 rounded-lg bg-transparent text-foreground border border-border text-sm
                   placeholder:text-muted-foreground/50 focus:outline-none focus:border-foreground/30"
        aria-label="Search icons"
      />
      <div
        className="grid grid-cols-8 gap-1.5 max-h-48 overflow-y-auto no-scrollbar"
        role="listbox"
        aria-label="Select icon"
      >
        {filtered.map((icon) => (
          <button
            key={icon}
            type="button"
            role="option"
            aria-selected={value === icon}
            onClick={() => onChange(icon)}
            className={cn(
              'w-9 h-9 flex items-center justify-center rounded-lg text-lg transition-colors',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/30',
              value === icon
                ? 'bg-foreground/[0.1] border border-foreground/30'
                : 'hover:bg-foreground/[0.05]'
            )}
          >
            {icon}
          </button>
        ))}
      </div>
    </div>
  );
};
