/**
 * Floating Navigation Bar
 * Glass blur background, hides on scroll down, reveals on scroll up.
 */
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { cn } from '../../utils/cn';
import { Button } from '../ui/Button';

const NAV_LINKS = [
  { label: 'Features', href: '#features' },
  { label: 'Insights', href: '#insights' },
  { label: 'About', href: '#about' },
];

export function Navbar() {
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
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 pt-4"
    >
      <nav
        aria-label="Main navigation"
        className={cn(
          'w-full max-w-5xl rounded-2xl px-5 py-3 flex items-center justify-between transition-all duration-300',
          scrolled
            ? 'bg-white/70 dark:bg-black/70 backdrop-blur-2xl border border-black/[0.06] dark:border-white/[0.08] shadow-lg shadow-black/[0.04]'
            : 'bg-transparent'
        )}
      >
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 select-none" aria-label="HabitFlow AI Home">
          <div className="w-7 h-7 rounded-lg bg-foreground flex items-center justify-center">
            <div className="w-3 h-3 rounded-sm bg-background" />
          </div>
          <span className="font-semibold text-sm tracking-tight">HabitFlow AI</span>
        </Link>

        {/* Desktop Links */}
        <ul className="hidden md:flex items-center gap-1" role="list">
          {NAV_LINKS.map((link) => (
            <li key={link.label}>
              <button
                onClick={() => handleAnchor(link.href)}
                className="px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground rounded-lg hover:bg-accent/50 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground"
              >
                {link.label}
              </button>
            </li>
          ))}
        </ul>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/auth/login')}
            aria-label="Login"
          >
            Login
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={() => navigate('/auth/register')}
            aria-label="Get Started"
            className="rounded-xl"
          >
            Get Started
          </Button>
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden p-2 rounded-lg hover:bg-accent transition-colors"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="absolute top-full mt-2 left-4 right-4 glass-card rounded-2xl p-4 flex flex-col gap-2"
            role="dialog"
            aria-label="Mobile navigation menu"
          >
            {NAV_LINKS.map((link) => (
              <button
                key={link.label}
                onClick={() => handleAnchor(link.href)}
                className="text-left px-3 py-2 rounded-lg text-sm hover:bg-accent transition-colors"
              >
                {link.label}
              </button>
            ))}
            <div className="border-t border-border pt-2 mt-1 flex flex-col gap-2">
              <Button variant="ghost" size="sm" onClick={() => { setMobileOpen(false); navigate('/auth/login'); }} className="justify-start">
                Login
              </Button>
              <Button variant="default" size="sm" onClick={() => { setMobileOpen(false); navigate('/auth/register'); }} className="rounded-xl">
                Get Started
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
