import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import { connectDB } from '../config/db.js';
import { 
  User, 
  Category, 
  Vehicle, 
  Booking, 
  Payment, 
  Maintenance, 
  Review, 
  VehicleCatalog 
} from '../models/index.js';
import { ROLES } from '../constants/roles.js';
import { VEHICLE_STATUS, BOOKING_STATUS, BOOKING_TYPES, RENTAL_PLANS, PAYMENT_STATUS, MAINTENANCE_STATUS } from '../constants/status.js';
import { logger } from '../utils/logger.js';

/**
 * Idempotent Demo Marketplace Seeder with Realistic Indian Data
 * Usage: npm run seed:demo
 */
const seedDemoData = async () => {
  try {
    logger.info('Connecting to database for demo dataset seeding...');
    await connectDB();

    // -------------------------------------------------------------
    // 1. Ensure Categories
    // -------------------------------------------------------------
    const categoriesData = [
      { name: 'SUV', slug: 'suv', type: 'four_wheeler', description: 'Rugged and spacious SUVs' },
      { name: 'Sedan', slug: 'sedan', type: 'four_wheeler', description: 'Comfortable executive sedans' },
      { name: 'Hatchback', slug: 'hatchback', type: 'four_wheeler', description: 'Agile and fuel-efficient city hatchbacks' },
      { name: 'Cruiser Bike', slug: 'cruiser-bike', type: 'two_wheeler', description: 'Classic highway cruisers' },
      { name: 'Sports Bike', slug: 'sports-bike', type: 'two_wheeler', description: 'High-performance street motorcycles' },
      { name: 'Scooter', slug: 'scooter', type: 'two_wheeler', description: 'Convenient gearless urban scooters' },
      { name: 'Electric Vehicle', slug: 'electric-vehicle', type: 'four_wheeler', description: 'Zero-emission modern EVs' }
    ];

    const categoryMap = {};
    for (const cat of categoriesData) {
      const doc = await Category.findOneAndUpdate(
        { slug: cat.slug },
        { $setOnInsert: cat },
        { upsert: true, new: true }
      );
      categoryMap[cat.slug] = doc;
    }
    logger.info(`Categories ensured: ${Object.keys(categoryMap).length}`);

    // -------------------------------------------------------------
    // 2. Ensure Admin User
    // -------------------------------------------------------------
    let admin = await User.findOne({ email: 'admin@rentride.in' });
    if (!admin) {
      admin = await User.create({
        name: 'RentRide Super Admin',
        email: 'admin@rentride.in',
        password: 'Admin@123',
        phone: '+919900000001',
        role: ROLES.ADMIN,
        isActive: true
      });
      logger.info('Created Admin user: admin@rentride.in');
    }

    // -------------------------------------------------------------
    // 3. Ensure 6 Realistic Indian Fleet Vendors
    // -------------------------------------------------------------
    const vendorsData = [
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
          address: { street: 'AB Road, Vijay Nagar', city: 'Indore', state: 'Madhya Pradesh', pincode: '452010' },
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
          address: { street: 'MP Nagar Zone 1', city: 'Bhopal', state: 'Madhya Pradesh', pincode: '462011' },
          isApproved: true
        }
      },
      {
        name: 'Gwalior Fort Rentals',
        email: 'vendor3@rentride.in',
        password: 'Vendor@123',
        phone: '+919600000004',
        role: ROLES.VENDOR,
        isActive: true,
        vendorProfile: {
          businessName: 'Gwalior Fort Rentals & Travels',
          gstNumber: '23ABCDE9012F3Z8',
          address: { street: 'Lashkar Road', city: 'Gwalior', state: 'Madhya Pradesh', pincode: '474001' },
          isApproved: true
        }
      },
      {
        name: 'Malwa Heritage Fleets',
        email: 'vendor4@rentride.in',
        password: 'Vendor@123',
        phone: '+919500000005',
        role: ROLES.VENDOR,
        isActive: true,
        vendorProfile: {
          businessName: 'Malwa Heritage Fleets',
          gstNumber: '23ABCDE3456F4Z2',
          address: { street: 'Palasia Square', city: 'Indore', state: 'Madhya Pradesh', pincode: '452001' },
          isApproved: true
        }
      },
      {
        name: 'Narmada Green Mobilities',
        email: 'vendor5@rentride.in',
        password: 'Vendor@123',
        phone: '+919400000006',
        role: ROLES.VENDOR,
        isActive: true,
        vendorProfile: {
          businessName: 'Narmada Green EV Mobilities',
          gstNumber: '23ABCDE7890F5Z7',
          address: { street: 'Arera Colony', city: 'Bhopal', state: 'Madhya Pradesh', pincode: '462016' },
          isApproved: false // Pending approval for demonstration
        }
      },
      {
        name: 'Central India Auto Rentals',
        email: 'vendor6@rentride.in',
        password: 'Vendor@123',
        phone: '+919300000007',
        role: ROLES.VENDOR,
        isActive: false, // Suspended for demonstration
        vendorProfile: {
          businessName: 'Central India Auto Rentals Co',
          gstNumber: '23ABCDE2345F6Z4',
          address: { street: 'Sarafa Bazar', city: 'Indore', state: 'Madhya Pradesh', pincode: '452002' },
          isApproved: true
        }
      }
    ];

    const vendorMap = {};
    for (const vData of vendorsData) {
      let v = await User.findOne({ email: vData.email });
      if (!v) {
        v = await User.create(vData);
      } else {
        v.vendorProfile = vData.vendorProfile;
        v.isActive = vData.isActive;
        await v.save();
      }
      vendorMap[vData.email] = v;
    }
    logger.info(`Vendors ensured: ${Object.keys(vendorMap).length}`);

    // -------------------------------------------------------------
    // 4. Ensure Several Customers
    // -------------------------------------------------------------
    const customersData = [
      {
        name: 'Rahul Sharma',
        email: 'customer1@rentride.in',
        password: 'Customer@123',
        phone: '+919600000010',
        role: ROLES.CUSTOMER,
        isActive: true,
        customerProfile: { drivingLicenseNumber: 'MP0920210012345', kycStatus: 'VERIFIED' }
      },
      {
        name: 'Priya Verma',
        email: 'customer2@rentride.in',
        password: 'Customer@123',
        phone: '+919500000020',
        role: ROLES.CUSTOMER,
        isActive: true,
        customerProfile: { drivingLicenseNumber: 'MP0420220054321', kycStatus: 'VERIFIED' }
      },
      {
        name: 'Amit Patel',
        email: 'customer3@rentride.in',
        password: 'Customer@123',
        phone: '+919400000030',
        role: ROLES.CUSTOMER,
        isActive: true,
        customerProfile: { drivingLicenseNumber: 'MP0720200098765', kycStatus: 'VERIFIED' }
      },
      {
        name: 'Neha Gupta',
        email: 'customer4@rentride.in',
        password: 'Customer@123',
        phone: '+919300000040',
        role: ROLES.CUSTOMER,
        isActive: true,
        customerProfile: { drivingLicenseNumber: 'MP0920230011223', kycStatus: 'VERIFIED' }
      }
    ];

    const customerMap = {};
    for (const cData of customersData) {
      let c = await User.findOne({ email: cData.email });
      if (!c) {
        c = await User.create(cData);
      }
      customerMap[cData.email] = c;
    }
    logger.info(`Customers ensured: ${Object.keys(customerMap).length}`);

    // -------------------------------------------------------------
    // 5. Ensure 24+ Realistic Indian Vehicles Across Categories
    // -------------------------------------------------------------
    const vehiclesData = [
      // Two Wheelers - Scooters & Bikes
      {
        reg: 'MP09AB1001',
        brand: 'Honda',
        model: 'Activa 6G',
        year: 2023,
        fuelType: 'petrol',
        transmission: 'automatic',
        seatingCapacity: 2,
        category: 'scooter',
        vendor: 'vendor1@rentride.in',
        city: 'Indore',
        rates: { hourlyRate: 49, rate12Hour: 299, rate24Hour: 499, securityDeposit: 1000 },
        isApproved: true,
        status: VEHICLE_STATUS.AVAILABLE,
        images: [{ url: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=800&q=80', isPrimary: true }]
      },
      {
        reg: 'MP09AB1002',
        brand: 'TVS',
        model: 'Jupiter 125',
        year: 2023,
        fuelType: 'petrol',
        transmission: 'automatic',
        seatingCapacity: 2,
        category: 'scooter',
        vendor: 'vendor1@rentride.in',
        city: 'Indore',
        rates: { hourlyRate: 45, rate12Hour: 279, rate24Hour: 469, securityDeposit: 1000 },
        isApproved: true,
        status: VEHICLE_STATUS.AVAILABLE,
        images: [{ url: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=800&q=80', isPrimary: true }]
      },
      {
        reg: 'MP04CD2001',
        brand: 'Royal Enfield',
        model: 'Classic 350',
        year: 2023,
        fuelType: 'petrol',
        transmission: 'manual',
        seatingCapacity: 2,
        category: 'cruiser-bike',
        vendor: 'vendor2@rentride.in',
        city: 'Bhopal',
        rates: { hourlyRate: 99, rate12Hour: 699, rate24Hour: 1199, securityDeposit: 2000 },
        isApproved: true,
        status: VEHICLE_STATUS.AVAILABLE,
        images: [{ url: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80', isPrimary: true }]
      },
      {
        reg: 'MP04CD2002',
        brand: 'Royal Enfield',
        model: 'Hunter 350',
        year: 2024,
        fuelType: 'petrol',
        transmission: 'manual',
        seatingCapacity: 2,
        category: 'cruiser-bike',
        vendor: 'vendor2@rentride.in',
        city: 'Bhopal',
        rates: { hourlyRate: 89, rate12Hour: 649, rate24Hour: 1099, securityDeposit: 2000 },
        isApproved: true,
        status: VEHICLE_STATUS.AVAILABLE,
        images: [{ url: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80', isPrimary: true }]
      },
      {
        reg: 'MP09EF3001',
        brand: 'Yamaha',
        model: 'YZF R15 V4',
        year: 2023,
        fuelType: 'petrol',
        transmission: 'manual',
        seatingCapacity: 2,
        category: 'sports-bike',
        vendor: 'vendor1@rentride.in',
        city: 'Indore',
        rates: { hourlyRate: 119, rate12Hour: 799, rate24Hour: 1399, securityDeposit: 2500 },
        isApproved: true,
        status: VEHICLE_STATUS.AVAILABLE,
        images: [{ url: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=800&q=80', isPrimary: true }]
      },
      {
        reg: 'MP07GH4001',
        brand: 'KTM',
        model: 'Duke 250',
        year: 2023,
        fuelType: 'petrol',
        transmission: 'manual',
        seatingCapacity: 2,
        category: 'sports-bike',
        vendor: 'vendor3@rentride.in',
        city: 'Gwalior',
        rates: { hourlyRate: 129, rate12Hour: 849, rate24Hour: 1499, securityDeposit: 2500 },
        isApproved: true,
        status: VEHICLE_STATUS.AVAILABLE,
        images: [{ url: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=800&q=80', isPrimary: true }]
      },

      // Four Wheelers - Hatchback & Sedans
      {
        reg: 'MP09IJ5001',
        brand: 'Maruti Suzuki',
        model: 'Swift ZXi',
        year: 2023,
        fuelType: 'petrol',
        transmission: 'manual',
        seatingCapacity: 5,
        category: 'hatchback',
        vendor: 'vendor1@rentride.in',
        city: 'Indore',
        rates: { hourlyRate: 149, rate12Hour: 1199, rate24Hour: 1999, securityDeposit: 3000 },
        isApproved: true,
        status: VEHICLE_STATUS.AVAILABLE,
        images: [{ url: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=800&q=80', isPrimary: true }]
      },
      {
        reg: 'MP09IJ5002',
        brand: 'Hyundai',
        model: 'i20 Asta',
        year: 2023,
        fuelType: 'petrol',
        transmission: 'automatic',
        seatingCapacity: 5,
        category: 'hatchback',
        vendor: 'vendor4@rentride.in',
        city: 'Indore',
        rates: { hourlyRate: 169, rate12Hour: 1299, rate24Hour: 2199, securityDeposit: 3000 },
        isApproved: true,
        status: VEHICLE_STATUS.AVAILABLE,
        images: [{ url: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=800&q=80', isPrimary: true }]
      },
      {
        reg: 'MP04KL6001',
        brand: 'Honda',
        model: 'City ZX',
        year: 2023,
        fuelType: 'petrol',
        transmission: 'automatic',
        seatingCapacity: 5,
        category: 'sedan',
        vendor: 'vendor2@rentride.in',
        city: 'Bhopal',
        rates: { hourlyRate: 219, rate12Hour: 1699, rate24Hour: 2899, securityDeposit: 4000 },
        isApproved: true,
        status: VEHICLE_STATUS.AVAILABLE,
        images: [{ url: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=80', isPrimary: true }]
      },
      {
        reg: 'MP04KL6002',
        brand: 'Hyundai',
        model: 'Verna SX(O)',
        year: 2024,
        fuelType: 'petrol',
        transmission: 'automatic',
        seatingCapacity: 5,
        category: 'sedan',
        vendor: 'vendor2@rentride.in',
        city: 'Bhopal',
        rates: { hourlyRate: 229, rate12Hour: 1799, rate24Hour: 2999, securityDeposit: 4000 },
        isApproved: true,
        status: VEHICLE_STATUS.AVAILABLE,
        images: [{ url: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=80', isPrimary: true }]
      },

      // Four Wheelers - SUVs
      {
        reg: 'MP09MN7001',
        brand: 'Hyundai',
        model: 'Creta SX',
        year: 2023,
        fuelType: 'diesel',
        transmission: 'automatic',
        seatingCapacity: 5,
        category: 'suv',
        vendor: 'vendor1@rentride.in',
        city: 'Indore',
        rates: { hourlyRate: 249, rate12Hour: 1899, rate24Hour: 3299, securityDeposit: 5000 },
        isApproved: true,
        status: VEHICLE_STATUS.AVAILABLE,
        images: [{ url: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80', isPrimary: true }]
      },
      {
        reg: 'MP09MN7002',
        brand: 'Mahindra',
        model: 'Thar 4x4',
        year: 2023,
        fuelType: 'diesel',
        transmission: 'manual',
        seatingCapacity: 4,
        category: 'suv',
        vendor: 'vendor4@rentride.in',
        city: 'Indore',
        rates: { hourlyRate: 299, rate12Hour: 2299, rate24Hour: 3899, securityDeposit: 5000 },
        isApproved: true,
        status: VEHICLE_STATUS.AVAILABLE,
        images: [{ url: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80', isPrimary: true }]
      },
      {
        reg: 'MP07OP8001',
        brand: 'Mahindra',
        model: 'Scorpio-N Z8',
        year: 2024,
        fuelType: 'diesel',
        transmission: 'automatic',
        seatingCapacity: 7,
        category: 'suv',
        vendor: 'vendor3@rentride.in',
        city: 'Gwalior',
        rates: { hourlyRate: 319, rate12Hour: 2499, rate24Hour: 4199, securityDeposit: 5000 },
        isApproved: true,
        status: VEHICLE_STATUS.AVAILABLE,
        images: [{ url: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80', isPrimary: true }]
      },
      {
        reg: 'MP04QR9001',
        brand: 'Tata',
        model: 'Harrier Fearless',
        year: 2024,
        fuelType: 'diesel',
        transmission: 'automatic',
        seatingCapacity: 5,
        category: 'suv',
        vendor: 'vendor2@rentride.in',
        city: 'Bhopal',
        rates: { hourlyRate: 289, rate12Hour: 2199, rate24Hour: 3699, securityDeposit: 5000 },
        isApproved: true,
        status: VEHICLE_STATUS.AVAILABLE,
        images: [{ url: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80', isPrimary: true }]
      },

      // Four Wheelers - Electric Vehicles (EVs)
      {
        reg: 'MP09EV0001',
        brand: 'Tata',
        model: 'Nexon EV Empowered',
        year: 2024,
        fuelType: 'electric',
        transmission: 'automatic',
        seatingCapacity: 5,
        category: 'electric-vehicle',
        vendor: 'vendor1@rentride.in',
        city: 'Indore',
        rates: { hourlyRate: 269, rate12Hour: 1999, rate24Hour: 3399, securityDeposit: 4000 },
        isApproved: true,
        status: VEHICLE_STATUS.AVAILABLE,
        images: [{ url: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=800&q=80', isPrimary: true }]
      },
      {
        reg: 'MP04EV0002',
        brand: 'MG',
        model: 'ZS EV Exclusive',
        year: 2023,
        fuelType: 'electric',
        transmission: 'automatic',
        seatingCapacity: 5,
        category: 'electric-vehicle',
        vendor: 'vendor2@rentride.in',
        city: 'Bhopal',
        rates: { hourlyRate: 299, rate12Hour: 2299, rate24Hour: 3799, securityDeposit: 4000 },
        isApproved: true,
        status: VEHICLE_STATUS.AVAILABLE,
        images: [{ url: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=800&q=80', isPrimary: true }]
      },

      // PENDING APPROVAL VEHICLES (Demonstration of Admin Review Queue)
      {
        reg: 'MP09PEND01',
        brand: 'Kia',
        model: 'Seltos GTX+',
        year: 2024,
        fuelType: 'petrol',
        transmission: 'automatic',
        seatingCapacity: 5,
        category: 'suv',
        vendor: 'vendor4@rentride.in',
        city: 'Indore',
        rates: { hourlyRate: 279, rate12Hour: 2099, rate24Hour: 3499, securityDeposit: 5000 },
        isApproved: false,
        status: VEHICLE_STATUS.PENDING_APPROVAL,
        images: [{ url: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80', isPrimary: true }]
      },
      {
        reg: 'MP04PEND02',
        brand: 'Ather',
        model: '450X Gen 3',
        year: 2024,
        fuelType: 'electric',
        transmission: 'automatic',
        seatingCapacity: 2,
        category: 'scooter',
        vendor: 'vendor2@rentride.in',
        city: 'Bhopal',
        rates: { hourlyRate: 69, rate12Hour: 449, rate24Hour: 749, securityDeposit: 1500 },
        isApproved: false,
        status: VEHICLE_STATUS.PENDING_APPROVAL,
        images: [{ url: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=800&q=80', isPrimary: true }]
      },

      // MAINTENANCE VEHICLE
      {
        reg: 'MP09MAIN01',
        brand: 'Toyota',
        model: 'Innova Crysta',
        year: 2022,
        fuelType: 'diesel',
        transmission: 'manual',
        seatingCapacity: 7,
        category: 'suv',
        vendor: 'vendor1@rentride.in',
        city: 'Indore',
        rates: { hourlyRate: 349, rate12Hour: 2799, rate24Hour: 4799, securityDeposit: 5000 },
        isApproved: true,
        status: VEHICLE_STATUS.MAINTENANCE,
        images: [{ url: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80', isPrimary: true }]
      }
    ];

    const vehicleMap = {};
    for (const vData of vehiclesData) {
      const cat = categoryMap[vData.category];
      const vendor = vendorMap[vData.vendor];

      if (!cat || !vendor) continue;

      let v = await Vehicle.findOne({ registrationNumber: vData.reg });
      if (!v) {
        v = await Vehicle.create({
          vendorId: vendor._id,
          categoryId: cat._id,
          brand: vData.brand,
          model: vData.model,
          registrationNumber: vData.reg,
          year: vData.year,
          fuelType: vData.fuelType,
          transmission: vData.transmission,
          seatingCapacity: vData.seatingCapacity,
          location: { city: vData.city, state: 'Madhya Pradesh', address: `${vData.city} Central Hub` },
          images: vData.images,
          pricing: vData.rates,
          status: vData.status,
          isApproved: vData.isApproved,
          ratingAverage: 4.8,
          ratingCount: 12
        });
      } else {
        v.isApproved = vData.isApproved;
        v.status = vData.status;
        v.pricing = vData.rates;
        await v.save();
      }
      vehicleMap[vData.reg] = v;
    }
    logger.info(`Vehicles ensured: ${Object.keys(vehicleMap).length}`);

    // -------------------------------------------------------------
    // 6. Ensure Sample Bookings & Payment Records
    // -------------------------------------------------------------
    const sampleBookings = [
      {
        num: 'RR-20260301-A101',
        reg: 'MP09AB1001',
        customerEmail: 'customer1@rentride.in',
        vendorEmail: 'vendor1@rentride.in',
        plan: RENTAL_PLANS.TWENTY_FOUR_HOURS,
        duration: 24,
        startOffsetDays: -5,
        endOffsetDays: -4,
        subtotal: 499,
        platformCommission: 60,
        vendorPayout: 439,
        totalAmount: 1499, // includes 1000 deposit
        status: BOOKING_STATUS.COMPLETED,
        paymentStatus: PAYMENT_STATUS.SUCCESS
      },
      {
        num: 'RR-20260302-B202',
        reg: 'MP04CD2001',
        customerEmail: 'customer2@rentride.in',
        vendorEmail: 'vendor2@rentride.in',
        plan: RENTAL_PLANS.TWELVE_HOURS,
        duration: 12,
        startOffsetDays: -3,
        endOffsetDays: -2,
        subtotal: 699,
        platformCommission: 84,
        vendorPayout: 615,
        totalAmount: 2699,
        status: BOOKING_STATUS.COMPLETED,
        paymentStatus: PAYMENT_STATUS.SUCCESS
      },
      {
        num: 'RR-20260303-C303',
        reg: 'MP09MN7001',
        customerEmail: 'customer3@rentride.in',
        vendorEmail: 'vendor1@rentride.in',
        plan: RENTAL_PLANS.TWENTY_FOUR_HOURS,
        duration: 48,
        startOffsetDays: -1,
        endOffsetDays: 1,
        subtotal: 6598,
        platformCommission: 792,
        vendorPayout: 5806,
        totalAmount: 11598,
        status: BOOKING_STATUS.ACTIVE,
        paymentStatus: PAYMENT_STATUS.SUCCESS
      },
      {
        num: 'RR-20260304-D404',
        reg: 'MP09EV0001',
        customerEmail: 'customer4@rentride.in',
        vendorEmail: 'vendor1@rentride.in',
        plan: RENTAL_PLANS.TWELVE_HOURS,
        duration: 12,
        startOffsetDays: 2,
        endOffsetDays: 3,
        subtotal: 1999,
        platformCommission: 240,
        vendorPayout: 1759,
        totalAmount: 5999,
        status: BOOKING_STATUS.CONFIRMED,
        paymentStatus: PAYMENT_STATUS.SUCCESS
      },
      {
        num: 'RR-20260305-E505',
        reg: 'MP09MN7002',
        customerEmail: 'customer1@rentride.in',
        vendorEmail: 'vendor4@rentride.in',
        plan: RENTAL_PLANS.TWENTY_FOUR_HOURS,
        duration: 24,
        startOffsetDays: -10,
        endOffsetDays: -9,
        subtotal: 3899,
        platformCommission: 468,
        vendorPayout: 3431,
        totalAmount: 8899,
        status: BOOKING_STATUS.CANCELLED,
        paymentStatus: PAYMENT_STATUS.REFUNDED
      }
    ];

    for (const bData of sampleBookings) {
      const veh = vehicleMap[bData.reg];
      const cust = customerMap[bData.customerEmail];
      const vend = vendorMap[bData.vendorEmail];

      if (!veh || !cust || !vend) continue;

      const now = Date.now();
      const start = new Date(now + bData.startOffsetDays * 24 * 60 * 60 * 1000);
      const end = new Date(now + bData.endOffsetDays * 24 * 60 * 60 * 1000);

      let b = await Booking.findOne({ bookingNumber: bData.num });
      if (!b) {
        b = await Booking.create({
          bookingNumber: bData.num,
          vehicleId: veh._id,
          vendorId: vend._id,
          customerId: cust._id,
          bookingType: BOOKING_TYPES.ONLINE,
          rentalPlan: bData.plan,
          startDateTime: start,
          endDateTime: end,
          durationHours: bData.duration,
          priceBreakdown: {
            basePrice: bData.subtotal,
            surgeMultiplier: 1.0,
            couponDiscount: 0,
            subtotal: bData.subtotal,
            platformFee: 99,
            taxAmount: Math.round(bData.subtotal * 0.18),
            securityDeposit: 1000,
            totalAmount: bData.totalAmount,
            vendorPayout: bData.vendorPayout,
            platformCommission: bData.platformCommission
          },
          status: bData.status,
          paymentStatus: bData.paymentStatus
        });

        // Associated Payment Record
        await Payment.create({
          bookingId: b._id,
          userId: cust._id,
          razorpayOrderId: `order_${b.bookingNumber.toLowerCase()}`,
          razorpayPaymentId: `pay_${b.bookingNumber.toLowerCase()}_123`,
          amount: bData.totalAmount,
          currency: 'INR',
          status: bData.paymentStatus,
          paymentMethod: 'RAZORPAY'
        });

        // Associated Review for completed bookings
        if (bData.status === BOOKING_STATUS.COMPLETED) {
          await Review.create({
            bookingId: b._id,
            vehicleId: veh._id,
            vendorId: vend._id,
            customerId: cust._id,
            rating: 5,
            comment: 'Superb smooth ride! The vehicle was clean, well-serviced and handed over on time.',
            isModerated: true
          });
        }
      }
    }
    logger.info('Sample Bookings, Payments, and Reviews populated.');

    // -------------------------------------------------------------
    // 7. Ensure Sample Maintenance Records
    // -------------------------------------------------------------
    const maintVehicle = vehicleMap['MP09MAIN01'] || vehicleMap['MP09AB1001'];
    if (maintVehicle) {
      const existingMaint = await Maintenance.findOne({ vehicleId: maintVehicle._id });
      if (!existingMaint) {
        await Maintenance.create({
          vehicleId: maintVehicle._id,
          vendorId: maintVehicle.vendorId,
          maintenanceType: 'routine',
          description: 'Periodic 10,000 km general service, brake inspection and oil replacement.',
          cost: 3500,
          startDate: new Date(),
          endDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
          status: MAINTENANCE_STATUS.IN_PROGRESS,
          serviceCenterDetails: {
            name: 'Toyota Authorised Service, Vijay Nagar',
            contact: '+917314000111'
          }
        });
        logger.info('Sample Maintenance record populated.');
      }
    }

    logger.info('Demo dataset seed process completed successfully!');
    process.exit(0);
  } catch (error) {
    logger.error('Error seeding demo data:', error);
    process.exit(1);
  }
};

seedDemoData();
