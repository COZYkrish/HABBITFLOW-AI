import type { ReactNode } from 'react';

interface ChartCardProps {
  title: string;
  description?: string;
  children: ReactNode;
}

export const ChartCard = ({ title, description, children }: ChartCardProps) => {
  return (
    <div className="glass-card rounded-2xl p-6 shadow-sm relative overflow-hidden">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-zinc-100">{title}</h3>
        {description && <p className="text-sm text-zinc-400 mt-1">{description}</p>}
      </div>
      <div className="w-full">
        {children}
      </div>
    </div>
  );
};
