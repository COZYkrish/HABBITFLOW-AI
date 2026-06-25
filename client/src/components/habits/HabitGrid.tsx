import { motion } from 'framer-motion';
import { staggerContainerVariants, staggerItemVariants } from '../../animations/variants';
import { HabitCard } from './HabitCard';
import type { Habit } from '../../types/habit.types';

interface HabitGridProps {
  habits: Habit[];
}

export const HabitGrid = ({ habits }: HabitGridProps) => (
  <motion.div
    variants={staggerContainerVariants}
    initial="hidden"
    animate="visible"
    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
    role="list"
    aria-label="Habits"
  >
    {habits.map((habit) => (
      <motion.div key={habit.id} variants={staggerItemVariants} role="listitem">
        <HabitCard habit={habit} />
      </motion.div>
    ))}
  </motion.div>
);
