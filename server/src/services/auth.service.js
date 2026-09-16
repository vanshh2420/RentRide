import { User } from '../models/user.model.js';
import { ApiError } from '../utils/ApiError.js';
import { ROLES } from '../constants/roles.js';
import { UserService } from './user.service.js';

export class AuthService {
  /**
   * Register a new user (Customer or Vendor)
   */
  static async registerUser({ name, email, password, phone, role, businessName, gstNumber, city }) {
    const normalizedEmail = (email || '').trim().toLowerCase();
    // 1. Check if user already exists
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      throw new ApiError(409, 'An account with this email address already exists');
    }

    // 2. Build vendor/customer specific profile data
    const userData = {
      name: (name || '').trim(),
      email: normalizedEmail,
      password,
      phone: phone ? phone.trim() : '',
      role: role || ROLES.CUSTOMER
    };

    if (role === ROLES.VENDOR) {
      userData.vendorProfile = {
        businessName: businessName || `${name}'s Fleet`,
        gstNumber: gstNumber || '',
        address: { city: city || '' },
        isApproved: true // Auto-approved for development or approval queue
      };
    }

    // 3. Save new user
    const user = await User.create(userData);

    // 4. Generate JWT access token
    const token = user.generateAccessToken();

    // 5. Exclude password from return payload
    const sanitizedUser = await User.findById(user._id).select('-password');

    return { user: sanitizedUser, token };
  }

  /**
   * Login user with email & password
   */
  static async loginUser({ email, password }) {
    const normalizedEmail = (email || '').trim().toLowerCase();
    // 1. Find user by email including password field
    const user = await User.findOne({ email: normalizedEmail }).select('+password');
    if (!user) {
      throw new ApiError(401, 'Invalid email or password');
    }

    // 2. Check if account is active
    if (!user.isActive) {
      throw new ApiError(403, 'Your account has been deactivated. Please contact support.');
    }

    // 3. Verify password
    const isMatch = await user.isPasswordCorrect(password);
    if (!isMatch) {
      throw new ApiError(401, 'Invalid email or password');
    }

    // 4. Generate JWT Token
    const token = user.generateAccessToken();

    // 5. Return sanitized user
    const sanitizedUser = await User.findById(user._id).select('-password');

    return { user: sanitizedUser, token };
  }

  /**
   * Get user profile details by ID
   */
  static async getUserProfile(userId) {
    const user = await User.findById(userId).select('-password');
    if (!user) {
      throw new ApiError(404, 'User profile not found');
    }
    return user;
  }

  /**
   * Update user profile fields (delegates to UserService)
   */
  static async updateProfile(userId, updateData) {
    return await UserService.updateUserProfile(userId, updateData);
  }

  /**
   * Change password (delegates to UserService)
   */
  static async changePassword(userId, currentPassword, newPassword) {
    return await UserService.changeUserPassword(userId, { currentPassword, newPassword, confirmPassword: newPassword });
  }
}

