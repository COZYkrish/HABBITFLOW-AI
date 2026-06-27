/**
 * HabitFlow AI — Cinematic Landing Page
 * Kinetic Typography redesign: 6-act storytelling experience.
 * Each scene flows into the next with relentless motion and aggressive scale.
 */
import { lazy, Suspense } from 'react';
import { KineticNavbar } from '../components/navigation/KineticNavbar';

// Lazy-load each scene for code-splitting & performance
const HeroScene       = lazy(() => import('./landing/HeroScene'));
const WhyHabitsScene  = lazy(() => import('./landing/WhyHabitsScene'));
const ProductScene    = lazy(() => import('./landing/ProductScene'));
const AnalyticsScene  = lazy(() => import('./landing/AnalyticsScene'));
const InsightsScene   = lazy(() => import('./landing/InsightsScene'));
const GetStartedScene = lazy(() => import('./landing/GetStartedScene'));

/** Minimal scene suspense fallback — avoids layout shift */
function SceneFallback() {
  return (
    <div
      className="min-h-[40vh] flex items-center justify-center bg-kinetic-background"
      aria-hidden="true"
    />
  );
}

export default function Home() {
  return (
    <div className="bg-kinetic-background min-h-screen">
      {/* Kinetic floating nav */}
      <KineticNavbar />

      {/* Main page content */}
      <main id="main-content" tabIndex={-1}>
        {/* Act I — The Wake-Up Call */}
        <Suspense fallback={<SceneFallback />}>
          <HeroScene />
        </Suspense>

        {/* Act II — The Harsh Truth */}
        <Suspense fallback={<SceneFallback />}>
          <WhyHabitsScene />
        </Suspense>

        {/* Act III — The Anatomy of a Perfect System */}
        <Suspense fallback={<SceneFallback />}>
          <ProductScene />
        </Suspense>

        {/* Act IV — The Mirror */}
        <Suspense fallback={<SceneFallback />}>
          <AnalyticsScene />
        </Suspense>

        {/* Act V — Insights from the Void */}
        <Suspense fallback={<SceneFallback />}>
          <InsightsScene />
        </Suspense>

        {/* Act VI — The Ultimatum */}
        <Suspense fallback={<SceneFallback />}>
          <GetStartedScene />
        </Suspense>
      </main>
    </div>
  );
}
