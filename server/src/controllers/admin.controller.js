import { AdminService } from '../services/admin.service.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

// ==========================================
// DASHBOARD & ANALYTICS
// ==========================================

export const getPlatformStats = asyncHandler(async (req, res) => {
  const stats = await AdminService.getPlatformOverviewStats();
  return res.status(200).json(new ApiResponse(200, stats, 'Platform analytics fetched successfully'));
});

// ==========================================
// USER MANAGEMENT
// ==========================================

export const getAllUsers = asyncHandler(async (req, res) => {
  const { role, status, search, page, limit } = req.query;
  const result = await AdminService.getAllUsers({ role, status, search, page, limit });
  return res.status(200).json(new ApiResponse(200, result, 'Users retrieved successfully'));
});

export const getUserById = asyncHandler(async (req, res) => {
  const result = await AdminService.getUserById(req.params.id);
  return res.status(200).json(new ApiResponse(200, result, 'User details fetched successfully'));
});

export const updateUserStatus = asyncHandler(async (req, res) => {
  const user = await AdminService.updateUserStatus(req.params.id, req.body, req.user._id);
  return res.status(200).json(new ApiResponse(200, { user }, 'User account status updated successfully'));
});

// ==========================================
// VENDOR MANAGEMENT
// ==========================================

export const getAllVendors = asyncHandler(async (req, res) => {
  const { isApproved, status, search, page, limit } = req.query;
  const result = await AdminService.getAllVendors({ isApproved, status, search, page, limit });
  return res.status(200).json(new ApiResponse(200, result, 'Vendors retrieved successfully'));
});

export const getVendorById = asyncHandler(async (req, res) => {
  const result = await AdminService.getVendorById(req.params.id);
  return res.status(200).json(new ApiResponse(200, result, 'Vendor details fetched successfully'));
});

export const approveVendor = asyncHandler(async (req, res) => {
  const vendor = await AdminService.updateVendorApproval(req.params.id, { isApproved: true, ...req.body });
  return res.status(200).json(new ApiResponse(200, { vendor }, 'Vendor approved successfully'));
});

export const rejectVendor = asyncHandler(async (req, res) => {
  const vendor = await AdminService.updateVendorApproval(req.params.id, { isApproved: false, ...req.body });
  return res.status(200).json(new ApiResponse(200, { vendor }, 'Vendor rejected successfully'));
});

export const suspendVendor = asyncHandler(async (req, res) => {
  const vendor = await AdminService.updateVendorStatus(req.params.id, { isActive: false, ...req.body });
  return res.status(200).json(new ApiResponse(200, { vendor }, 'Vendor suspended successfully'));
});

export const activateVendor = asyncHandler(async (req, res) => {
  const vendor = await AdminService.updateVendorStatus(req.params.id, { isActive: true, ...req.body });
  return res.status(200).json(new ApiResponse(200, { vendor }, 'Vendor re-activated successfully'));
});

// ==========================================
// VEHICLE MANAGEMENT
// ==========================================

export const getAllVehicles = asyncHandler(async (req, res) => {
  const { isApproved, status, categoryId, vendorId, city, search, page, limit } = req.query;
  const result = await AdminService.getAllVehicles({ isApproved, status, categoryId, vendorId, city, search, page, limit });
  return res.status(200).json(new ApiResponse(200, result, 'Vehicles retrieved successfully'));
});

export const getVehicleById = asyncHandler(async (req, res) => {
  const result = await AdminService.getVehicleById(req.params.id);
  return res.status(200).json(new ApiResponse(200, result, 'Vehicle details fetched successfully'));
});

export const approveOrRejectVehicle = asyncHandler(async (req, res) => {
  const vehicle = await AdminService.approveOrRejectVehicle(req.params.id, req.body);
  return res.status(200).json(new ApiResponse(200, { vehicle }, 'Vehicle approval status updated successfully'));
});

export const approveVehicle = asyncHandler(async (req, res) => {
  const vehicle = await AdminService.approveOrRejectVehicle(req.params.id, { isApproved: true, ...req.body });
  return res.status(200).json(new ApiResponse(200, { vehicle }, 'Vehicle approved successfully'));
});

export const rejectVehicle = asyncHandler(async (req, res) => {
  const vehicle = await AdminService.approveOrRejectVehicle(req.params.id, { isApproved: false, ...req.body });
  return res.status(200).json(new ApiResponse(200, { vehicle }, 'Vehicle rejected successfully'));
});

export const activateVehicle = asyncHandler(async (req, res) => {
  const vehicle = await AdminService.updateVehicleStatus(req.params.id, { status: 'AVAILABLE', ...req.body });
  return res.status(200).json(new ApiResponse(200, { vehicle }, 'Vehicle activated successfully'));
});

export const deactivateVehicle = asyncHandler(async (req, res) => {
  const vehicle = await AdminService.updateVehicleStatus(req.params.id, { status: 'INACTIVE', ...req.body });
  return res.status(200).json(new ApiResponse(200, { vehicle }, 'Vehicle deactivated successfully'));
});

// ==========================================
// BOOKINGS MANAGEMENT
// ==========================================

export const getAllBookings = asyncHandler(async (req, res) => {
  const { status, paymentStatus, bookingType, vendorId, vehicleId, customerId, search, page, limit } = req.query;
  const result = await AdminService.getAllBookings({ status, paymentStatus, bookingType, vendorId, vehicleId, customerId, search, page, limit });
  return res.status(200).json(new ApiResponse(200, result, 'Global bookings audit retrieved successfully'));
});

export const getBookingById = asyncHandler(async (req, res) => {
  const result = await AdminService.getBookingById(req.params.id);
  return res.status(200).json(new ApiResponse(200, result, 'Booking details fetched successfully'));
});

// ==========================================
// PAYMENTS MANAGEMENT
// ==========================================

export const getAllPayments = asyncHandler(async (req, res) => {
  const { status, paymentMethod, search, page, limit } = req.query;
  const result = await AdminService.getAllPayments({ status, paymentMethod, search, page, limit });
  return res.status(200).json(new ApiResponse(200, result, 'Payments retrieved successfully'));
});

export const getPaymentById = asyncHandler(async (req, res) => {
  const payment = await AdminService.getPaymentById(req.params.id);
  return res.status(200).json(new ApiResponse(200, { payment }, 'Payment details fetched successfully'));
});

// ==========================================
// MAINTENANCE MANAGEMENT
// ==========================================

export const getAllMaintenance = asyncHandler(async (req, res) => {
  const { status, maintenanceType, vehicleId, vendorId, search, page, limit } = req.query;
  const result = await AdminService.getAllMaintenance({ status, maintenanceType, vehicleId, vendorId, search, page, limit });
  return res.status(200).json(new ApiResponse(200, result, 'Maintenance records retrieved successfully'));
});

// ==========================================
// REVIEWS MANAGEMENT
// ==========================================

export const getAllReviews = asyncHandler(async (req, res) => {
  const { rating, isModerated, vehicleId, vendorId, search, page, limit } = req.query;
  const result = await AdminService.getAllReviews({ rating, isModerated, vehicleId, vendorId, search, page, limit });
  return res.status(200).json(new ApiResponse(200, result, 'Reviews retrieved successfully'));
});

export const moderateReview = asyncHandler(async (req, res) => {
  const review = await AdminService.moderateReview(req.params.id, req.body);
  return res.status(200).json(new ApiResponse(200, { review }, 'Review moderation status updated successfully'));
});
