import { z } from 'zod';
import { VEHICLE_STATUS } from '../constants/status.js';

export const createVehicleSchema = {
  body: z.object({
    categoryId: z.string().min(1, 'Category is required'),
    brand: z.string().min(2, 'Brand is required'),
    model: z.string().min(2, 'Model is required'),
    registrationNumber: z.string().min(4, 'Registration number is required').toUpperCase(),
    year: z.coerce.number().min(2000).max(new Date().getFullYear() + 1),
    fuelType: z.enum(['petrol', 'diesel', 'electric', 'cng', 'hybrid']),
    transmission: z.enum(['manual', 'automatic']),
    seatingCapacity: z.coerce.number().min(1).max(20),
    engineCapacity: z.coerce.number().optional().nullable(),
    city: z.string().min(2, 'City is required'),
    state: z.string().optional().default(''),
    address: z.string().optional().default(''),
    features: z.preprocess((val) => {
      if (typeof val === 'string') {
        try { return JSON.parse(val); } catch { return val.split(',').map(s => s.trim()); }
      }
      return val;
    }, z.array(z.string()).default([])),
    hourlyRate: z.coerce.number().min(10, 'Hourly rate must be at least ₹10'),
    rate12Hour: z.coerce.number().min(50, '12-Hour rate must be at least ₹50'),
    rate24Hour: z.coerce.number().min(100, '24-Hour rate must be at least ₹100'),
    minRentalHours: z.coerce.number().default(1),
    securityDeposit: z.coerce.number().default(1000),
    fuelEconomy: z.coerce.number().min(0.1, 'Fuel economy must be greater than 0').optional().nullable(),
    fuelEconomyUnit: z.enum(['km/l', 'km/kg', 'km/charge', 'km/kWh']).optional().default('km/l'),
    status: z.enum(Object.values(VEHICLE_STATUS)).default(VEHICLE_STATUS.AVAILABLE)
  })
};

export const updateVehicleSchema = {
  body: z.object({
    categoryId: z.string().optional(),
    brand: z.string().min(2).optional(),
    model: z.string().min(2).optional(),
    year: z.coerce.number().min(2000).optional(),
    fuelType: z.enum(['petrol', 'diesel', 'electric', 'cng', 'hybrid']).optional(),
    transmission: z.enum(['manual', 'automatic']).optional(),
    seatingCapacity: z.coerce.number().min(1).optional(),
    engineCapacity: z.coerce.number().optional().nullable(),
    city: z.string().optional(),
    state: z.string().optional(),
    address: z.string().optional(),
    features: z.preprocess((val) => {
      if (typeof val === 'string') {
        try { return JSON.parse(val); } catch { return val.split(',').map(s => s.trim()); }
      }
      return val;
    }, z.array(z.string()).optional()),
    hourlyRate: z.coerce.number().min(10).optional(),
    rate12Hour: z.coerce.number().min(50).optional(),
    rate24Hour: z.coerce.number().min(100).optional(),
    minRentalHours: z.coerce.number().optional(),
    securityDeposit: z.coerce.number().optional(),
    fuelEconomy: z.coerce.number().min(0.1, 'Fuel economy must be greater than 0').optional().nullable(),
    fuelEconomyUnit: z.enum(['km/l', 'km/kg', 'km/charge', 'km/kWh']).optional(),
    status: z.enum(Object.values(VEHICLE_STATUS)).optional()
  })
};

export const updateVehicleStatusSchema = {
  body: z.object({
    status: z.enum(Object.values(VEHICLE_STATUS), {
      required_error: 'Status is required'
    })
  })
};

export const searchVehiclesSchema = {
  query: z.object({
    search: z.string().optional(),
    city: z.string().optional(),
    category: z.string().optional(),
    type: z.string().optional(),
    vehicleType: z.string().optional(),
    fuelType: z.string().optional(),
    transmission: z.string().optional(),
    seatingCapacity: z.coerce.number().min(1).optional(),
    minPrice: z.coerce.number().min(0).optional(),
    maxPrice: z.coerce.number().min(0).optional(),
    plan: z.string().optional().default('HOURLY'),
    sortBy: z.string().optional().default('popular'),
    sortOrder: z.string().optional().default('desc'),
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).max(100).default(12)
  })
};

export const nearbyVehiclesSchema = {
  query: z.object({
    lat: z.coerce.number().min(-90).max(90, 'Valid latitude required (-90 to 90)'),
    lng: z.coerce.number().min(-180).max(180, 'Valid longitude required (-180 to 180)'),
    startDateTime: z.string().optional(),
    endDateTime: z.string().optional(),
    category: z.string().optional(),
    vehicleType: z.string().optional(),
    radius: z.coerce.number().min(0.5).max(500).default(50),
    limit: z.coerce.number().min(1).max(50).default(12)
  })
};
