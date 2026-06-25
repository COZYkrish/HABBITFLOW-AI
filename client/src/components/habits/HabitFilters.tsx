import { useHabitStore } from '../../store/habitStore';
import { Button } from '../ui/Button';
import { cn } from '../../utils/cn';

const STATUSES = [
  { value: '', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'paused', label: 'Paused' },
  { value: 'archived', label: 'Archived' },
];

const SORT_OPTIONS = [
  { value: 'createdAt', label: 'Newest' },
  { value: 'updatedAt', label: 'Recently Updated' },
  { value: 'title', label: 'Alphabetical' },
  { value: 'priority', label: 'Priority' },
];

const GridIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
    <rect x="1" y="1" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.5" />
    <rect x="8" y="1" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.5" />
    <rect x="1" y="8" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.5" />
    <rect x="8" y="8" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);

const ListIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
    <line x1="1" y1="3" x2="13" y2="3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="1" y1="7" x2="13" y2="7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="1" y1="11" x2="13" y2="11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

/**
 * HabitFilters — toolbar with search, status/category filters, sort, and view mode toggle.
 */
export const HabitFilters = () => {
  const { filters, viewMode, setFilter, clearFilters, setViewMode } = useHabitStore();

  return (
    <div className="space-y-3">
      {/* Row 1: search + view toggle */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <input
            type="search"
            placeholder="Search habits..."
            value={filters.search ?? ''}
            onChange={(e) => setFilter('search', e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-foreground/[0.03] border border-border
                       text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:border-foreground/30"
            aria-label="Search habits"
          />
          <span
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/50"
            aria-hidden="true"
          >
            ⌕
          </span>
        </div>

        {/* View mode toggle */}
        <div className="flex rounded-xl border border-border overflow-hidden" role="group" aria-label="View mode">
          <button
            type="button"
            onClick={() => setViewMode('grid')}
            aria-pressed={viewMode === 'grid'}
            aria-label="Grid view"
            className={cn(
              'px-3 py-2 transition-colors',
              viewMode === 'grid' ? 'bg-foreground/[0.08] text-foreground' : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <GridIcon />
          </button>
          <button
            type="button"
            onClick={() => setViewMode('list')}
            aria-pressed={viewMode === 'list'}
            aria-label="List view"
            className={cn(
              'px-3 py-2 border-l border-border transition-colors',
              viewMode === 'list' ? 'bg-foreground/[0.08] text-foreground' : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <ListIcon />
          </button>
        </div>
      </div>

      {/* Row 2: status filters */}
      <div className="flex flex-wrap items-center gap-2">
        {STATUSES.map((s) => (
          <button
            key={s.value}
            type="button"
            onClick={() => setFilter('status', s.value || undefined)}
            aria-pressed={filters.status === (s.value || undefined)}
            className={cn(
              'px-3 py-1 rounded-full text-xs font-medium border transition-colors',
              'focus-visible:outline-none focus-visible:ring-2',
              filters.status === (s.value || undefined)
                ? 'bg-foreground text-background border-foreground'
                : 'border-border text-muted-foreground hover:border-foreground/30 hover:text-foreground'
            )}
          >
            {s.label}
          </button>
        ))}

        <div className="ml-auto flex items-center gap-2">
          {/* Sort */}
          <select
            value={filters.sortBy ?? 'createdAt'}
            onChange={(e) => setFilter('sortBy', e.target.value)}
            aria-label="Sort by"
            className="text-xs bg-transparent border border-border rounded-lg px-2 py-1.5
                       text-muted-foreground focus:outline-none focus:border-foreground/30 cursor-pointer"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>

          {/* Clear filters */}
          {(filters.search || filters.status || filters.priority || filters.category) && (
            <Button variant="ghost" size="sm" onClick={clearFilters} className="text-xs">
              Clear
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
