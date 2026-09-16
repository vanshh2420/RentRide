import mongoose from 'mongoose';
import { ALL_ROLES } from '../constants/roles.js';

const notificationSchema = new mongoose.Schema(
  {
    recipientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Recipient ID is required']
    },
    recipientRole: {
      type: String,
      enum: ALL_ROLES,
      required: true
    },
    type: {
      type: String,
      enum: [
        'BOOKING_CONFIRMED',
        'BOOKING_CANCELLED',
        'NEW_BOOKING',
        'PAYMENT_SUCCESS',
        'PAYMENT_FAILED',
        'MAINTENANCE_ALERT',
        'VENDOR_APPROVAL',
        'VENDOR_APPROVED',
        'VENDOR_REJECTED',
        'VEHICLE_APPROVED',
        'VEHICLE_REJECTED',
        'ACCOUNT_ACTIVATED',
        'ACCOUNT_SUSPENDED',
        'REVIEW_RECEIVED',
        'SYSTEM_ANNOUNCEMENT'
      ],
      default: 'SYSTEM_ANNOUNCEMENT'
    },
    title: {
      type: String,
      required: [true, 'Notification title is required'],
      trim: true
    },
    message: {
      type: String,
      required: [true, 'Notification message is required'],
      trim: true
    },
    data: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },
    isRead: {
      type: Boolean,
      default: false
    },
    readAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);

// Indexes
notificationSchema.index({ recipientId: 1, isRead: 1, createdAt: -1 });

export const Notification = mongoose.model('Notification', notificationSchema);
