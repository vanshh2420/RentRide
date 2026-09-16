import { User } from '../models/user.model.js';
import { ApiError } from '../utils/ApiError.js';
import { ROLES } from '../constants/roles.js';
import { uploadToCloudinary, deleteFromCloudinary } from '../config/cloudinary.js';

export class UserService {
  /**
   * Get user profile by authenticated user ID
   */
  static async getUserProfile(userId) {
    const user = await User.findById(userId).select('-password');
    if (!user) {
      throw new ApiError(404, 'User profile not found');
    }
    return user;
  }

  /**
   * Update user profile information & avatar
   */
  static async updateUserProfile(userId, updateData = {}, file = null) {
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    // 1. Email uniqueness check
    if (updateData.email) {
      const normalizedEmail = updateData.email.toLowerCase().trim();
      if (normalizedEmail !== user.email) {
        const existingUser = await User.findOne({
          email: normalizedEmail,
          _id: { $ne: userId }
        });
        if (existingUser) {
          throw new ApiError(409, 'An account with this email address is already registered');
        }
        user.email = normalizedEmail;
      }
    }

    // 2. Name & Phone updates
    if (updateData.name) {
      user.name = updateData.name.trim();
    }
    if (updateData.phone !== undefined) {
      user.phone = updateData.phone.trim();
    }

    // 3. Profile picture avatar upload (Multer + Cloudinary)
    if (file && file.buffer) {
      // If user had a previous non-mock Cloudinary avatar, delete it
      if (user.avatar?.publicId) {
        await deleteFromCloudinary(user.avatar.publicId);
      }

      const uploadResult = await uploadToCloudinary(file.buffer, 'rentride/avatars');
      user.avatar = {
        url: uploadResult.url,
        publicId: uploadResult.publicId
      };
    }

    // 4. Role-specific profile extensions
    if (user.role === ROLES.VENDOR && user.vendorProfile) {
      if (updateData.businessName) user.vendorProfile.businessName = updateData.businessName.trim();
      if (updateData.gstNumber) user.vendorProfile.gstNumber = updateData.gstNumber.trim();
      if (updateData.city) user.vendorProfile.address.city = updateData.city.trim();
      if (updateData.street) user.vendorProfile.address.street = updateData.street.trim();
      if (updateData.state) user.vendorProfile.address.state = updateData.state.trim();
      if (updateData.pincode) user.vendorProfile.address.pincode = updateData.pincode.trim();
    }

    if (user.role === ROLES.CUSTOMER && user.customerProfile) {
      if (updateData.drivingLicenseNumber !== undefined) {
        user.customerProfile.drivingLicenseNumber = updateData.drivingLicenseNumber.trim();
      }
    }

    // Ensure role cannot be altered through profile update
    // (user.role is strictly preserved)

    await user.save();

    return await User.findById(userId).select('-password');
  }

  /**
   * Change user password securely
   */
  static async changeUserPassword(userId, { currentPassword, newPassword, confirmPassword }) {
    if (confirmPassword && newPassword !== confirmPassword) {
      throw new ApiError(400, 'New password and confirm password do not match');
    }

    const user = await User.findById(userId).select('+password');
    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    // Verify current password with bcrypt
    const isMatch = await user.isPasswordCorrect(currentPassword);
    if (!isMatch) {
      throw new ApiError(400, 'Current password is incorrect');
    }

    // Prevent reusing current password as new password
    const isSamePassword = await user.isPasswordCorrect(newPassword);
    if (isSamePassword) {
      throw new ApiError(400, 'New password cannot be the same as your current password');
    }

    // Set new password (pre-save hook will hash it with bcrypt)
    user.password = newPassword;
    await user.save();

    return { message: 'Password changed successfully' };
  }
}
