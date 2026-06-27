/**
 * Scene 2 — THE HARSH TRUTH
 * Kinetic Typography: Hard color inversion on hover, brutalist quote reveal,
 * massive stats grid, anti-motivation message.
 */
import { motion } from 'framer-motion';
import MarqueeLib from 'react-fast-marquee';
const Marquee = (MarqueeLib as unknown as { default: typeof MarqueeLib }).default ?? MarqueeLib;

const STATS = [
  { number: '92%', label: 'of people quit within 3 weeks' },
  { number: '21', label: 'days to form a habit (minimum)' },
  { number: '1%', label: 'daily improvement = 37× better in 1 year' },
  { number: '0', label: 'willpower required — only systems' },
];

const TRUTHS = [
  {
    id: '01',
    title: 'MOTIVATION IS A MYTH.',
    body: 'Motivation arrives uninvited and leaves without warning. Relying on it is the #1 reason your habits die on day 4.',
  },
  {
    id: '02',
    title: 'YOUR BRAIN IS FIGHTING YOU.',
    body: "The basal ganglia hardwires habits over weeks. Before that happens, every single day is a battle you'll lose without a system.",
  },
  {
    id: '03',
    title: 'STREAKS ARE EVERYTHING.',
    body: 'The pain of breaking a streak is 4× stronger than the pleasure of maintaining one. That asymmetry is your greatest weapon.',
  },
];

const MARQUEE_STATS = [
  '92% QUIT', '21 DAYS', '1% DAILY', '10× ANNUAL', '37× COMPOUNDED',
];

export default function WhyHabitsScene() {
  return (
    <section
      id="why-habits"
      className="bg-kinetic-background text-kinetic-foreground relative z-10"
      aria-labelledby="truth-headline"
    >
      {/* Stats marquee strip — acid yellow background */}
      <div className="w-full bg-kinetic-accent py-4 overflow-hidden" aria-hidden="true">
        <Marquee speed={80} gradient={false} autoFill>
          {MARQUEE_STATS.map((s, i) => (
            <span
              key={i}
              className="font-kinetic font-bold text-xl md:text-3xl tracking-tighter uppercase text-kinetic-accent-foreground mx-8"
            >
              {s}  ·
            </span>
          ))}
        </Marquee>
      </div>

      <div className="max-w-[95vw] mx-auto px-4 md:px-8 py-32">
        {/* Section eyebrow */}
        <p className="font-kinetic text-sm tracking-[0.3em] uppercase text-kinetic-muted-foreground mb-8">
          Act II — The Harsh Truth
        </p>

        {/* Massive section headline */}
        <h2
          id="truth-headline"
          className="font-kinetic font-bold uppercase leading-[0.85] tracking-tighter mb-24"
          style={{ fontSize: 'clamp(2.5rem, 8vw, 9rem)' }}
        >
          MOTIVATION
          <br />
          <span className="text-kinetic-muted-foreground">IS A</span>
          <br />
          MYTH.
        </h2>

        {/* Truth cards — hard inversion on hover */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-kinetic-border">
          {TRUTHS.map((truth) => (
            <motion.div
              key={truth.id}
              className="bg-kinetic-background p-8 md:p-12 group hover:bg-kinetic-accent transition-colors duration-300 cursor-default"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Decorative number */}
              <span
                className="font-kinetic font-bold text-[5rem] leading-none text-kinetic-muted group-hover:text-kinetic-accent-foreground/20 transition-colors duration-300 block mb-4"
                aria-hidden="true"
              >
                {truth.id}
              </span>
              <h3 className="font-kinetic font-bold text-2xl md:text-3xl uppercase tracking-tighter leading-none mb-6 group-hover:text-kinetic-accent-foreground transition-colors duration-300 group-hover:translate-x-2 transform">
                {truth.title}
              </h3>
              <p className="font-kinetic text-base md:text-lg text-kinetic-muted-foreground leading-tight group-hover:text-kinetic-accent-foreground/80 transition-colors duration-300">
                {truth.body}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Giant stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-kinetic-border mt-px">
          {STATS.map((stat) => (
            <motion.div
              key={stat.number}
              className="bg-kinetic-background p-8 group hover:bg-kinetic-muted transition-colors duration-300"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <p
                className="font-kinetic font-bold text-[4rem] md:text-[6rem] leading-none tracking-tighter text-kinetic-foreground mb-2"
                aria-label={stat.number}
              >
                {stat.number}
              </p>
              <p className="font-kinetic text-sm text-kinetic-muted-foreground uppercase tracking-widest leading-tight">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Closing pull-quote */}
        <motion.blockquote
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mt-32 border-l-4 border-kinetic-accent pl-8 max-w-3xl"
        >
          <p className="font-kinetic font-bold text-3xl md:text-5xl uppercase tracking-tighter leading-[0.9] text-kinetic-foreground">
            "YOU DON'T RISE TO YOUR GOALS.
            <br />
            <span className="text-kinetic-muted-foreground">
              YOU FALL TO YOUR SYSTEMS."
            </span>
          </p>
          <footer className="font-kinetic text-sm tracking-widest uppercase text-kinetic-muted-foreground mt-6">
            — James Clear, Atomic Habits
          </footer>
        </motion.blockquote>
      </div>

      {/* Scene counter */}
      <div className="border-t-2 border-kinetic-border py-4 px-4 md:px-8 flex justify-between items-center">
        <span className="font-kinetic text-xs tracking-[0.2em] uppercase text-kinetic-muted-foreground">
          The Science of Consistency
        </span>
        <span className="font-kinetic text-xs tracking-[0.2em] uppercase text-kinetic-muted-foreground">
          Scene 2 / 6
        </span>
      </div>
    </section>
  );
}
