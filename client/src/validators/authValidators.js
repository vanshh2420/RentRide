import { z } from 'zod';

export const loginFormSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Please enter a valid email'),
  password: z.string().min(1, 'Password is required')
});

export const registerFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  phone: z.string().optional(),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Please confirm your password'),
  role: z.enum(['customer', 'vendor']),
  businessName: z.string().optional(),
  gstNumber: z.string().optional(),
  city: z.string().optional()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"]
});

export const profileFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(60, 'Name cannot exceed 60 characters'),
  email: z.string().min(1, 'Email is required').email('Please provide a valid email address'),
  phone: z.string().optional(),
  businessName: z.string().optional(),
  gstNumber: z.string().optional(),
  city: z.string().optional(),
  street: z.string().optional(),
  state: z.string().optional(),
  pincode: z.string().optional(),
  drivingLicenseNumber: z.string().optional()
});

export const changePasswordFormSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(6, 'New password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Please confirm your new password')
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "New password and confirm password do not match",
  path: ["confirmPassword"]
});

