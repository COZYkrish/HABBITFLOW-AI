/**
 * Scene 3 — THE ANATOMY OF A PERFECT SYSTEM
 * Kinetic Typography: Sticky overlapping feature cards with hard hover inversion.
 * Uses the brutalist grid approach with sharp corners and 2px borders.
 */
import { motion } from 'framer-motion';

const FEATURES = [
  {
    id: '01',
    title: 'INTELLIGENT TRACKING',
    desc: 'Log every habit in under a second. HabitFlow learns your rhythm and sends reminders exactly when your focus is sharpest.',
    tags: ['AUTO-LOG', 'SMART REMINDERS', 'STREAK GUARD'],
    stat: '< 1s',
    statLabel: 'to log',
  },
  {
    id: '02',
    title: 'COMPOUND ANALYTICS',
    desc: 'Bar charts. Heatmaps. Trend lines. See your compound growth over days, weeks, and months — not just a streak counter.',
    tags: ['HEATMAP', 'TREND LINES', 'WEEKLY REPORT'],
    stat: '365',
    statLabel: 'days tracked',
  },
  {
    id: '03',
    title: 'AI-POWERED INSIGHTS',
    desc: 'HabitFlow Intelligence surfaces your peak performance windows, at-risk habits, and momentum patterns before you even notice them.',
    tags: ['PEAK WINDOWS', 'AT-RISK ALERTS', 'AI PATTERNS'],
    stat: '31%',
    statLabel: 'avg improvement',
  },
  {
    id: '04',
    title: 'STREAK PROTECTION',
    desc: 'One missed day doesn\'t end your journey. Emergency streak freezes, habit skips, and recovery plans keep your momentum alive.',
    tags: ['STREAK FREEZE', 'RECOVERY PLAN', 'ACCOUNTABILITY'],
    stat: '0',
    statLabel: 'excuses needed',
  },
];

export default function ProductScene() {
  return (
    <section
      id="product"
      className="bg-kinetic-background text-kinetic-foreground relative z-20"
      aria-labelledby="product-headline"
    >
      <div className="max-w-[95vw] mx-auto px-4 md:px-8 py-32">
        {/* Section eyebrow */}
        <p className="font-kinetic text-sm tracking-[0.3em] uppercase text-kinetic-muted-foreground mb-8">
          Act III — The System
        </p>

        {/* Section headline */}
        <h2
          id="product-headline"
          className="font-kinetic font-bold uppercase leading-[0.85] tracking-tighter mb-24"
          style={{ fontSize: 'clamp(2.5rem, 8vw, 9rem)' }}
        >
          THE ANATOMY
          <br />
          OF A{' '}
          <span className="text-kinetic-accent">PERFECT</span>
          <br />
          SYSTEM.
        </h2>

        {/* Sticky stacking feature cards */}
        <div className="relative">
          {FEATURES.map((feature, index) => (
            <motion.div
              key={feature.id}
              className="sticky mb-12 lg:mb-0 border-2 border-kinetic-border bg-kinetic-background p-8 md:p-16 group hover:bg-kinetic-accent hover:border-kinetic-accent transition-colors duration-300"
              style={{ top: `${96 + index * 16}px` }}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-16">
                {/* ID Column */}
                <div className="lg:col-span-2 flex items-start">
                  <span
                    className="font-kinetic font-bold text-[5rem] md:text-[7rem] leading-none text-kinetic-muted group-hover:text-kinetic-accent-foreground/20 transition-colors duration-300"
                    aria-hidden="true"
                  >
                    {feature.id}
                  </span>
                </div>

                {/* Content Column */}
                <div className="lg:col-span-7 flex flex-col justify-between min-h-[200px]">
                  <div>
                    <h3 className="font-kinetic font-bold text-4xl md:text-6xl uppercase tracking-tighter leading-none mb-6 group-hover:text-kinetic-accent-foreground transition-colors duration-300 group-hover:translate-x-3 transform duration-300">
                      {feature.title}
                    </h3>
                    <p className="font-kinetic text-xl md:text-2xl text-kinetic-muted-foreground max-w-2xl leading-tight group-hover:text-kinetic-accent-foreground/80 transition-colors duration-300">
                      {feature.desc}
                    </p>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-3 mt-10">
                    {feature.tags.map(tag => (
                      <span
                        key={tag}
                        className="font-kinetic text-xs tracking-widest uppercase border border-kinetic-border px-4 py-2 text-kinetic-muted-foreground group-hover:border-kinetic-accent-foreground group-hover:text-kinetic-accent-foreground transition-colors duration-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Stat Column */}
                <div className="lg:col-span-3 flex flex-col items-end justify-center">
                  <p
                    className="font-kinetic font-bold text-[5rem] md:text-[7rem] leading-none tracking-tighter text-kinetic-muted group-hover:text-kinetic-accent-foreground/30 transition-colors duration-300 tabular-nums"
                    aria-label={`${feature.stat} ${feature.statLabel}`}
                  >
                    {feature.stat}
                  </p>
                  <p className="font-kinetic text-sm tracking-widest uppercase text-kinetic-muted-foreground group-hover:text-kinetic-accent-foreground/60 transition-colors duration-300 text-right mt-2">
                    {feature.statLabel}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Scene counter */}
      <div className="border-t-2 border-kinetic-border py-4 px-4 md:px-8 flex justify-between items-center">
        <span className="font-kinetic text-xs tracking-[0.2em] uppercase text-kinetic-muted-foreground">
          The Product
        </span>
        <span className="font-kinetic text-xs tracking-[0.2em] uppercase text-kinetic-muted-foreground">
          Scene 3 / 6
        </span>
      </div>
    </section>
  );
}
