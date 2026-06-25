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
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={toggleSidebar} />

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0">
        <TopNavbar onMenuToggle={toggleSidebar} isSidebarOpen={sidebarOpen} />

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
                className="p-5 md:p-7 space-y-6 max-w-[1200px] mx-auto"
              >
                {/* Welcome card */}
                <WelcomeCard name={data?.user?.name ?? user?.name ?? 'there'} />

                {/* Stats row */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <ProgressRing
                    value={data?.productivityScore ?? 0}
                    label="Daily"
                    subLabel="Completion"
                    size={130}
                    strokeWidth={8}
                    className="glass-card rounded-2xl p-5"
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

                {/* Today's habits + Quick Actions */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                  <div className="lg:col-span-2 glass-card rounded-2xl p-6">
                    <SectionTitle title="Today's Habits" subtitle={`${data?.todayHabits?.length ?? 0} scheduled`} />
                    <TodayHabits habits={data?.todayHabits ?? []} />
                  </div>

                  <div className="glass-card rounded-2xl p-6">
                    <SectionTitle title="Quick Actions" />
                    <QuickActionGrid />
                  </div>
                </div>

                {/* Weekly Summary + Quote */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <WeeklySummaryCard summary={data?.weeklySummary ?? { completionRate: 0, habitsCompleted: 0, totalHabits: 0, streak: 0, dailyRates: [0,0,0,0,0,0,0] }} />
                  <QuoteCard />
                </div>

                {/* Activity + Reminders */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="glass-card rounded-2xl p-6">
                    <SectionTitle title="Recent Activity" />
                    <ActivityTimeline items={data?.recentActivity ?? []} />
                  </div>
                  <div className="glass-card rounded-2xl p-6">
                    <SectionTitle title="Upcoming Reminders" />
                    <ReminderList reminders={data?.upcomingReminders ?? []} />
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
