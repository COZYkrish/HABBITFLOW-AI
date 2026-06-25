/**
 * Design Tokens
 * These constants form the foundation of the luxury monochrome design system.
 */

export const colors = {
  background: 'var(--color-background)',
  foreground: 'var(--color-foreground)',
  primary: 'var(--color-primary)',
  muted: 'var(--color-muted)',
  border: 'var(--color-border)',
  glow: 'var(--color-glow)',
};

export const typography = {
  fontFamily: 'Inter, sans-serif',
  weights: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
};

export const spacing = {
  xs: '0.25rem',
  sm: '0.5rem',
  md: '1rem',
  lg: '1.5rem',
  xl: '2rem',
  '2xl': '3rem',
};

export const radius = {
  sm: '0.25rem',
  md: '0.5rem',
  lg: '0.75rem',
  full: '9999px',
};

export const shadows = {
  glow: '0 0 20px 0 var(--color-glow)',
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
};

export const animations = {
  transition: 'all 0.3s ease',
  fast: 'all 0.15s ease',
};
