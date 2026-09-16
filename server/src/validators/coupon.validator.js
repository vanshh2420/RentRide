import { z } from 'zod';

export const createCouponSchema = {
  body: z.object({
    code: z.string().min(3, 'Coupon code must be at least 3 characters').toUpperCase().trim(),
    description: z.string().optional().default(''),
    discountType: z.enum(['PERCENTAGE', 'FIXED']),
    discountValue: z.coerce.number().min(1, 'Discount value must be at least 1'),
    minBookingAmount: z.coerce.number().min(0).default(0),
    maxDiscountAmount: z.coerce.number().min(0).optional().nullable(),
    validFrom: z.string().datetime({ message: 'Valid ISO validFrom date required' }).optional(),
    validUntil: z.string().datetime({ message: 'Valid ISO validUntil date required' }).optional(),
    totalUsageLimit: z.coerce.number().min(1).default(1000),
    perUserLimit: z.coerce.number().min(1).default(1),
    applicableCategories: z.array(z.string()).optional().default([]),
    isActive: z.boolean().default(true)
  })
};

export const updateCouponSchema = {
  body: z.object({
    description: z.string().optional(),
    discountType: z.enum(['PERCENTAGE', 'FIXED']).optional(),
    discountValue: z.coerce.number().min(1).optional(),
    minBookingAmount: z.coerce.number().min(0).optional(),
    maxDiscountAmount: z.coerce.number().min(0).optional().nullable(),
    validFrom: z.string().datetime().optional(),
    validUntil: z.string().datetime().optional(),
    totalUsageLimit: z.coerce.number().min(1).optional(),
    perUserLimit: z.coerce.number().min(1).optional(),
    applicableCategories: z.array(z.string()).optional(),
    isActive: z.boolean().optional()
  })
};

export const validateCouponSchema = {
  body: z.object({
    code: z.string().min(1, 'Coupon code is required').toUpperCase().trim(),
    bookingAmount: z.coerce.number().min(1, 'Booking amount is required')
  })
};
