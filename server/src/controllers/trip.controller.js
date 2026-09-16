import { TripTrackingService } from '../services/tripTracking.service.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const recordTelemetry = asyncHandler(async (req, res) => {
  const { bookingId } = req.params;
  const result = await TripTrackingService.recordTelemetry(
    bookingId,
    req.user._id,
    req.user.role,
    req.body
  );
  return res.status(200).json(new ApiResponse(200, result, 'Telemetry processed successfully'));
});

export const getLiveTrip = asyncHandler(async (req, res) => {
  const { bookingId } = req.params;
  const liveState = await TripTrackingService.getLiveTripState(
    bookingId,
    req.user._id,
    req.user.role
  );
  return res.status(200).json(new ApiResponse(200, liveState, 'Live trip state retrieved successfully'));
});
