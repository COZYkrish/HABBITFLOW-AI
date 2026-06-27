/**
 * Scene 1 — THE WAKE-UP CALL (Hero)
 * Background: boomerang video loop (forward → backward, 30fps canvas)
 * Layout & colors taken from the reference prompt.
 * Framer Motion kept only for scroll-based parallax on the canvas wrapper.
 */
import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import MarqueeLib from 'react-fast-marquee';
import BoomerangVideoBg from '../../components/ui/BoomerangVideoBg';

const Marquee = (MarqueeLib as unknown as { default: typeof MarqueeLib }).default ?? MarqueeLib;

const BG_VIDEO =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260511_131941_d136af49-e243-493a-be14-6ff3f24e09e6.mp4';

const MARQUEE_ITEMS = [
  '⬡ DAY 1',
  '★ STREAK BROKEN',
  '◈ HABIT MISSED',
  '◎ POTENTIAL LOST',
  '▤ ANOTHER EXCUSE',
  '⬡ DAY 1',
  '★ START OVER',
  '◈ AGAIN.',
];

const NEUE_HAAS = '"Neue Haas Grotesk Display Pro 55 Roman", "Neue Haas Grotesk Text Pro", "Helvetica Neue", Helvetica, Arial, sans-serif';

export default function HeroScene() {
  const navigate = useNavigate();
  const sectionRef = useRef<HTMLElement>(null);
  /* scroll parallax on bg */
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });
  const videoScale   = useTransform(scrollYProgress, [0, 1],   [1, 1.10]);
  const heroOpacity  = useTransform(scrollYProgress, [0, 0.4], [1, 0]);
  const heroY        = useTransform(scrollYProgress, [0, 0.4], [0, -40]);

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative w-full min-h-screen sm:h-screen overflow-hidden"
      aria-labelledby="hero-headline"
    >
      {/* ── Boomerang background video ── */}
      <motion.div
        style={{ scale: videoScale }}
        className="absolute inset-0 w-full h-full origin-center"
      >
        <BoomerangVideoBg src={BG_VIDEO} className="absolute inset-0 w-full h-full" />
      </motion.div>

      {/* ── Cinematic overlays ── */}
      {/* Top dark gradient so navbar reads clearly */}
      <div
        className="absolute inset-0 pointer-events-none z-[1]"
        style={{
          background: `
            linear-gradient(to bottom, rgba(15,25,14,0.55) 0%, transparent 25%, transparent 55%, rgba(15,25,14,0.70) 100%),
            linear-gradient(to right,  rgba(15,25,14,0.30) 0%, transparent 50%)
          `,
        }}
        aria-hidden="true"
      />

      {/* ── Top ticker marquee ── */}
      <div
        className="w-full border-b border-white/10 py-2.5 relative z-10 bg-black/20 backdrop-blur-sm"
        aria-hidden="true"
      >
        <Marquee speed={70} gradient={false} autoFill>
          {MARQUEE_ITEMS.map((item, i) => (
            <span
              key={i}
              className="text-[10px] tracking-[0.3em] uppercase text-white/35 mx-8 font-medium"
              style={{ fontFamily: NEUE_HAAS }}
            >
              {item}
            </span>
          ))}
        </Marquee>
      </div>

      {/* ── Hero copy — top-center ── */}
      <motion.div
        style={{ opacity: heroOpacity, y: heroY }}
        className="relative z-10 flex flex-col items-center text-center pt-16 sm:pt-20 md:pt-24 px-4 sm:px-6"
      >
        {/* Eyebrow */}
        <p
          className="text-[10px] tracking-[0.35em] uppercase mb-5 font-medium"
          style={{ fontFamily: NEUE_HAAS, color: '#85AB8B' }}
        >
          Act I — The Problem
        </p>

        {/* Headline */}
        <h1
          id="hero-headline"
          className="font-normal leading-[0.95] text-[2rem] sm:text-4xl md:text-5xl lg:text-[4.75rem] xl:text-[5.25rem] max-w-5xl"
          style={{
            fontFamily: NEUE_HAAS,
            letterSpacing: '-0.035em',
            color: '#336443',
          }}
        >
          Your{' '}
          <span style={{ color: '#85AB8B' }}>Potential</span>
          {' '}Is Rotting.
        </h1>

        {/* Body copy */}
        <p
          className="mt-6 sm:mt-8 text-sm sm:text-base md:text-lg leading-relaxed max-w-md px-2"
          style={{ fontFamily: NEUE_HAAS, color: '#4b5b47' }}
        >
          Not because of your ambition — that's still intact. It's rotting
          because you keep starting over. Day 1, again and again.
        </p>
      </motion.div>

      {/* ── Bottom-left CTA block ── */}
      <motion.div
        style={{ opacity: heroOpacity }}
        className="absolute left-4 right-4 sm:right-auto sm:left-6 md:left-10 bottom-6 sm:bottom-8 md:bottom-10 z-10 max-w-sm"
      >
        <div
          className="flex items-center gap-2 mb-3"
          style={{ color: '#3d5638' }}
        >
          <Sparkles className="w-4 h-4" />
          <span
            className="text-sm font-semibold"
            style={{ fontFamily: NEUE_HAAS }}
          >
            HabitFlow AI
          </span>
        </div>

        <p
          className="text-xs leading-relaxed mb-5 max-w-xs"
          style={{ fontFamily: NEUE_HAAS, color: 'rgba(61,86,56,0.85)' }}
        >
          HabitFlow smoothly unites your habits, tracking, and insights —
          building consistency without the constant restart.
        </p>

        <div className="flex items-center gap-4 flex-wrap">
          <button
            onClick={() => navigate('/auth/register')}
            className="text-white text-sm font-semibold px-5 py-2.5 rounded-full transition-colors shadow-sm"
            style={{
              fontFamily: NEUE_HAAS,
              backgroundColor: '#3d5638',
            }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#2d4228')}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#3d5638')}
            aria-label="End the cycle — start your account"
          >
            End The Cycle →
          </button>
          <button
            onClick={() => {
              const el = document.getElementById('why-habits');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="text-sm font-semibold hover:opacity-70 transition-opacity"
            style={{ fontFamily: NEUE_HAAS, color: '#3d5638' }}
            aria-label="See why habits matter"
          >
            Know More.
          </button>
        </div>
      </motion.div>


    </section>
  );
}
