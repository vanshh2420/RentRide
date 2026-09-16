import { z } from 'zod';
import { RENTAL_PLANS } from '../constants/status.js';

export const checkAvailabilitySchema = {
  body: z.object({
    vehicleId: z.string().min(1, 'Vehicle ID is required'),
    rentalPlan: z.enum(Object.values(RENTAL_PLANS)),
    startDateTime: z.string().datetime({ message: 'Valid ISO start date/time is required' }),
    endDateTime: z.string().datetime({ message: 'Valid ISO end date/time is required' }),
    couponCode: z.string().optional()
  })
};

export const createOnlineBookingSchema = {
  body: z.object({
    vehicleId: z.string().min(1, 'Vehicle ID is required'),
    rentalPlan: z.enum(Object.values(RENTAL_PLANS)),
    startDateTime: z.string().datetime({ message: 'Valid ISO start date/time is required' }),
    endDateTime: z.string().datetime({ message: 'Valid ISO end date/time is required' }),
    couponCode: z.string().optional()
  })
};

export const cancelBookingSchema = {
  body: z.object({
    reason: z.string().max(300).optional()
  })
};
