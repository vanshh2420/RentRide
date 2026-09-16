import { z } from 'zod';

export const updateUserProfileSchema = {
  body: z.object({
    name: z
      .string()
      .trim()
      .min(2, 'Name must be at least 2 characters')
      .max(60, 'Name cannot exceed 60 characters')
      .optional(),
    email: z
      .string()
      .trim()
      .email('Please provide a valid email address')
      .toLowerCase()
      .optional(),
    phone: z
      .string()
      .trim()
      .regex(/^[0-9+ -]{8,15}$/, 'Invalid phone number format')
      .optional()
      .or(z.literal('')),
    // Vendor profile fields
    businessName: z.string().trim().max(100, 'Business name cannot exceed 100 characters').optional(),
    gstNumber: z.string().trim().max(20, 'GST number cannot exceed 20 characters').optional(),
    city: z.string().trim().max(50, 'City cannot exceed 50 characters').optional(),
    street: z.string().trim().max(150, 'Street address cannot exceed 150 characters').optional(),
    state: z.string().trim().max(50, 'State cannot exceed 50 characters').optional(),
    pincode: z.string().trim().max(10, 'Pincode cannot exceed 10 characters').optional(),
    // Customer profile fields
    drivingLicenseNumber: z.string().trim().max(30, 'Driving license number cannot exceed 30 characters').optional()
  })
};

export const changeUserPasswordSchema = {
  body: z
    .object({
      currentPassword: z
        .string({ required_error: 'Current password is required' })
        .min(1, 'Current password is required'),
      newPassword: z
        .string({ required_error: 'New password is required' })
        .min(6, 'New password must be at least 6 characters long')
        .max(100, 'New password cannot exceed 100 characters'),
      confirmPassword: z
        .string({ required_error: 'Confirm password is required' })
        .min(6, 'Confirm password must be at least 6 characters long')
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      message: 'New password and confirm password do not match',
      path: ['confirmPassword']
    })
};
