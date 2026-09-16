import { z } from 'zod';

export const createOrderSchema = {
  body: z.object({
    bookingId: z.string().min(1, 'Booking ID is required')
  })
};

export const verifyPaymentSchema = {
  body: z.object({
    bookingId: z.string().min(1, 'Booking ID is required'),
    razorpay_order_id: z.string().min(1, 'Razorpay Order ID is required'),
    razorpay_payment_id: z.string().min(1, 'Razorpay Payment ID is required'),
    razorpay_signature: z.string().min(1, 'Razorpay Signature is required')
  })
};

export const handlePaymentFailureSchema = {
  body: z.object({
    bookingId: z.string().min(1, 'Booking ID is required'),
    errorDescription: z.string().optional()
  })
};

export const refundPaymentSchema = {
  body: z.object({
    amount: z.coerce.number().min(1, 'Refund amount must be at least 1').optional(),
    reason: z.string().optional()
  })
};
