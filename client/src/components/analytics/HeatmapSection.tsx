import { useHeatmap } from '../../hooks/useAnalytics';
import { ChartCard } from '../charts/ChartCard';
import { Loader2 } from 'lucide-react';

export const HeatmapSection = () => {
  const year = new Date().getFullYear();
  const { data, isLoading } = useHeatmap({ year: year.toString() });

  if (isLoading) {
    return (
      <ChartCard title="Activity Heatmap" description="Your daily habit completions">
        <div className="flex justify-center items-center h-40">
          <Loader2 className="w-8 h-8 animate-spin text-zinc-500" />
        </div>
      </ChartCard>
    );
  }

  if (!data) return null;

  // Simple Github-style heatmap grid representation
  // For a real app, this should be organized by weeks. Here we just show a wrapping flex box for demonstration.
  return (
    <ChartCard title="Activity Heatmap" description={`${data.totalCompletions} completions in ${year}`}>
      <div className="flex flex-wrap gap-1 overflow-x-auto pb-2">
        {data.days.map((day, idx) => {
          let bgColor = 'bg-zinc-800';
          if (day.intensity === 1) bgColor = 'bg-emerald-900';
          else if (day.intensity === 2) bgColor = 'bg-emerald-700';
          else if (day.intensity === 3) bgColor = 'bg-emerald-500';
          else if (day.intensity === 4) bgColor = 'bg-emerald-400';

          return (
            <div 
              key={idx} 
              className={`w-3 h-3 rounded-sm ${bgColor}`} 
              title={`${day.date}: ${day.count} completions`}
            />
          );
        })}
      </div>
      <div className="flex items-center justify-end mt-4 gap-2 text-xs text-zinc-400">
        <span>Less</span>
        <div className="flex gap-1">
          <div className="w-3 h-3 rounded-sm bg-zinc-800" />
          <div className="w-3 h-3 rounded-sm bg-emerald-900" />
          <div className="w-3 h-3 rounded-sm bg-emerald-700" />
          <div className="w-3 h-3 rounded-sm bg-emerald-500" />
          <div className="w-3 h-3 rounded-sm bg-emerald-400" />
        </div>
        <span>More</span>
      </div>
    </ChartCard>
  );
};
