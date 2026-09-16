import { AiService } from '../services/ai.service.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getRecommendations = asyncHandler(async (req, res) => {
  const { categoryId, fuelType, transmission, maxBudget, city, limit } = req.query;
  const recommendations = await AiService.getRecommendations({
    categoryId,
    fuelType,
    transmission,
    maxBudget,
    city,
    limit
  });
  return res.status(200).json(new ApiResponse(200, { recommendations }, 'AI vehicle recommendations generated successfully'));
});

export const getDemandForecast = asyncHandler(async (req, res) => {
  const { city, category } = req.query;
  const forecast = await AiService.getDemandForecast({ city, category });
  return res.status(200).json(new ApiResponse(200, { forecast }, '7-day AI demand forecast generated successfully'));
});

export const getDynamicPricing = asyncHandler(async (req, res) => {
  const { baseRate, rentalDate, categorySlug, city } = req.body;
  const pricing = await AiService.getDynamicPricing({ baseRate, rentalDate, categorySlug, city });
  return res.status(200).json(new ApiResponse(200, { pricing }, 'Dynamic pricing quote calculated successfully'));
});

export const getPersonalizedOffers = asyncHandler(async (req, res) => {
  const userId = req.user?._id || req.query.userId;
  const city = req.query.city || 'Indore';
  const offer = await AiService.getPersonalizedOffers({ userId, city });
  return res.status(200).json(new ApiResponse(200, { offer }, 'Personalized offer generated successfully'));
});

export const handleAssistantChat = asyncHandler(async (req, res) => {
  const { message, userContext } = req.body;
  const context = {
    ...(userContext || {}),
    userId: req.user?._id,
    name: req.user?.name
  };
  const response = await AiService.handleAssistantQuery({ message, userContext: context });
  return res.status(200).json(new ApiResponse(200, response, 'AI assistant processed message successfully'));
});
