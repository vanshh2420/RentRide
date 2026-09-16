import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import { ENV } from './env.js';
import { logger } from '../utils/logger.js';
import { Category } from '../models/category.model.js';
import { User } from '../models/user.model.js';
import { Vehicle } from '../models/vehicle.model.js';
import { ROLES } from '../constants/roles.js';
import { VEHICLE_STATUS } from '../constants/status.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const storageDir = path.resolve(__dirname, '../../.mongo-storage');

let memoryServerInstance = null;

const INITIAL_CATEGORIES = [
  {
    name: 'Electric Scooters',
    slug: 'electric-scooters',
    type: 'two_wheeler',
    description: 'Eco-friendly, silent, and smart city commuters with instant torque.',
    iconUrl: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=400&q=80',
    isActive: true
  },
  {
    name: 'Scooters',
    slug: 'scooters',
    type: 'two_wheeler',
    description: 'Comfortable automatic scooters perfect for navigating city traffic.',
    iconUrl: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=400&q=80',
    isActive: true
  },
  {
    name: 'Bikes',
    slug: 'bikes',
    type: 'two_wheeler',
    description: 'Geared motorcycles, cruisers, and sporty rides for city and highway touring.',
    iconUrl: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=400&q=80',
    isActive: true
  },
  {
    name: 'Hatchbacks',
    slug: 'hatchbacks',
    type: 'four_wheeler',
    description: 'Compact, fuel-efficient, and easy to park cars for couples and small families.',
    iconUrl: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=400&q=80',
    isActive: true
  },
  {
    name: 'Sedans',
    slug: 'sedans',
    type: 'four_wheeler',
    description: 'Smooth, spacious, and comfortable long-distance sedans with generous boot space.',
    iconUrl: 'https://images.unsplash.com/photo-1550355291-bbee04a92027?auto=format&fit=crop&w=400&q=80',
    isActive: true
  },
  {
    name: 'SUVs',
    slug: 'suvs',
    type: 'four_wheeler',
    description: 'High ground clearance, rugged capability, and 5-to-7-seater capacity for adventures.',
    iconUrl: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=400&q=80',
    isActive: true
  }
];

export const autoSeedIfEmpty = async () => {
  try {
    // 1. Seed Categories if none exist
    let categories = await Category.find();
    if (categories.length === 0) {
      logger.info('Database empty: Seeding default vehicle categories...');
      categories = await Category.create(INITIAL_CATEGORIES);
      logger.info(`Initialized ${categories.length} vehicle categories.`);
    }

    const catMap = {};
    categories.forEach((cat) => {
      catMap[cat.name] = cat._id;
      catMap[cat.slug] = cat._id;
    });

    // 2. Seed Default Users (Admin, Vendors, Customers) if none exist
    let vendor = await User.findOne({ role: ROLES.VENDOR });
    if (!vendor) {
      logger.info('Seeding default users and vendor accounts...');
      await User.create([
        {
          name: 'RentRide Admin',
          email: 'admin@rentride.in',
          password: 'Admin@123',
          phone: '+919900000001',
          role: ROLES.ADMIN,
          isActive: true
        },
        {
          name: 'Indore Prime Fleet Hub',
          email: 'vendor1@rentride.in',
          password: 'Vendor@123',
          phone: '+919800000002',
          role: ROLES.VENDOR,
          isActive: true,
          vendorProfile: {
            businessName: 'Indore Prime Fleet Hub Pvt Ltd',
            gstNumber: '23ABCDE1234F1Z5',
            address: {
              street: 'AB Road, Vijay Nagar',
              city: 'Indore',
              state: 'Madhya Pradesh',
              pincode: '452010'
            },
            isApproved: true
          }
        },
        {
          name: 'Bhopal Lakes Rides',
          email: 'vendor2@rentride.in',
          password: 'Vendor@123',
          phone: '+919700000003',
          role: ROLES.VENDOR,
          isActive: true,
          vendorProfile: {
            businessName: 'Bhopal Lakes Rides Enterprise',
            gstNumber: '23ABCDE5678F2Z1',
            address: {
              street: 'MP Nagar Zone 1',
              city: 'Bhopal',
              state: 'Madhya Pradesh',
              pincode: '462011'
            },
            isApproved: true
          }
        },
        {
          name: 'Rahul Sharma',
          email: 'customer1@rentride.in',
          password: 'Customer@123',
          phone: '+919600000004',
          role: ROLES.CUSTOMER,
          isActive: true,
          customerProfile: {
            drivingLicenseNumber: 'MP0920210012345',
            kycStatus: 'VERIFIED'
          }
        }
      ]);

      vendor = await User.findOne({ email: 'vendor1@rentride.in' });
    }

    // 3. Ensure supported city vehicle fleets (Indore, Bhopal, Gwalior) exist
    if (vendor) {
      const vendor2 = (await User.findOne({ email: 'vendor2@rentride.in' })) || vendor;

      const sampleVehicles = [
        // --- INDORE FLEET ---
        {
          vendorId: vendor._id,
          categoryId: catMap['Bikes'] || catMap['bikes'],
          brand: 'Royal Enfield',
          model: 'Hunter 350 (Dapper Ash)',
          registrationNumber: 'MP09HR1001',
          year: 2024,
          fuelType: 'petrol',
          fuelEconomy: 36.2,
          fuelEconomyUnit: 'km/l',
          transmission: 'manual',
          seatingCapacity: 2,
          engineCapacity: 349,
          location: {
            city: 'Indore',
            state: 'Madhya Pradesh',
            address: 'Vijay Nagar Hub, AB Road',
            coordinates: { lat: 22.7533, lng: 75.8937 }
          },
          images: [{ url: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=800&q=80', isPrimary: true }],
          features: ['Dual-channel ABS', 'USB Charger', 'Tubeless Tyres', 'Helmet Included'],
          pricing: { hourlyRate: 90, rate12Hour: 600, rate24Hour: 999, minRentalHours: 2, securityDeposit: 1000 },
          status: VEHICLE_STATUS.AVAILABLE,
          ratingAverage: 4.8,
          ratingCount: 24,
          isApproved: true
        },
        {
          vendorId: vendor._id,
          categoryId: catMap['Electric Scooters'] || catMap['electric-scooters'],
          brand: 'Ather',
          model: '450X Gen 3',
          registrationNumber: 'MP09EV2022',
          year: 2024,
          fuelType: 'electric',
          fuelEconomy: 3.2,
          fuelEconomyUnit: 'km/kWh',
          transmission: 'automatic',
          seatingCapacity: 2,
          engineCapacity: 4,
          location: {
            city: 'Indore',
            state: 'Madhya Pradesh',
            address: 'Palasia Square Hub',
            coordinates: { lat: 22.7244, lng: 75.8839 }
          },
          images: [{ url: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80', isPrimary: true }],
          features: ['Google Maps Navigation', 'Fast Charging (Warp Mode)', 'Underseat Helmet Storage', 'Bluetooth Audio'],
          pricing: { hourlyRate: 65, rate12Hour: 420, rate24Hour: 700, minRentalHours: 1, securityDeposit: 1000 },
          status: VEHICLE_STATUS.AVAILABLE,
          ratingAverage: 4.9,
          ratingCount: 38,
          isApproved: true
        },
        {
          vendorId: vendor._id,
          categoryId: catMap['Scooters'] || catMap['scooters'],
          brand: 'Honda',
          model: 'Activa 6G Smart',
          registrationNumber: 'MP09AC6006',
          year: 2023,
          fuelType: 'petrol',
          fuelEconomy: 47.0,
          fuelEconomyUnit: 'km/l',
          transmission: 'automatic',
          seatingCapacity: 2,
          engineCapacity: 110,
          location: {
            city: 'Indore',
            state: 'Madhya Pradesh',
            address: 'Bhawarkua Hub',
            coordinates: { lat: 22.6926, lng: 75.8676 }
          },
          images: [{ url: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=800&q=80', isPrimary: true }],
          features: ['Keyless Start', 'External Fuel Lid', 'Helmet Included', 'Combi Brake System'],
          pricing: { hourlyRate: 50, rate12Hour: 320, rate24Hour: 550, minRentalHours: 1, securityDeposit: 800 },
          status: VEHICLE_STATUS.AVAILABLE,
          ratingAverage: 4.6,
          ratingCount: 52,
          isApproved: true
        },
        {
          vendorId: vendor._id,
          categoryId: catMap['SUVs'] || catMap['suvs'],
          brand: 'Mahindra',
          model: 'Thar 4x4 Hard Top',
          registrationNumber: 'MP09TH4004',
          year: 2024,
          fuelType: 'diesel',
          fuelEconomy: 15.2,
          fuelEconomyUnit: 'km/l',
          transmission: 'automatic',
          seatingCapacity: 4,
          engineCapacity: 2184,
          location: {
            city: 'Indore',
            state: 'Madhya Pradesh',
            address: 'Vijay Nagar Hub, AB Road',
            coordinates: { lat: 22.7533, lng: 75.8937 }
          },
          images: [{ url: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80', isPrimary: true }],
          features: ['4x4 Drivetrain', 'Touchscreen Infotainment', 'Apple CarPlay & Android Auto', 'Hill Hold Assist', 'Cruise Control'],
          pricing: { hourlyRate: 360, rate12Hour: 2400, rate24Hour: 4200, minRentalHours: 4, securityDeposit: 3000 },
          status: VEHICLE_STATUS.AVAILABLE,
          ratingAverage: 4.9,
          ratingCount: 19,
          isApproved: true
        },
        {
          vendorId: vendor._id,
          categoryId: catMap['Hatchbacks'] || catMap['hatchbacks'],
          brand: 'Maruti Suzuki',
          model: 'Swift ZXi Plus',
          registrationNumber: 'MP09SW3003',
          year: 2024,
          fuelType: 'petrol',
          fuelEconomy: 22.5,
          fuelEconomyUnit: 'km/l',
          transmission: 'manual',
          seatingCapacity: 5,
          engineCapacity: 1197,
          location: {
            city: 'Indore',
            state: 'Madhya Pradesh',
            address: 'Vijay Nagar Hub, AB Road',
            coordinates: { lat: 22.7533, lng: 75.8937 }
          },
          images: [{ url: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=800&q=80', isPrimary: true }],
          features: ['Keyless Entry', 'SmartPlay Touchscreen', 'Reverse Camera', 'Dual Airbags'],
          pricing: { hourlyRate: 150, rate12Hour: 1000, rate24Hour: 1750, minRentalHours: 2, securityDeposit: 2000 },
          status: VEHICLE_STATUS.AVAILABLE,
          ratingAverage: 4.7,
          ratingCount: 33,
          isApproved: true
        },
        {
          vendorId: vendor._id,
          categoryId: catMap['Sedans'] || catMap['sedans'],
          brand: 'Honda',
          model: 'City ZX e:HEV Hybrid',
          registrationNumber: 'MP09CT5555',
          year: 2024,
          fuelType: 'hybrid',
          fuelEconomy: 27.1,
          fuelEconomyUnit: 'km/l',
          transmission: 'automatic',
          seatingCapacity: 5,
          engineCapacity: 1498,
          location: {
            city: 'Indore',
            state: 'Madhya Pradesh',
            address: 'Palasia Square Hub',
            coordinates: { lat: 22.7244, lng: 75.8839 }
          },
          images: [{ url: 'https://images.unsplash.com/photo-1550355291-bbee04a92027?auto=format&fit=crop&w=800&q=80', isPrimary: true }],
          features: ['Honda Sensing ADAS', 'Electric Sunroof', '25+ km/l Mileage', 'LaneWatch Camera', 'Leather Upholstery'],
          pricing: { hourlyRate: 230, rate12Hour: 1550, rate24Hour: 2700, minRentalHours: 3, securityDeposit: 2500 },
          status: VEHICLE_STATUS.AVAILABLE,
          ratingAverage: 4.9,
          ratingCount: 16,
          isApproved: true
        },

        // --- BHOPAL FLEET ---
        {
          vendorId: vendor2._id,
          categoryId: catMap['SUVs'] || catMap['suvs'],
          brand: 'Hyundai',
          model: 'Creta SX (O) Turbo',
          registrationNumber: 'MP04CR7007',
          year: 2024,
          fuelType: 'petrol',
          fuelEconomy: 17.0,
          fuelEconomyUnit: 'km/l',
          transmission: 'automatic',
          seatingCapacity: 5,
          engineCapacity: 1497,
          location: {
            city: 'Bhopal',
            state: 'Madhya Pradesh',
            address: 'MP Nagar Zone 1 Hub',
            coordinates: { lat: 23.2324, lng: 77.4293 }
          },
          images: [{ url: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=800&q=80', isPrimary: true }],
          features: ['Panoramic Sunroof', 'Bose Premium Audio', 'Ventilated Seats', 'ADAS Level 2'],
          pricing: { hourlyRate: 320, rate12Hour: 2100, rate24Hour: 3600, minRentalHours: 3, securityDeposit: 3000 },
          status: VEHICLE_STATUS.AVAILABLE,
          ratingAverage: 4.8,
          ratingCount: 22,
          isApproved: true
        },
        {
          vendorId: vendor2._id,
          categoryId: catMap['Bikes'] || catMap['bikes'],
          brand: 'Yamaha',
          model: 'MT-15 V2',
          registrationNumber: 'MP04MT2002',
          year: 2023,
          fuelType: 'petrol',
          fuelEconomy: 48.0,
          fuelEconomyUnit: 'km/l',
          transmission: 'manual',
          seatingCapacity: 2,
          engineCapacity: 155,
          location: {
            city: 'Bhopal',
            state: 'Madhya Pradesh',
            address: 'Arera Colony Hub',
            coordinates: { lat: 23.2156, lng: 77.4332 }
          },
          images: [{ url: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=800&q=80', isPrimary: true }],
          features: ['Liquid Cooled VVA', 'Traction Control', 'Dual ABS', 'LED Projector Headlamp'],
          pricing: { hourlyRate: 85, rate12Hour: 550, rate24Hour: 900, minRentalHours: 2, securityDeposit: 1000 },
          status: VEHICLE_STATUS.AVAILABLE,
          ratingAverage: 4.7,
          ratingCount: 29,
          isApproved: true
        },
        {
          vendorId: vendor2._id,
          categoryId: catMap['Electric Scooters'] || catMap['electric-scooters'],
          brand: 'Ola',
          model: 'S1 Pro Gen 2',
          registrationNumber: 'MP04OL3003',
          year: 2024,
          fuelType: 'electric',
          fuelEconomy: 3.8,
          fuelEconomyUnit: 'km/kWh',
          transmission: 'automatic',
          seatingCapacity: 2,
          engineCapacity: 4,
          location: {
            city: 'Bhopal',
            state: 'Madhya Pradesh',
            address: 'MP Nagar Zone 1 Hub',
            coordinates: { lat: 23.2324, lng: 77.4293 }
          },
          images: [{ url: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80', isPrimary: true }],
          features: ['195 km Range', 'Hyper Mode', 'Cruise Control', 'Proximity Unlock'],
          pricing: { hourlyRate: 60, rate12Hour: 390, rate24Hour: 650, minRentalHours: 1, securityDeposit: 1000 },
          status: VEHICLE_STATUS.AVAILABLE,
          ratingAverage: 4.6,
          ratingCount: 31,
          isApproved: true
        },
        {
          vendorId: vendor2._id,
          categoryId: catMap['Scooters'] || catMap['scooters'],
          brand: 'TVS',
          model: 'Jupiter 125 SmartXonnect',
          registrationNumber: 'MP04JP5005',
          year: 2023,
          fuelType: 'petrol',
          fuelEconomy: 50.0,
          fuelEconomyUnit: 'km/l',
          transmission: 'automatic',
          seatingCapacity: 2,
          engineCapacity: 125,
          location: {
            city: 'Bhopal',
            state: 'Madhya Pradesh',
            address: 'Arera Colony Hub',
            coordinates: { lat: 23.2156, lng: 77.4332 }
          },
          images: [{ url: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=800&q=80', isPrimary: true }],
          features: ['Large 33L Boot Space', 'Front Fuel Fill', 'USB Fast Charger', 'Metal Body'],
          pricing: { hourlyRate: 50, rate12Hour: 320, rate24Hour: 540, minRentalHours: 1, securityDeposit: 800 },
          status: VEHICLE_STATUS.AVAILABLE,
          ratingAverage: 4.7,
          ratingCount: 18,
          isApproved: true
        },
        {
          vendorId: vendor2._id,
          categoryId: catMap['Hatchbacks'] || catMap['hatchbacks'],
          brand: 'Hyundai',
          model: 'i20 Sportz Dual Tone',
          registrationNumber: 'MP04HY6006',
          year: 2024,
          fuelType: 'petrol',
          fuelEconomy: 20.0,
          fuelEconomyUnit: 'km/l',
          transmission: 'manual',
          seatingCapacity: 5,
          engineCapacity: 1197,
          location: {
            city: 'Bhopal',
            state: 'Madhya Pradesh',
            address: 'MP Nagar Zone 1 Hub',
            coordinates: { lat: 23.2324, lng: 77.4293 }
          },
          images: [{ url: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=800&q=80', isPrimary: true }],
          features: ['Touchscreen Nav', 'Rear Camera', 'Cruise Control', 'Wireless Charger'],
          pricing: { hourlyRate: 155, rate12Hour: 1020, rate24Hour: 1800, minRentalHours: 2, securityDeposit: 2000 },
          status: VEHICLE_STATUS.AVAILABLE,
          ratingAverage: 4.8,
          ratingCount: 15,
          isApproved: true
        },
        {
          vendorId: vendor2._id,
          categoryId: catMap['Sedans'] || catMap['sedans'],
          brand: 'Hyundai',
          model: 'Verna SX Turbo',
          registrationNumber: 'MP04VR8008',
          year: 2024,
          fuelType: 'petrol',
          fuelEconomy: 18.6,
          fuelEconomyUnit: 'km/l',
          transmission: 'automatic',
          seatingCapacity: 5,
          engineCapacity: 1482,
          location: {
            city: 'Bhopal',
            state: 'Madhya Pradesh',
            address: 'MP Nagar Zone 1 Hub',
            coordinates: { lat: 23.2324, lng: 77.4293 }
          },
          images: [{ url: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80', isPrimary: true }],
          features: ['160 PS Turbo Power', 'Heated & Cooled Seats', 'Dual 10.25 screens', 'Switchable Controls'],
          pricing: { hourlyRate: 220, rate12Hour: 1450, rate24Hour: 2500, minRentalHours: 3, securityDeposit: 2500 },
          status: VEHICLE_STATUS.AVAILABLE,
          ratingAverage: 4.9,
          ratingCount: 20,
          isApproved: true
        },

        // --- GWALIOR FLEET ---
        {
          vendorId: vendor._id,
          categoryId: catMap['SUVs'] || catMap['suvs'],
          brand: 'Tata',
          model: 'Harrier Fearless Plus',
          registrationNumber: 'MP07HR9009',
          year: 2024,
          fuelType: 'diesel',
          fuelEconomy: 16.3,
          fuelEconomyUnit: 'km/l',
          transmission: 'automatic',
          seatingCapacity: 5,
          engineCapacity: 1956,
          location: {
            city: 'Gwalior',
            state: 'Madhya Pradesh',
            address: 'City Center Hub',
            coordinates: { lat: 26.2183, lng: 78.1828 }
          },
          images: [{ url: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=800&q=80', isPrimary: true }],
          features: ['JBL 10-Speaker Audio', 'Memory Driver Seat', 'Terrain Response Modes', 'Air Purifier'],
          pricing: { hourlyRate: 350, rate12Hour: 2300, rate24Hour: 4000, minRentalHours: 4, securityDeposit: 3000 },
          status: VEHICLE_STATUS.AVAILABLE,
          ratingAverage: 4.8,
          ratingCount: 14,
          isApproved: true
        },
        {
          vendorId: vendor._id,
          categoryId: catMap['Bikes'] || catMap['bikes'],
          brand: 'Royal Enfield',
          model: 'Classic 350 (Marsh Grey)',
          registrationNumber: 'MP07CL3500',
          year: 2023,
          fuelType: 'petrol',
          fuelEconomy: 41.5,
          fuelEconomyUnit: 'km/l',
          transmission: 'manual',
          seatingCapacity: 2,
          engineCapacity: 349,
          location: {
            city: 'Gwalior',
            state: 'Madhya Pradesh',
            address: 'City Center Hub',
            coordinates: { lat: 26.2183, lng: 78.1828 }
          },
          images: [{ url: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=800&q=80', isPrimary: true }],
          features: ['J-Series Smooth Engine', 'Tripper Navigation', 'Dual Disc ABS', 'Touring Seat'],
          pricing: { hourlyRate: 90, rate12Hour: 580, rate24Hour: 950, minRentalHours: 2, securityDeposit: 1000 },
          status: VEHICLE_STATUS.AVAILABLE,
          ratingAverage: 4.8,
          ratingCount: 27,
          isApproved: true
        },
        {
          vendorId: vendor._id,
          categoryId: catMap['Electric Scooters'] || catMap['electric-scooters'],
          brand: 'Ather',
          model: '450S',
          registrationNumber: 'MP07EV4500',
          year: 2024,
          fuelType: 'electric',
          fuelEconomy: 3.1,
          fuelEconomyUnit: 'km/kWh',
          transmission: 'automatic',
          seatingCapacity: 2,
          engineCapacity: 3,
          location: {
            city: 'Gwalior',
            state: 'Madhya Pradesh',
            address: 'Lashkar Hub',
            coordinates: { lat: 26.2045, lng: 78.1582 }
          },
          images: [{ url: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80', isPrimary: true }],
          features: ['DeepView Display', '115 km Real Range', 'Regenerative Braking', 'Park Assist'],
          pricing: { hourlyRate: 55, rate12Hour: 360, rate24Hour: 600, minRentalHours: 1, securityDeposit: 1000 },
          status: VEHICLE_STATUS.AVAILABLE,
          ratingAverage: 4.7,
          ratingCount: 16,
          isApproved: true
        },
        {
          vendorId: vendor._id,
          categoryId: catMap['Scooters'] || catMap['scooters'],
          brand: 'Honda',
          model: 'Dio 125 Smart',
          registrationNumber: 'MP07DI1250',
          year: 2024,
          fuelType: 'petrol',
          fuelEconomy: 48.0,
          fuelEconomyUnit: 'km/l',
          transmission: 'automatic',
          seatingCapacity: 2,
          engineCapacity: 125,
          location: {
            city: 'Gwalior',
            state: 'Madhya Pradesh',
            address: 'City Center Hub',
            coordinates: { lat: 26.2183, lng: 78.1828 }
          },
          images: [{ url: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=800&q=80', isPrimary: true }],
          features: ['Sporty Exhaust Sound', 'Wave Disc Brakes', 'Fully Digital Cluster', 'Smart Key'],
          pricing: { hourlyRate: 50, rate12Hour: 320, rate24Hour: 530, minRentalHours: 1, securityDeposit: 800 },
          status: VEHICLE_STATUS.AVAILABLE,
          ratingAverage: 4.6,
          ratingCount: 12,
          isApproved: true
        },
        {
          vendorId: vendor._id,
          categoryId: catMap['Hatchbacks'] || catMap['hatchbacks'],
          brand: 'Tata',
          model: 'Altroz i-Turbo',
          registrationNumber: 'MP07AL2024',
          year: 2024,
          fuelType: 'petrol',
          fuelEconomy: 18.5,
          fuelEconomyUnit: 'km/l',
          transmission: 'manual',
          seatingCapacity: 5,
          engineCapacity: 1199,
          location: {
            city: 'Gwalior',
            state: 'Madhya Pradesh',
            address: 'City Center Hub',
            coordinates: { lat: 26.2183, lng: 78.1828 }
          },
          images: [{ url: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=800&q=80', isPrimary: true }],
          features: ['5-Star Global NCAP Safety', 'Harman Audio', '90-degree Doors', 'Cruise Control'],
          pricing: { hourlyRate: 145, rate12Hour: 950, rate24Hour: 1650, minRentalHours: 2, securityDeposit: 2000 },
          status: VEHICLE_STATUS.AVAILABLE,
          ratingAverage: 4.8,
          ratingCount: 19,
          isApproved: true
        },
        {
          vendorId: vendor._id,
          categoryId: catMap['Sedans'] || catMap['sedans'],
          brand: 'Skoda',
          model: 'Slavia 1.5 TSI Style',
          registrationNumber: 'MP07SL1500',
          year: 2024,
          fuelType: 'petrol',
          fuelEconomy: 18.7,
          fuelEconomyUnit: 'km/l',
          transmission: 'automatic',
          seatingCapacity: 5,
          engineCapacity: 1498,
          location: {
            city: 'Gwalior',
            state: 'Madhya Pradesh',
            address: 'City Center Hub',
            coordinates: { lat: 26.2183, lng: 78.1828 }
          },
          images: [{ url: 'https://images.unsplash.com/photo-1550355291-bbee04a92027?auto=format&fit=crop&w=800&q=80', isPrimary: true }],
          features: ['150 PS Active Cylinder Tech', '521L Massive Boot', 'Ventilated Front Seats', 'Sunroof'],
          pricing: { hourlyRate: 240, rate12Hour: 1600, rate24Hour: 2800, minRentalHours: 3, securityDeposit: 2500 },
          status: VEHICLE_STATUS.AVAILABLE,
          ratingAverage: 4.9,
          ratingCount: 11,
          isApproved: true
        }
      ];

      let seededCount = 0;
      for (const vData of sampleVehicles) {
        const existing = await Vehicle.findOne({
          $or: [
            { registrationNumber: vData.registrationNumber },
            { brand: vData.brand, model: vData.model, 'location.city': vData.location.city }
          ]
        });
        if (!existing) {
          await Vehicle.create(vData);
          seededCount++;
        }
      }
      if (seededCount > 0) {
        logger.info(`Successfully seeded ${seededCount} vehicles across Indore, Bhopal, and Gwalior hubs.`);
      }
    }

    // 4. Auto-migration: Ensure all vehicles in database have realistic fuelEconomy and fuelEconomyUnit
    const vehiclesMissingEconomy = await Vehicle.find({
      $or: [{ fuelEconomy: null }, { fuelEconomy: { $exists: false } }]
    });
    if (vehiclesMissingEconomy.length > 0) {
      logger.info(`Backfilling certified fuel economy for ${vehiclesMissingEconomy.length} existing vehicles...`);
      for (const v of vehiclesMissingEconomy) {
        let economy = 18.0;
        let unit = 'km/l';
        const brand = (v.brand || '').toLowerCase();
        const model = (v.model || '').toLowerCase();

        if (v.fuelType === 'electric') {
          economy = v.seatingCapacity > 2 ? 6.0 : (brand.includes('ola') ? 3.8 : 3.2);
          unit = 'km/kWh';
        } else if (v.fuelType === 'hybrid') {
          economy = 27.1;
          unit = 'km/l';
        } else if (v.seatingCapacity === 2) {
          if (brand.includes('royal enfield')) economy = model.includes('hunter') ? 36.2 : 41.5;
          else if (brand.includes('honda')) economy = model.includes('activa') ? 47.0 : 48.0;
          else if (brand.includes('yamaha')) economy = 48.0;
          else if (brand.includes('tvs')) economy = 50.0;
          else economy = 42.0;
          unit = 'km/l';
        } else if (v.fuelType === 'diesel') {
          economy = (v.engineCapacity && v.engineCapacity > 2000) ? 15.2 : 16.3;
          unit = 'km/l';
        } else {
          if (brand.includes('maruti')) economy = 22.5;
          else if (brand.includes('hyundai')) economy = model.includes('creta') ? 17.0 : (model.includes('i20') ? 20.0 : 18.6);
          else if (brand.includes('skoda') || brand.includes('tata')) economy = 18.5;
          else economy = 18.0;
          unit = 'km/l';
        }
        v.fuelEconomy = economy;
        v.fuelEconomyUnit = unit;
        await v.save();
      }
      logger.info('Vehicle fuel economy backfill completed successfully.');
    }
  } catch (err) {
    logger.warn(`Database auto-seed check skipped: ${err.message}`);
  }
};

export const autoSeedCategoriesIfEmpty = autoSeedIfEmpty;

const attachListeners = () => {
  mongoose.connection.on('error', (err) => {
    logger.error('MongoDB runtime connection error:', err.message || err);
  });

  mongoose.connection.on('disconnected', () => {
    logger.warn('MongoDB connection lost. Reconnecting...');
  });

  mongoose.connection.on('reconnected', () => {
    logger.info('MongoDB connection re-established.');
  });
};

/**
 * Connect to MongoDB database with event listeners and sanitized logging
 */
export const connectDB = async () => {
  if (!ENV.MONGODB_URI) {
    const errorMsg = 'MongoDB connection URI is not configured in environment variables (MONGODB_URI or MONGO_URI).';
    logger.error(errorMsg);
    throw new Error(errorMsg);
  }

  // 1. Try Primary MongoDB Connection (Atlas / Configured URI)
  try {
    const conn = await mongoose.connect(ENV.MONGODB_URI, {
      autoIndex: true,
      serverSelectionTimeoutMS: 4000,
    });

    const host = conn.connection.host || 'remote-cluster';
    const dbName = conn.connection.name || 'default';
    logger.info(`MongoDB Connected successfully [Host: ${host} | Database: ${dbName}]`);
    await autoSeedIfEmpty();
    attachListeners();
    return conn;
  } catch (error) {
    logger.warn(`Primary MongoDB connection failed (${error.message}).`);

    // 2. In Development Mode, fall back to resilient local MongoMemoryServer with persistent disk storage
    if (ENV.NODE_ENV === 'development') {
      try {
        const fs = await import('fs');
        const activeUriFile = path.join(storageDir, 'active_uri.txt');

        if (fs.existsSync(activeUriFile)) {
          const activeUri = fs.readFileSync(activeUriFile, 'utf8').trim();
          if (activeUri) {
            try {
              const conn = await mongoose.connect(activeUri, {
                autoIndex: true,
                serverSelectionTimeoutMS: 2000,
              });
              logger.info(`MongoDB Connected successfully to existing local persistent instance [URI: ${activeUri}]`);
              attachListeners();
              return conn;
            } catch (activeErr) {
              try { fs.unlinkSync(activeUriFile); } catch (e) {}
            }
          }
        }

        logger.info('Starting local development persistent MongoDB instance as fallback...');
        const { MongoMemoryServer } = await import('mongodb-memory-server');
        if (!fs.existsSync(storageDir)) {
          fs.mkdirSync(storageDir, { recursive: true });
        }

        memoryServerInstance = await MongoMemoryServer.create({
          instance: {
            dbPath: storageDir,
            storageEngine: 'wiredTiger',
            dbName: 'rentride'
          }
        });
        const fallbackUri = memoryServerInstance.getUri();
        try {
          fs.writeFileSync(activeUriFile, fallbackUri, 'utf8');
        } catch (e) {}

        const conn = await mongoose.connect(fallbackUri, {
          autoIndex: true,
          serverSelectionTimeoutMS: 5000,
        });

        logger.info(`MongoDB Connected successfully to local persistent storage instance [Path: ${storageDir} | URI: ${fallbackUri}]`);
        await autoSeedIfEmpty();
        attachListeners();
        return conn;
      } catch (fallbackError) {
        logger.error(`Fallback persistent MongoDB failed: ${fallbackError.message}`);
        throw error;
      }
    } else {
      throw error;
    }
  }
};

export const disconnectDB = async () => {
  await mongoose.disconnect();
  if (memoryServerInstance) {
    await memoryServerInstance.stop();
  }
};
