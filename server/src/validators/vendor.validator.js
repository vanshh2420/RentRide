import { z } from 'zod';
import { RENTAL_PLANS } from '../constants/status.js';
import { validateRentalBookingPayload } from './booking.validator.js';

export const createOfflineBookingSchema = {
  body: z.object({
    vehicleId: z.string().min(1, 'Vehicle ID is required'),
    rentalPlan: z.enum(Object.values(RENTAL_PLANS)),
    startDateTime: z.string().datetime({ message: 'Valid ISO start date/time is required' }),
    endDateTime: z.string().datetime({ message: 'Valid ISO end date/time is required' }),
    duration: z.coerce.number().optional(),
    durationHours: z.coerce.number().optional(),
    offlineCustomer: z.object({
      name: z.string().min(2, 'Customer name is required'),
      phone: z.string().min(8, 'Valid phone number is required'),
      drivingLicenseNumber: z.string().min(4, 'Driving license number is required'),
      notes: z.string().optional()
    }),
    paymentMethod: z.enum(['offline_cash', 'upi', 'card', 'other']).default('offline_cash'),
    isPaymentCollected: z.boolean().default(true),
    customBasePrice: z.coerce.number().min(0).optional()
  }).superRefine(validateRentalBookingPayload)
};

export const getVendorBookingsSchema = {
  query: z.object({
    bookingType: z.enum(['ALL', 'ONLINE', 'OFFLINE']).optional().default('ALL'),
    status: z.string().optional().default('ALL'),
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).max(50).default(20)
  })
};

export const startTripSchema = {
  body: z.object({
    startOdometer: z.coerce.number().min(0, 'Start odometer reading is required'),
    notes: z.string().optional()
  })
};

export const completeTripSchema = {
  body: z.object({
    endOdometer: z.coerce.number().min(0, 'Return odometer reading is required'),
    fuelLevel: z.enum(['FULL', 'THREE_QUARTERS', 'HALF', 'QUARTER', 'EMPTY']).default('FULL'),
    damageReport: z.string().optional(),
    extraCharges: z.coerce.number().min(0).default(0),
    securityDepositRefund: z.coerce.number().min(0).optional()
  })
};
