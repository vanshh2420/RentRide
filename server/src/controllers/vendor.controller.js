import { BookingService } from '../services/booking.service.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const createOfflineBooking = asyncHandler(async (req, res) => {
  const booking = await BookingService.createOfflineBooking(
    req.user._id,
    req.body,
    req.user.role
  );
  return res.status(201).json(new ApiResponse(201, { booking }, 'Offline walk-in booking created successfully'));
});

export const getVendorBookings = asyncHandler(async (req, res) => {
  const { bookingType, status, page, limit } = req.query;
  const result = await BookingService.getVendorBookings(req.user._id, {
    bookingType,
    status,
    page,
    limit
  });
  return res.status(200).json(new ApiResponse(200, result, 'Vendor fleet bookings retrieved successfully'));
});

export const startTrip = asyncHandler(async (req, res) => {
  const booking = await BookingService.startTrip(
    req.params.id,
    req.user._id,
    req.user.role,
    req.body
  );
  return res.status(200).json(new ApiResponse(200, { booking }, 'Trip started successfully. Vehicle marked as in-use.'));
});

export const completeTrip = asyncHandler(async (req, res) => {
  const booking = await BookingService.completeTrip(
    req.params.id,
    req.user._id,
    req.user.role,
    req.body
  );
  return res.status(200).json(new ApiResponse(200, { booking }, 'Trip completed successfully. Vehicle inventory released.'));
});

export const getVendorStats = asyncHandler(async (req, res) => {
  const stats = await BookingService.getVendorStats(req.user._id);
  return res.status(200).json(new ApiResponse(200, stats, 'Vendor statistics retrieved successfully'));
});
