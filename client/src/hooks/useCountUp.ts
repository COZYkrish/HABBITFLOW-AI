/**
 * useCountUp — animates a number from 0 to a target value when element enters view.
 */
import { useState, useEffect, useRef } from 'react';

interface Options {
  start?: number;
  duration?: number;
  decimals?: number;
}

export function useCountUp(target: number, options: Options = {}) {
  const { start = 0, duration = 2000, decimals = 0 } = options;
  const [count, setCount] = useState(start);
  const [triggered, setTriggered] = useState(false);
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !triggered) {
          setTriggered(true);
        }
      },
      { threshold: 0.3 }
    );
    const el = ref.current;
    if (el) observer.observe(el);
    return () => { if (el) observer.unobserve(el); };
  }, [triggered]);

  useEffect(() => {
    if (!triggered) return;

    const startTime = performance.now();
    const range = target - start;

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = start + range * eased;
      setCount(parseFloat(value.toFixed(decimals)));
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  }, [triggered, target, start, duration, decimals]);

  return { count, ref };
}
