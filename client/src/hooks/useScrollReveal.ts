/**
 * useScrollReveal — triggers Framer Motion viewport entrance.
 * Returns ref + animation controls for scroll-based reveals.
 */
import { useEffect } from 'react';
import { useAnimation, useInView } from 'framer-motion';
import type { RefObject } from 'react';

export function useScrollReveal(ref: RefObject<Element>) {
  const controls = useAnimation();
  const inView = useInView(ref, { once: true, margin: '-80px' as const });

  useEffect(() => {
    if (inView) {
      void controls.start('visible');
    }
  }, [inView, controls]);

  return controls;
}
