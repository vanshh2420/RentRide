import mongoose from 'mongoose';
import { connectDB } from '../config/db.js';
import { 
  User, 
  Category, 
  Vehicle, 
  Coupon, 
  Notification,
  Booking,
  Payment,
  Review,
  Maintenance 
} from '../models/index.js';
import { ROLES } from '../constants/roles.js';
import { VEHICLE_STATUS } from '../constants/status.js';
import { logger } from '../utils/logger.js';

const seedDatabase = async () => {
  try {
    logger.info('Connecting to database for seeding...');
    await connectDB();

    logger.info('Clearing existing data...');
    await Promise.all([
      User.deleteMany({}),
      Category.deleteMany({}),
      Vehicle.deleteMany({}),
      Coupon.deleteMany({}),
      Notification.deleteMany({}),
      Booking.deleteMany({}),
      Payment.deleteMany({}),
      Review.deleteMany({}),
      Maintenance.deleteMany({})
    ]);

    logger.info('Creating Users (Admin, Vendors, Customers)...');
    
    // 1. Admin
    const admin = await User.create({
      name: 'RentRide Admin',
      email: 'admin@rentride.in',
      password: 'Admin@123',
      phone: '+919900000001',
      role: ROLES.ADMIN,
      isActive: true
    });

    // 2. Vendors
    const vendor1 = await User.create({
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
    });

    const vendor2 = await User.create({
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
    });

    // 3. Customers
    const customer1 = await User.create({
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
    });

    const customer2 = await User.create({
      name: 'Priya Patel',
      email: 'customer2@rentride.in',
      password: 'Customer@123',
      phone: '+919500000005',
      role: ROLES.CUSTOMER,
      isActive: true,
      customerProfile: {
        drivingLicenseNumber: 'MP0420220054321',
        kycStatus: 'VERIFIED'
      }
    });

    logger.info('Creating Vehicle Categories...');
    const categories = await Category.create([
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
    ]);

    const catMap = {};
    categories.forEach((cat) => {
      catMap[cat.name] = cat._id;
      catMap[cat.slug] = cat._id;
    });

    logger.info('Creating Vehicles fleet...');
    await Vehicle.create([
      // INDORE
      {
        vendorId: vendor1._id,
        categoryId: catMap['Bikes'],
        brand: 'Royal Enfield',
        model: 'Hunter 350 (Dapper Ash)',
        registrationNumber: 'MP09HR1001',
        year: 2024,
        fuelType: 'petrol',
        transmission: 'manual',
        seatingCapacity: 2,
        engineCapacity: 349,
        location: {
          city: 'Indore',
          state: 'Madhya Pradesh',
          address: 'Vijay Nagar Hub, AB Road',
          coordinates: { lat: 22.7533, lng: 75.8937 }
        },
        images: [
          {
            url: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=800&q=80',
            isPrimary: true
          }
        ],
        features: ['Dual-channel ABS', 'USB Charger', 'Tubeless Tyres', 'Helmet Included'],
        pricing: {
          hourlyRate: 90,
          rate12Hour: 600,
          rate24Hour: 999,
          minRentalHours: 2,
          securityDeposit: 1000
        },
        status: VEHICLE_STATUS.AVAILABLE,
        ratingAverage: 4.8,
        ratingCount: 24,
        isApproved: true
      },
      {
        vendorId: vendor1._id,
        categoryId: catMap['Electric Scooters'],
        brand: 'Ather',
        model: '450X Gen 3',
        registrationNumber: 'MP09EV2022',
        year: 2024,
        fuelType: 'electric',
        transmission: 'automatic',
        seatingCapacity: 2,
        engineCapacity: 4,
        location: {
          city: 'Indore',
          state: 'Madhya Pradesh',
          address: 'Palasia Square Hub',
          coordinates: { lat: 22.7244, lng: 75.8839 }
        },
        images: [
          {
            url: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80',
            isPrimary: true
          }
        ],
        features: ['Google Maps Navigation', 'Fast Charging (Warp Mode)', 'Underseat Helmet Storage', 'Bluetooth Audio'],
        pricing: {
          hourlyRate: 65,
          rate12Hour: 420,
          rate24Hour: 700,
          minRentalHours: 1,
          securityDeposit: 1000
        },
        status: VEHICLE_STATUS.AVAILABLE,
        ratingAverage: 4.9,
        ratingCount: 38,
        isApproved: true
      },
      {
        vendorId: vendor1._id,
        categoryId: catMap['Scooters'],
        brand: 'Honda',
        model: 'Activa 6G Smart',
        registrationNumber: 'MP09AC6006',
        year: 2023,
        fuelType: 'petrol',
        transmission: 'automatic',
        seatingCapacity: 2,
        engineCapacity: 110,
        location: {
          city: 'Indore',
          state: 'Madhya Pradesh',
          address: 'Bhawarkua Hub',
          coordinates: { lat: 22.6926, lng: 75.8676 }
        },
        images: [
          {
            url: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=800&q=80',
            isPrimary: true
          }
        ],
        features: ['Keyless Start', 'External Fuel Lid', 'Helmet Included', 'Combi Brake System'],
        pricing: {
          hourlyRate: 50,
          rate12Hour: 320,
          rate24Hour: 550,
          minRentalHours: 1,
          securityDeposit: 800
        },
        status: VEHICLE_STATUS.AVAILABLE,
        ratingAverage: 4.6,
        ratingCount: 52,
        isApproved: true
      },
      {
        vendorId: vendor1._id,
        categoryId: catMap['SUVs'],
        brand: 'Mahindra',
        model: 'Thar 4x4 Hard Top',
        registrationNumber: 'MP09TH4004',
        year: 2024,
        fuelType: 'diesel',
        transmission: 'automatic',
        seatingCapacity: 4,
        engineCapacity: 2184,
        location: {
          city: 'Indore',
          state: 'Madhya Pradesh',
          address: 'Vijay Nagar Hub, AB Road',
          coordinates: { lat: 22.7533, lng: 75.8937 }
        },
        images: [
          {
            url: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80',
            isPrimary: true
          }
        ],
        features: ['4x4 Drivetrain', 'Touchscreen Infotainment', 'Apple CarPlay & Android Auto', 'Hill Hold Assist', 'Cruise Control'],
        pricing: {
          hourlyRate: 360,
          rate12Hour: 2400,
          rate24Hour: 4200,
          minRentalHours: 4,
          securityDeposit: 3000
        },
        status: VEHICLE_STATUS.AVAILABLE,
        ratingAverage: 4.9,
        ratingCount: 19,
        isApproved: true
      },
      {
        vendorId: vendor1._id,
        categoryId: catMap['Hatchbacks'],
        brand: 'Maruti Suzuki',
        model: 'Swift ZXi Plus',
        registrationNumber: 'MP09SW3003',
        year: 2024,
        fuelType: 'petrol',
        transmission: 'manual',
        seatingCapacity: 5,
        engineCapacity: 1197,
        location: {
          city: 'Indore',
          state: 'Madhya Pradesh',
          address: 'Vijay Nagar Hub, AB Road',
          coordinates: { lat: 22.7533, lng: 75.8937 }
        },
        images: [
          {
            url: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=800&q=80',
            isPrimary: true
          }
        ],
        features: ['Keyless Entry', 'SmartPlay Touchscreen', 'Reverse Camera', 'Dual Airbags'],
        pricing: {
          hourlyRate: 150,
          rate12Hour: 1000,
          rate24Hour: 1750,
          minRentalHours: 2,
          securityDeposit: 2000
        },
        status: VEHICLE_STATUS.AVAILABLE,
        ratingAverage: 4.7,
        ratingCount: 33,
        isApproved: true
      },
      {
        vendorId: vendor1._id,
        categoryId: catMap['Sedans'],
        brand: 'Honda',
        model: 'City ZX e:HEV Hybrid',
        registrationNumber: 'MP09CT5555',
        year: 2024,
        fuelType: 'hybrid',
        transmission: 'automatic',
        seatingCapacity: 5,
        engineCapacity: 1498,
        location: {
          city: 'Indore',
          state: 'Madhya Pradesh',
          address: 'Palasia Square Hub',
          coordinates: { lat: 22.7244, lng: 75.8839 }
        },
        images: [
          {
            url: 'https://images.unsplash.com/photo-1550355291-bbee04a92027?auto=format&fit=crop&w=800&q=80',
            isPrimary: true
          }
        ],
        features: ['Honda Sensing ADAS', 'Electric Sunroof', '25+ km/l Mileage', 'LaneWatch Camera', 'Leather Upholstery'],
        pricing: {
          hourlyRate: 230,
          rate12Hour: 1550,
          rate24Hour: 2700,
          minRentalHours: 3,
          securityDeposit: 2500
        },
        status: VEHICLE_STATUS.AVAILABLE,
        ratingAverage: 4.9,
        ratingCount: 16,
        isApproved: true
      },

      // BHOPAL
      {
        vendorId: vendor2._id,
        categoryId: catMap['SUVs'],
        brand: 'Hyundai',
        model: 'Creta SX (O) Turbo',
        registrationNumber: 'MP04CR7007',
        year: 2024,
        fuelType: 'petrol',
        transmission: 'automatic',
        seatingCapacity: 5,
        engineCapacity: 1497,
        location: {
          city: 'Bhopal',
          state: 'Madhya Pradesh',
          address: 'MP Nagar Zone 1 Hub',
          coordinates: { lat: 23.2324, lng: 77.4293 }
        },
        images: [
          {
            url: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=800&q=80',
            isPrimary: true
          }
        ],
        features: ['Panoramic Sunroof', 'Bose Premium Audio', 'Ventilated Seats', 'ADAS Level 2'],
        pricing: {
          hourlyRate: 320,
          rate12Hour: 2100,
          rate24Hour: 3600,
          minRentalHours: 3,
          securityDeposit: 3000
        },
        status: VEHICLE_STATUS.AVAILABLE,
        ratingAverage: 4.8,
        ratingCount: 22,
        isApproved: true
      },
      {
        vendorId: vendor2._id,
        categoryId: catMap['Bikes'],
        brand: 'Yamaha',
        model: 'MT-15 V2',
        registrationNumber: 'MP04MT2002',
        year: 2023,
        fuelType: 'petrol',
        transmission: 'manual',
        seatingCapacity: 2,
        engineCapacity: 155,
        location: {
          city: 'Bhopal',
          state: 'Madhya Pradesh',
          address: 'Arera Colony Hub',
          coordinates: { lat: 23.2156, lng: 77.4332 }
        },
        images: [
          {
            url: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=800&q=80',
            isPrimary: true
          }
        ],
        features: ['Liquid Cooled VVA', 'Traction Control', 'Dual ABS', 'LED Projector Headlamp'],
        pricing: {
          hourlyRate: 85,
          rate12Hour: 550,
          rate24Hour: 900,
          minRentalHours: 2,
          securityDeposit: 1000
        },
        status: VEHICLE_STATUS.AVAILABLE,
        ratingAverage: 4.7,
        ratingCount: 29,
        isApproved: true
      },
      {
        vendorId: vendor2._id,
        categoryId: catMap['Electric Scooters'],
        brand: 'Ola',
        model: 'S1 Pro Gen 2',
        registrationNumber: 'MP04OL3003',
        year: 2024,
        fuelType: 'electric',
        transmission: 'automatic',
        seatingCapacity: 2,
        engineCapacity: 4,
        location: {
          city: 'Bhopal',
          state: 'Madhya Pradesh',
          address: 'MP Nagar Zone 1 Hub',
          coordinates: { lat: 23.2324, lng: 77.4293 }
        },
        images: [
          {
            url: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80',
            isPrimary: true
          }
        ],
        features: ['195 km Range', 'Hyper Mode', 'Cruise Control', 'Proximity Unlock'],
        pricing: {
          hourlyRate: 60,
          rate12Hour: 390,
          rate24Hour: 650,
          minRentalHours: 1,
          securityDeposit: 1000
        },
        status: VEHICLE_STATUS.AVAILABLE,
        ratingAverage: 4.6,
        ratingCount: 31,
        isApproved: true
      },
      {
        vendorId: vendor2._id,
        categoryId: catMap['Scooters'],
        brand: 'TVS',
        model: 'Jupiter 125 SmartXonnect',
        registrationNumber: 'MP04JP5005',
        year: 2023,
        fuelType: 'petrol',
        transmission: 'automatic',
        seatingCapacity: 2,
        engineCapacity: 125,
        location: {
          city: 'Bhopal',
          state: 'Madhya Pradesh',
          address: 'Arera Colony Hub',
          coordinates: { lat: 23.2156, lng: 77.4332 }
        },
        images: [
          {
            url: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=800&q=80',
            isPrimary: true
          }
        ],
        features: ['Large 33L Boot Space', 'Front Fuel Fill', 'USB Fast Charger', 'Metal Body'],
        pricing: {
          hourlyRate: 50,
          rate12Hour: 320,
          rate24Hour: 540,
          minRentalHours: 1,
          securityDeposit: 800
        },
        status: VEHICLE_STATUS.AVAILABLE,
        ratingAverage: 4.7,
        ratingCount: 18,
        isApproved: true
      },
      {
        vendorId: vendor2._id,
        categoryId: catMap['Hatchbacks'],
        brand: 'Hyundai',
        model: 'i20 Sportz Dual Tone',
        registrationNumber: 'MP04HY6006',
        year: 2024,
        fuelType: 'petrol',
        transmission: 'manual',
        seatingCapacity: 5,
        engineCapacity: 1197,
        location: {
          city: 'Bhopal',
          state: 'Madhya Pradesh',
          address: 'MP Nagar Zone 1 Hub',
          coordinates: { lat: 23.2324, lng: 77.4293 }
        },
        images: [
          {
            url: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=800&q=80',
            isPrimary: true
          }
        ],
        features: ['Touchscreen Nav', 'Rear Camera', 'Cruise Control', 'Wireless Charger'],
        pricing: {
          hourlyRate: 155,
          rate12Hour: 1020,
          rate24Hour: 1800,
          minRentalHours: 2,
          securityDeposit: 2000
        },
        status: VEHICLE_STATUS.AVAILABLE,
        ratingAverage: 4.8,
        ratingCount: 15,
        isApproved: true
      },
      {
        vendorId: vendor2._id,
        categoryId: catMap['Sedans'],
        brand: 'Hyundai',
        model: 'Verna SX Turbo',
        registrationNumber: 'MP04VR8008',
        year: 2024,
        fuelType: 'petrol',
        transmission: 'automatic',
        seatingCapacity: 5,
        engineCapacity: 1482,
        location: {
          city: 'Bhopal',
          state: 'Madhya Pradesh',
          address: 'MP Nagar Zone 1 Hub',
          coordinates: { lat: 23.2324, lng: 77.4293 }
        },
        images: [
          {
            url: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80',
            isPrimary: true
          }
        ],
        features: ['160 PS Turbo Power', 'Heated & Cooled Seats', 'Dual 10.25 screens', 'Switchable Controls'],
        pricing: {
          hourlyRate: 220,
          rate12Hour: 1450,
          rate24Hour: 2500,
          minRentalHours: 3,
          securityDeposit: 2500
        },
        status: VEHICLE_STATUS.AVAILABLE,
        ratingAverage: 4.9,
        ratingCount: 20,
        isApproved: true
      },

      // GWALIOR
      {
        vendorId: vendor1._id,
        categoryId: catMap['SUVs'],
        brand: 'Tata',
        model: 'Harrier Fearless Plus',
        registrationNumber: 'MP07HR9009',
        year: 2024,
        fuelType: 'diesel',
        transmission: 'automatic',
        seatingCapacity: 5,
        engineCapacity: 1956,
        location: {
          city: 'Gwalior',
          state: 'Madhya Pradesh',
          address: 'City Center Hub',
          coordinates: { lat: 26.2183, lng: 78.1828 }
        },
        images: [
          {
            url: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=800&q=80',
            isPrimary: true
          }
        ],
        features: ['JBL 10-Speaker Audio', 'Memory Driver Seat', 'Terrain Response Modes', 'Air Purifier'],
        pricing: {
          hourlyRate: 350,
          rate12Hour: 2300,
          rate24Hour: 4000,
          minRentalHours: 4,
          securityDeposit: 3000
        },
        status: VEHICLE_STATUS.AVAILABLE,
        ratingAverage: 4.8,
        ratingCount: 14,
        isApproved: true
      },
      {
        vendorId: vendor1._id,
        categoryId: catMap['Bikes'],
        brand: 'Royal Enfield',
        model: 'Classic 350 (Marsh Grey)',
        registrationNumber: 'MP07CL3500',
        year: 2023,
        fuelType: 'petrol',
        transmission: 'manual',
        seatingCapacity: 2,
        engineCapacity: 349,
        location: {
          city: 'Gwalior',
          state: 'Madhya Pradesh',
          address: 'City Center Hub',
          coordinates: { lat: 26.2183, lng: 78.1828 }
        },
        images: [
          {
            url: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=800&q=80',
            isPrimary: true
          }
        ],
        features: ['J-Series Smooth Engine', 'Tripper Navigation', 'Dual Disc ABS', 'Touring Seat'],
        pricing: {
          hourlyRate: 90,
          rate12Hour: 580,
          rate24Hour: 950,
          minRentalHours: 2,
          securityDeposit: 1000
        },
        status: VEHICLE_STATUS.AVAILABLE,
        ratingAverage: 4.8,
        ratingCount: 27,
        isApproved: true
      },
      {
        vendorId: vendor1._id,
        categoryId: catMap['Electric Scooters'],
        brand: 'Ather',
        model: '450S',
        registrationNumber: 'MP07EV4500',
        year: 2024,
        fuelType: 'electric',
        transmission: 'automatic',
        seatingCapacity: 2,
        engineCapacity: 3,
        location: {
          city: 'Gwalior',
          state: 'Madhya Pradesh',
          address: 'Lashkar Hub',
          coordinates: { lat: 26.2045, lng: 78.1582 }
        },
        images: [
          {
            url: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80',
            isPrimary: true
          }
        ],
        features: ['DeepView Display', '115 km Real Range', 'Regenerative Braking', 'Park Assist'],
        pricing: {
          hourlyRate: 55,
          rate12Hour: 360,
          rate24Hour: 600,
          minRentalHours: 1,
          securityDeposit: 1000
        },
        status: VEHICLE_STATUS.AVAILABLE,
        ratingAverage: 4.7,
        ratingCount: 16,
        isApproved: true
      },
      {
        vendorId: vendor1._id,
        categoryId: catMap['Scooters'],
        brand: 'Honda',
        model: 'Dio 125 Smart',
        registrationNumber: 'MP07DI1250',
        year: 2024,
        fuelType: 'petrol',
        transmission: 'automatic',
        seatingCapacity: 2,
        engineCapacity: 125,
        location: {
          city: 'Gwalior',
          state: 'Madhya Pradesh',
          address: 'City Center Hub',
          coordinates: { lat: 26.2183, lng: 78.1828 }
        },
        images: [
          {
            url: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=800&q=80',
            isPrimary: true
          }
        ],
        features: ['Sporty Exhaust Sound', 'Wave Disc Brakes', 'Fully Digital Cluster', 'Smart Key'],
        pricing: {
          hourlyRate: 50,
          rate12Hour: 320,
          rate24Hour: 530,
          minRentalHours: 1,
          securityDeposit: 800
        },
        status: VEHICLE_STATUS.AVAILABLE,
        ratingAverage: 4.6,
        ratingCount: 12,
        isApproved: true
      },
      {
        vendorId: vendor1._id,
        categoryId: catMap['Hatchbacks'],
        brand: 'Tata',
        model: 'Altroz i-Turbo',
        registrationNumber: 'MP07AL2024',
        year: 2024,
        fuelType: 'petrol',
        transmission: 'manual',
        seatingCapacity: 5,
        engineCapacity: 1199,
        location: {
          city: 'Gwalior',
          state: 'Madhya Pradesh',
          address: 'City Center Hub',
          coordinates: { lat: 26.2183, lng: 78.1828 }
        },
        images: [
          {
            url: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=800&q=80',
            isPrimary: true
          }
        ],
        features: ['5-Star Global NCAP Safety', 'Harman Audio', '90-degree Doors', 'Cruise Control'],
        pricing: {
          hourlyRate: 145,
          rate12Hour: 950,
          rate24Hour: 1650,
          minRentalHours: 2,
          securityDeposit: 2000
        },
        status: VEHICLE_STATUS.AVAILABLE,
        ratingAverage: 4.8,
        ratingCount: 19,
        isApproved: true
      },
      {
        vendorId: vendor1._id,
        categoryId: catMap['Sedans'],
        brand: 'Skoda',
        model: 'Slavia 1.5 TSI Style',
        registrationNumber: 'MP07SL1500',
        year: 2024,
        fuelType: 'petrol',
        transmission: 'automatic',
        seatingCapacity: 5,
        engineCapacity: 1498,
        location: {
          city: 'Gwalior',
          state: 'Madhya Pradesh',
          address: 'City Center Hub',
          coordinates: { lat: 26.2183, lng: 78.1828 }
        },
        images: [
          {
            url: 'https://images.unsplash.com/photo-1550355291-bbee04a92027?auto=format&fit=crop&w=800&q=80',
            isPrimary: true
          }
        ],
        features: ['150 PS Active Cylinder Tech', '521L Massive Boot', 'Ventilated Front Seats', 'Sunroof'],
        pricing: {
          hourlyRate: 240,
          rate12Hour: 1600,
          rate24Hour: 2800,
          minRentalHours: 3,
          securityDeposit: 2500
        },
        status: VEHICLE_STATUS.AVAILABLE,
        ratingAverage: 4.9,
        ratingCount: 11,
        isApproved: true
      }
    ]);

    logger.info('Creating Promotional Coupons...');
    await Coupon.create([
      {
        code: 'WELCOME100',
        discountType: 'FIXED',
        discountValue: 100,
        minBookingAmount: 400,
        validUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
        totalUsageLimit: 1000,
        perUserLimit: 1,
        isActive: true
      },
      {
        code: 'RENTRIDE20',
        discountType: 'PERCENTAGE',
        discountValue: 20,
        minBookingAmount: 700,
        maxDiscountAmount: 400,
        validUntil: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000), // 6 months
        totalUsageLimit: 500,
        perUserLimit: 2,
        isActive: true
      }
    ]);

    logger.info('Creating Sample Welcome Notifications...');
    await Notification.create([
      {
        recipientId: customer1._id,
        recipientRole: ROLES.CUSTOMER,
        type: 'SYSTEM_ANNOUNCEMENT',
        title: 'Welcome to RentRide!',
        message: 'Use coupon WELCOME100 for ₹100 off on your first ride booking.'
      },
      {
        recipientId: vendor1._id,
        recipientRole: ROLES.VENDOR,
        type: 'VENDOR_APPROVAL',
        title: 'Vendor Account Verified',
        message: 'Your fleet listings are now live and visible to thousands of customers across Indore, Bhopal, and Gwalior.'
      }
    ]);

    logger.info('=============================================');
    logger.info(' DATABASE SEEDING COMPLETED SUCCESSFULLY! ');
    logger.info(' Admin Login: admin@rentride.in / Admin@123');
    logger.info(' Vendor Login: vendor1@rentride.in / Vendor@123');
    logger.info(' Customer Login: customer1@rentride.in / Customer@123');
    logger.info('=============================================');

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    logger.error('Database seeding failed:', error);
    process.exit(1);
  }
};

seedDatabase();
