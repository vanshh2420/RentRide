import { z } from 'zod';

export const createReviewSchema = {
  body: z.object({
    vehicleId: z.string().min(1, 'Vehicle ID is required'),
    bookingId: z.string().min(1, 'Booking ID is required'),
    rating: z.coerce.number().min(1).max(5, 'Rating must be between 1 and 5 stars'),
    comment: z.string().max(500, 'Comment must not exceed 500 characters').optional()
  })
};
