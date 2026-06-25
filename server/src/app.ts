import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import { env } from './config/env';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';

const app = express();

// Middleware
app.use(helmet());
app.use(cors({ origin: env.FRONTEND_URL, credentials: true }));
app.use(morgan('dev'));
app.use(compression());
app.use(express.json());
app.use(cookieParser());

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

// Feature-based module routes
app.use(`${env.API_PREFIX}/auth`, authRoutes);
// app.use(`${env.API_PREFIX}/habits`, habitRoutes);

// Error Handling
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
