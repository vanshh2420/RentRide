import mongoose from 'mongoose';
import { Router } from 'express';
import { ApiResponse } from '../utils/ApiResponse.js';
import authRoutes from './auth.routes.js';
import categoryRoutes from './category.routes.js';
import vehicleRoutes from './vehicle.routes.js';
import bookingRoutes from './booking.routes.js';
import vendorRoutes from './vendor.routes.js';
import couponRoutes from './coupon.routes.js';
import paymentRoutes from './payment.routes.js';
import adminRoutes from './admin.routes.js';
import reviewRoutes from './review.routes.js';
import notificationRoutes from './notification.routes.js';
import maintenanceRoutes from './maintenance.routes.js';
import aiRoutes from './ai.routes.js';
import userRoutes from './user.routes.js';
import fuelPriceRoutes from './fuelPrice.routes.js';
import tripRoutes from './trip.routes.js';
import catalogRoutes from './catalog.routes.js';

const router = Router();

// Health Check Endpoint
router.get('/health', (req, res) => {
  const stateMap = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting'
  };
  const dbState = mongoose.connection.readyState;
  const isHealthy = dbState === 1;

  return res.status(isHealthy ? 200 : 503).json(
    new ApiResponse(
      isHealthy ? 200 : 503,
      {
        status: isHealthy ? 'UP' : 'DEGRADED',
        service: 'RentRide API Server',
        database: {
          status: stateMap[dbState] || 'unknown',
          host: mongoose.connection.host || 'unknown',
          name: mongoose.connection.name || 'rentride'
        },
        timestamp: new Date().toISOString(),
        uptime: `${Math.floor(process.uptime())}s`
      },
      isHealthy ? 'RentRide Backend Service is running healthy' : 'Database connection unavailable'
    )
  );
});

// Domain Routes
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/categories', categoryRoutes);
router.use('/vehicles', vehicleRoutes);
router.use('/bookings', bookingRoutes);
router.use('/vendor', vendorRoutes);
router.use('/coupons', couponRoutes);
router.use('/payments', paymentRoutes);
router.use('/admin', adminRoutes);
router.use('/reviews', reviewRoutes);
router.use('/notifications', notificationRoutes);
router.use('/maintenance', maintenanceRoutes);
router.use('/ai', aiRoutes);
router.use('/fuel-prices', fuelPriceRoutes);
router.use('/trips', tripRoutes);
router.use('/catalog', catalogRoutes);

export default router;
