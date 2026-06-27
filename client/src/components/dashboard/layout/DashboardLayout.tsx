import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TopNavbar } from './TopNavbar';
import { RightContextPanel } from './RightContextPanel';
import { useDashboard } from '../../../hooks/useDashboard';
import { DashboardSkeleton } from '../DashboardSkeleton';
import { WelcomeCard } from '../WelcomeCard';
import { StatCard } from '../StatCard';
import { ProgressRing } from '../ProgressRing';
import { ProductivityGauge } from '../ProductivityGauge';
import { TodayHabits } from '../TodayHabits';
import { QuoteCard } from '../QuoteCard';
import { QuickActionGrid } from '../QuickActionGrid';
import { ActivityTimeline } from '../ActivityTimeline';
import { WeeklySummaryCard } from '../WeeklySummaryCard';
import { ReminderList } from '../ReminderList';
import { SectionTitle } from '../SectionTitle';
import { useAuthStore } from '../../../store/authStore';
import { motion } from 'framer-motion';
import { HabitFormModal } from '../../habits/HabitFormModal';
import { DeleteDialog } from '../../habits/DeleteDialog';
import { ArchiveDialog } from '../../habits/ArchiveDialog';
import { InsightsPreviewWidget } from '../../insights/InsightsPreviewWidget';
import { LevelCard } from '../../gamification/LevelCard';
import Strands from '../../ui/Strands';
import GlassSurface from '../../ui/GlassSurface';

const ErrorCard = ({ message }: { message: string }) => (
  <div className="flex items-center justify-center min-h-[400px]">
    <div className="glass-card rounded-2xl p-8 text-center max-w-sm">
      <span className="text-3xl mb-4 block" aria-hidden="true">◌</span>
      <p className="text-sm font-medium text-foreground mb-1">Unable to load dashboard</p>
      <p className="text-xs text-muted-foreground">{message}</p>
    </div>
  </div>
);

/**
 * DashboardLayout — root layout for all authenticated dashboard pages.
 * Manages sidebar state and composes all dashboard widgets.
 */
export const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { data, isLoading, error } = useDashboard();
  const { user } = useAuthStore();
  const location = useLocation();
  const isDashboardRoot = location.pathname === '/dashboard';

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  return (
    <div className="min-h-screen bg-background flex relative overflow-hidden">
      {/* Dynamic Background Effect */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {isDashboardRoot && (
          <Strands
            colors={["#F97316","#7C3AED","#06B6D4"]}
            count={3}
            speed={0.5}
            amplitude={1}
            waviness={1}
            thickness={0.7}
            glow={3}
            taper={2.6}
            spread={1}
            intensity={0.6}
            saturation={1.5}
            opacity={1}
            scale={2.6}
            glass={false}
            refraction={1}
            dispersion={1}
            glassSize={1}
          />
        )}
      </div>

      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={toggleSidebar} />

      {/* Spacer for fixed sidebar on desktop */}
      <motion.div
        animate={{ width: sidebarOpen ? 220 : 64 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="hidden lg:block flex-shrink-0"
      />

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0 relative z-10">
        <TopNavbar 
          user={user || { name: 'Guest' }} 
          onMenuToggle={toggleSidebar} 
          isSidebarOpen={sidebarOpen} 
        />

        <div className="flex-1 flex overflow-hidden">
          {/* Scrollable content */}
          <main
            className="flex-1 overflow-y-auto no-scrollbar"
            id="main-content"
            aria-label="Dashboard content"
          >
            {isLoading && isDashboardRoot ? (
              <DashboardSkeleton />
            ) : error && isDashboardRoot ? (
              <ErrorCard message={error.message} />
            ) : isDashboardRoot ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
                className="p-5 md:p-7 space-y-6 max-w-none w-full"
              >
                {/* Welcome card */}
                <WelcomeCard name={data?.user?.name ?? user?.name ?? 'there'} />

                {/* Gamification Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <LevelCard currentLevel={3} currentXP={850} xpRequired={1400} />
                  {/* Additional Gamification Widget can go here later, like a featured challenge */}
                </div>

                {/* Stats row */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <ProgressRing
                    value={data?.todayHabits?.length ? Math.round((data.todayHabits.filter(h => h.status === 'completed').length / data.todayHabits.length) * 100) : 0}
                    label="Daily"
                    subLabel="Completion"
                    size={130}
                    strokeWidth={8}
                    className="relative z-0 overflow-hidden rounded-2xl p-5"
                  />
                  <StatCard
                    label="Current Streak"
                    value={data?.currentStreak ?? 0}
                    icon="🔥"
                    subLabel="days"
                    delay={0.1}
                  />
                  <StatCard
                    label="Best Streak"
                    value={data?.bestStreak ?? 0}
                    icon="⭐"
                    subLabel="days"
                    delay={0.2}
                  />
                  <ProductivityGauge score={data?.productivityScore ?? 0} />
                </div>

                {/* Dashboard Main Grid */}
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
                  {/* Left Column: Today's Habits */}
                  <div className="relative rounded-2xl p-6 h-full flex flex-col z-0">
                    <div className="absolute inset-0 z-[-1] pointer-events-none glass-card rounded-2xl">
                    </div>
                    <SectionTitle title="Today's Habits" subtitle={`${data?.todayHabits?.length ?? 0} scheduled`} />
                    <div className="flex-1 min-h-0">
                      <TodayHabits habits={data?.todayHabits ?? []} />
                    </div>
                  </div>

                  {/* Middle Column: Quick Actions */}
                  <div className="relative rounded-2xl p-6 h-full flex flex-col z-0">
                    <div className="absolute inset-0 z-[-1] pointer-events-none">
                      <GlassSurface width="100%" height="100%" borderRadius={16} />
                    </div>
                    <SectionTitle title="Quick Actions" />
                    <div className="flex-1 min-h-0 h-full">
                      <QuickActionGrid />
                    </div>
                  </div>

                  {/* Right Column: Widgets */}
                  <div className="flex flex-col gap-5">
                    <InsightsPreviewWidget />
                    <WeeklySummaryCard summary={data?.weeklySummary ?? { completionRate: 0, habitsCompleted: 0, totalHabits: 0, streak: 0, dailyRates: [0,0,0,0,0,0,0] }} />
                    <QuoteCard />
                  </div>
                </div>

                {/* Activity + Reminders */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="relative rounded-2xl p-6 z-0">
                    <div className="absolute inset-0 z-[-1] pointer-events-none">
                      <GlassSurface width="100%" height="100%" borderRadius={16} />
                    </div>
                    <SectionTitle title="Recent Activity" />
                    <ActivityTimeline items={data?.recentActivity ?? []} />
                  </div>
                  <div className="relative rounded-2xl p-6 z-0">
                    <div className="absolute inset-0 z-[-1] pointer-events-none">
                      <GlassSurface width="100%" height="100%" borderRadius={16} />
                    </div>
                    <SectionTitle title="Upcoming Reminders" />
                    <ReminderList />
                  </div>
                </div>
              </motion.div>
            ) : null}

            {/* Sub-routes (e.g. /dashboard/profile) render here */}
            <Outlet />
          </main>

          {/* Right context panel */}
          {isDashboardRoot && <RightContextPanel data={data} />}
        </div>
      </div>

      {/* Global Dashboard Modals */}
      <HabitFormModal mode="create" />
      <HabitFormModal mode="edit" />
      <DeleteDialog />
      <ArchiveDialog />
    </div>
  );
};
