import { Request, Response, NextFunction } from 'express';

// Standardized Error Response Format
export interface ApiError extends Error {
  statusCode?: number;
  errors?: any[];
}

export const errorHandler = (err: ApiError, req: Request, res: Response, next: NextFunction) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  
  // Follows Standard API Response Format for Errors
  res.status(statusCode).json({
    success: false,
    message,
    errors: err.errors || [],
  });
};

export const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({
    success: false,
    message: 'Resource not found',
    errors: [],
  });
};
