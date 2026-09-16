import { UserService } from '../services/user.service.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

/**
 * Get authenticated user profile
 */
export const getProfile = asyncHandler(async (req, res) => {
  const user = await UserService.getUserProfile(req.user._id);
  return res.status(200).json(new ApiResponse(200, { user }, 'User profile retrieved successfully'));
});

/**
 * Update authenticated user profile (name, email, phone, avatar, role-specific metadata)
 */
export const updateProfile = asyncHandler(async (req, res) => {
  const updatedUser = await UserService.updateUserProfile(req.user._id, req.body, req.file);
  return res.status(200).json(new ApiResponse(200, { user: updatedUser }, 'Profile updated successfully'));
});

/**
 * Change authenticated user password
 */
export const changePassword = asyncHandler(async (req, res) => {
  const result = await UserService.changeUserPassword(req.user._id, req.body);
  return res.status(200).json(new ApiResponse(200, result, 'Password changed successfully'));
});
