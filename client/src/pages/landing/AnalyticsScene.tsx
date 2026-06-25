/**
 * Scene 4 — Analytics Preview
 * Animated charts: bar, line, heatmap, circular progress, streak grid.
 */
import { motion } from 'framer-motion';
import { TrendingUp, CheckCircle2 } from 'lucide-react';
import {
  staggerContainerVariants,
  staggerItemVariants,
  cardHoverVariants,
  viewportOnce,
} from '../../animations/variants';

/* ── Weekly bar chart ──────────────────────────────────────── */
const BAR_DATA = [
  { day: 'Mon', value: 85 },
  { day: 'Tue', value: 100 },
  { day: 'Wed', value: 72 },
  { day: 'Thu', value: 90 },
  { day: 'Fri', value: 58 },
  { day: 'Sat', value: 94 },
  { day: 'Sun', value: 76 },
];

/* ── Line chart data ───────────────────────────────────────── */
const LINE_DATA = [30, 38, 44, 40, 55, 62, 70, 68, 75, 80, 78, 88];

/* ── Heatmap ───────────────────────────────────────────────── */
const HEATMAP = Array.from({ length: 52 }, () =>
  Array.from({ length: 7 }, () => {
    const r = Math.random();
    return r > 0.5 ? (r > 0.8 ? 3 : r > 0.65 ? 2 : 1) : 0;
  })
);

const HeatCell = ({ level, delay }: { level: number; delay: number }) => {
  const bg = ['bg-border', 'bg-foreground/20', 'bg-foreground/45', 'bg-foreground/80'][level];
  return (
    <motion.div
      className={`w-2 h-2 rounded-sm ${bg}`}
      initial={{ opacity: 0, scale: 0 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={viewportOnce}
      transition={{ delay, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
    />
  );
};

function BarChart() {
  return (
    <div className="glass-card rounded-2xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp size={13} className="text-muted-foreground" />
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Weekly Completion</span>
      </div>
      <div className="flex items-end gap-2 h-24" role="img" aria-label="Weekly completion bar chart">
        {BAR_DATA.map((d, i) => (
          <div key={d.day} className="flex-1 flex flex-col items-center gap-1">
            <div className="w-full flex items-end" style={{ height: '80px' }}>
              <motion.div
                className="w-full rounded-t-md bg-foreground/70"
                initial={{ scaleY: 0 }}
                whileInView={{ scaleY: 1 }}
                viewport={viewportOnce}
                transition={{ delay: i * 0.07, duration: 0.7, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
                style={{ transformOrigin: 'bottom', height: `${d.value}%` }}
              />
            </div>
            <span className="text-[9px] text-muted-foreground">{d.day}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function LineChart() {
  const max = Math.max(...LINE_DATA);
  const min = Math.min(...LINE_DATA);
  const range = max - min;
  const w = 280;
  const h = 80;
  const pts = LINE_DATA.map((v, i) => [
    (i / (LINE_DATA.length - 1)) * w,
    h - ((v - min) / range) * h,
  ]);
  const d = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0]},${p[1]}`).join(' ');
  const area = `${d} L${w},${h} L0,${h} Z`;

  return (
    <div className="glass-card rounded-2xl p-5">
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-4">Progress Over Months</p>
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full" role="img" aria-label="12-month progress line chart">
        <defs>
          <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="currentColor" stopOpacity={0.15} />
            <stop offset="100%" stopColor="currentColor" stopOpacity={0} />
          </linearGradient>
        </defs>
        <motion.path
          d={area}
          fill="url(#lineGrad)"
          className="text-foreground"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={viewportOnce}
          transition={{ duration: 0.8, delay: 0.3 }}
        />
        <motion.path
          d={d}
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-foreground/60"
          pathLength={1}
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={viewportOnce}
          transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
        />
        {pts.map(([x, y], i) => (
          <motion.circle
            key={i}
            cx={x} cy={y} r={3}
            fill="currentColor"
            className="text-foreground/50"
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={viewportOnce}
            transition={{ delay: 1.5 + i * 0.05, duration: 0.3 }}
          />
        ))}
      </svg>
    </div>
  );
}

function CircularStat({ label, value, pct }: { label: string; value: string; pct: number }) {
  const r = 32;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;
  return (
    <motion.div
      variants={cardHoverVariants}
      initial="rest"
      whileHover="hover"
      className="glass-card rounded-2xl p-4 flex flex-col items-center gap-2"
    >
      <svg width="80" height="80" className="-rotate-90" aria-hidden="true">
        <circle cx="40" cy="40" r={r} fill="none" stroke="currentColor" strokeWidth="4" className="text-border" />
        <motion.circle
          cx="40" cy="40" r={r}
          fill="none" stroke="currentColor" strokeWidth="4"
          strokeDasharray={circ}
          className="text-foreground/60"
          initial={{ strokeDashoffset: circ }}
          whileInView={{ strokeDashoffset: offset }}
          viewport={viewportOnce}
          transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
          strokeLinecap="round"
        />
      </svg>
      <p className="text-xl font-thin -mt-10 relative z-10">{value}</p>
      <p className="text-[10px] text-muted-foreground uppercase tracking-wide text-center">{label}</p>
    </motion.div>
  );
}

function Heatmap() {
  return (
    <div className="glass-card rounded-2xl p-5 overflow-hidden">
      <div className="flex items-center gap-2 mb-4">
        <CheckCircle2 size={13} className="text-muted-foreground" />
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Activity — Last 52 Weeks</span>
      </div>
      <div
        className="flex gap-0.5 overflow-x-auto no-scrollbar"
        role="img"
        aria-label="52-week activity heatmap"
      >
        {HEATMAP.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-0.5 flex-shrink-0">
            {week.map((level, di) => (
              <HeatCell key={di} level={level} delay={(wi * 7 + di) * 0.003} />
            ))}
          </div>
        ))}
      </div>
      <div className="flex items-center gap-1 mt-3 justify-end">
        <span className="text-[9px] text-muted-foreground">Less</span>
        {[0, 1, 2, 3].map((l) => (
          <div key={l} className={`w-2 h-2 rounded-sm ${['bg-border', 'bg-foreground/20', 'bg-foreground/45', 'bg-foreground/80'][l]}`} />
        ))}
        <span className="text-[9px] text-muted-foreground">More</span>
      </div>
    </div>
  );
}

export default function AnalyticsScene() {
  return (
    <section
      id="analytics"
      className="relative py-32 bg-muted/30 dark:bg-muted/10"
      aria-labelledby="analytics-headline"
    >
      <div className="max-w-5xl mx-auto px-6">
        {/* Header */}
        <motion.div
          variants={staggerContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="text-center mb-20"
        >
          <motion.p variants={staggerItemVariants} className="text-xs uppercase tracking-widest text-muted-foreground mb-4">
            Data visualisation
          </motion.p>
          <motion.h2
            id="analytics-headline"
            variants={staggerItemVariants}
            className="text-headline font-thin"
          >
            Understand your patterns.
            <br />
            Celebrate every win.
          </motion.h2>
        </motion.div>

        {/* Charts grid */}
        <motion.div
          variants={staggerContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="grid gap-4 md:grid-cols-2"
        >
          <motion.div variants={staggerItemVariants}><BarChart /></motion.div>
          <motion.div variants={staggerItemVariants}><LineChart /></motion.div>

          <motion.div variants={staggerItemVariants} className="grid grid-cols-3 gap-3">
            <CircularStat label="Completion" value="87%" pct={87} />
            <CircularStat label="Streak" value="30d" pct={82} />
            <CircularStat label="Habits" value="4/4" pct={100} />
          </motion.div>

          <motion.div variants={staggerItemVariants}><Heatmap /></motion.div>
        </motion.div>
      </div>
    </section>
  );
}
