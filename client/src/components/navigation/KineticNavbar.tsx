/**
 * KineticNavbar — Landing page navigation bar.
 * Dark, brutalist aesthetic to match the kinetic typography design system.
 * Hides on scroll down, reveals on scroll up.
 */
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';

const NAV_LINKS = [
  { label: 'The Problem', href: '#hero' },
  { label: 'The System', href: '#product' },
  { label: 'The Data', href: '#analytics' },
  { label: 'Intelligence', href: '#insights' },
];

export function KineticNavbar() {
  const [visible, setVisible] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setVisible(y < lastY || y < 80);
      setScrolled(y > 20);
      lastY = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleAnchor = (href: string) => {
    setMobileOpen(false);
    if (href.startsWith('#')) {
      const el = document.querySelector(href);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <motion.header
      role="banner"
      animate={{ y: visible ? 0 : -100, opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-0 left-0 right-0 z-50"
    >
      <nav
        aria-label="Main navigation"
        className={`w-full px-4 md:px-8 py-4 flex items-center justify-between transition-all duration-300 ${
          scrolled
            ? 'bg-kinetic-background/90 backdrop-blur-xl border-b-2 border-kinetic-border'
            : 'bg-transparent'
        }`}
      >
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-3 select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kinetic-accent"
          aria-label="HabitFlow AI Home"
        >
          <div className="w-8 h-8 bg-kinetic-foreground flex items-center justify-center">
            <span className="font-kinetic font-bold text-xs text-kinetic-accent-foreground">H</span>
          </div>
          <span className="font-kinetic font-bold text-sm tracking-[0.15em] uppercase text-kinetic-foreground">
            HabitFlow AI
          </span>
        </Link>

        {/* Desktop Links */}
        <ul className="hidden md:flex items-center gap-0" role="list">
          {NAV_LINKS.map((link) => (
            <li key={link.label}>
              <button
                onClick={() => handleAnchor(link.href)}
                className="font-kinetic text-xs tracking-widest uppercase text-kinetic-muted-foreground hover:text-kinetic-foreground px-4 py-2 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kinetic-accent"
              >
                {link.label}
              </button>
            </li>
          ))}
        </ul>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={() => navigate('/auth/login')}
            className="font-kinetic font-bold text-xs tracking-widest uppercase text-kinetic-muted-foreground hover:text-kinetic-foreground px-4 py-2 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kinetic-foreground"
            aria-label="Login"
          >
            LOGIN
          </button>
          <button
            onClick={() => navigate('/auth/register')}
            className="font-kinetic font-bold text-xs tracking-widest uppercase bg-kinetic-accent text-kinetic-accent-foreground px-6 py-2.5 hover:scale-105 active:scale-95 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kinetic-accent"
            aria-label="Get Started"
          >
            GET STARTED
          </button>
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden p-2 text-kinetic-foreground hover:text-kinetic-accent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kinetic-accent"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="bg-kinetic-background border-b-2 border-kinetic-border px-4 py-6 flex flex-col gap-2"
            role="dialog"
            aria-label="Mobile navigation menu"
          >
            {NAV_LINKS.map((link) => (
              <button
                key={link.label}
                onClick={() => handleAnchor(link.href)}
                className="font-kinetic font-bold text-sm tracking-widest uppercase text-left text-kinetic-muted-foreground hover:text-kinetic-foreground py-2 transition-colors border-b border-kinetic-border last:border-0"
              >
                {link.label}
              </button>
            ))}
            <div className="flex flex-col gap-3 pt-4">
              <button
                onClick={() => { setMobileOpen(false); navigate('/auth/login'); }}
                className="font-kinetic font-bold text-sm tracking-widest uppercase text-kinetic-muted-foreground border-2 border-kinetic-border py-3 hover:text-kinetic-foreground hover:border-kinetic-foreground transition-colors"
              >
                LOGIN
              </button>
              <button
                onClick={() => { setMobileOpen(false); navigate('/auth/register'); }}
                className="font-kinetic font-bold text-sm tracking-widest uppercase bg-kinetic-accent text-kinetic-accent-foreground py-3 hover:scale-105 transition-all"
              >
                GET STARTED
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
