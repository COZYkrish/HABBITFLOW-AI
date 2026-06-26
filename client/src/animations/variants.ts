/**
 * Shared Framer Motion Variants
 * Centralised animation library — reuse across all landing page scenes.
 */
import type { Variants, Transition } from 'framer-motion';

/** Apple-style ease curve as a named easing function reference */
const appleEase = [0.22, 1, 0.36, 1] as [number, number, number, number];

const appleTransition: Transition = { duration: 0.9, ease: appleEase };

/* ── Fade ────────────────────────────────────────────────── */
export const fadeVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.8, ease: appleEase } },
};

/* ── Page Transition ─────────────────────────────────────── */
export const pageTransitionVariants: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
};

/* ── Fade + slide up ─────────────────────────────────────── */
export const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: appleTransition },
};

/* ── Fade + slide in from left ───────────────────────────── */
export const fadeLeftVariants: Variants = {
  hidden: { opacity: 0, x: -40 },
  visible: { opacity: 1, x: 0, transition: appleTransition },
};

/* ── Fade + slide in from right ──────────────────────────── */
export const fadeRightVariants: Variants = {
  hidden: { opacity: 0, x: 40 },
  visible: { opacity: 1, x: 0, transition: appleTransition },
};

/* ── Scale in ────────────────────────────────────────────── */
export const scaleInVariants: Variants = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.8, ease: appleEase } },
};

/* ── Stagger container ───────────────────────────────────── */
export const staggerContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

/* ── Stagger container (slower children) ────────────────── */
export const staggerSlowVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2, delayChildren: 0.15 },
  },
};

/* ── Stagger item (used inside stagger containers) ───────── */
export const staggerItemVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: appleEase } },
};

/* ── Headline character stagger ──────────────────────────── */
export const headlineContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.2 },
  },
};

export const headlineCharVariants: Variants = {
  hidden: { opacity: 0, y: 60 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: appleEase },
  },
};

/* ── Float loop (inline animate object — NOT a Variants map) */
export const floatAnimation = {
  y: [0, -12, 0],
  transition: { duration: 4, ease: 'easeInOut' as const, repeat: Infinity },
};

/* ── Pulse glow (inline animate) ──────────────────────────── */
export const pulseGlowAnimation = {
  opacity: [0.4, 0.8, 0.4],
  scale: [1, 1.04, 1],
  transition: { duration: 3, ease: 'easeInOut' as const, repeat: Infinity },
};

/* ── Hover lift ──────────────────────────────────────────── */
export const hoverLiftVariants: Variants = {
  rest: { y: 0, scale: 1 },
  hover: { y: -6, scale: 1.02, transition: { duration: 0.35, ease: appleEase } },
};

/* ── Card hover ──────────────────────────────────────────── */
export const cardHoverVariants: Variants = {
  rest: { y: 0 },
  hover: { y: -4, transition: { duration: 0.35, ease: appleEase } },
};

/** Re-exported for convenience in whileHover/animate inline props */
export const floatVariants = {
  animate: floatAnimation,
};

export const pulseGlowVariants = {
  animate: pulseGlowAnimation,
};

/* ── Viewport trigger defaults ───────────────────────────── */
export const viewportOnce = { once: true, margin: '-80px' } as const;
