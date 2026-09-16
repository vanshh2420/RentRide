import { ApiError } from '../utils/ApiError.js';
import { ENV } from '../config/env.js';
import { logger } from '../utils/logger.js';
import { ZodError } from 'zod';

/**
 * Global centralized error handler middleware
 */
export const errorHandler = (err, req, res, next) => {
  let error = err;

  // Handle Zod Validation Errors
  if (err instanceof ZodError) {
    const formattedErrors = err.errors.map((e) => ({
      field: e.path.join('.'),
      message: e.message
    }));
    error = new ApiError(400, 'Validation Error', formattedErrors);
  }
  // Handle Mongoose CastError (Invalid ObjectId)
  else if (err.name === 'CastError') {
    error = new ApiError(400, `Resource not found with invalid ID: ${err.value}`);
  }
  // Handle Mongoose Duplicate Key Error
  else if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'Field';
    error = new ApiError(409, `${field} already exists. Please use another value.`);
  }
  // Handle Mongoose ValidationError
  else if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((val) => val.message);
    error = new ApiError(400, `Validation Failed: ${messages.join(', ')}`);
  }
  // Handle JWT Invalid Token
  else if (err.name === 'JsonWebTokenError') {
    error = new ApiError(401, 'Invalid authentication token');
  }
  // Handle JWT Expired Token
  else if (err.name === 'TokenExpiredError') {
    error = new ApiError(401, 'Authentication token expired. Please login again');
  }
  // Default to Generic ApiError if not already an ApiError
  else if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode || 500;
    const message = error.message || 'Internal Server Error';
    error = new ApiError(statusCode, message, [], err.stack);
  }

  // Log server errors
  if (error.statusCode >= 500) {
    logger.error(`[${req.method}] ${req.originalUrl} - ${error.message}`, error);
  }

  return res.status(error.statusCode).json({
    success: false,
    statusCode: error.statusCode,
    message: error.message,
    errors: error.errors || [],
    stack: ENV.NODE_ENV === 'development' ? error.stack : undefined
  });
};
