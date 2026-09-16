import mongoose from 'mongoose';
import { MAINTENANCE_STATUS } from '../constants/status.js';

const maintenanceSchema = new mongoose.Schema(
  {
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
    title: {
      type: String,
      default: '',
      trim: true
    },
    serviceType: {
      type: String,
      default: 'GENERAL_SERVICE'
    },
    maintenanceType: {
      type: String,
      default: 'routine'
    },
    description: {
      type: String,
      default: function() { return this.title || this.notes || 'Vehicle Maintenance'; },
      trim: true
    },
    notes: {
      type: String,
      default: '',
      trim: true
    },
    estimatedCost: {
      type: Number,
      default: 0,
      min: [0, 'Cost cannot be negative']
    },
    cost: {
      type: Number,
      default: 0,
      min: [0, 'Cost cannot be negative']
    },
    startDate: {
      type: Date,
      required: [true, 'Maintenance start date is required']
    },
    endDate: {
      type: Date,
      required: [true, 'Maintenance expected completion date is required']
    },
    status: {
      type: String,
      enum: Object.values(MAINTENANCE_STATUS),
      default: MAINTENANCE_STATUS.SCHEDULED,
      required: true
    },
    serviceCenterDetails: {
      name: { type: String, default: '' },
      contact: { type: String, default: '' },
      invoiceUrl: { type: String, default: '' }
    }
  },
  {
    timestamps: true
  }
);

// CRITICAL AVAILABILITY BLOCKOUT INDEX
maintenanceSchema.index({ vehicleId: 1, startDate: 1, endDate: 1, status: 1 });
maintenanceSchema.index({ vendorId: 1, status: 1 });

export const Maintenance = mongoose.model('Maintenance', maintenanceSchema);
