import app from './app.js';
import { connectDB } from './config/db.js';
import { ENV } from './config/env.js';
import { logger } from './utils/logger.js';
import { FuelPriceService } from './services/fuelPrice.service.js';

const startServer = async () => {
  try {
    // 1. Connect to Database (with automatic fallback in development)
    await connectDB();
    await FuelPriceService.seedInitialFuelPrices();

    // 2. Start HTTP Server
    const server = app.listen(ENV.PORT, () => {
      logger.info(`=========================================`);
      logger.info(` RentRide Server running in [${ENV.NODE_ENV}] mode`);
      logger.info(` Base URL: http://localhost:${ENV.PORT}`);
      logger.info(` Health Check: http://localhost:${ENV.PORT}/api/health`);
      logger.info(` Categories API: http://localhost:${ENV.PORT}/api/categories`);
      logger.info(`=========================================`);
    });

    // Graceful Shutdown Handlers
    const shutdown = (signal) => {
      logger.info(`${signal} received. Shutting down gracefully...`);
      server.close(() => {
        logger.info('HTTP server closed.');
        process.exit(0);
      });
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

