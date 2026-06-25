import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Label } from '../../ui/Label';
import { Input } from '../../ui/Input';
import { Button } from '../../ui/Button';
import { CategoryPicker } from './CategoryPicker';
import { IconPicker } from './IconPicker';
import { ColorPicker } from './ColorPicker';
import { RepeatSelector } from './RepeatSelector';
import { GoalTypeSelector } from './GoalTypeSelector';
import { useCategories } from '../../../hooks/useCategories';
import type { Habit, CreateHabitData } from '../../../types/habit.types';

const habitFormSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100),
  description: z.string().max(500).optional(),
  category: z.string().min(1),
  icon: z.string().min(1),
  color: z.string().min(1),
  priority: z.enum(['low', 'medium', 'high', 'critical']),
  goalType: z.enum(['boolean', 'duration', 'count']),
  targetValue: z.number().min(1),
  estimatedDuration: z.number().min(1).max(1440),
  repeatSchedule: z.object({
    type: z.string(),
    days: z.array(z.number()),
    dayOfMonth: z.number().optional(),
  }),
  reminder: z.object({
    enabled: z.boolean(),
    time: z.string().optional(),
    timezone: z.string().optional(),
  }),
  notes: z.string().max(2000).optional(),
});

type HabitFormValues = z.infer<typeof habitFormSchema>;

interface HabitFormProps {
  defaultValues?: Partial<Habit>;
  onSubmit: (data: CreateHabitData) => void;
  isLoading?: boolean;
  submitLabel?: string;
}

const PRIORITIES: { value: string; label: string }[] = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'critical', label: 'Critical' },
];

/**
 * HabitForm — full React Hook Form + Zod form for creating and editing habits.
 * Reusable in create modal, edit modal, and any future habit form surface.
 */
export const HabitForm = ({
  defaultValues,
  onSubmit,
  isLoading,
  submitLabel = 'Save Habit',
}: HabitFormProps) => {
  const { data: categories = [] } = useCategories();

  const { control, register, handleSubmit, watch, setValue, formState: { errors } } = useForm<HabitFormValues>({
    resolver: zodResolver(habitFormSchema),
    defaultValues: {
      title: defaultValues?.title ?? '',
      description: defaultValues?.description ?? '',
      category: defaultValues?.category ?? 'General',
      icon: defaultValues?.icon ?? '⭕',
      color: defaultValues?.color ?? 'zinc',
      priority: (defaultValues?.priority as any) ?? 'medium',
      goalType: (defaultValues?.goalType as any) ?? 'boolean',
      targetValue: defaultValues?.targetValue ?? 1,
      estimatedDuration: defaultValues?.estimatedDuration ?? 15,
      repeatSchedule: defaultValues?.repeatSchedule ?? { type: 'daily', days: [] },
      reminder: defaultValues?.reminder ?? { enabled: false },
      notes: defaultValues?.notes ?? '',
    },
  });

  const goalType = watch('goalType');
  const repeatType = watch('repeatSchedule.type');
  const repeatDays = watch('repeatSchedule.days');
  const reminderEnabled = watch('reminder.enabled');

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
      {/* Basic Info */}
      <section className="space-y-4">
        <h3 className="text-xs uppercase tracking-widest text-muted-foreground">Basic Info</h3>

        <div className="space-y-2">
          <Label htmlFor="title">Title *</Label>
          <Input
            id="title"
            placeholder="e.g. Morning Run"
            {...register('title')}
            error={errors.title?.message}
            autoComplete="off"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <textarea
            id="description"
            rows={2}
            placeholder="Optional description..."
            {...register('description')}
            className="w-full px-3 py-2 rounded-xl bg-muted/40 border border-border text-sm
                       placeholder:text-muted-foreground/40 focus:outline-none focus:border-foreground/30
                       resize-none"
          />
        </div>
      </section>

      {/* Icon & Color */}
      <section className="space-y-4">
        <h3 className="text-xs uppercase tracking-widest text-muted-foreground">Appearance</h3>

        <div className="space-y-2">
          <Label>Icon</Label>
          <Controller
            name="icon"
            control={control}
            render={({ field }) => <IconPicker value={field.value} onChange={field.onChange} />}
          />
        </div>

        <div className="space-y-2">
          <Label>Color</Label>
          <Controller
            name="color"
            control={control}
            render={({ field }) => <ColorPicker value={field.value} onChange={field.onChange} />}
          />
        </div>
      </section>

      {/* Category */}
      <section className="space-y-3">
        <h3 className="text-xs uppercase tracking-widest text-muted-foreground">Category</h3>
        <Controller
          name="category"
          control={control}
          render={({ field }) => (
            <CategoryPicker
              categories={categories}
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />
      </section>

      {/* Priority */}
      <section className="space-y-3">
        <h3 className="text-xs uppercase tracking-widest text-muted-foreground">Priority</h3>
        <div className="flex gap-2" role="group" aria-label="Priority">
          {PRIORITIES.map((p) => (
            <Controller
              key={p.value}
              name="priority"
              control={control}
              render={({ field }) => (
                <button
                  type="button"
                  aria-pressed={field.value === p.value}
                  onClick={() => field.onChange(p.value)}
                  className={`flex-1 py-2 rounded-lg text-xs font-medium border transition-colors
                    focus-visible:outline-none focus-visible:ring-2
                    ${field.value === p.value
                      ? 'bg-foreground text-background border-foreground'
                      : 'border-border text-muted-foreground hover:border-foreground/30'
                    }`}
                >
                  {p.label}
                </button>
              )}
            />
          ))}
        </div>
      </section>

      {/* Goal */}
      <section className="space-y-3">
        <h3 className="text-xs uppercase tracking-widest text-muted-foreground">Goal Type</h3>
        <Controller
          name="goalType"
          control={control}
          render={({ field }) => (
            <GoalTypeSelector
              value={field.value}
              targetValue={watch('targetValue')}
              onChange={field.onChange}
              onTargetChange={(v) => setValue('targetValue', v)}
            />
          )}
        />
      </section>

      {/* Schedule */}
      <section className="space-y-3">
        <h3 className="text-xs uppercase tracking-widest text-muted-foreground">Schedule</h3>

        <RepeatSelector
          type={repeatType}
          days={repeatDays}
          onTypeChange={(t) => setValue('repeatSchedule.type', t)}
          onDaysChange={(d) => setValue('repeatSchedule.days', d)}
        />

        <div className="flex items-center gap-3">
          <Label htmlFor="estimatedDuration" className="whitespace-nowrap">Duration (min)</Label>
          <input
            id="estimatedDuration"
            type="number"
            min={1}
            max={1440}
            {...register('estimatedDuration', { valueAsNumber: true })}
            className="w-24 px-3 py-1.5 rounded-lg bg-muted/50 border border-border text-sm
                       focus:outline-none focus:border-foreground/30 tabular-nums"
          />
        </div>
      </section>

      {/* Reminder */}
      <section className="space-y-3">
        <h3 className="text-xs uppercase tracking-widest text-muted-foreground">Reminder</h3>
        <div className="flex items-center gap-3">
          <Controller
            name="reminder.enabled"
            control={control}
            render={({ field }) => (
              <button
                type="button"
                role="switch"
                aria-checked={field.value}
                onClick={() => field.onChange(!field.value)}
                className={`w-10 h-5 rounded-full transition-colors relative
                  ${field.value ? 'bg-foreground' : 'bg-border'}
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/30`}
              >
                <span
                  className={`absolute top-0.5 w-4 h-4 rounded-full bg-background transition-transform
                    ${field.value ? 'translate-x-5' : 'translate-x-0.5'}`}
                />
              </button>
            )}
          />
          <span className="text-sm text-muted-foreground">Enable reminder</span>
        </div>

        {reminderEnabled && (
          <input
            type="time"
            {...register('reminder.time')}
            className="px-3 py-1.5 rounded-lg bg-muted/50 border border-border text-sm
                       focus:outline-none focus:border-foreground/30"
            aria-label="Reminder time"
          />
        )}
      </section>

      {/* Notes */}
      <section className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <textarea
          id="notes"
          rows={3}
          maxLength={2000}
          placeholder="Any notes about this habit..."
          {...register('notes')}
          className="w-full px-3 py-2 rounded-xl bg-muted/40 border border-border text-sm
                     placeholder:text-muted-foreground/40 focus:outline-none focus:border-foreground/30
                     resize-none"
        />
      </section>

      {/* Submit */}
      <Button type="submit" className="w-full h-11 rounded-xl" disabled={isLoading}>
        {isLoading ? 'Saving...' : submitLabel}
      </Button>
    </form>
  );
};
