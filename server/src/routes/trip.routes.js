import { Router } from 'express';
import { recordTelemetry, getLiveTrip } from '../controllers/trip.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = Router();

// Protected: Only authenticated customer or vendor for this booking
router.post('/:bookingId/telemetry', protect, recordTelemetry);
router.get('/:bookingId/live', protect, getLiveTrip);

export default router;
