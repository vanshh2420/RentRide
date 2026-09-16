import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking',
      required: [true, 'Booking ID is required'],
      unique: true // Exactly one review per booking
    },
    vehicleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vehicle',
      required: [true, 'Vehicle ID is required']
    },
    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Vendor ID is required']
    },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Customer ID is required']
    },
    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: [1, 'Rating must be at least 1 star'],
      max: [5, 'Rating cannot exceed 5 stars']
    },
    comment: {
      type: String,
      trim: true,
      maxlength: [1000, 'Review comment cannot exceed 1000 characters'],
      default: ''
    },
    isModerated: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

// Indexes
reviewSchema.index({ vehicleId: 1, createdAt: -1 });
reviewSchema.index({ vendorId: 1 });
reviewSchema.index({ customerId: 1 });

// Static Method to recalculate vehicle average rating
reviewSchema.statics.calculateAverageRating = async function (vehicleId) {
  const stats = await this.aggregate([
    {
      $match: { vehicleId: new mongoose.Types.ObjectId(vehicleId), isModerated: true }
    },
    {
      $group: {
        _id: '$vehicleId',
        ratingCount: { $sum: 1 },
        ratingAverage: { $avg: '$rating' }
      }
    }
  ]);

  if (stats.length > 0) {
    await mongoose.model('Vehicle').findByIdAndUpdate(vehicleId, {
      ratingAverage: stats[0].ratingAverage,
      ratingCount: stats[0].ratingCount
    });
  } else {
    await mongoose.model('Vehicle').findByIdAndUpdate(vehicleId, {
      ratingAverage: 0,
      ratingCount: 0
    });
  }
};

// Post-save hook to update vehicle rating stats
reviewSchema.post('save', async function () {
  await this.constructor.calculateAverageRating(this.vehicleId);
});

// Post-delete hook
reviewSchema.post('findOneAndDelete', async function (doc) {
  if (doc) {
    await doc.constructor.calculateAverageRating(doc.vehicleId);
  }
});

export const Review = mongoose.model('Review', reviewSchema);
