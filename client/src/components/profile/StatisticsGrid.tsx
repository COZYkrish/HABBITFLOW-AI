import { motion } from 'framer-motion';
import { Target, Flame, Trophy, Calendar } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

export const StatisticsGrid = () => {
  const { user } = useAuthStore();
  const stats = user?.statistics;

  const items = [
    {
      label: 'Total Habits',
      value: stats?.totalHabits || 0,
      icon: Target,
      color: 'text-blue-500',
      bg: 'bg-blue-500/10'
    },
    {
      label: 'Current Streak',
      value: `${stats?.currentStreak || 0} days`,
      icon: Flame,
      color: 'text-orange-500',
      bg: 'bg-orange-500/10'
    },
    {
      label: 'Longest Streak',
      value: `${stats?.longestStreak || 0} days`,
      icon: Calendar,
      color: 'text-purple-500',
      bg: 'bg-purple-500/10'
    },
    {
      label: 'Achievements',
      value: stats?.achievementsCount || 0,
      icon: Trophy,
      color: 'text-yellow-500',
      bg: 'bg-yellow-500/10'
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {items.map((item, i) => (
        <motion.div
          key={item.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="glass-card p-5 rounded-2xl border border-border flex flex-col items-center text-center group hover:-translate-y-1 transition-transform"
        >
          <div className={`w-12 h-12 rounded-full ${item.bg} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
            <item.icon className={`w-6 h-6 ${item.color}`} />
          </div>
          <div className="text-2xl font-semibold text-foreground mb-1">
            {item.value}
          </div>
          <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            {item.label}
          </div>
        </motion.div>
      ))}
    </div>
  );
};
