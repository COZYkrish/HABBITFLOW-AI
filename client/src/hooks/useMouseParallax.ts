/**
 * useMouseParallax — tracks mouse position for subtle parallax effects.
 */
import { useState, useEffect } from 'react';

interface MousePosition {
  x: number;
  y: number;
  normalX: number; // -1 to 1
  normalY: number; // -1 to 1
}

export function useMouseParallax(): MousePosition {
  const [position, setPosition] = useState<MousePosition>({
    x: 0,
    y: 0,
    normalX: 0,
    normalY: 0,
  });

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      const normalX = (e.clientX / window.innerWidth - 0.5) * 2;
      const normalY = (e.clientY / window.innerHeight - 0.5) * 2;
      setPosition({ x: e.clientX, y: e.clientY, normalX, normalY });
    };

    window.addEventListener('mousemove', handleMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMove);
  }, []);

  return position;
}
