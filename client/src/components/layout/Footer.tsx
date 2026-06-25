/**
 * Footer — Minimal, elegant. Links to placeholders.
 */
import { Link } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';
const FOOTER_LINKS = [
  { label: 'Privacy', href: '/privacy' },
  { label: 'Terms', href: '/terms' },
  { label: 'About', href: '/#about' },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      className="border-t border-border py-10 px-6"
      role="contentinfo"
      aria-label="Site footer"
    >
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 select-none group"
          aria-label="HabitFlow AI homepage"
        >
          <div className="w-6 h-6 rounded-md bg-foreground flex items-center justify-center transition-transform group-hover:scale-105">
            <div className="w-2.5 h-2.5 rounded-sm bg-background" />
          </div>
          <span className="text-sm font-semibold tracking-tight">HabitFlow AI</span>
        </Link>

        {/* Nav links */}
        <nav aria-label="Footer navigation">
          <ul className="flex items-center gap-6" role="list">
            {FOOTER_LINKS.map((link) => (
              <li key={link.label}>
                <Link
                  to={link.href}
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors duration-200"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Right: GitHub + copyright */}
        <div className="flex items-center gap-4">
          <a
            href="https://github.com/COZYkrish/HABBITFLOW-AI"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-label="HabitFlow AI on GitHub"
          >
            <ExternalLink size={16} />
          </a>
          <span className="text-xs text-muted-foreground/50">
            © {year} HabitFlow AI
          </span>
        </div>
      </div>
    </footer>
  );
}
