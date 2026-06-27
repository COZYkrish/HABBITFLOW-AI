/**
 * Scene 6 — THE ULTIMATUM (Cinematic CTA)
 * Fullscreen video background with custom fade-in/fade-out loop logic.
 * Typography: Instrument Serif (display) + Inter (body).
 * Reference: cinematic hero prompt — white bg, black/grey palette, serif headline.
 */
import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const BG_VIDEO =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260328_083109_283f3553-e28f-428b-a723-d639c617eb2b.mp4';

const INSTRUMENT_SERIF = '"Instrument Serif", "Georgia", serif';
const INTER = '"Inter", "Helvetica Neue", Helvetica, Arial, sans-serif';

const FADE_DURATION = 500; // ms

/** rAF-based opacity tween — returns cancel fn */
function tweenOpacity(
  el: HTMLVideoElement,
  from: number,
  to: number,
  durationMs: number,
  onDone?: () => void,
): () => void {
  let id: number;
  const start = performance.now();
  el.style.opacity = String(from);
  const tick = (now: number) => {
    const t = Math.min((now - start) / durationMs, 1);
    el.style.opacity = String(from + (to - from) * t);
    if (t < 1) { id = requestAnimationFrame(tick); }
    else { onDone?.(); }
  };
  id = requestAnimationFrame(tick);
  return () => cancelAnimationFrame(id);
}

export default function GetStartedScene() {
  const navigate  = useNavigate();
  const videoRef  = useRef<HTMLVideoElement>(null);
  const cancelRef = useRef<(() => void) | null>(null);

  /* ── Video fade-loop ── */
  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;

    const cancel = () => { cancelRef.current?.(); cancelRef.current = null; };
    let rafId = 0;

    const checkFadeOut = () => {
      if (!vid || vid.paused) return;
      const remaining = vid.duration - vid.currentTime;
      if (remaining <= 0.55 && Number(vid.style.opacity) > 0) {
        cancel();
        cancelRef.current = tweenOpacity(vid, Number(vid.style.opacity), 0, FADE_DURATION);
      }
      rafId = requestAnimationFrame(checkFadeOut);
    };

    const onCanPlay = () => {
      vid.play().then(() => {
        cancel();
        cancelRef.current = tweenOpacity(vid, 0, 1, FADE_DURATION, () => {
          rafId = requestAnimationFrame(checkFadeOut);
        });
      }).catch(() => {});
    };

    const onEnded = () => {
      cancel();
      cancelAnimationFrame(rafId);
      vid.style.opacity = '0';
      setTimeout(() => {
        vid.currentTime = 0;
        vid.play().then(() => {
          cancelRef.current = tweenOpacity(vid, 0, 1, FADE_DURATION, () => {
            rafId = requestAnimationFrame(checkFadeOut);
          });
        }).catch(() => {});
      }, 100);
    };

    vid.addEventListener('canplay', onCanPlay);
    vid.addEventListener('ended',   onEnded);
    if (vid.readyState >= 3) onCanPlay();

    return () => {
      cancel();
      cancelAnimationFrame(rafId);
      vid.removeEventListener('canplay', onCanPlay);
      vid.removeEventListener('ended',   onEnded);
    };
  }, []);

  /* ── Shared fade-rise keyframe helpers ── */
  const fadeRise = {
    initial:    { opacity: 0, y: 20 },
    whileInView:{ opacity: 1, y: 0  },
    viewport:   { once: true },
  };

  return (
    <section
      id="get-started"
      className="relative h-screen w-full overflow-hidden bg-white flex flex-col"
      aria-labelledby="cta-headline"
    >
      {/* ── Background video layer ── */}
      <video
        ref={videoRef}
        src={BG_VIDEO}
        className="absolute w-full object-cover pointer-events-none"
        style={{
          opacity: 0,
          inset: 'auto 0 0 0',
          top: '200px',
          height: 'calc(100% - 200px)',
        }}
        muted
        autoPlay
        playsInline
        preload="auto"
        aria-hidden="true"
      />

      {/* ── Gradient overlays ── */}
      <div
        className="absolute inset-0 pointer-events-none z-[1]"
        style={{
          background:
            'linear-gradient(to bottom, #ffffff 0%, rgba(255,255,255,0.7) 25%, transparent 50%, transparent 75%, #ffffff 100%)',
        }}
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 pointer-events-none z-[1]"
        style={{
          background:
            'linear-gradient(to right, rgba(255,255,255,0.45) 0%, transparent 20%, transparent 80%, rgba(255,255,255,0.45) 100%)',
        }}
        aria-hidden="true"
      />

      {/* ── Main content — fills remaining space ── */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-6 py-6">
        {/* Eyebrow */}
        <motion.p
          {...fadeRise}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="text-[10px] tracking-[0.3em] uppercase mb-4"
          style={{ fontFamily: INTER, color: '#6F6F6F' }}
        >
          Act VI — The Ultimatum
        </motion.p>

        {/* Headline */}
        <motion.h2
          id="cta-headline"
          {...fadeRise}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.05 }}
          className="font-normal max-w-4xl mb-5"
          style={{
            fontFamily: INSTRUMENT_SERIF,
            fontSize: 'clamp(2rem, min(5.5vw, 9svh), 5.5rem)',
            lineHeight: 0.97,
            letterSpacing: '-1.8px',
            color: '#000000',
          }}
        >
          Beyond excuses,{' '}
          <span style={{ color: '#6F6F6F', fontStyle: 'italic' }}>build the habit</span>
          {' '}that{' '}
          <span style={{ color: '#6F6F6F', fontStyle: 'italic' }}>never breaks.</span>
        </motion.h2>

        {/* Description */}
        <motion.p
          {...fadeRise}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
          className="text-sm sm:text-base max-w-xl leading-relaxed mb-7"
          style={{ fontFamily: INTER, color: '#6F6F6F' }}
        >
          Building consistency for brilliant minds, fearless makers, and thoughtful souls.
          Through the noise, HabitFlow crafts a system for deep growth and pure momentum.
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          {...fadeRise}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center gap-3 mb-5"
        >
          <button
            onClick={() => navigate('/auth/register')}
            className="rounded-full text-sm font-medium transition-transform hover:scale-[1.03] active:scale-[0.98] px-12 py-3.5"
            style={{ fontFamily: INTER, backgroundColor: '#000000', color: '#FFFFFF' }}
            aria-label="Begin your habit journey"
          >
            Begin Journey
          </button>
          <button
            onClick={() => navigate('/auth/login')}
            className="rounded-full text-sm font-medium border transition-transform hover:scale-[1.03] active:scale-[0.98] px-8 py-3"
            style={{ fontFamily: INTER, borderColor: '#000000', color: '#000000', backgroundColor: 'transparent' }}
            aria-label="Already started — log in"
          >
            I Already Started
          </button>
        </motion.div>

        {/* Trust micro-copy */}
        <motion.p
          {...fadeRise}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.55 }}
          className="text-xs"
          style={{ fontFamily: INTER, color: '#6F6F6F' }}
        >
          Free forever · No credit card · No excuses
        </motion.p>
      </div>

      {/* ── Stats strip ── */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="relative z-10 border-t border-black/10"
      >
        <div className="grid grid-cols-3 divide-x divide-black/10 max-w-3xl mx-auto">
          {[
            { n: '10,000+', l: 'habits tracked daily' },
            { n: '94%',     l: 'user retention at 30 days' },
            { n: 'Free',    l: 'always — no paywalls' },
          ].map(item => (
            <div key={item.n} className="px-6 py-5 text-center">
              <p
                className="font-normal"
                style={{
                  fontFamily: INSTRUMENT_SERIF,
                  fontSize: 'clamp(1.5rem, 3vw, 2.5rem)',
                  color: '#000000',
                  letterSpacing: '-0.5px',
                }}
              >
                {item.n}
              </p>
              <p
                className="text-[10px] tracking-widest uppercase mt-1"
                style={{ fontFamily: INTER, color: '#6F6F6F' }}
              >
                {item.l}
              </p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* ── Footer bar ── */}
      <div className="relative z-10 border-t border-black/10 py-3 px-6 md:px-10 flex justify-between items-center">
        <span className="text-[10px] tracking-[0.2em] uppercase" style={{ fontFamily: INTER, color: '#6F6F6F' }}>
          © 2025 HabitFlow AI
        </span>
        <span className="text-[10px] tracking-[0.2em] uppercase" style={{ fontFamily: INTER, color: '#6F6F6F' }}>
          Scene 6 / 6 — The End.
        </span>
      </div>
    </section>
  );
}
