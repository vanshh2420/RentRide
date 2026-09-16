import { z } from 'zod';
import { ROLES } from '../constants/roles.js';
import { VEHICLE_STATUS, BOOKING_STATUS, PAYMENT_STATUS, MAINTENANCE_STATUS } from '../constants/status.js';

export const approveVehicleSchema = {
  body: z.object({
    isApproved: z.boolean(),
    status: z.enum(['AVAILABLE', 'INACTIVE', 'MAINTENANCE']).default('AVAILABLE'),
    rejectionReason: z.string().optional()
  })
};

export const updateVehicleStatusSchema = {
  body: z.object({
    status: z.enum(Object.values(VEHICLE_STATUS)),
    reason: z.string().optional()
  })
};

export const updateUserStatusSchema = {
  body: z.object({
    isActive: z.boolean().optional(),
    status: z.enum(['ACTIVE', 'SUSPENDED']).optional(),
    reason: z.string().optional()
  }).refine((data) => data.isActive !== undefined || data.status !== undefined, {
    message: 'Either isActive (boolean) or status (ACTIVE/SUSPENDED) must be provided'
  })
};

export const updateVendorApprovalSchema = {
  body: z.object({
    isApproved: z.boolean(),
    reason: z.string().optional()
  })
};

export const updateVendorStatusSchema = {
  body: z.object({
    isActive: z.boolean(),
    reason: z.string().optional()
  })
};

export const moderateReviewSchema = {
  body: z.object({
    isModerated: z.boolean()
  })
};

export const getAdminUsersSchema = {
  query: z.object({
    role: z.enum(Object.values(ROLES)).optional(),
    status: z.enum(['ALL', 'ACTIVE', 'SUSPENDED']).optional().default('ALL'),
    search: z.string().optional(),
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).max(100).default(20)
  })
};

export const getAdminVendorsSchema = {
  query: z.object({
    isApproved: z.enum(['true', 'false', 'all']).optional().default('all'),
    status: z.enum(['ALL', 'ACTIVE', 'SUSPENDED']).optional().default('ALL'),
    search: z.string().optional(),
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).max(100).default(20)
  })
};

export const getAdminVehiclesSchema = {
  query: z.object({
    isApproved: z.enum(['true', 'false', 'all']).optional().default('all'),
    status: z.string().optional().default('ALL'),
    categoryId: z.string().optional(),
    vendorId: z.string().optional(),
    city: z.string().optional(),
    search: z.string().optional(),
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).max(100).default(20)
  })
};

export const getAdminBookingsSchema = {
  query: z.object({
    status: z.string().optional().default('ALL'),
    paymentStatus: z.string().optional().default('ALL'),
    bookingType: z.string().optional().default('ALL'),
    vendorId: z.string().optional(),
    vehicleId: z.string().optional(),
    customerId: z.string().optional(),
    search: z.string().optional(),
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).max(100).default(20)
  })
};

export const getAdminPaymentsSchema = {
  query: z.object({
    status: z.string().optional().default('ALL'),
    paymentMethod: z.string().optional().default('ALL'),
    search: z.string().optional(),
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).max(100).default(20)
  })
};

export const getAdminMaintenanceSchema = {
  query: z.object({
    status: z.string().optional().default('ALL'),
    maintenanceType: z.string().optional().default('ALL'),
    vehicleId: z.string().optional(),
    vendorId: z.string().optional(),
    search: z.string().optional(),
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).max(100).default(20)
  })
};

export const getAdminReviewsSchema = {
  query: z.object({
    rating: z.coerce.number().min(1).max(5).optional(),
    isModerated: z.enum(['true', 'false', 'all']).optional().default('all'),
    vehicleId: z.string().optional(),
    vendorId: z.string().optional(),
    search: z.string().optional(),
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).max(100).default(20)
  })
};
