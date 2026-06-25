import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useHabitStore } from '../../store/habitStore';
import { usePauseHabit, useResumeHabit, useDuplicateHabit } from '../../hooks/useHabits';
import type { Habit } from '../../types/habit.types';

interface HabitActionsDropdownProps {
  habit: Habit;
}

/**
 * HabitActionsDropdown — context menu for habit actions.
 * Keyboard accessible, closes on outside click or Escape.
 */
export const HabitActionsDropdown = ({ habit }: HabitActionsDropdownProps) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { openEditModal, openDeleteDialog, openArchiveDialog } = useHabitStore();
  const { mutate: pause } = usePauseHabit();
  const { mutate: resume } = useResumeHabit();
  const { mutate: duplicate } = useDuplicateHabit();

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  const actions = [
    {
      label: 'Edit',
      icon: '✎',
      action: () => { openEditModal(habit.id); setOpen(false); },
    },
    {
      label: 'Duplicate',
      icon: '⧉',
      action: () => { duplicate(habit.id); setOpen(false); },
    },
    habit.isPaused
      ? { label: 'Resume', icon: '▶', action: () => { resume(habit.id); setOpen(false); } }
      : { label: 'Pause', icon: '⏸', action: () => { pause(habit.id); setOpen(false); } },
    {
      label: habit.isArchived ? 'Restore' : 'Archive',
      icon: '◫',
      action: () => { openArchiveDialog(habit.id); setOpen(false); },
    },
    {
      label: 'Delete',
      icon: '✕',
      danger: true,
      action: () => { openDeleteDialog(habit.id); setOpen(false); },
    },
  ];

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); setOpen((p) => !p); }}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Habit actions"
        className="w-7 h-7 flex items-center justify-center rounded-lg
                   text-muted-foreground hover:text-foreground hover:bg-foreground/[0.06]
                   transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/30"
      >
        <span className="text-sm tracking-widest leading-none">···</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            role="menu"
            initial={{ opacity: 0, scale: 0.95, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -4 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-9 z-50 w-44 glass-card rounded-xl py-1
                       shadow-lg border border-border/60 overflow-hidden"
          >
            {actions.map((action) => (
              <li key={action.label} role="none">
                <button
                  type="button"
                  role="menuitem"
                  onClick={action.action}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm transition-colors
                    focus-visible:outline-none focus-visible:bg-foreground/[0.06]
                    ${action.danger
                      ? 'text-red-500 hover:bg-red-500/10'
                      : 'text-foreground hover:bg-foreground/[0.04]'
                    }`}
                >
                  <span className="text-xs w-4 text-center" aria-hidden="true">{action.icon}</span>
                  {action.label}
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
};
