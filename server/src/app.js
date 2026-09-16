import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import morgan from 'morgan';
import { ENV } from './config/env.js';
import { errorHandler } from './middleware/error.middleware.js';
import { apiRateLimiter } from './middleware/rateLimiter.middleware.js';
import { ApiError } from './utils/ApiError.js';
import apiRouter from './routes/index.js';

const app = express();

// Security Middlewares
app.use(helmet());
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, postman) or matching client url
      if (!origin || origin === ENV.CLIENT_URL || origin.startsWith('http://localhost')) {
        callback(null, true);
      } else {
        callback(new Error('Blocked by CORS policy'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
  })
);

// Logging
if (ENV.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Request Parsers
app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true, limit: '16kb' }));
app.use(cookieParser());

// Rate Limiting
app.use('/api', apiRateLimiter);

// API Routes
app.use('/api', apiRouter);

// 404 Route Handler
app.use('*', (req, res, next) => {
  next(new ApiError(404, `Route ${req.originalUrl} not found on this server`));
});

// Centralized Error Handling Middleware
app.use(errorHandler);

export default app;
