import { motion } from 'framer-motion';
import { useHabits } from '../../hooks/useHabits';
import { useHabitStore } from '../../store/habitStore';
import { HabitGrid } from '../../components/habits/HabitGrid';
import { HabitList } from '../../components/habits/HabitList';
import { HabitFilters } from '../../components/habits/HabitFilters';
import { EmptyHabitsState } from '../../components/habits/EmptyHabitsState';
import { Button } from '../../components/ui/Button';
import { fadeUpVariants } from '../../animations/variants';

const SkeletonCard = () => (
  <div className="glass-card rounded-2xl p-5 space-y-4 animate-pulse">
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-xl bg-foreground/[0.05]" />
      <div className="space-y-2 flex-1">
        <div className="h-3 bg-foreground/[0.05] rounded w-3/4" />
        <div className="h-2.5 bg-foreground/[0.04] rounded w-1/2" />
      </div>
    </div>
    <div className="flex gap-2">
      <div className="h-2 bg-foreground/[0.04] rounded w-12" />
      <div className="h-2 bg-foreground/[0.04] rounded w-10" />
    </div>
    <div className="h-5 bg-foreground/[0.04] rounded-full w-16" />
  </div>
);

const LoadingGrid = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
    {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
  </div>
);

/**
 * HabitsPage — full habit management interface.
 * Composed from reusable habit components.
 */
export default function HabitsPage() {
  const { filters, viewMode, openCreateModal } = useHabitStore();
  const { data, isLoading, error } = useHabits(filters);

  const habits = data?.habits ?? [];
  const total = data?.total ?? 0;
  const hasFilters = Boolean(filters.search || filters.status || filters.category || filters.priority);

  return (
    <motion.div
      variants={fadeUpVariants}
      initial="hidden"
      animate="visible"
      className="p-5 md:p-7 space-y-6 max-w-[1200px] mx-auto"
    >
      {/* Page header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-thin">Habits</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {isLoading ? '...' : `${total} habit${total !== 1 ? 's' : ''}`}
          </p>
        </div>
        <Button
          onClick={openCreateModal}
          className="h-9 px-5 rounded-xl text-sm flex-shrink-0"
          id="create-habit-btn"
        >
          + New Habit
        </Button>
      </div>

      {/* Filters */}
      <HabitFilters />

      {/* Content */}
      {isLoading ? (
        <LoadingGrid />
      ) : error ? (
        <div className="flex flex-col items-center py-16 text-center">
          <span className="text-3xl mb-4" aria-hidden="true">◌</span>
          <p className="text-sm text-muted-foreground">Failed to load habits. Please refresh.</p>
        </div>
      ) : habits.length === 0 ? (
        hasFilters ? (
          <div className="flex flex-col items-center py-16 text-center">
            <span className="text-3xl mb-4" aria-hidden="true">○</span>
            <p className="text-sm text-foreground font-medium">No habits match your filters</p>
            <p className="text-xs text-muted-foreground mt-1">Try adjusting your search or filters</p>
          </div>
        ) : (
          <EmptyHabitsState />
        )
      ) : viewMode === 'grid' ? (
        <HabitGrid habits={habits} />
      ) : (
        <HabitList habits={habits} />
      )}

      {/* Pagination */}
      {!isLoading && data && data.total > data.limit && (
        <div className="flex justify-center gap-2 pt-4">
          {Array.from({ length: Math.ceil(data.total / data.limit) }).map((_, i) => (
            <button
              key={i}
              type="button"
              aria-current={data.page === i + 1 ? 'page' : undefined}
              onClick={() => useHabitStore.getState().setFilter('page', i + 1)}
              className={`w-8 h-8 rounded-lg text-xs transition-colors
                ${data.page === i + 1
                  ? 'bg-foreground text-background'
                  : 'text-muted-foreground hover:bg-foreground/[0.06]'
                }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}

    </motion.div>
  );
}
