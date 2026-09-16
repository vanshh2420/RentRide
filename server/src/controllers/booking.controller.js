import { BookingService } from '../services/booking.service.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const checkAvailability = asyncHandler(async (req, res) => {
  const result = await BookingService.checkAvailability({
    ...req.body,
    userId: req.user?._id
  });
  return res.status(200).json(new ApiResponse(200, result, 'Availability checked successfully'));
});

export const createOnlineBooking = asyncHandler(async (req, res) => {
  const booking = await BookingService.createOnlineBooking(req.user._id, req.body);
  return res.status(201).json(new ApiResponse(201, { booking }, 'Booking initiated. Slot reserved for 10 minutes.'));
});

export const getMyBookings = asyncHandler(async (req, res) => {
  const { status, page, limit } = req.query;
  const result = await BookingService.getCustomerBookings(req.user._id, { status, page, limit });
  return res.status(200).json(new ApiResponse(200, result, 'Bookings retrieved successfully'));
});

export const getBookingById = asyncHandler(async (req, res) => {
  const booking = await BookingService.getBookingById(req.params.id, req.user._id, req.user.role);
  return res.status(200).json(new ApiResponse(200, { booking }, 'Booking details retrieved successfully'));
});

export const cancelBooking = asyncHandler(async (req, res) => {
  const { reason } = req.body;
  const booking = await BookingService.cancelBooking(req.params.id, req.user._id, req.user.role, reason);
  return res.status(200).json(new ApiResponse(200, { booking }, 'Booking cancelled successfully'));
});
