/**
 * Scene 2 — Why Habits Matter
 * Scroll-driven timeline with compound growth visualisation.
 */
import { useRef } from 'react';
import { motion } from 'framer-motion';

import {
  staggerContainerVariants,
  staggerItemVariants,
  fadeUpVariants,
  viewportOnce,
} from '../../animations/variants';

const MILESTONES = [
  {
    day: '1',
    label: 'Day One',
    description: 'A single decision. Small, deliberate, intentional.',
    stat: '1',
    statLabel: 'habit begun',
    progress: 5,
  },
  {
    day: '7',
    label: 'First Week',
    description: 'The pattern becomes familiar. Resistance softens.',
    stat: '7×',
    statLabel: 'compound effect',
    progress: 28,
  },
  {
    day: '30',
    label: 'First Month',
    description: 'What felt forced becomes second nature.',
    stat: '31%',
    statLabel: 'improvement average',
    progress: 62,
  },
  {
    day: '365',
    label: 'One Year',
    description: 'You are no longer the same person who started.',
    stat: '10×',
    statLabel: 'life transformation',
    progress: 100,
  },
];



function MilestoneCard({
  milestone,
  index,
}: {
  milestone: (typeof MILESTONES)[0];
  index: number;
}) {
  const isRight = index % 2 !== 0;

  return (
    <motion.div
      variants={staggerItemVariants}
      className={`relative flex items-start gap-8 ${isRight ? 'flex-row-reverse' : ''}`}
    >
      {/* Timeline dot */}
      <div className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center" aria-hidden="true">
        <motion.div
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={viewportOnce}
          transition={{ duration: 0.5, delay: index * 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="w-10 h-10 rounded-full border-2 border-foreground/20 bg-background flex items-center justify-center z-10"
        >
          <div className="w-3 h-3 rounded-full bg-foreground/60" />
        </motion.div>
      </div>

      {/* Content card */}
      <motion.div
        whileHover={{ y: -4, transition: { duration: 0.3 } }}
        className={`w-full md:w-5/12 glass-card rounded-2xl p-6 ${isRight ? 'md:ml-auto' : ''}`}
      >
        <div className="flex items-center gap-3 mb-3">
          <span className="text-4xl font-thin tabular-nums text-foreground/30">
            {milestone.day}
          </span>
          <div>
            <p className="text-xs uppercase tracking-widest text-muted-foreground font-medium">
              {milestone.label}
            </p>
          </div>
        </div>

        <p className="text-sm text-muted-foreground leading-relaxed mb-4">
          {milestone.description}
        </p>

        {/* Mini progress bar */}
        <div className="h-1 rounded-full bg-border overflow-hidden" aria-hidden="true">
          <motion.div
            className="h-full rounded-full bg-foreground/40"
            initial={{ width: 0 }}
            whileInView={{ width: `${milestone.progress}%` }}
            viewport={viewportOnce}
            transition={{ duration: 1.2, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>

        <p className="mt-3 text-2xl font-thin text-foreground">
          {milestone.stat}
          <span className="ml-2 text-xs text-muted-foreground font-normal">{milestone.statLabel}</span>
        </p>
      </motion.div>
    </motion.div>
  );
}

export default function WhyHabitsScene() {
  const ref = useRef<HTMLElement>(null);

  return (
    <section
      id="why-habits"
      ref={ref}
      className="relative py-32 overflow-hidden"
      aria-labelledby="why-habits-headline"
    >
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <motion.div
          variants={staggerContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="text-center mb-24"
        >
          <motion.p variants={staggerItemVariants} className="text-xs uppercase tracking-widest text-muted-foreground mb-4">
            The science of consistency
          </motion.p>
          <motion.h2
            id="why-habits-headline"
            variants={staggerItemVariants}
            className="text-headline font-thin text-foreground mb-6"
          >
            Why habits matter
          </motion.h2>
          <motion.p variants={staggerItemVariants} className="text-muted-foreground max-w-md mx-auto leading-relaxed">
            Compound growth is invisible until it's undeniable.
          </motion.p>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-border hidden md:block" aria-hidden="true">
            <motion.div
              className="h-full w-full bg-gradient-to-b from-transparent via-foreground/20 to-transparent origin-top"
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={viewportOnce}
              transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>

          <motion.div
            variants={staggerContainerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            className="flex flex-col gap-12"
          >
            {MILESTONES.map((m, i) => (
              <MilestoneCard key={m.day} milestone={m} index={i} />
            ))}
          </motion.div>
        </div>

        {/* Quote */}
        <motion.blockquote
          variants={fadeUpVariants}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="mt-28 text-center border-l-0"
        >
          <p className="text-2xl sm:text-3xl font-thin text-foreground/80 leading-relaxed italic">
            "You don't rise to your goals.
            <br />
            You fall to your systems."
          </p>
          <footer className="mt-4 text-sm text-muted-foreground">— James Clear, Atomic Habits</footer>
        </motion.blockquote>
      </div>
    </section>
  );
}
