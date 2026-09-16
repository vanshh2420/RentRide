import { PaymentService } from '../services/payment.service.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const createRazorpayOrder = asyncHandler(async (req, res) => {
  const result = await PaymentService.createRazorpayOrder(
    req.body.bookingId,
    req.user._id,
    req.user.role
  );
  return res.status(200).json(new ApiResponse(200, result, 'Razorpay order generated successfully'));
});

export const verifyPayment = asyncHandler(async (req, res) => {
  const result = await PaymentService.verifyPayment(req.user._id, req.body);
  return res.status(200).json(new ApiResponse(200, result, 'Payment verified and booking confirmed'));
});

export const handlePaymentFailure = asyncHandler(async (req, res) => {
  const result = await PaymentService.handlePaymentFailure(
    req.body.bookingId,
    req.user._id,
    req.body.errorDescription
  );
  return res.status(200).json(new ApiResponse(200, result, 'Payment failure recorded'));
});

export const getPaymentHistory = asyncHandler(async (req, res) => {
  const { page, limit } = req.query;
  const result = await PaymentService.getPaymentHistory(req.user._id, req.user.role, { page, limit });
  return res.status(200).json(new ApiResponse(200, result, 'Payment history fetched successfully'));
});
