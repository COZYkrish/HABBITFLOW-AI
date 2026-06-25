import { createBrowserRouter } from 'react-router-dom';
import App from '../App';
import React, { Suspense } from 'react';

// Lazy load placeholder components
const Home = React.lazy(() => import('../pages/Home'));
const Auth = React.lazy(() => import('../pages/Auth'));
const Dashboard = React.lazy(() => import('../pages/Dashboard'));
const NotFound = React.lazy(() => import('../pages/NotFound'));
const ErrorPage = React.lazy(() => import('../pages/ErrorPage'));

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: (
      <Suspense fallback={<div>Loading...</div>}>
        <ErrorPage />
      </Suspense>
    ),
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <Home />
          </Suspense>
        ),
      },
      {
        path: 'auth',
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <Auth />
          </Suspense>
        ),
      },
      {
        path: 'dashboard',
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <Dashboard />
          </Suspense>
        ),
      },
      {
        path: '*',
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <NotFound />
          </Suspense>
        ),
      },
    ],
  },
]);
