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

// Auth Pages
const Login = React.lazy(() => import('../pages/auth/Login'));
const Register = React.lazy(() => import('../pages/auth/Register'));
const ForgotPassword = React.lazy(() => import('../pages/auth/ForgotPassword'));
const ResetPassword = React.lazy(() => import('../pages/auth/ResetPassword'));
const VerifyEmail = React.lazy(() => import('../pages/auth/VerifyEmail'));

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: (
      <Suspense fallback={<div className="min-h-screen bg-background" />}>
        <ErrorPage />
      </Suspense>
    ),
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<div className="min-h-screen bg-background" />}>
            <Home />
          </Suspense>
        ),
      },
      {
        path: 'auth',
        element: (
          <GuestGuard>
            <Suspense fallback={<div className="min-h-screen bg-background" />}>
              <AuthLayout />
            </Suspense>
          </GuestGuard>
        ),
        children: [
          { index: true, element: <Navigate to="/auth/login" replace /> },
          { path: 'login', element: <Suspense fallback={<div />}><Login /></Suspense> },
          { path: 'register', element: <Suspense fallback={<div />}><Register /></Suspense> },
          { path: 'forgot-password', element: <Suspense fallback={<div />}><ForgotPassword /></Suspense> },
          { path: 'reset-password', element: <Suspense fallback={<div />}><ResetPassword /></Suspense> },
          { path: 'verify-email', element: <Suspense fallback={<div />}><VerifyEmail /></Suspense> },
        ]
      },
      {
        path: 'dashboard',
        element: (
          <AuthGuard>
            <Suspense fallback={<div className="min-h-screen bg-background" />}>
              <Dashboard />
            </Suspense>
          </AuthGuard>
        ),
      },
      {
        path: '*',
        element: (
          <Suspense fallback={<div className="min-h-screen bg-background" />}>
            <NotFound />
          </Suspense>
        ),
      },
    ],
  },
]);
