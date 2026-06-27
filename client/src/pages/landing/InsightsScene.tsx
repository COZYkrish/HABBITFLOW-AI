/**
 * Scene 5 — INSIGHTS FROM THE VOID
 * Kinetic Typography: Slow marquee of AI insights, hover-reveal details,
 * brutal text hierarchy, acid yellow highlights.
 */
import { motion } from 'framer-motion';
import MarqueeLib from 'react-fast-marquee';
const Marquee = (MarqueeLib as unknown as { default: typeof MarqueeLib }).default ?? MarqueeLib;

const INSIGHT_CARDS = [
  {
    id: '01',
    category: 'PEAK PERFORMANCE',
    headline: 'YOUR BEST HOUR IS 6–8 PM.',
    sub: 'You complete habits 31% more often in the early evening. Schedule the hard ones there.',
  },
  {
    id: '02',
    category: 'CHAIN ANALYSIS',
    headline: 'WEDNESDAY IS YOUR ANCHOR.',
    sub: '94% completion every Wednesday for 12 weeks. This day anchors your entire week.',
  },
  {
    id: '03',
    category: 'POSITIVE TREND',
    headline: 'READING UP 18% THIS MONTH.',
    sub: 'Your consistency in reading improved faster than any other habit. Momentum is building.',
  },
  {
    id: '04',
    category: 'STREAK AT RISK',
    headline: 'EVENING RUN: ACT NOW.',
    sub: 'Skipped twice this week. Your streak dies tonight unless you act in the next 4 hours.',
  },
  {
    id: '05',
    category: 'HABIT ANCHOR',
    headline: 'COLD SHOWER = IMMUNE.',
    sub: '100% completion for 30 consecutive days. This habit is now fully automated in your brain.',
  },
  {
    id: '06',
    category: 'MOMENTUM',
    headline: 'BEST WEEK ON RECORD.',
    sub: '92% overall completion. You outperformed your monthly average by 17 percentage points.',
  },
];

const INSIGHT_MARQUEE = [
  '⬡ PEAK PERFORMANCE DETECTED',
  '★ STREAK MILESTONE UNLOCKED',
  '◈ NEW PATTERN IDENTIFIED',
  '◎ MOMENTUM ACCELERATING',
  '▤ HABIT ANCHOR CONFIRMED',
];

export default function InsightsScene() {
  return (
    <section
      id="insights"
      className="bg-kinetic-background text-kinetic-foreground relative z-10"
      aria-labelledby="insights-headline"
    >
      <div className="max-w-[95vw] mx-auto px-4 md:px-8 pt-32 pb-0">
        {/* Section eyebrow */}
        <p className="font-kinetic text-sm tracking-[0.3em] uppercase text-kinetic-muted-foreground mb-8">
          Act V — The Intelligence
        </p>

        {/* Section headline */}
        <h2
          id="insights-headline"
          className="font-kinetic font-bold uppercase leading-[0.85] tracking-tighter mb-12"
          style={{ fontSize: 'clamp(2.5rem, 8vw, 9rem)' }}
        >
          INSIGHTS
          <br />
          FROM
          <br />
          <span className="text-kinetic-accent">THE VOID.</span>
        </h2>

        <p className="font-kinetic text-xl md:text-2xl text-kinetic-muted-foreground max-w-2xl leading-tight mb-24">
          HabitFlow Intelligence doesn't just track your habits — it reads between them.
          It sees the patterns you can't, and whispers them to you before it's too late.
        </p>
      </div>

      {/* Slow insight marquee */}
      <div
        className="w-full border-t-2 border-b-2 border-kinetic-border py-6 mb-0 overflow-hidden"
        aria-hidden="true"
      >
        <Marquee speed={35} gradient={false} autoFill>
          {INSIGHT_MARQUEE.map((s, i) => (
            <span
              key={i}
              className="font-kinetic font-bold text-xl md:text-3xl tracking-tighter uppercase text-kinetic-accent mx-12"
            >
              {s}
            </span>
          ))}
        </Marquee>
      </div>

      {/* Insight cards — full-width hairline grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-kinetic-border">
        {INSIGHT_CARDS.map((card, index) => (
          <motion.div
            key={card.id}
            className="bg-kinetic-background p-8 md:p-12 group hover:bg-kinetic-accent transition-colors duration-300 min-h-[280px] flex flex-col justify-between"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Category badge */}
            <div>
              <span className="font-kinetic text-xs tracking-[0.25em] uppercase text-kinetic-accent group-hover:text-kinetic-accent-foreground/60 transition-colors duration-300 block mb-6">
                {card.category}
              </span>
              <h3 className="font-kinetic font-bold text-2xl md:text-3xl uppercase tracking-tighter leading-none mb-4 group-hover:text-kinetic-accent-foreground transition-colors duration-300">
                {card.headline}
              </h3>
              <p className="font-kinetic text-base text-kinetic-muted-foreground leading-tight group-hover:text-kinetic-accent-foreground/80 transition-colors duration-300">
                {card.sub}
              </p>
            </div>

            {/* Decorative ID */}
            <span
              className="font-kinetic font-bold text-[3rem] leading-none text-kinetic-muted group-hover:text-kinetic-accent-foreground/20 transition-colors duration-300 mt-6 block"
              aria-hidden="true"
            >
              {card.id}
            </span>
          </motion.div>
        ))}
      </div>

      {/* Scene counter */}
      <div className="border-t-2 border-kinetic-border py-4 px-4 md:px-8 flex justify-between items-center">
        <span className="font-kinetic text-xs tracking-[0.2em] uppercase text-kinetic-muted-foreground">
          HabitFlow Intelligence
        </span>
        <span className="font-kinetic text-xs tracking-[0.2em] uppercase text-kinetic-muted-foreground">
          Scene 5 / 6
        </span>
      </div>
    </section>
  );
}
