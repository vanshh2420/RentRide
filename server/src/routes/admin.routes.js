import { Router } from 'express';
import { 
  getPlatformStats, 
  // Users
  getAllUsers, 
  getUserById, 
  updateUserStatus,
  // Vendors
  getAllVendors,
  getVendorById,
  approveVendor,
  rejectVendor,
  suspendVendor,
  activateVendor,
  // Vehicles
  getAllVehicles, 
  getVehicleById,
  approveOrRejectVehicle, 
  approveVehicle,
  rejectVehicle,
  activateVehicle,
  deactivateVehicle,
  // Bookings
  getAllBookings, 
  getBookingById,
  // Payments
  getAllPayments,
  getPaymentById,
  // Maintenance
  getAllMaintenance,
  // Reviews
  getAllReviews,
  moderateReview
} from '../controllers/admin.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { authorize } from '../middleware/role.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { 
  approveVehicleSchema, 
  updateUserStatusSchema,
  getAdminUsersSchema, 
  getAdminVendorsSchema,
  getAdminVehiclesSchema,
  getAdminBookingsSchema,
  getAdminPaymentsSchema,
  getAdminMaintenanceSchema,
  getAdminReviewsSchema,
  moderateReviewSchema
} from '../validators/admin.validator.js';
import { ROLES } from '../constants/roles.js';

const router = Router();

// ============================================================================
// SECURITY BOUNDARY: All Admin Endpoints Require Valid JWT & ADMIN Role
// ============================================================================
router.use(protect, authorize(ROLES.ADMIN));

// Platform Overview & Analytics
router.get('/stats', getPlatformStats);
router.get('/dashboard', getPlatformStats);

// User Governance
router.get('/users', validate(getAdminUsersSchema), getAllUsers);
router.get('/users/:id', getUserById);
router.patch('/users/:id/status', validate(updateUserStatusSchema), updateUserStatus);

// Vendor Governance & Approvals
router.get('/vendors', validate(getAdminVendorsSchema), getAllVendors);
router.get('/vendors/:id', getVendorById);
router.patch('/vendors/:id/approve', approveVendor);
router.patch('/vendors/:id/reject', rejectVendor);
router.patch('/vendors/:id/suspend', suspendVendor);
router.patch('/vendors/:id/activate', activateVendor);

// Vehicle Approvals & Fleet Management
router.get('/vehicles', validate(getAdminVehiclesSchema), getAllVehicles);
router.get('/vehicles/:id', getVehicleById);
router.patch('/vehicles/:id/approval', validate(approveVehicleSchema), approveOrRejectVehicle);
router.patch('/vehicles/:id/approve', approveVehicle);
router.patch('/vehicles/:id/reject', rejectVehicle);
router.patch('/vehicles/:id/activate', activateVehicle);
router.patch('/vehicles/:id/deactivate', deactivateVehicle);

// Global Bookings Audit
router.get('/bookings', validate(getAdminBookingsSchema), getAllBookings);
router.get('/bookings/:id', getBookingById);

// Financials & Payment Audit
router.get('/payments', validate(getAdminPaymentsSchema), getAllPayments);
router.get('/payments/:id', getPaymentById);

// Fleet Maintenance Tracking
router.get('/maintenance', validate(getAdminMaintenanceSchema), getAllMaintenance);

// Review Moderation
router.get('/reviews', validate(getAdminReviewsSchema), getAllReviews);
router.patch('/reviews/:id/moderate', validate(moderateReviewSchema), moderateReview);

export default router;
