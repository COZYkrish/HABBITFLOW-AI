import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import path from 'path';
import rateLimit from 'express-rate-limit';
import { env } from './config/env';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';

const app = express();

// Middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}));
app.use(cors({ origin: env.FRONTEND_URL, credentials: true }));
app.use(morgan('dev'));
app.use(compression());
app.use(express.json());
app.use(cookieParser());

// Rate Limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: env.NODE_ENV === 'production' ? 500 : 2000,
  message: { success: false, message: 'Too many requests from this IP, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', apiLimiter);

// Static files
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));

// Health Check Endpoint (Standard API Response Format)
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'HabitFlow AI Server is running properly.',
    data: { timestamp: new Date().toISOString() },
    meta: {}
  });
});

import authRoutes from './modules/auth/auth.routes';
import dashboardRoutes from './modules/dashboard/dashboard.routes';
import habitRoutes from './modules/habit/habit.routes';
import categoryRoutes from './modules/habit/category.routes';
import analyticsRoutes from './modules/analytics/analytics.routes';
import insightsRoutes from './modules/insights/insights.routes';
import gamificationRoutes from './modules/gamification/gamification.routes';
import { reportsRouter } from './modules/reports/reports.routes';
import notificationsRoutes from './modules/notifications/notifications.routes';
import profileRoutes from './modules/profile/profile.routes';

// Feature-based module routes
app.use(`${env.API_PREFIX}/auth`, authRoutes);
app.use(`${env.API_PREFIX}/dashboard`, dashboardRoutes);
app.use(`${env.API_PREFIX}/habits`, habitRoutes);
app.use(`${env.API_PREFIX}/categories`, categoryRoutes);
app.use(`${env.API_PREFIX}/analytics`, analyticsRoutes);
app.use(`${env.API_PREFIX}/insights`, insightsRoutes);
app.use(`${env.API_PREFIX}/gamification`, gamificationRoutes);
app.use(`${env.API_PREFIX}/reports`, reportsRouter);
app.use(`${env.API_PREFIX}/notifications`, notificationsRoutes);
app.use(`${env.API_PREFIX}/profile`, profileRoutes);

// Error Handling
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
