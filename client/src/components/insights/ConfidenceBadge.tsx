
interface ConfidenceBadgeProps {
  confidence: number; // 0-100
}

export const ConfidenceBadge = ({ confidence }: ConfidenceBadgeProps) => {
  let color = 'text-zinc-400 bg-zinc-900/50';
  let label = 'Low Confidence';

  if (confidence >= 85) {
    color = 'text-emerald-400 bg-emerald-900/30';
    label = 'Very High Confidence';
  } else if (confidence >= 65) {
    color = 'text-blue-400 bg-blue-900/30';
    label = 'High Confidence';
  } else if (confidence >= 40) {
    color = 'text-amber-400 bg-amber-900/30';
    label = 'Medium Confidence';
  }

  return (
    <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded border border-white/5 text-[10px] uppercase tracking-wider font-medium ${color}`} title={`${confidence}% data certainty`}>
      <div className="flex gap-0.5 items-end h-2.5">
        <div className={`w-0.5 rounded-full ${confidence >= 40 ? 'bg-current h-1' : 'bg-current/30 h-1'}`} />
        <div className={`w-0.5 rounded-full ${confidence >= 65 ? 'bg-current h-1.5' : 'bg-current/30 h-1.5'}`} />
        <div className={`w-0.5 rounded-full ${confidence >= 85 ? 'bg-current h-2.5' : 'bg-current/30 h-2.5'}`} />
      </div>
      {label}
    </div>
  );
};
