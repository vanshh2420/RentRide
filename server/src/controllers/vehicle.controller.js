import { VehicleService } from '../services/vehicle.service.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const createVehicle = asyncHandler(async (req, res) => {
  const vehicle = await VehicleService.createVehicle(req.user._id, req.body, req.files);
  return res.status(201).json(new ApiResponse(201, { vehicle }, 'Vehicle listing created successfully'));
});

export const updateVehicle = asyncHandler(async (req, res) => {
  const vehicle = await VehicleService.updateVehicle(req.params.id, req.user._id, req.body, req.user.role);
  return res.status(200).json(new ApiResponse(200, { vehicle }, 'Vehicle listing updated successfully'));
});

export const deleteVehicle = asyncHandler(async (req, res) => {
  const result = await VehicleService.deleteVehicle(req.params.id, req.user._id, req.user.role);
  return res.status(200).json(new ApiResponse(200, result, 'Vehicle listing deleted successfully'));
});

export const getVehicleById = asyncHandler(async (req, res) => {
  const vehicle = await VehicleService.getVehicleById(req.params.id);
  return res.status(200).json(new ApiResponse(200, { vehicle }, 'Vehicle details fetched successfully'));
});

export const getMyVendorVehicles = asyncHandler(async (req, res) => {
  const { status, search, page, limit } = req.query;
  const data = await VehicleService.getVendorVehicles(req.user._id, { status, search, page, limit });
  return res.status(200).json(new ApiResponse(200, data, 'Vendor vehicles fetched successfully'));
});

export const updateVehicleStatus = asyncHandler(async (req, res) => {
  const vehicle = await VehicleService.updateVehicleStatus(
    req.params.id,
    req.user._id,
    req.body.status,
    req.user.role
  );
  return res.status(200).json(new ApiResponse(200, { vehicle }, 'Vehicle status updated successfully'));
});

export const searchVehicles = asyncHandler(async (req, res) => {
  const result = await VehicleService.searchVehicles(req.query);
  return res.status(200).json(new ApiResponse(200, result, 'Vehicles retrieved successfully'));
});

export const getNearbyVehicles = asyncHandler(async (req, res) => {
  const result = await VehicleService.getNearbyAvailableVehicles(req.query);
  return res.status(200).json(new ApiResponse(200, result, 'Nearby available vehicles retrieved successfully'));
});
