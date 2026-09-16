import mongoose from 'mongoose';

const fuelPriceSchema = new mongoose.Schema(
  {
    city: {
      type: String,
      required: [true, 'City name is required'],
      trim: true
    },
    state: {
      type: String,
      default: 'Madhya Pradesh',
      trim: true
    },
    fuelType: {
      type: String,
      enum: ['petrol', 'diesel', 'cng', 'electric'],
      required: [true, 'Fuel type is required']
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0.1, 'Price must be greater than 0']
    },
    unit: {
      type: String,
      enum: ['L', 'kg', 'kWh'],
      required: [true, 'Unit is required']
    },
    currency: {
      type: String,
      default: 'INR'
    },
    effectiveFrom: {
      type: Date,
      default: Date.now
    },
    lastUpdated: {
      type: Date,
      default: Date.now
    },
    source: {
      type: String,
      default: 'IOCL / State Petroleum Board',
      trim: true
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

// Unique compound index so each city has only one active price record per fuel type
fuelPriceSchema.index({ city: 1, fuelType: 1 }, { unique: true });

export const FuelPrice = mongoose.model('FuelPrice', fuelPriceSchema);
