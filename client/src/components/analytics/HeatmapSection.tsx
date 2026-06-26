import { useHeatmap } from '../../hooks/useAnalytics';
import { ChartCard } from '../charts/ChartCard';
import { Loader2 } from 'lucide-react';
import type { DayActivity } from '../../types/analytics.types';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

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

  // 1. Determine starting day of week
  const firstDate = new Date(`${year}-01-01T00:00:00Z`);
  const firstDayOfWeek = firstDate.getUTCDay();

  // 2. Build weeks array
  const weeks: (DayActivity | null)[][] = [];
  let currentWeek: (DayActivity | null)[] = new Array(firstDayOfWeek).fill(null);

  data.days.forEach(day => {
    currentWeek.push(day);
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  });
  if (currentWeek.length > 0) {
    while (currentWeek.length < 7) {
      currentWeek.push(null);
    }
    weeks.push(currentWeek);
  }

  // 3. Find month boundaries for labels
  const monthLabels: { label: string; weekIndex: number }[] = [];
  let currentMonth = -1;

  weeks.forEach((week, index) => {
    const firstValidDay = week.find(d => d !== null);
    if (firstValidDay) {
      const month = parseInt(firstValidDay.date.split('-')[1], 10) - 1;
      if (month !== currentMonth) {
        monthLabels.push({ label: MONTHS[month], weekIndex: index });
        currentMonth = month;
      }
    }
  });

  return (
    <ChartCard title="Activity Heatmap" description={`${data.totalCompletions} completions in ${year}`}>
      <div className="flex overflow-x-auto pb-4 mt-2 no-scrollbar">
        <div className="flex flex-col min-w-max">
          
          {/* Month Labels */}
          <div className="flex relative h-6 ml-8">
            {monthLabels.map((m, i) => (
              <div 
                key={i} 
                className="absolute text-xs text-zinc-400" 
                style={{ left: `${m.weekIndex * 16}px` }}
              >
                {m.label}
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            {/* Day Labels */}
            <div className="flex flex-col gap-1 text-[10px] text-zinc-400 mt-[2px] mr-1">
              <div className="h-3 leading-3"></div>
              <div className="h-3 leading-3">Mon</div>
              <div className="h-3 leading-3"></div>
              <div className="h-3 leading-3">Wed</div>
              <div className="h-3 leading-3"></div>
              <div className="h-3 leading-3">Fri</div>
              <div className="h-3 leading-3"></div>
            </div>

            {/* Heatmap Grid */}
            <div className="flex gap-1">
              {weeks.map((week, wIdx) => (
                <div key={wIdx} className="flex flex-col gap-1">
                  {week.map((day, dIdx) => {
                    if (!day) {
                      return <div key={dIdx} className="w-3 h-3" />;
                    }

                    let bgColor = 'bg-zinc-800';
                    if (day.intensity === 1) bgColor = 'bg-emerald-900';
                    else if (day.intensity === 2) bgColor = 'bg-emerald-700';
                    else if (day.intensity === 3) bgColor = 'bg-emerald-500';
                    else if (day.intensity === 4) bgColor = 'bg-emerald-400';

                    return (
                      <div 
                        key={dIdx} 
                        className={`w-3 h-3 rounded-[2px] ${bgColor} hover:ring-1 hover:ring-zinc-400 transition-all cursor-pointer`}
                        title={`${day.date}: ${day.count} completions`}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end mt-2 gap-2 text-xs text-zinc-400">
        <span>Less</span>
        <div className="flex gap-1">
          <div className="w-3 h-3 rounded-[2px] bg-zinc-800" />
          <div className="w-3 h-3 rounded-[2px] bg-emerald-900" />
          <div className="w-3 h-3 rounded-[2px] bg-emerald-700" />
          <div className="w-3 h-3 rounded-[2px] bg-emerald-500" />
          <div className="w-3 h-3 rounded-[2px] bg-emerald-400" />
        </div>
        <span>More</span>
      </div>
    </ChartCard>
  );
};
