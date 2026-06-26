import { useWeeklyAnalytics } from '../../hooks/useAnalytics';
import { ChartCard } from '../charts/ChartCard';
import { Loader2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export const WeeklySection = () => {
  const endDate = new Date().toISOString().split('T')[0];
  const start = new Date();
  start.setDate(start.getDate() - 6);
  const startDate = start.toISOString().split('T')[0];

  const { data, isLoading } = useWeeklyAnalytics({ startDate, endDate });

  if (isLoading) {
    return (
      <ChartCard title="Weekly Progress" description="Last 7 days of activity">
        <div className="flex justify-center items-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-zinc-500" />
        </div>
      </ChartCard>
    );
  }

  if (!data) return null;

  return (
    <ChartCard 
      title="Weekly Progress" 
      description={`${data.completionPercentage}% completion rate this week. Trend: ${data.trend}`}
    >
      <div className="h-64 w-full mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data.chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
            <XAxis dataKey="label" stroke="#a1a1aa" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#a1a1aa" fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '8px' }}
              itemStyle={{ color: '#e4e4e7' }}
            />
            <Bar dataKey="completed" fill="#10b981" radius={[4, 4, 0, 0]} name="Completed" />
            <Bar dataKey="missed" fill="#3f3f46" radius={[4, 4, 0, 0]} name="Missed" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
};
