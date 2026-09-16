import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { ROLES, ALL_ROLES } from '../constants/roles.js';
import { ENV } from '../config/env.js';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters long'],
      maxlength: [60, 'Name cannot exceed 60 characters']
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email address']
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters long'],
      select: false // Exclude from query results by default
    },
    phone: {
      type: String,
      trim: true,
      default: ''
    },
    role: {
      type: String,
      enum: ALL_ROLES,
      default: ROLES.CUSTOMER
    },
    avatar: {
      url: {
        type: String,
        default: ''
      },
      publicId: {
        type: String,
        default: ''
      }
    },
    isActive: {
      type: Boolean,
      default: true
    },
    // Role-specific profile extensions
    vendorProfile: {
      businessName: { type: String, default: '' },
      gstNumber: { type: String, default: '' },
      address: {
        street: { type: String, default: '' },
        city: { type: String, default: '' },
        state: { type: String, default: '' },
        pincode: { type: String, default: '' }
      },
      isApproved: { type: Boolean, default: false },
      commissionRateOverride: { type: Number, default: null } // Custom commission if negotiated
    },
    customerProfile: {
      drivingLicenseNumber: { type: String, default: '' },
      drivingLicenseUrl: { type: String, default: '' },
      kycStatus: {
        type: String,
        enum: ['PENDING', 'VERIFIED', 'REJECTED'],
        default: 'PENDING'
      }
    }
  },
  {
    timestamps: true
  }
);

// Indexes
userSchema.index({ email: 1, role: 1 });

// Pre-save password hashing hook
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Instance Method: Compare Password
userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// Instance Method: Generate JWT Access Token
userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      name: this.name,
      role: this.role
    },
    ENV.JWT_SECRET,
    {
      expiresIn: ENV.JWT_EXPIRES_IN
    }
  );
};

export const User = mongoose.model('User', userSchema);
