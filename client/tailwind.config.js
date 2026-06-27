/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        /* ── Dashboard / App tokens (unchanged) ── */
        background: 'var(--color-background)',
        foreground: 'var(--color-foreground)',
        primary: 'var(--color-primary)',
        'primary-foreground': 'var(--color-primary-foreground)',
        muted: 'var(--color-muted)',
        'muted-foreground': 'var(--color-muted-foreground)',
        border: 'var(--color-border)',
        card: 'var(--color-card)',
        'card-foreground': 'var(--color-card-foreground)',
        accent: 'var(--color-accent)',
        'accent-foreground': 'var(--color-accent-foreground)',
        glow: 'var(--color-glow)',

        /* ── Kinetic Typography Landing Page tokens (isolated) ── */
        'kinetic-background':   '#09090B',
        'kinetic-foreground':   '#FAFAFA',
        'kinetic-muted':        '#27272A',
        'kinetic-muted-foreground': '#A1A1AA',
        'kinetic-accent':       '#DFE104',
        'kinetic-accent-foreground': '#000000',
        'kinetic-border':       '#3F3F46',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        /* Kinetic display font — only used on landing page */
        kinetic: ['"Space Grotesk"', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 20px 0 var(--color-glow)',
      },
      fontSize: {
        /* Viewport-fluid hero size for kinetic scenes */
        'kinetic-hero': 'clamp(3rem, 12vw, 14rem)',
        'kinetic-section': 'clamp(2.5rem, 8vw, 6rem)',
      },
    },
  },
  plugins: [],
}
