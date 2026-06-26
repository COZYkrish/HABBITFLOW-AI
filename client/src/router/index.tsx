import { createBrowserRouter, Navigate } from 'react-router-dom';
import App from '../App';
import React, { Suspense } from 'react';
import { AuthGuard } from '../components/auth/AuthGuard';
import { GuestGuard } from '../components/auth/GuestGuard';

// Lazy load components
const Home = React.lazy(() => import('../pages/Home'));
const AuthLayout = React.lazy(() => import('../pages/Auth'));
const Dashboard = React.lazy(() => import('../pages/Dashboard'));
const NotFound = React.lazy(() => import('../pages/NotFound'));
const ErrorPage = React.lazy(() => import('../pages/ErrorPage'));
const PlaceholderPage = React.lazy(() => import('../pages/PlaceholderPage'));
const HabitsPage = React.lazy(() => import('../pages/dashboard/HabitsPage'));
const AnalyticsPage = React.lazy(() => import('../pages/dashboard/AnalyticsPage'));
const InsightsPage = React.lazy(() => import('../pages/dashboard/InsightsPage'));
const ReportsPage = React.lazy(() => import('../pages/dashboard/reports/ReportsPage'));
const NotificationsPage = React.lazy(() => import('../pages/dashboard/NotificationsPage'));
const AchievementsPage = React.lazy(() => import('../pages/gamification/AchievementsPage'));

// Auth Pages
const Login = React.lazy(() => import('../pages/auth/Login'));
const Register = React.lazy(() => import('../pages/auth/Register'));
const ForgotPassword = React.lazy(() => import('../pages/auth/ForgotPassword'));
const ResetPassword = React.lazy(() => import('../pages/auth/ResetPassword'));
const VerifyEmail = React.lazy(() => import('../pages/auth/VerifyEmail'));

const PageFallback = <div className="min-h-screen bg-background" />;
const WidgetFallback = <div />;

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: (
      <Suspense fallback={PageFallback}>
        <ErrorPage />
      </Suspense>
    ),
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={PageFallback}>
            <Home />
          </Suspense>
        ),
      },
      {
        path: 'auth',
        element: (
          <GuestGuard>
            <Suspense fallback={PageFallback}>
              <AuthLayout />
            </Suspense>
          </GuestGuard>
        ),
        children: [
          { index: true, element: <Navigate to="/auth/login" replace /> },
          { path: 'login', element: <Suspense fallback={WidgetFallback}><Login /></Suspense> },
          { path: 'register', element: <Suspense fallback={WidgetFallback}><Register /></Suspense> },
          { path: 'forgot-password', element: <Suspense fallback={WidgetFallback}><ForgotPassword /></Suspense> },
          { path: 'reset-password', element: <Suspense fallback={WidgetFallback}><ResetPassword /></Suspense> },
          { path: 'verify-email', element: <Suspense fallback={WidgetFallback}><VerifyEmail /></Suspense> },
        ],
      },
      {
        path: 'dashboard',
        element: (
          <AuthGuard>
            <Suspense fallback={PageFallback}>
              <Dashboard />
            </Suspense>
          </AuthGuard>
        ),
        children: [
          // Sub-routes — render inside DashboardLayout's <Outlet />
          { path: 'habits', element: <Suspense fallback={WidgetFallback}><HabitsPage /></Suspense> },
          { path: 'analytics', element: <Suspense fallback={WidgetFallback}><AnalyticsPage /></Suspense> },
          { path: 'insights', element: <Suspense fallback={WidgetFallback}><InsightsPage /></Suspense> },
          { path: 'gamification', element: <Suspense fallback={WidgetFallback}><AchievementsPage /></Suspense> },
          { path: 'reports', element: <Suspense fallback={WidgetFallback}><ReportsPage /></Suspense> },
          { path: 'notifications', element: <Suspense fallback={WidgetFallback}><NotificationsPage /></Suspense> },
          { path: 'achievements', element: <Suspense fallback={WidgetFallback}><AchievementsPage /></Suspense> },
          { path: 'profile', element: <Suspense fallback={WidgetFallback}><PlaceholderPage /></Suspense> },
          { path: 'settings', element: <Suspense fallback={WidgetFallback}><PlaceholderPage /></Suspense> },
        ],
      },
      {
        path: '*',
        element: (
          <Suspense fallback={PageFallback}>
            <NotFound />
          </Suspense>
        ),
      },
    ],
  },
]);
