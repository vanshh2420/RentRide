import { Router } from 'express';
import { 
  createOfflineBooking, 
  getVendorBookings, 
  startTrip, 
  completeTrip, 
  getVendorStats 
} from '../controllers/vendor.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { authorize } from '../middleware/role.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { 
  createOfflineBookingSchema, 
  getVendorBookingsSchema,
  startTripSchema,
  completeTripSchema
} from '../validators/vendor.validator.js';
import { ROLES } from '../constants/roles.js';

const router = Router();

// Protect all vendor routes
router.use(protect, authorize(ROLES.VENDOR, ROLES.ADMIN));

// Vendor Dashboard KPI Stats
router.get('/stats', getVendorStats);

// Create offline walk-in booking
router.post('/bookings/offline', validate(createOfflineBookingSchema), createOfflineBooking);

// Get vendor unified fleet bookings (Online + Offline)
router.get('/bookings', validate(getVendorBookingsSchema), getVendorBookings);

// Handover Actions (Start & Complete Trip)
router.post('/bookings/:id/start-trip', validate(startTripSchema), startTrip);
router.post('/bookings/:id/complete-trip', validate(completeTripSchema), completeTrip);

export default router;
