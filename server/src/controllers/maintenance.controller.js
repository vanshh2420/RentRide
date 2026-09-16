import { MaintenanceService } from '../services/maintenance.service.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const scheduleMaintenance = asyncHandler(async (req, res) => {
  const maintenance = await MaintenanceService.scheduleMaintenance(
    req.user._id,
    req.user.role,
    req.body
  );
  return res.status(201).json(new ApiResponse(201, { maintenance }, 'Maintenance scheduled successfully. Inventory slot blocked.'));
});

export const getVendorMaintenance = asyncHandler(async (req, res) => {
  const { status, page, limit } = req.query;
  const result = await MaintenanceService.getVendorMaintenance(req.user._id, { status, page, limit });
  return res.status(200).json(new ApiResponse(200, result, 'Vendor maintenance schedule retrieved successfully'));
});

export const completeMaintenance = asyncHandler(async (req, res) => {
  const maintenance = await MaintenanceService.completeMaintenance(
    req.params.id,
    req.user._id,
    req.user.role,
    req.body
  );
  return res.status(200).json(new ApiResponse(200, { maintenance }, 'Maintenance marked as completed. Vehicle restored to available status.'));
});
