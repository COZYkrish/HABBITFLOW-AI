import type { InsightDTO } from '../../types/insights.types';
import { ConfidenceBadge } from './ConfidenceBadge';
import { EvidencePanel } from './EvidencePanel';

const severityConfig = {
  critical: { icon: '⚠️', color: 'text-red-400', border: 'border-red-500/30', bg: 'bg-red-500/5' },
  high: { icon: '🔔', color: 'text-amber-400', border: 'border-amber-500/30', bg: 'bg-amber-500/5' },
  medium: { icon: '📊', color: 'text-blue-400', border: 'border-blue-500/30', bg: 'bg-blue-500/5' },
  low: { icon: '💡', color: 'text-emerald-400', border: 'border-emerald-500/30', bg: 'bg-emerald-500/5' },
  info: { icon: 'ℹ️', color: 'text-zinc-400', border: 'border-border/50', bg: 'bg-foreground/[0.02]' }
};

export const InsightCard = ({ insight }: { insight: InsightDTO }) => {
  const config = severityConfig[insight.severity] || severityConfig.info;

  return (
    <div className={`glass-card relative p-5 rounded-2xl border ${config.border} ${config.bg} transition-all hover:bg-foreground/[0.04]`}>
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl glass flex items-center justify-center text-xl shadow-inner">
            {config.icon}
          </div>
          <div>
            <h3 className="font-medium text-foreground text-sm">{insight.title}</h3>
            <p className={`text-xs capitalize ${config.color}`}>{insight.severity} Priority</p>
          </div>
        </div>
        <ConfidenceBadge confidence={insight.confidence} />
      </div>

      <p className="text-sm text-muted-foreground leading-relaxed">
        {insight.description}
      </p>

      {insight.recommendation && (
        <div className="mt-4 p-3 rounded-xl bg-foreground/[0.04] border border-border/30 border-l-2 border-l-primary">
          <p className="text-xs font-medium text-foreground mb-1 flex items-center gap-1.5">
            <span className="text-primary">✦</span> Recommendation
          </p>
          <p className="text-sm text-muted-foreground">{insight.recommendation}</p>
        </div>
      )}

      <EvidencePanel evidence={insight.evidence} />
    </div>
  );
};
