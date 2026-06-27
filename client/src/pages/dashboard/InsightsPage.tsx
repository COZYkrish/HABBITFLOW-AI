import { motion } from 'framer-motion';
import { useInsightsOverview } from '../../hooks/useInsights';
import { InsightCard } from '../../components/insights/InsightCard';
import { staggerContainerVariants, staggerItemVariants, fadeUpVariants } from '../../animations/variants';
import { Loader2, Zap, AlertTriangle, TrendingUp, CalendarDays } from 'lucide-react';
import LineWaves from '../../components/ui/LineWaves';

export default function InsightsPage() {
  const { data, isLoading, error } = useInsightsOverview();

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-zinc-500" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[50vh] text-center max-w-md mx-auto">
        <div className="w-16 h-16 rounded-2xl bg-red-500/10 text-red-500 flex items-center justify-center mb-4">
          <AlertTriangle size={32} />
        </div>
        <h2 className="text-xl font-medium text-foreground mb-2">Engine Offline</h2>
        <p className="text-muted-foreground text-sm">
          Failed to process insights. Ensure you have tracked some habits so the intelligence engine has data to analyze.
        </p>
      </div>
    );
  }

  const { activeInsights, recommendations, productivity, weeklySummary } = data;

  return (
    <>
      <div className="fixed inset-0 z-[-1]">
        <LineWaves
          speed={0.1}
          innerLineCount={32}
          outerLineCount={36}
          warpIntensity={0.8}
          rotation={-45}
          edgeFadeWidth={0.05}
          colorCycleSpeed={0.7}
          brightness={0.2}
          color1="#ffffff"
          color2="#fcfafa"
          color3="#ffffff"
          enableMouseInteraction={true}
          mouseInfluence={2.0}
        />
      </div>
      <motion.div
        variants={fadeUpVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
      className="max-w-5xl mx-auto space-y-8"
    >
      <header>
        <h1 className="text-3xl font-light text-foreground tracking-tight mb-2">Intelligence Engine</h1>
        <p className="text-muted-foreground">Deterministic, rule-based analysis of your habit logs.</p>
      </header>

      {/* Overview Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card rounded-2xl p-5 flex flex-col gap-2">
          <div className="flex items-center gap-2 text-zinc-400 mb-1">
            <Zap size={16} /> <span className="text-xs uppercase tracking-wider font-medium">Productivity Score</span>
          </div>
          <div className="text-3xl font-medium text-foreground">{productivity.overallScore}</div>
          <p className="text-xs text-muted-foreground line-clamp-2">{productivity.reasoning}</p>
        </div>

        <div className="glass-card rounded-2xl p-5 flex flex-col gap-2">
          <div className="flex items-center gap-2 text-zinc-400 mb-1">
            <TrendingUp size={16} /> <span className="text-xs uppercase tracking-wider font-medium">Completion</span>
          </div>
          <div className="text-3xl font-medium text-foreground">{weeklySummary.completionPercentage}%</div>
          <p className="text-xs text-muted-foreground">{weeklySummary.habitsCompleted} logs this week</p>
        </div>

        <div className="glass-card rounded-2xl p-5 flex flex-col gap-2">
          <div className="flex items-center gap-2 text-zinc-400 mb-1">
            <AlertTriangle size={16} /> <span className="text-xs uppercase tracking-wider font-medium">Active Risks</span>
          </div>
          <div className="text-3xl font-medium text-foreground">
            {activeInsights.filter(i => i.severity === 'critical' || i.severity === 'high').length}
          </div>
          <p className="text-xs text-muted-foreground">Requires attention</p>
        </div>

        <div className="glass-card rounded-2xl p-5 flex flex-col gap-2">
          <div className="flex items-center gap-2 text-zinc-400 mb-1">
            <CalendarDays size={16} /> <span className="text-xs uppercase tracking-wider font-medium">Strongest Habit</span>
          </div>
          <div className="text-xl font-medium text-foreground truncate mt-1">
            {weeklySummary.strongestHabit || 'None'}
          </div>
          <p className="text-xs text-muted-foreground">Max streak: {weeklySummary.longestStreak}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Active Insights & Rules */}
        <div className="lg:col-span-2 space-y-6">
          <div>
            <h2 className="text-lg font-medium text-foreground mb-4">Active Insights</h2>
            {activeInsights.length === 0 ? (
              <div className="p-8 text-center border border-border/50 rounded-2xl border-dashed">
                <p className="text-muted-foreground text-sm">No active insights at the moment. Keep logging your habits!</p>
              </div>
            ) : (
              <motion.div 
                variants={staggerContainerVariants}
                initial="hidden"
                animate="visible"
                className="space-y-4"
              >
                {activeInsights.map(insight => (
                  <motion.div key={insight.id} variants={staggerItemVariants}>
                    <InsightCard insight={insight} />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </div>

        {/* Right Column: Recommendations */}
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-medium text-foreground mb-4">Recommendations</h2>
            {recommendations.length === 0 ? (
              <div className="p-8 text-center border border-border/50 rounded-2xl border-dashed">
                <p className="text-muted-foreground text-sm">Your routine looks solid. No recommendations right now.</p>
              </div>
            ) : (
              <motion.div 
                variants={staggerContainerVariants}
                initial="hidden"
                animate="visible"
                className="space-y-4"
              >
                {recommendations.map(rec => (
                  <motion.div key={rec.id} variants={staggerItemVariants}>
                    <div className="p-5 rounded-2xl border border-primary/20 bg-primary/5">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-primary text-lg">💡</span>
                        <h3 className="font-medium text-foreground text-sm">{rec.title}</h3>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{rec.recommendation}</p>
                      
                      <div className="text-xs p-2 rounded bg-background/50 border border-border/50">
                        <span className="text-emerald-400 font-medium">Expected Benefit:</span>
                        <p className="text-muted-foreground mt-0.5">{rec.expectedBenefit}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </div>

      </div>
    </motion.div>
    </>
  );
}
