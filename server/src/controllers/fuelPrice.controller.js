import { FuelPriceService } from '../services/fuelPrice.service.js';
import { FuelCostService } from '../services/fuelCost.service.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getFuelPrices = asyncHandler(async (req, res) => {
  const city = req.query.city || 'Indore';
  const prices = await FuelPriceService.getAllPricesForCity(city);
  return res.status(200).json(new ApiResponse(200, { city, prices }, 'Fuel prices retrieved successfully'));
});

export const getCityFuelPrices = asyncHandler(async (req, res) => {
  const city = req.params.city || 'Indore';
  const prices = await FuelPriceService.getAllPricesForCity(city);
  return res.status(200).json(new ApiResponse(200, { city, prices }, 'City fuel prices retrieved successfully'));
});

export const estimateFuelCost = asyncHandler(async (req, res) => {
  const estimate = await FuelCostService.calculateEstimatedFuelCost(req.body);
  return res.status(200).json(new ApiResponse(200, { estimate }, 'Fuel cost estimated successfully'));
});

export const updateFuelPrice = asyncHandler(async (req, res) => {
  const updated = await FuelPriceService.updateFuelPrice(req.body);
  return res.status(200).json(new ApiResponse(200, { price: updated }, 'Fuel price updated successfully'));
});
