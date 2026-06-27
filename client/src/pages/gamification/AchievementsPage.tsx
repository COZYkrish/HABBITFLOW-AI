import { useState } from 'react';
import { motion } from 'framer-motion';
import { fadeUpVariants, staggerContainerVariants, staggerItemVariants } from '../../animations/variants';
import { AchievementCard } from '../../components/gamification/AchievementCard';
import { LevelCard } from '../../components/gamification/LevelCard';
import { Loader2 } from 'lucide-react';
import Hyperspeed from '../../components/ui/Hyperspeed';
// import { api } from '../../api/client'; // Assuming an api client exists

// Dummy data for initial UI build
const DUMMY_ACHIEVEMENTS = [
  { id: '1', title: 'The Journey Begins', description: 'Complete your first habit.', icon: '🌱', tier: 'bronze' as const, xpReward: 50, currentProgress: 1, targetProgress: 1, percentageComplete: 100, unlocked: true },
  { id: '2', title: 'Momentum', description: 'Maintain a 7-day streak.', icon: '🔥', tier: 'silver' as const, xpReward: 150, currentProgress: 7, targetProgress: 7, percentageComplete: 100, unlocked: true },
  { id: '3', title: 'Unstoppable', description: 'Maintain a 30-day streak.', icon: '⚡', tier: 'gold' as const, xpReward: 500, currentProgress: 12, targetProgress: 30, percentageComplete: 40, unlocked: false },
  { id: '4', title: 'Century', description: 'Maintain a 100-day streak.', icon: '💯', tier: 'platinum' as const, xpReward: 2000, currentProgress: 12, targetProgress: 100, percentageComplete: 12, unlocked: false },
  { id: '5', title: 'Flawless Execution', description: 'Perfect week of scheduled habits.', icon: '🎯', tier: 'gold' as const, xpReward: 400, currentProgress: 3, targetProgress: 7, percentageComplete: 42, unlocked: false },
];

export default function AchievementsPage() {
  const [filter, setFilter] = useState<'all' | 'unlocked' | 'locked'>('all');
  const [loading] = useState(false); // will be true when fetching real data

  const filtered = DUMMY_ACHIEVEMENTS.filter((a) => {
    if (filter === 'unlocked') return a.unlocked;
    if (filter === 'locked') return !a.unlocked;
    return true;
  });

  return (
    <>
      <div className="fixed inset-0 z-[-1]">
        <Hyperspeed />
      </div>
    <motion.div
      variants={fadeUpVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
      className="max-w-6xl mx-auto space-y-10"
    >
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-light text-foreground tracking-tight mb-2 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">Gamification</h1>
          <p className="text-white/90 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">Your progression, achievements, and milestones.</p>
        </div>
      </header>

      {/* Hero Section: Level & XP */}
      <section>
        <LevelCard currentLevel={3} currentXP={850} xpRequired={1400} />
      </section>

      {/* Filters & Gallery */}
      <section className="space-y-6">
        <div className="flex items-center gap-4 border-b border-border/50 pb-4">
          <button 
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${filter === 'all' ? 'bg-foreground text-background' : 'text-muted-foreground hover:bg-foreground/[0.04]'}`}
          >
            All Achievements
          </button>
          <button 
            onClick={() => setFilter('unlocked')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${filter === 'unlocked' ? 'bg-foreground text-background' : 'text-muted-foreground hover:bg-foreground/[0.04]'}`}
          >
            Unlocked
          </button>
          <button 
            onClick={() => setFilter('locked')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${filter === 'locked' ? 'bg-foreground text-background' : 'text-muted-foreground hover:bg-foreground/[0.04]'}`}
          >
            Locked
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-zinc-500" />
          </div>
        ) : (
          <motion.div
            variants={staggerContainerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {filtered.map((achievement) => (
              <motion.div key={achievement.id} variants={staggerItemVariants}>
                <AchievementCard achievement={achievement} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </section>
    </motion.div>
    </>
  );
}
