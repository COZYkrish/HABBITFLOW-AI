import { useInsightsOverview } from '../../hooks/useInsights';
import { Loader2, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const InsightsPreviewWidget = () => {
  const { data, isLoading } = useInsightsOverview();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="glass-card rounded-2xl p-6 flex flex-col justify-center items-center min-h-[150px]">
        <Loader2 className="w-6 h-6 animate-spin text-zinc-500 mb-2" />
        <span className="text-xs text-muted-foreground">Loading Intelligence Engine...</span>
      </div>
    );
  }

  if (!data || (!data.activeInsights.length && !data.recommendations.length)) {
    return null;
  }

  const topRecommendation = data.recommendations[0];
  const criticalRisk = data.activeInsights.find(i => i.severity === 'critical' || i.severity === 'high');

  return (
    <div className="glass-card rounded-2xl p-6 relative overflow-hidden group">
      {/* Decorative background gradient */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-colors duration-500 pointer-events-none" />
      
      <div className="flex justify-between items-center mb-4 relative z-10">
        <h3 className="font-medium text-foreground flex items-center gap-2">
          <span className="text-primary">💡</span> Intelligence Preview
        </h3>
        <button 
          onClick={() => navigate('/dashboard/insights')}
          className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
        >
          View All <ArrowRight size={12} />
        </button>
      </div>

      <div className="space-y-3 relative z-10">
        {criticalRisk && (
          <div className="p-3 rounded-xl border border-red-500/20 bg-red-500/5">
            <div className="flex items-center gap-2 mb-1 text-red-400">
              <span className="text-xs font-medium uppercase tracking-wider">⚠️ Risk Detected</span>
            </div>
            <p className="text-sm text-foreground">{criticalRisk.title}</p>
            <p className="text-xs text-muted-foreground mt-0.5 truncate">{criticalRisk.recommendation}</p>
          </div>
        )}

        {topRecommendation && !criticalRisk && (
          <div className="p-3 rounded-xl border border-primary/20 bg-primary/5">
            <div className="flex items-center gap-2 mb-1 text-primary">
              <span className="text-xs font-medium uppercase tracking-wider">✦ Today's Focus</span>
            </div>
            <p className="text-sm text-foreground">{topRecommendation.title}</p>
            <p className="text-xs text-muted-foreground mt-0.5 truncate">{topRecommendation.recommendation}</p>
          </div>
        )}
      </div>
    </div>
  );
};
