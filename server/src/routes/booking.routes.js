import { Router } from 'express';
import { 
  checkAvailability, 
  createOnlineBooking, 
  getMyBookings, 
  getBookingById, 
  cancelBooking 
} from '../controllers/booking.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { 
  checkAvailabilitySchema, 
  createOnlineBookingSchema, 
  cancelBookingSchema 
} from '../validators/booking.validator.js';

const router = Router();

// Public / Auth Dry-Run Availability & Price Quote
router.post('/check-availability', validate(checkAvailabilitySchema), checkAvailability);

// Customer Online Booking (Protected)
router.post('/online', protect, validate(createOnlineBookingSchema), createOnlineBooking);

// Customer Bookings History (Protected)
router.get('/my-bookings', protect, getMyBookings);

// Single Booking Details (Protected)
router.get('/:id', protect, getBookingById);

// Cancel Booking (Protected)
router.post('/:id/cancel', protect, validate(cancelBookingSchema), cancelBooking);

export default router;
