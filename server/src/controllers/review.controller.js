import { ReviewService } from '../services/review.service.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const createReview = asyncHandler(async (req, res) => {
  const review = await ReviewService.createReview(req.user._id, req.body);
  return res.status(201).json(new ApiResponse(201, { review }, 'Review submitted successfully'));
});

export const getVehicleReviews = asyncHandler(async (req, res) => {
  const { page, limit } = req.query;
  const result = await ReviewService.getVehicleReviews(req.params.vehicleId, { page, limit });
  return res.status(200).json(new ApiResponse(200, result, 'Vehicle reviews fetched successfully'));
});
