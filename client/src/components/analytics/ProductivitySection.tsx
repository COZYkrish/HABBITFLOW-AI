import { useProductivity, useStreaks } from '../../hooks/useAnalytics';
import { ChartCard } from '../charts/ChartCard';
import { Loader2, Zap, Flame } from 'lucide-react';

export const ProductivitySection = () => {
  const { data: prodData, isLoading: prodLoading } = useProductivity();
  const { data: streakData, isLoading: streakLoading } = useStreaks();

  if (prodLoading || streakLoading) {
    return (
      <ChartCard title="Productivity & Streaks">
        <div className="flex justify-center items-center h-32">
          <Loader2 className="w-8 h-8 animate-spin text-zinc-500" />
        </div>
      </ChartCard>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <ChartCard title="Productivity Score" description="Overall efficiency based on completions & time">
        <div className="flex items-center justify-center mt-6">
          <div className="relative flex items-center justify-center w-32 h-32 rounded-full border-8 border-zinc-800">
            {/* Simple representation of a progress ring */}
            <div 
              className="absolute inset-0 rounded-full border-8 border-emerald-500"
              style={{
                clipPath: `polygon(50% 50%, 50% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 0%, ${prodData?.overallProductivity || 0}% 0%)` // Simplified styling
              }}
            />
            <div className="flex flex-col items-center">
              <Zap className="w-6 h-6 text-emerald-500 mb-1" />
              <span className="text-3xl font-bold text-white">{prodData?.overallProductivity || 0}</span>
            </div>
          </div>
        </div>
        <div className="flex justify-between mt-8 text-sm text-zinc-400">
          <div className="text-center">
            <div className="font-semibold text-zinc-200">{prodData?.consistencyScore}%</div>
            <div>Consistency</div>
          </div>
          <div className="text-center">
            <div className="font-semibold text-zinc-200">{prodData?.timeEfficiency}%</div>
            <div>Efficiency</div>
          </div>
        </div>
      </ChartCard>

      <ChartCard title="Streak History" description="Your momentum over time">
        <div className="flex flex-col h-full justify-between mt-6">
          <div className="flex items-center gap-4 bg-zinc-800/50 p-4 rounded-xl border border-zinc-800">
            <div className="p-3 bg-orange-500/20 rounded-lg">
              <Flame className="w-6 h-6 text-orange-500" />
            </div>
            <div>
              <div className="text-sm text-zinc-400">Current Streak</div>
              <div className="text-2xl font-bold text-white">{streakData?.currentStreak || 0} Days</div>
            </div>
          </div>
          
          <div className="flex items-center gap-4 bg-zinc-800/50 p-4 rounded-xl border border-zinc-800 mt-4">
            <div className="p-3 bg-indigo-500/20 rounded-lg">
              <Flame className="w-6 h-6 text-indigo-500" />
            </div>
            <div>
              <div className="text-sm text-zinc-400">Best Streak</div>
              <div className="text-2xl font-bold text-white">{streakData?.bestStreak || 0} Days</div>
            </div>
          </div>
        </div>
      </ChartCard>
    </div>
  );
};
