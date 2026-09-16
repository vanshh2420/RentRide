import mongoose from 'mongoose';
import { VEHICLE_STATUS } from '../constants/status.js';

const vehicleSchema = new mongoose.Schema(
  {
    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Vendor ID is required']
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Category ID is required']
    },
    catalogId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'VehicleCatalog',
      default: null
    },
    brand: {
      type: String,
      required: [true, 'Vehicle brand is required'],
      trim: true
    },
    model: {
      type: String,
      required: [true, 'Vehicle model is required'],
      trim: true
    },
    registrationNumber: {
      type: String,
      required: [true, 'Registration number is required'],
      unique: true,
      uppercase: true,
      trim: true
    },
    year: {
      type: Number,
      required: [true, 'Manufacturing year is required'],
      min: [2000, 'Year must be 2000 or newer'],
      max: [new Date().getFullYear() + 1, 'Year cannot be in the future']
    },
    fuelType: {
      type: String,
      enum: ['petrol', 'diesel', 'electric', 'cng', 'hybrid'],
      required: [true, 'Fuel type is required']
    },
    transmission: {
      type: String,
      enum: ['manual', 'automatic'],
      required: [true, 'Transmission type is required']
    },
    seatingCapacity: {
      type: Number,
      required: [true, 'Seating capacity is required'],
      min: [1, 'Seating capacity must be at least 1']
    },
    engineCapacity: {
      type: Number, // In cc for fuel, or kWh for EV
      default: null
    },
    location: {
      city: { type: String, required: true, trim: true },
      state: { type: String, default: '', trim: true },
      address: { type: String, default: '', trim: true },
      coordinates: {
        lat: { type: Number, default: 0 },
        lng: { type: Number, default: 0 }
      }
    },
    images: [
      {
        url: { type: String, required: true },
        publicId: { type: String, default: '' },
        isPrimary: { type: Boolean, default: false }
      }
    ],
    features: [
      {
        type: String,
        trim: true
      }
    ],
    pricing: {
      hourlyRate: {
        type: Number,
        required: [true, 'Hourly rental rate is required'],
        min: [10, 'Hourly rate must be at least ₹10']
      },
      rate12Hour: {
        type: Number,
        required: [true, '12-Hour rental rate is required'],
        min: [50, '12-Hour rate must be at least ₹50']
      },
      rate24Hour: {
        type: Number,
        required: [true, '24-Hour rental rate is required'],
        min: [100, '24-Hour rate must be at least ₹100']
      },
      minRentalHours: {
        type: Number,
        default: 1,
        min: 1
      },
      securityDeposit: {
        type: Number,
        default: 1000
      }
    },
    status: {
      type: String,
      enum: Object.values(VEHICLE_STATUS),
      default: VEHICLE_STATUS.AVAILABLE
    },
    ratingAverage: {
      type: Number,
      default: 0,
      min: [0, 'Rating cannot be below 0'],
      max: [5, 'Rating cannot exceed 5'],
      set: (val) => Math.round(val * 10) / 10 // Round to 1 decimal place
    },
    ratingCount: {
      type: Number,
      default: 0
    },
    isApproved: {
      type: Boolean,
      default: true
    },
    mileageLimitPerDayKm: {
      type: Number,
      default: 250 // 250 km limit per day by default
    },
    extraKmCharge: {
      type: Number,
      default: 10 // ₹10 per extra km
    },
    fuelEconomy: {
      type: Number,
      default: null,
      min: [0.1, 'Fuel economy must be greater than 0']
    },
    fuelEconomyUnit: {
      type: String,
      enum: ['km/l', 'km/kg', 'km/charge', 'km/kWh'],
      default: 'km/l'
    }
  },
  {
    timestamps: true
  }
);

// High-Performance Query Indexes
vehicleSchema.index({ categoryId: 1, status: 1, isApproved: 1 });
vehicleSchema.index({ 'location.city': 1, status: 1 });
vehicleSchema.index({ vendorId: 1, status: 1 });
vehicleSchema.index({ brand: 1, model: 1 });
vehicleSchema.index({ 'pricing.hourlyRate': 1 });

export const Vehicle = mongoose.model('Vehicle', vehicleSchema);
