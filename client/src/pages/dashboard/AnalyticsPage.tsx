import { HeatmapSection } from '../../components/analytics/HeatmapSection';
import { WeeklySection } from '../../components/analytics/WeeklySection';
import { ProductivitySection } from '../../components/analytics/ProductivitySection';
import { CategorySection } from '../../components/analytics/CategorySection';
import ColorBends from '../../components/ui/ColorBends';

export default function AnalyticsPage() {
  return (
    <>
      <div className="fixed inset-0 z-[-1]">
        <ColorBends
          colors={["#ff5c7a", "#8a5cff", "#00ffd1"]}
          rotation={90}
          speed={0.12}
          scale={1}
          frequency={1}
          warpStrength={1}
          mouseInfluence={1}
          noise={0}
          parallax={0.5}
          iterations={1}
          intensity={2}
          bandWidth={2.5}
          transparent={true}
        />
      </div>
      <div className="flex flex-col gap-6 w-full max-w-6xl mx-auto pb-12 animate-fade-in relative z-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Analytics Engine</h1>
          <p className="text-zinc-400 mt-1">Deep dive into your habit history and productivity patterns.</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        <ProductivitySection />
      </div>

      <div className="grid grid-cols-1 gap-6">
        <HeatmapSection />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <WeeklySection />
        </div>
        <div>
          <CategorySection />
        </div>
      </div>
      </div>
    </>
  );
}
