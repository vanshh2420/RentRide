import { z } from 'zod';
import { ROLES } from '../constants/roles.js';

export const registerSchema = {
  body: z.object({
    name: z
      .string({ required_error: 'Full name is required' })
      .min(2, 'Name must be at least 2 characters')
      .max(60, 'Name cannot exceed 60 characters'),
    email: z
      .string({ required_error: 'Email is required' })
      .trim()
      .email('Invalid email address')
      .toLowerCase(),
    password: z
      .string({ required_error: 'Password is required' })
      .min(6, 'Password must be at least 6 characters'),
    phone: z
      .string()
      .regex(/^[0-9+ -]{8,15}$/, 'Invalid phone number format')
      .optional()
      .or(z.literal('')),
    role: z
      .enum([ROLES.CUSTOMER, ROLES.VENDOR])
      .default(ROLES.CUSTOMER),
    // Vendor profile fields (conditional validation)
    businessName: z.string().max(100).optional(),
    gstNumber: z.string().max(20).optional(),
    city: z.string().max(50).optional()
  })
};

export const loginSchema = {
  body: z.object({
    email: z
      .string({ required_error: 'Email is required' })
      .trim()
      .email('Invalid email address')
      .toLowerCase(),
    password: z
      .string({ required_error: 'Password is required' })
      .min(1, 'Password is required')
  })
};

export const updateProfileSchema = {
  body: z.object({
    name: z.string().min(2).max(60).optional(),
    phone: z.string().regex(/^[0-9+ -]{8,15}$/, 'Invalid phone format').optional().or(z.literal('')),
    businessName: z.string().max(100).optional(),
    gstNumber: z.string().max(20).optional(),
    city: z.string().max(50).optional(),
    drivingLicenseNumber: z.string().max(30).optional()
  })
};

export const changePasswordSchema = {
  body: z.object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z.string().min(6, 'New password must be at least 6 characters')
  })
};
