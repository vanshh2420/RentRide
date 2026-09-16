import jwt from 'jsonwebtoken';
import { User } from '../models/user.model.js';
import { ApiError } from '../utils/ApiError.js';
import { ENV } from '../config/env.js';
import { asyncHandler } from '../utils/asyncHandler.js';

/**
 * Protect routes: Validates JWT access token from HTTP-only Cookie or Authorization Header
 */
export const protect = asyncHandler(async (req, res, next) => {
  let token = null;

  // 1. Check HTTP-Only Cookie
  if (req.cookies && req.cookies.rentride_token) {
    token = req.cookies.rentride_token;
  }
  // 2. Check Authorization Header Bearer token
  else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    throw new ApiError(401, 'Authentication required. Please log in to continue.');
  }

  try {
    // 3. Verify JWT token signature and expiration
    const decoded = jwt.verify(token, ENV.JWT_SECRET);

    // 4. Retrieve user and verify existence & active status
    const user = await User.findById(decoded._id).select('-password');
    if (!user) {
      throw new ApiError(401, 'The account belonging to this token no longer exists.');
    }

    if (!user.isActive) {
      throw new ApiError(403, 'Your account has been deactivated. Please contact support.');
    }

    // Attach user object to Express request
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new ApiError(401, 'Session expired. Please log in again.');
    }
    throw new ApiError(401, 'Invalid authentication token.');
  }
});
