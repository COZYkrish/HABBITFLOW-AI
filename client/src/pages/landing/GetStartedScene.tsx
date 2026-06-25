/**
 * Scene 6 — Get Started (CTA)
 * Minimal, powerful closing call-to-action that leads to Phase 3 auth.
 */
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import {
  staggerContainerVariants,
  staggerItemVariants,
  pulseGlowVariants,
  viewportOnce,
} from '../../animations/variants';

export default function GetStartedScene() {
  const navigate = useNavigate();

  return (
    <section
      id="get-started"
      className="relative py-40 overflow-hidden"
      aria-labelledby="cta-headline"
    >
      {/* Atmospheric radial glow */}
      <motion.div
        variants={pulseGlowVariants}
        animate="animate"
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        aria-hidden="true"
      >
        <div className="w-[700px] h-[400px] rounded-full bg-gradient-radial from-foreground/[0.04] via-transparent to-transparent blur-2xl" />
      </motion.div>

      {/* Subtle top border */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-24 bg-gradient-to-b from-transparent to-border" aria-hidden="true" />

      <div className="relative max-w-3xl mx-auto px-6 text-center">
        <motion.div
          variants={staggerContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
        >
          {/* Eyebrow */}
          <motion.p
            variants={staggerItemVariants}
            className="text-xs uppercase tracking-[0.25em] text-muted-foreground mb-8"
          >
            Begin your journey
          </motion.p>

          {/* Headline */}
          <motion.h2
            id="cta-headline"
            variants={staggerItemVariants}
            className="text-display font-thin tracking-tight text-foreground mb-6"
          >
            The future you imagine
            <br />
            begins today.
          </motion.h2>

          {/* Support text */}
          <motion.p
            variants={staggerItemVariants}
            className="text-base sm:text-lg text-muted-foreground font-light max-w-md mx-auto mb-14 leading-relaxed"
          >
            Consistency isn't built overnight.
            <br />
            It's built one decision at a time.
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            variants={staggerItemVariants}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button
              size="lg"
              onClick={() => navigate('/auth')}
              className="rounded-2xl px-10 h-14 text-base font-medium group"
              aria-label="Create free account"
            >
              Create Free Account
              <motion.span
                className="ml-2 inline-block"
                animate={{ x: [0, 3, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
              >
                <ArrowRight size={16} />
              </motion.span>
            </Button>
            <Button
              variant="ghost"
              size="lg"
              onClick={() => navigate('/auth')}
              className="rounded-2xl px-8 h-14 text-base font-light text-muted-foreground hover:text-foreground"
              aria-label="Login to existing account"
            >
              Login
            </Button>
          </motion.div>

          {/* Micro trust line */}
          <motion.p
            variants={staggerItemVariants}
            className="mt-8 text-xs text-muted-foreground/60"
          >
            Free forever. No credit card required.
          </motion.p>
        </motion.div>
      </div>

      {/* Subtle bottom border */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-px h-24 bg-gradient-to-t from-transparent to-border" aria-hidden="true" />
    </section>
  );
}
