import { z } from 'zod';
import { RENTAL_PLANS } from '../constants/status.js';

/**
 * Centralized validator for rental duration and plan constraints
 */
export const validateRentalBookingPayload = (data, ctx) => {
  const start = new Date(data.startDateTime);
  const end = new Date(data.endDateTime);

  if (isNaN(start.getTime())) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['startDateTime'],
      message: 'Valid ISO start date/time is required'
    });
    return;
  }

  if (isNaN(end.getTime())) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['endDateTime'],
      message: 'Valid ISO end date/time is required'
    });
    return;
  }

  const durationMs = end.getTime() - start.getTime();
  if (durationMs <= 0) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['endDateTime'],
      message: 'End date/time must be strictly after start date/time'
    });
    return;
  }

  // Exact duration in hours
  const calculatedHours = durationMs / (1000 * 60 * 60);

  // If explicit duration is supplied in payload, verify it matches
  const explicitDuration = data.duration ?? data.durationHours;
  if (explicitDuration !== undefined) {
    if (typeof explicitDuration !== 'number' || isNaN(explicitDuration) || !isFinite(explicitDuration)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['duration'],
        message: 'Duration must be a valid numeric value'
      });
      return;
    }

    if (!Number.isInteger(explicitDuration)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['duration'],
        message: 'Duration must be a whole number of hours'
      });
      return;
    }

    if (Math.abs(calculatedHours - explicitDuration) > 0.01) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['duration'],
        message: `Duration (${explicitDuration}h) does not match the time difference between start and end (${calculatedHours}h)`
      });
      return;
    }
  }

  // Validate rental plan constraints against duration
  if (data.rentalPlan === RENTAL_PLANS.TWELVE_HOURS) {
    if (Math.abs(calculatedHours - 12) > 0.01) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['duration'],
        message: '12-Hour rental plan requires a duration of exactly 12 hours'
      });
    }
  } else if (data.rentalPlan === RENTAL_PLANS.TWENTY_FOUR_HOURS) {
    if (Math.abs(calculatedHours - 24) > 0.01) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['duration'],
        message: '24-Hour rental plan requires a duration of exactly 24 hours'
      });
    }
  } else if (data.rentalPlan === RENTAL_PLANS.HOURLY) {
    if (!Number.isInteger(calculatedHours) && Math.abs(calculatedHours - Math.round(calculatedHours)) > 0.001) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['duration'],
        message: 'Hourly rental duration must be a whole number of hours'
      });
      return;
    }

    const roundedHours = Math.round(calculatedHours);
    if (roundedHours < 1) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['duration'],
        message: 'Hourly rental duration must be at least 1 hour'
      });
      return;
    }

    if (roundedHours > 24) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['duration'],
        message: 'Hourly rental duration cannot exceed 24 hours. For longer rentals, please select the 24-Hour plan'
      });
      return;
    }
  }
};

export const checkAvailabilitySchema = {
  body: z.object({
    vehicleId: z.string().min(1, 'Vehicle ID is required'),
    rentalPlan: z.enum(Object.values(RENTAL_PLANS)),
    startDateTime: z.string().datetime({ message: 'Valid ISO start date/time is required' }),
    endDateTime: z.string().datetime({ message: 'Valid ISO end date/time is required' }),
    duration: z.coerce.number().optional(),
    durationHours: z.coerce.number().optional(),
    couponCode: z.string().optional()
  }).superRefine(validateRentalBookingPayload)
};

export const createOnlineBookingSchema = {
  body: z.object({
    vehicleId: z.string().min(1, 'Vehicle ID is required'),
    rentalPlan: z.enum(Object.values(RENTAL_PLANS)),
    startDateTime: z.string().datetime({ message: 'Valid ISO start date/time is required' }),
    endDateTime: z.string().datetime({ message: 'Valid ISO end date/time is required' }),
    duration: z.coerce.number().optional(),
    durationHours: z.coerce.number().optional(),
    couponCode: z.string().optional()
  }).superRefine(validateRentalBookingPayload)
};

export const cancelBookingSchema = {
  body: z.object({
    reason: z.string().max(300).optional()
  })
};
