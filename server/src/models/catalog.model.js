import mongoose from 'mongoose';

const catalogImageSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    publicId: { type: String, default: '' },
    isPrimary: { type: Boolean, default: false },
    altText: { type: String, default: '' },
    caption: { type: String, default: '' },
    sourceUrl: { type: String, default: '' },
    sourceProvider: { type: String, default: '' },
    licenseStatus: {
      type: String,
      enum: ['OPEN_LICENSE', 'CREATIVE_COMMONS', 'MANUFACTURER_PRESS', 'PUBLIC_DOMAIN', 'UNKNOWN'],
      default: 'UNKNOWN'
    },
    attribution: { type: String, default: '' },
    verificationStatus: {
      type: String,
      enum: ['VERIFIED', 'UNVERIFIED'],
      default: 'UNVERIFIED'
    }
  },
  { _id: false }
);

const specificationsSchema = new mongoose.Schema(
  {
    dimensions: {
      lengthMm: { type: Number, default: null },
      widthMm: { type: Number, default: null },
      heightMm: { type: Number, default: null },
      wheelbaseMm: { type: Number, default: null }
    },
    groundClearanceMm: { type: Number, default: null },
    fuelTankCapacityLiters: { type: Number, default: null }, // Null for EV
    batteryCapacityKwh: { type: Number, default: null }, // Only for EV/Hybrid
    maxPowerBhp: { type: Number, default: null },
    maxTorqueNm: { type: Number, default: null },
    kerbWeightKg: { type: Number, default: null },
    topSpeedKmph: { type: Number, default: null },
    chargingTimeHours: { type: Number, default: null } // Only for EV
  },
  { _id: false }
);

const vehicleCatalogSchema = new mongoose.Schema(
  {
    catalogKey: {
      type: String,
      required: [true, 'Catalog key is required'],
      unique: true,
      lowercase: true,
      trim: true,
      index: true
    },
    brand: {
      type: String,
      required: [true, 'Vehicle brand is required'],
      trim: true,
      index: true
    },
    model: {
      type: String,
      required: [true, 'Vehicle model is required'],
      trim: true,
      index: true
    },
    variant: {
      type: String,
      trim: true,
      default: ''
    },
    generationOrYear: {
      type: String,
      trim: true,
      default: ''
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Category ID is required'],
      index: true
    },
    vehicleType: {
      type: String,
      enum: ['two_wheeler', 'four_wheeler'],
      required: [true, 'Vehicle type (two_wheeler or four_wheeler) is required'],
      index: true
    },
    fuelType: {
      type: String,
      enum: ['petrol', 'diesel', 'electric', 'cng', 'hybrid'],
      required: [true, 'Fuel type is required'],
      index: true
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
      type: Number, // In cc for ICE, or battery capacity in kWh for EVs
      default: null
    },
    fuelEconomy: {
      value: {
        type: Number,
        required: [true, 'Fuel economy or range value is required'],
        min: [0.1, 'Fuel economy must be positive']
      },
      unit: {
        type: String,
        enum: ['km/l', 'km/kg', 'km/charge', 'km/kWh'],
        required: true,
        default: 'km/l'
      },
      source: {
        type: String,
        default: 'ARAI / Manufacturer Certified'
      }
    },
    features: [
      {
        type: String,
        trim: true
      }
    ],
    specifications: {
      type: specificationsSchema,
      default: () => ({})
    },
    images: {
      type: [catalogImageSchema],
      default: []
    },
    suggestedPricing: {
      hourlyRate: { type: Number, default: 80 },
      rate12Hour: { type: Number, default: 500 },
      rate24Hour: { type: Number, default: 850 }
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true
    }
  },
  {
    timestamps: true
  }
);

// High-Performance Query Indexes
vehicleCatalogSchema.index({ brand: 1, model: 1 });
vehicleCatalogSchema.index({ categoryId: 1, isActive: 1 });
vehicleCatalogSchema.index({ vehicleType: 1, fuelType: 1, transmission: 1 });

export const VehicleCatalog = mongoose.model('VehicleCatalog', vehicleCatalogSchema);
export default VehicleCatalog;
