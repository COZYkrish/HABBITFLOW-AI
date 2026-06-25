/**
 * Scene 3 — Product Showcase
 * Floating glass dashboard mock built entirely from components (no screenshots).
 */
import { motion } from 'framer-motion';
import { CheckCircle2, Flame, Calendar, TrendingUp, Target, BarChart2 } from 'lucide-react';
import { useMouseParallax } from '../../hooks/useMouseParallax';
import {
  staggerContainerVariants,
  staggerItemVariants,
  floatAnimation,
  cardHoverVariants,
  viewportOnce,
} from '../../animations/variants';

const HABITS = [
  { name: 'Morning Meditation', streak: 21, done: true,  progress: 87 },
  { name: 'Daily Reading',      streak: 14, done: true,  progress: 62 },
  { name: 'Evening Run',        streak: 7,  done: false, progress: 45 },
  { name: 'Cold Shower',        streak: 30, done: true,  progress: 100 },
];

function ProgressRing({ value, size = 48 }: { value: number; size?: number }) {
  const r = (size - 6) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (value / 100) * circ;

  return (
    <svg width={size} height={size} className="-rotate-90" aria-hidden="true">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="currentColor" strokeWidth={3} className="text-border" />
      <motion.circle
        cx={size / 2} cy={size / 2} r={r}
        fill="none" stroke="currentColor" strokeWidth={3}
        strokeDasharray={circ}
        className="text-foreground/60"
        initial={{ strokeDashoffset: circ }}
        whileInView={{ strokeDashoffset: offset }}
        viewport={viewportOnce}
        transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] as [number, number, number, number], delay: 0.3 }}
        strokeLinecap="round"
      />
    </svg>
  );
}

function HabitCard({ habit }: { habit: typeof HABITS[0] }) {
  return (
    <motion.div
      variants={cardHoverVariants}
      initial="rest"
      whileHover="hover"
      className="glass-card rounded-xl p-4 flex items-center gap-4 cursor-default"
    >
      <div className="relative">
        <ProgressRing value={habit.progress} size={44} />
        <div className="absolute inset-0 flex items-center justify-center">
          {habit.done
            ? <CheckCircle2 size={14} className="text-foreground/70" />
            : <Target size={12} className="text-muted-foreground" />
          }
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{habit.name}</p>
        <div className="flex items-center gap-1 mt-0.5">
          <Flame size={10} className="text-muted-foreground" />
          <span className="text-xs text-muted-foreground">{habit.streak} day streak</span>
        </div>
      </div>

      <div
        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0
          ${habit.done ? 'border-foreground/40 bg-foreground/10' : 'border-border'}`}
        aria-label={habit.done ? 'Completed' : 'Not completed'}
        role="img"
      >
        {habit.done && <div className="w-2 h-2 rounded-full bg-foreground/60" />}
      </div>
    </motion.div>
  );
}

function WeekCalendar() {
  const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  const completions = [true, true, true, true, false, true, false];

  return (
    <div className="glass-card rounded-xl p-4" aria-label="Weekly habit calendar">
      <div className="flex items-center gap-2 mb-3">
        <Calendar size={13} className="text-muted-foreground" />
        <span className="text-xs text-muted-foreground font-medium">This Week</span>
      </div>
      <div className="grid grid-cols-7 gap-1">
        {days.map((d, i) => (
          <div key={i} className="flex flex-col items-center gap-1">
            <span className="text-[9px] text-muted-foreground">{d}</span>
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={viewportOnce}
              transition={{ delay: i * 0.07, duration: 0.4, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
              className={`w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-medium
                ${completions[i]
                  ? 'bg-foreground/90 text-background'
                  : 'bg-border/50 text-muted-foreground'}`}
              aria-label={completions[i] ? `${d} completed` : `${d} missed`}
            >
              {completions[i] ? '✓' : ''}
            </motion.div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StatsRow() {
  const stats = [
    { icon: Flame, label: 'Best Streak', value: '30d' },
    { icon: TrendingUp, label: 'Completion', value: '87%' },
    { icon: BarChart2, label: 'Habits', value: '4' },
  ];

  return (
    <div className="grid grid-cols-3 gap-2">
      {stats.map((s) => (
        <motion.div
          key={s.label}
          variants={staggerItemVariants}
          className="glass-card rounded-xl p-3 text-center"
        >
          <s.icon size={14} className="mx-auto text-muted-foreground mb-1" />
          <p className="text-lg font-thin">{s.value}</p>
          <p className="text-[9px] text-muted-foreground uppercase tracking-wide">{s.label}</p>
        </motion.div>
      ))}
    </div>
  );
}

export default function ProductScene() {
  const { normalX, normalY } = useMouseParallax();

  return (
    <section
      id="product"
      className="relative py-32 overflow-hidden"
      aria-labelledby="product-headline"
    >
      {/* Subtle radial */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none" aria-hidden="true">
        <div className="w-[800px] h-[400px] rounded-full bg-gradient-to-br from-foreground/[0.02] to-transparent blur-3xl" />
      </div>

      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <motion.div
          variants={staggerContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="text-center mb-20"
        >
          <motion.p variants={staggerItemVariants} className="text-xs uppercase tracking-widest text-muted-foreground mb-4">
            The product
          </motion.p>
          <motion.h2
            id="product-headline"
            variants={staggerItemVariants}
            className="text-headline font-thin"
          >
            Designed to make
            <br />
            consistency effortless.
          </motion.h2>
        </motion.div>

        {/* Floating product mockup */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
          style={{
            perspective: 1000,
            rotateX: normalY * 4,
            rotateY: normalX * -4,
          }}
          className="relative max-w-sm mx-auto md:max-w-none"
        >
          <motion.div
            animate={floatAnimation}
            className="glass-card rounded-3xl p-6 max-w-sm mx-auto shadow-2xl shadow-black/10 dark:shadow-black/40"
          >
            {/* App header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-xs text-muted-foreground">Good morning</p>
                <p className="text-lg font-medium">Your Habits</p>
              </div>
              <div className="glass-card rounded-full px-3 py-1 flex items-center gap-1.5">
                <Flame size={12} className="text-muted-foreground" />
                <span className="text-xs font-medium">21 day streak</span>
              </div>
            </div>

            {/* Stats */}
            <motion.div
              variants={staggerContainerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
            >
              <StatsRow />
            </motion.div>

            {/* Habit list */}
            <div className="mt-4 flex flex-col gap-2">
              {HABITS.map((h, i) => (
                <motion.div
                  key={h.name}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={viewportOnce}
                  transition={{ delay: i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
                >
                  <HabitCard habit={h} />
                </motion.div>
              ))}
            </div>

            {/* Calendar */}
            <div className="mt-4">
              <WeekCalendar />
            </div>
          </motion.div>

          {/* Floating accent cards */}
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' as const, delay: 1 }}
            className="hidden md:block absolute -right-16 top-12 glass-card rounded-2xl p-4 w-36"
            aria-hidden="true"
          >
            <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Streak</p>
            <p className="text-3xl font-thin mt-1">30 🔥</p>
            <p className="text-[10px] text-muted-foreground mt-1">Days running</p>
          </motion.div>

          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' as const, delay: 0.5 }}
            className="hidden md:block absolute -left-20 bottom-16 glass-card rounded-2xl p-4 w-40"
            aria-hidden="true"
          >
            <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Today</p>
            <p className="text-2xl font-thin mt-1">3 / 4</p>
            <div className="mt-2 h-1 bg-border rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-foreground/50 rounded-full"
                initial={{ width: 0 }}
                whileInView={{ width: '75%' }}
                viewport={viewportOnce}
                transition={{ duration: 1, delay: 0.5 }}
              />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
