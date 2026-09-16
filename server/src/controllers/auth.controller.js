import { AuthService } from '../services/auth.service.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ENV } from '../config/env.js';

// Cookie options for secure JWT storage
const cookieOptions = {
  httpOnly: true,
  secure: ENV.NODE_ENV === 'production',
  sameSite: ENV.NODE_ENV === 'production' ? 'none' : 'lax',
  maxAge: ENV.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000 // In milliseconds
};

export const register = asyncHandler(async (req, res) => {
  const { user, token } = await AuthService.registerUser(req.body);

  return res
    .status(201)
    .cookie('rentride_token', token, cookieOptions)
    .json(
      new ApiResponse(
        201,
        { user, token },
        'User registered successfully'
      )
    );
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const { user, token } = await AuthService.loginUser({ email, password });

  return res
    .status(200)
    .cookie('rentride_token', token, cookieOptions)
    .json(
      new ApiResponse(
        200,
        { user, token },
        'Logged in successfully'
      )
    );
});

export const logout = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .clearCookie('rentride_token', cookieOptions)
    .json(new ApiResponse(200, null, 'Logged out successfully'));
});

export const getMe = asyncHandler(async (req, res) => {
  const user = await AuthService.getUserProfile(req.user._id);
  return res.status(200).json(new ApiResponse(200, { user }, 'Current user profile'));
});

export const updateProfile = asyncHandler(async (req, res) => {
  const updatedUser = await AuthService.updateProfile(req.user._id, req.body);
  return res.status(200).json(new ApiResponse(200, { user: updatedUser }, 'Profile updated successfully'));
});

export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const result = await AuthService.changePassword(req.user._id, currentPassword, newPassword);
  return res.status(200).json(new ApiResponse(200, result, 'Password changed successfully'));
});
