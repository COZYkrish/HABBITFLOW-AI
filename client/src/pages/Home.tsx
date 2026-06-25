/**
 * HabitFlow AI — Landing Page
 * Phase 2: Cinematic storytelling experience. Composes all 6 scenes.
 */
import { lazy, Suspense } from 'react';
import { Navbar } from '../components/navigation/Navbar';
import { Footer } from '../components/layout/Footer';

// Lazy-load each scene for code-splitting & performance
const HeroScene      = lazy(() => import('./landing/HeroScene'));
const WhyHabitsScene = lazy(() => import('./landing/WhyHabitsScene'));
const ProductScene   = lazy(() => import('./landing/ProductScene'));
const AnalyticsScene = lazy(() => import('./landing/AnalyticsScene'));
const InsightsScene  = lazy(() => import('./landing/InsightsScene'));
const GetStartedScene = lazy(() => import('./landing/GetStartedScene'));

/** Minimal scene suspense fallback — avoids layout shift */
function SceneFallback() {
  return <div className="min-h-[40vh] flex items-center justify-center" aria-hidden="true" />;
}

export default function Home() {
  return (
    <>
      {/* Floating nav */}
      <Navbar />

      {/* Main page content */}
      <main id="main-content" tabIndex={-1}>
        {/* Scene 1 */}
        <Suspense fallback={<SceneFallback />}>
          <HeroScene />
        </Suspense>

        {/* Scene 2 */}
        <Suspense fallback={<SceneFallback />}>
          <WhyHabitsScene />
        </Suspense>

        {/* Scene 3 */}
        <Suspense fallback={<SceneFallback />}>
          <ProductScene />
        </Suspense>

        {/* Scene 4 */}
        <Suspense fallback={<SceneFallback />}>
          <AnalyticsScene />
        </Suspense>

        {/* Scene 5 */}
        <Suspense fallback={<SceneFallback />}>
          <InsightsScene />
        </Suspense>

        {/* Scene 6 */}
        <Suspense fallback={<SceneFallback />}>
          <GetStartedScene />
        </Suspense>
      </main>

      <Footer />
    </>
  );
}
