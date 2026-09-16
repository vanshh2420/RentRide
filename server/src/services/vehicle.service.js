import mongoose from 'mongoose';
import { Vehicle } from '../models/vehicle.model.js';
import { Category } from '../models/category.model.js';
import { ApiError } from '../utils/ApiError.js';
import { ROLES } from '../constants/roles.js';
import { uploadToCloudinary, deleteFromCloudinary } from '../config/cloudinary.js';
import { BookingService } from './booking.service.js';

export class VehicleService {
  /**
   * Create a new vehicle listing
   */
  static async createVehicle(vendorId, payload, files = []) {
    // 1. Verify category exists
    const category = await Category.findById(payload.categoryId);
    if (!category) {
      throw new ApiError(404, 'Selected category does not exist');
    }

    // 2. Check duplicate registration number
    const existingVehicle = await Vehicle.findOne({
      registrationNumber: payload.registrationNumber.toUpperCase().trim()
    });
    if (existingVehicle) {
      throw new ApiError(409, `Vehicle with registration number ${payload.registrationNumber} already exists`);
    }

    // 3. Process image uploads via Cloudinary or inherit verified catalog imagery
    let catalogDoc = null;
    if (payload.catalogId) {
      const { VehicleCatalog } = await import('../models/catalog.model.js');
      catalogDoc = await VehicleCatalog.findById(payload.catalogId);
    }

    const images = [];
    if (files && files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        const uploadResult = await uploadToCloudinary(files[i].buffer, 'rentride/vehicles');
        images.push({
          url: uploadResult.url,
          publicId: uploadResult.publicId,
          isPrimary: i === 0
        });
      }
    } else if (catalogDoc && catalogDoc.images && catalogDoc.images.length > 0) {
      catalogDoc.images.forEach((img, idx) => {
        images.push({
          url: img.url,
          publicId: img.publicId || '',
          isPrimary: idx === 0
        });
      });
    } else {
      // Fallback sample image if none provided
      images.push({
        url: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=800&q=80',
        publicId: '',
        isPrimary: true
      });
    }

    // 4. Construct vehicle document
    const vehicle = await Vehicle.create({
      vendorId,
      catalogId: payload.catalogId || null,
      categoryId: payload.categoryId,
      brand: payload.brand.trim(),
      model: payload.model.trim(),
      registrationNumber: payload.registrationNumber.toUpperCase().trim(),
      year: payload.year,
      fuelType: payload.fuelType,
      transmission: payload.transmission,
      seatingCapacity: payload.seatingCapacity,
      engineCapacity: payload.engineCapacity || null,
      location: {
        city: payload.city.trim(),
        state: payload.state || '',
        address: payload.address || ''
      },
      images,
      features: payload.features || [],
      fuelEconomy: payload.fuelEconomy ? Number(payload.fuelEconomy) : null,
      fuelEconomyUnit: payload.fuelEconomyUnit || 'km/l',
      pricing: {
        hourlyRate: payload.hourlyRate,
        rate12Hour: payload.rate12Hour,
        rate24Hour: payload.rate24Hour,
        minRentalHours: payload.minRentalHours || 1,
        securityDeposit: payload.securityDeposit || 1000
      },
      status: payload.status || 'AVAILABLE',
      isApproved: true
    });

    return await Vehicle.findById(vehicle._id)
      .populate('categoryId', 'name slug type')
      .populate('vendorId', 'name email phone vendorProfile');
  }

  /**
   * Update existing vehicle listing
   */
  static async updateVehicle(vehicleId, vendorId, payload, userRole) {
    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) {
      throw new ApiError(404, 'Vehicle not found');
    }

    // Role check: Only the owning vendor or admin can update
    if (userRole !== ROLES.ADMIN && vehicle.vendorId.toString() !== vendorId.toString()) {
      throw new ApiError(403, 'You do not have permission to update this vehicle');
    }

    // Update fields
    if (payload.categoryId) vehicle.categoryId = payload.categoryId;
    if (payload.brand) vehicle.brand = payload.brand.trim();
    if (payload.model) vehicle.model = payload.model.trim();
    if (payload.year) vehicle.year = payload.year;
    if (payload.fuelType) vehicle.fuelType = payload.fuelType;
    if (payload.transmission) vehicle.transmission = payload.transmission;
    if (payload.seatingCapacity) vehicle.seatingCapacity = payload.seatingCapacity;
    if (payload.engineCapacity !== undefined) vehicle.engineCapacity = payload.engineCapacity;
    if (payload.features) vehicle.features = payload.features;
    if (payload.status) vehicle.status = payload.status;

    if (payload.city || payload.state || payload.address) {
      vehicle.location = {
        city: payload.city || vehicle.location.city,
        state: payload.state || vehicle.location.state,
        address: payload.address || vehicle.location.address
      };
    }

    if (payload.fuelEconomy !== undefined) vehicle.fuelEconomy = payload.fuelEconomy ? Number(payload.fuelEconomy) : null;
    if (payload.fuelEconomyUnit) vehicle.fuelEconomyUnit = payload.fuelEconomyUnit;

    if (payload.hourlyRate || payload.rate12Hour || payload.rate24Hour || payload.securityDeposit) {
      vehicle.pricing = {
        hourlyRate: payload.hourlyRate || vehicle.pricing.hourlyRate,
        rate12Hour: payload.rate12Hour || vehicle.pricing.rate12Hour,
        rate24Hour: payload.rate24Hour || vehicle.pricing.rate24Hour,
        minRentalHours: payload.minRentalHours || vehicle.pricing.minRentalHours,
        securityDeposit: payload.securityDeposit !== undefined ? payload.securityDeposit : vehicle.pricing.securityDeposit
      };
    }

    await vehicle.save();

    return await Vehicle.findById(vehicle._id)
      .populate('categoryId', 'name slug type')
      .populate('vendorId', 'name email phone vendorProfile');
  }

  /**
   * Delete vehicle listing
   */
  static async deleteVehicle(vehicleId, vendorId, userRole) {
    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) {
      throw new ApiError(404, 'Vehicle not found');
    }

    if (userRole !== ROLES.ADMIN && vehicle.vendorId.toString() !== vendorId.toString()) {
      throw new ApiError(403, 'You do not have permission to delete this vehicle');
    }

    // Clean up images from Cloudinary
    if (vehicle.images && vehicle.images.length > 0) {
      for (const img of vehicle.images) {
        if (img.publicId) {
          await deleteFromCloudinary(img.publicId);
        }
      }
    }

    await Vehicle.findByIdAndDelete(vehicleId);
    return { message: 'Vehicle deleted successfully' };
  }

  /**
   * Get single vehicle details
   */
  static async getVehicleById(vehicleId) {
    const vehicle = await Vehicle.findById(vehicleId)
      .populate('categoryId', 'name slug type iconUrl')
      .populate('vendorId', 'name email phone vendorProfile')
      .populate('catalogId');

    if (!vehicle) {
      throw new ApiError(404, 'Vehicle not found');
    }

    return vehicle;
  }

  /**
   * Get vehicles belonging to a specific vendor (Fleet Dashboard)
   */
  static async getVendorVehicles(vendorId, { status, search, page = 1, limit = 20 }) {
    const query = { vendorId };

    if (status && status !== 'ALL') {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { brand: { $regex: search, $options: 'i' } },
        { model: { $regex: search, $options: 'i' } },
        { registrationNumber: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const [vehicles, total] = await Promise.all([
      Vehicle.find(query)
        .populate('categoryId', 'name slug type')
        .populate('catalogId')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Vehicle.countDocuments(query)
    ]);

    return {
      vehicles,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit))
      }
    };
  }

  /**
   * Quick status toggle (AVAILABLE, MAINTENANCE, INACTIVE)
   */
  static async updateVehicleStatus(vehicleId, vendorId, status, userRole) {
    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) {
      throw new ApiError(404, 'Vehicle not found');
    }

    if (userRole !== ROLES.ADMIN && vehicle.vendorId.toString() !== vendorId.toString()) {
      throw new ApiError(403, 'You do not have permission to update this vehicle');
    }

    vehicle.status = status;
    await vehicle.save();

    return vehicle;
  }

  /**
   * Faceted search for customers exploring vehicles
   */
  static async searchVehicles({
    city,
    category,
    vehicleType,
    type,
    fuelType,
    transmission,
    plan = 'HOURLY',
    minPrice,
    maxPrice,
    search,
    sortBy = 'popular',
    sortOrder = 'desc',
    page = 1,
    limit = 12
  }) {
    const query = { status: 'AVAILABLE', isApproved: true };

    if (city && city !== 'all') {
      query['location.city'] = { $regex: city.trim(), $options: 'i' };
    }

    if (category && category !== 'all') {
      const isObjectId = mongoose.Types.ObjectId.isValid(category);
      const cat = await Category.findOne({
        $or: [
          ...(isObjectId ? [{ _id: category }] : []),
          { slug: category.toLowerCase().trim() },
          { name: { $regex: new RegExp(`^${category.trim()}$`, 'i') } }
        ]
      });
      if (cat) {
        query.categoryId = cat._id;
      } else {
        query.categoryId = new mongoose.Types.ObjectId();
      }
    }

    const effectiveVehicleType = (vehicleType || type || '').toLowerCase();
    if (effectiveVehicleType && effectiveVehicleType !== 'all') {
      const categories = await Category.find({ type: effectiveVehicleType });
      const catIds = categories.map((c) => c._id);
      if (query.categoryId) {
        if (!catIds.some((id) => id.toString() === query.categoryId.toString())) {
          query.categoryId = new mongoose.Types.ObjectId();
        }
      } else {
        query.categoryId = { $in: catIds };
      }
    }

    if (fuelType && fuelType !== 'all') {
      query.fuelType = fuelType.toLowerCase();
    }

    if (transmission && transmission !== 'all') {
      query.transmission = transmission.toLowerCase();
    }

    if (minPrice || maxPrice) {
      const priceField =
        plan === 'HOURLY'
          ? 'pricing.hourlyRate'
          : (plan === '12_HOURS' || plan === 'TWELVE_HOUR')
          ? 'pricing.rate12Hour'
          : 'pricing.rate24Hour';
      query[priceField] = {};
      if (minPrice) query[priceField].$gte = Number(minPrice);
      if (maxPrice) query[priceField].$lte = Number(maxPrice);
    }

    if (search) {
      query.$or = [
        { brand: { $regex: search, $options: 'i' } },
        { model: { $regex: search, $options: 'i' } },
        { registrationNumber: { $regex: search, $options: 'i' } }
      ];
    }

    let sort = { ratingAverage: -1 };
    if (sortBy === 'price_asc' || sortBy === 'pricing.hourlyRate:asc') {
      const priceField =
        plan === 'HOURLY'
          ? 'pricing.hourlyRate'
          : (plan === '12_HOURS' || plan === 'TWELVE_HOUR')
          ? 'pricing.rate12Hour'
          : 'pricing.rate24Hour';
      sort = { [priceField]: 1 };
    } else if (sortBy === 'price_desc' || sortBy === 'pricing.hourlyRate:desc') {
      const priceField =
        plan === 'HOURLY'
          ? 'pricing.hourlyRate'
          : (plan === '12_HOURS' || plan === 'TWELVE_HOUR')
          ? 'pricing.rate12Hour'
          : 'pricing.rate24Hour';
      sort = { [priceField]: -1 };
    } else if (sortBy === 'newest' || sortBy === 'createdAt') {
      sort = { createdAt: sortOrder === 'asc' ? 1 : -1 };
    } else if (sortBy === 'rating' || sortBy === 'ratingAverage' || sortBy === 'rating_desc') {
      sort = { ratingAverage: -1 };
    } else {
      sort = { ratingAverage: -1, createdAt: -1 };
    }

    const skip = (Number(page) - 1) * Number(limit);
    const [vehicles, total] = await Promise.all([
      Vehicle.find(query)
        .populate('categoryId', 'name slug type iconUrl')
        .populate('vendorId', 'name vendorProfile')
        .populate('catalogId')
        .sort(sort)
        .skip(skip)
        .limit(Number(limit)),
      Vehicle.countDocuments(query)
    ]);

    return {
      vehicles,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit))
      }
    };
  }

  /**
   * Helper function: Haversine distance formula in kilometers
   */
  static calculateDistanceKm(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c * 10) / 10;
  }

  /**
   * Helper function: City center coordinates fallback for MP hubs
   */
  static getCityCoordinates(cityName = '') {
    const norm = (cityName || '').toLowerCase().trim();
    if (norm.includes('indore')) return { lat: 22.7196, lng: 75.8577 };
    if (norm.includes('bhopal')) return { lat: 23.2599, lng: 77.4126 };
    if (norm.includes('gwalior')) return { lat: 26.2183, lng: 78.1828 };
    if (norm.includes('bangalore') || norm.includes('bengaluru')) return { lat: 12.9716, lng: 77.5946 };
    return { lat: 22.7196, lng: 75.8577 }; // Default to Indore
  }

  /**
   * Discover Nearest Available Vehicles/Vendors
   * Combines: Distance + Actual Interval Availability (Collision Engine) + Radius Filtering
   */
  static async getNearbyAvailableVehicles({
    lat,
    lng,
    startDateTime,
    endDateTime,
    category,
    vehicleType,
    radius = 50,
    limit = 12
  }) {
    const userLat = Number(lat);
    const userLng = Number(lng);
    const maxRadiusKm = Number(radius) || 50;

    // 1. Fetch approved and available vehicles
    const query = { status: 'AVAILABLE', isApproved: true };
    if (category && category !== 'all') {
      if (mongoose.Types.ObjectId.isValid(category)) {
        query.categoryId = category;
      }
    }

    const candidateVehicles = await Vehicle.find(query)
      .populate('categoryId', 'name slug type iconUrl')
      .populate('vendorId', 'name email phone vendorProfile')
      .lean();

    // 2. Perform distance calculations and distance filtering
    const vehiclesWithDistance = candidateVehicles.map((vehicle) => {
      let vLat = vehicle.location?.coordinates?.lat;
      let vLng = vehicle.location?.coordinates?.lng;

      // If coordinates are unpopulated/zero, use city center coordinates
      if (!vLat || !vLng || (vLat === 0 && vLng === 0)) {
        const cityCoord = VehicleService.getCityCoordinates(vehicle.location?.city);
        vLat = cityCoord.lat;
        vLng = cityCoord.lng;
      }

      const distanceKm = VehicleService.calculateDistanceKm(userLat, userLng, vLat, vLng);
      return {
        ...vehicle,
        distanceKm,
        computedCoordinates: { lat: vLat, lng: vLng }
      };
    }).filter(v => v.distanceKm <= maxRadiusKm);

    // 3. Filter by vehicleType if requested
    let filteredByType = vehiclesWithDistance;
    if (vehicleType && vehicleType !== 'all') {
      filteredByType = vehiclesWithDistance.filter(
        v => v.categoryId?.type === vehicleType
      );
    }

    // 4. Critical Availability Verification: Check against booking collision engine
    let availableVehicles = filteredByType;
    if (startDateTime && endDateTime) {
      const availabilityChecks = await Promise.all(
        filteredByType.map(async (vehicle) => {
          try {
            const isAvailable = await BookingService.checkVehicleAvailability(
              vehicle._id,
              startDateTime,
              endDateTime
            );
            return { vehicle, isAvailable };
          } catch (err) {
            return { vehicle, isAvailable: false };
          }
        })
      );

      availableVehicles = availabilityChecks
        .filter(item => item.isAvailable)
        .map(item => item.vehicle);
    }

    // 5. Sort by distance ascending
    availableVehicles.sort((a, b) => a.distanceKm - b.distanceKm);

    // 6. Return limited results
    const results = availableVehicles.slice(0, Number(limit));

    return {
      totalFound: availableVehicles.length,
      userLocation: { lat: userLat, lng: userLng },
      searchRadiusKm: maxRadiusKm,
      intervalChecked: Boolean(startDateTime && endDateTime),
      vehicles: results
    };
  }
}
