import mongoose from 'mongoose';
import { Review } from '../models/review.model.js';
import { Booking } from '../models/booking.model.js';
import { Vehicle } from '../models/vehicle.model.js';
import { Notification } from '../models/notification.model.js';
import { ApiError } from '../utils/ApiError.js';
import { ROLES } from '../constants/roles.js';

export class ReviewService {
  /**
   * Create verified review after trip completion
   */
  static async createReview(userId, payload) {
    const { vehicleId, bookingId, rating, comment = '' } = payload;

    // 1. Verify that booking exists, is completed, and belongs to this user
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      throw new ApiError(404, 'Booking not found');
    }

    if (booking.customerId?.toString() !== userId.toString()) {
      throw new ApiError(403, 'You can only review rides you personally booked and completed');
    }

    if (booking.status !== 'COMPLETED') {
      throw new ApiError(400, 'Reviews can only be submitted for completed rentals');
    }

    if (booking.vehicleId.toString() !== vehicleId.toString()) {
      throw new ApiError(400, 'Vehicle mismatch for this booking');
    }

    // 2. Check for duplicate review
    const existingReview = await Review.findOne({ bookingId });
    if (existingReview) {
      throw new ApiError(409, 'You have already submitted a review for this booking');
    }

    // 3. Create review
    const review = await Review.create({
      vehicleId,
      customerId: userId,
      bookingId,
      rating: Number(rating),
      comment: comment.trim()
    });

    // 4. Recalculate Vehicle rating statistics
    const stats = await Review.aggregate([
      { $match: { vehicleId: new mongoose.Types.ObjectId(vehicleId) } },
      {
        $group: {
          _id: '$vehicleId',
          ratingAverage: { $avg: '$rating' },
          ratingCount: { $sum: 1 }
        }
      }
    ]);

    if (stats.length > 0) {
      await Vehicle.findByIdAndUpdate(vehicleId, {
        ratingAverage: Math.round(stats[0].ratingAverage * 10) / 10,
        ratingCount: stats[0].ratingCount
      });
    }

    // 5. Notify vendor
    if (booking.vendorId) {
      await Notification.create({
        recipientId: booking.vendorId,
        recipientRole: ROLES.VENDOR,
        type: 'NEW_REVIEW',
        title: `New ${rating}★ Review Received`,
        message: `A customer left a ${rating}-star rating for ${booking.vehicleId?.brand || 'your vehicle'}: "${comment.substring(0, 60)}${comment.length > 60 ? '...' : ''}"`,
        data: { vehicleId, reviewId: review._id }
      });
    }

    return await Review.findById(review._id).populate('customerId', 'name');
  }

  /**
   * Get reviews for a specific vehicle
   */
  static async getVehicleReviews(vehicleId, { page = 1, limit = 10 } = {}) {
    const skip = (Number(page) - 1) * Number(limit);
    const [reviews, total] = await Promise.all([
      Review.find({ vehicleId })
        .populate('customerId', 'name')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Review.countDocuments({ vehicleId })
    ]);

    return {
      reviews,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit))
      }
    };
  }
}
