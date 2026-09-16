import mongoose from 'mongoose';

const tripTrackingSchema = new mongoose.Schema(
  {
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking',
      required: true,
      unique: true,
      index: true
    },
    vehicleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vehicle',
      required: true
    },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    status: {
      type: String,
      enum: ['INACTIVE', 'TRACKING', 'PAUSED', 'STOPPED'],
      default: 'TRACKING'
    },
    totalGpsDistanceKm: {
      type: Number,
      default: 0,
      min: 0
    },
    lastValidLocation: {
      lat: { type: Number, default: null },
      lng: { type: Number, default: null },
      accuracy: { type: Number, default: null },
      speed: { type: Number, default: 0 },
      timestamp: { type: Date, default: null }
    },
    recentWaypoints: [
      {
        lat: { type: Number, required: true },
        lng: { type: Number, required: true },
        timestamp: { type: Date, default: Date.now },
        speed: { type: Number, default: 0 }
      }
    ],
    gpsStatus: {
      type: String,
      enum: ['ACTIVE', 'ACCURACY_DEGRADED', 'SIGNAL_LOST'],
      default: 'ACTIVE'
    },
    startedAt: {
      type: Date,
      default: Date.now
    },
    endedAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);

tripTrackingSchema.index({ vehicleId: 1, status: 1 });

export const TripTracking = mongoose.model('TripTracking', tripTrackingSchema);
