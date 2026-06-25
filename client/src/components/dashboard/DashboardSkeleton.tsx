/**
 * DashboardSkeleton — full-page skeleton loader shown while TanStack Query fetches.
 * Matches the real dashboard layout to prevent layout shift.
 */
export const DashboardSkeleton = () => {
  const Bone = ({ className }: { className?: string }) => (
    <div
      className={`animate-pulse rounded-xl bg-foreground/[0.05] ${className ?? ''}`}
      aria-hidden="true"
    />
  );

  return (
    <div className="space-y-6 p-6" aria-label="Loading dashboard" aria-busy="true">
      {/* Welcome card skeleton */}
      <Bone className="h-[220px] rounded-3xl" />

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Bone className="h-32" />
        <Bone className="h-32" />
        <Bone className="h-32" />
        <Bone className="h-32" />
      </div>

      {/* Habits + progress */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <Bone className="h-8 w-40" />
          <Bone className="h-64" />
        </div>
        <div className="space-y-4">
          <Bone className="h-8 w-32" />
          <Bone className="h-64" />
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Bone className="h-48" />
        <Bone className="h-48" />
      </div>
    </div>
  );
};
