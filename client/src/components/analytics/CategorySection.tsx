import { useCategoryAnalytics } from '../../hooks/useAnalytics';
import { ChartCard } from '../charts/ChartCard';
import { Loader2 } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export const CategorySection = () => {
  const { data, isLoading } = useCategoryAnalytics();

  if (isLoading) {
    return (
      <ChartCard title="Category Distribution">
        <div className="flex justify-center items-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-zinc-500" />
        </div>
      </ChartCard>
    );
  }

  if (!data || data.categories.length === 0) return null;

  return (
    <ChartCard title="Category Distribution" description="Completions by category">
      <div className="h-64 w-full mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data.categories}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="completionPercentage"
              nameKey="category"
            >
              {data.categories.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '8px' }}
              itemStyle={{ color: '#e4e4e7' }}
              formatter={(value: any) => [`${value}%`, 'Completions']}
            />
            <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: '12px', color: '#a1a1aa' }}/>
          </PieChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
};
