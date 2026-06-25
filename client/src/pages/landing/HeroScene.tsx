/**
 * Scene 1 — The Problem (Hero)
 * Emotional opener with parallax, particle field, broken-streak visualisation.
 */
import { useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowDown } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { useMouseParallax } from '../../hooks/useMouseParallax';
import {
  staggerContainerVariants,
  staggerItemVariants,
  floatAnimation,
  pulseGlowAnimation,
} from '../../animations/variants';

const CALENDAR_FRAGMENTS = [
  { day: 'Mon', done: true,  rotate: -8,  x: -180, y: -60 },
  { day: 'Tue', done: true,  rotate: 4,   x: -90,  y: -100 },
  { day: 'Wed', done: true,  rotate: -3,  x: 0,    y: -120 },
  { day: 'Thu', done: false, rotate: 12,  x: 90,   y: -90 },
  { day: 'Fri', done: false, rotate: -10, x: 175,  y: -55 },
];

const PARTICLES = Array.from({ length: 24 }, (_, i) => ({
  id: i,
  x: `${(i * 37 + 11) % 100}%`,
  y: `${(i * 53 + 7) % 100}%`,
  size: i % 3 === 0 ? 2 : 1,
  delay: (i * 0.3) % 4,
}));

function CalendarFragment({
  day,
  done,
  rotate,
  x,
  y,
  parallaxX,
  parallaxY,
}: {
  day: string;
  done: boolean;
  rotate: number;
  x: number;
  y: number;
  parallaxX: number;
  parallaxY: number;
}) {
  return (
    <motion.div
      style={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        x: x + parallaxX * 12,
        y: y + parallaxY * 8,
        rotate,
      }}
      animate={floatAnimation}
      initial={{ opacity: 0, scale: 0.7 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: 0.3, duration: 1, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
      className={`glass-card rounded-xl px-3 py-2 text-center select-none pointer-events-none w-14
        ${done ? 'border-foreground/20' : 'border-red-500/20 opacity-50'}`}
    >
      <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">{day}</p>
      <div className={`mt-1 w-5 h-5 mx-auto rounded-full border-2 flex items-center justify-center
        ${done ? 'border-foreground/60 bg-foreground/10' : 'border-red-400/40 bg-red-500/5'}`}>
        {done && <div className="w-2 h-2 rounded-full bg-foreground/60" />}
      </div>
    </motion.div>
  );
}

export default function HeroScene() {
  const navigate = useNavigate();
  const { normalX, normalY } = useMouseParallax();
  const sectionRef = useRef<HTMLElement>(null);

  const scrollToNext = () => {
    const el = document.getElementById('why-habits');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-24 pb-16"
      aria-labelledby="hero-headline"
    >
      {/* Ambient radial background */}
      <motion.div
        animate={pulseGlowAnimation}
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
        aria-hidden="true"
      >
        <div className="w-[600px] h-[600px] rounded-full bg-gradient-to-br from-foreground/[0.03] via-transparent to-transparent" />
      </motion.div>

      {/* Particles */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        {PARTICLES.map((p) => (
          <motion.div
            key={p.id}
            className="absolute rounded-full bg-foreground/10"
            style={{ left: p.x, top: p.y, width: p.size, height: p.size }}
            animate={{ opacity: [0.2, 0.6, 0.2], y: [0, -8, 0] }}
            transition={{ duration: 3 + p.delay, repeat: Infinity, delay: p.delay, ease: 'easeInOut' as const }}
          />
        ))}
      </div>

      {/* Calendar fragments */}
      <div className="pointer-events-none absolute inset-0 hidden md:flex items-center justify-center" aria-hidden="true">
        {CALENDAR_FRAGMENTS.map((f) => (
          <CalendarFragment
            key={f.day}
            {...f}
            parallaxX={normalX}
            parallaxY={normalY}
          />
        ))}
      </div>

      {/* Main content */}
      <motion.div
        className="relative z-10 max-w-4xl mx-auto px-6 text-center"
        variants={staggerContainerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Eyebrow badge */}
        <motion.div variants={staggerItemVariants} className="mb-8 flex justify-center">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-border bg-muted/50 text-xs font-medium text-muted-foreground tracking-widest uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-foreground/40 animate-pulse" />
            Build Better Habits
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          id="hero-headline"
          variants={staggerItemVariants}
          className="text-display font-thin tracking-tight text-foreground mb-4"
        >
          Most goals don't fail
          <br />
          <span className="text-muted-foreground">because of ambition.</span>
        </motion.h1>

        <motion.p
          variants={staggerItemVariants}
          className="text-display font-thin tracking-tight text-foreground mb-10"
        >
          They fail because{' '}
          <em className="not-italic text-foreground/50">consistency</em>{' '}
          disappears.
        </motion.p>

        {/* Sub */}
        <motion.p
          variants={staggerItemVariants}
          className="text-base sm:text-lg text-muted-foreground font-light max-w-lg mx-auto mb-12 leading-relaxed"
        >
          Small actions repeated daily create extraordinary outcomes.
          HabitFlow AI keeps you consistent — one day at a time.
        </motion.p>

        {/* CTAs */}
        <motion.div
          variants={staggerItemVariants}
          className="flex flex-col sm:flex-row items-center justify-center gap-3"
        >
          <Button
            size="lg"
            onClick={() => navigate('/auth')}
            className="rounded-2xl px-8 h-12 text-base font-medium"
            aria-label="Start your journey"
          >
            Start Your Journey
          </Button>
          <Button
            variant="ghost"
            size="lg"
            onClick={scrollToNext}
            className="rounded-2xl px-8 h-12 text-base font-light text-muted-foreground hover:text-foreground"
            aria-label="Learn more about HabitFlow AI"
          >
            Learn More
          </Button>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.button
        onClick={scrollToNext}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6 }}
        aria-label="Scroll down"
      >
        <span className="text-[10px] uppercase tracking-[0.2em] font-medium">Scroll</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' as const }}
        >
          <ArrowDown size={14} />
        </motion.div>
      </motion.button>
    </section>
  );
}
