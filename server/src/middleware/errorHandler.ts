import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

// Standardized Error Response Format
export interface ApiError extends Error {
  statusCode?: number;
  errors?: any[];
}

export const errorHandler = (err: ApiError | ZodError, req: Request, res: Response, next: NextFunction) => {
  let statusCode = (err as ApiError).statusCode || 500;
  let message = err.message || 'Internal Server Error';
  let errors = (err as ApiError).errors || [];

  if (err instanceof ZodError) {
    statusCode = 400;
    message = 'Validation failed';
    errors = err.errors;
  }

  if (statusCode === 500) {
    console.error('[errorHandler] 500 Error:', err);
  }

  // Follows Standard API Response Format for Errors
  res.status(statusCode).json({
    success: false,
    message,
    errors,
  });
};

export const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({
    success: false,
    message: 'Resource not found',
    errors: [],
  });
};
