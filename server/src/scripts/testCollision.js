import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { BookingService } from '../services/booking.service.js';
import { Vehicle } from '../models/vehicle.model.js';
import { Booking } from '../models/booking.model.js';
import { User } from '../models/user.model.js';
import { ROLES } from '../constants/roles.js';

dotenv.config();

async function runCollisionTests() {
  console.log('====================================================');
  console.log('🔄 RENTRIDE: ONLINE / OFFLINE INVENTORY COLLISION TEST');
  console.log('====================================================\n');

  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/rentride';
    await mongoose.connect(mongoUri);
    console.log('✓ Connected to MongoDB');

    // 1. Find a test vehicle, vendor, and customer
    const vehicle = await Vehicle.findOne({ status: 'AVAILABLE', isApproved: true });
    if (!vehicle) {
      throw new Error('No available vehicle found for test. Please run seed script first.');
    }
    const customer = await User.findOne({ role: ROLES.CUSTOMER });
    if (!customer) {
      throw new Error('No customer found for test.');
    }

    console.log(`✓ Using Test Vehicle: ${vehicle.brand} ${vehicle.model} (${vehicle.registrationNumber})`);
    console.log(`✓ Using Vendor ID: ${vehicle.vendorId}`);
    console.log(`✓ Using Customer ID: ${customer._id}\n`);

    // Define timestamps for testing (Next month to avoid conflicts with real data)
    const baseDate = new Date();
    baseDate.setMonth(baseDate.getMonth() + 1);
    baseDate.setDate(15);
    baseDate.setHours(10, 0, 0, 0); // 10:00 AM

    const slot1Start = new Date(baseDate).toISOString();
    const slot1End = new Date(baseDate.getTime() + 10 * 60 * 60 * 1000).toISOString(); // 8:00 PM (10h)

    // Overlapping slot: 5:00 PM to 10:00 PM
    const overlapStart = new Date(baseDate.getTime() + 7 * 60 * 60 * 1000).toISOString(); // 5:00 PM
    const overlapEnd = new Date(baseDate.getTime() + 12 * 60 * 60 * 1000).toISOString(); // 10:00 PM

    // Non-overlapping slot: 8:01 PM to 11:00 PM
    const validStart = new Date(baseDate.getTime() + 10.1 * 60 * 60 * 1000).toISOString(); // 8:06 PM
    const validEnd = new Date(baseDate.getTime() + 13 * 60 * 60 * 1000).toISOString(); // 11:00 PM

    // Clean up any lingering test records
    await Booking.deleteMany({ vehicleId: vehicle._id, startDateTime: { $gte: baseDate } });

    // ----------------------------------------------------
    // TEST 1: Online Booking -> Attempt Overlapping Offline
    // ----------------------------------------------------
    console.log('----------------------------------------------------');
    console.log('TEST 1: Online Booking [10:00 AM - 8:00 PM]');
    console.log('        Attempt Conflicting Offline Walk-in [5:00 PM - 10:00 PM]');
    console.log('----------------------------------------------------');

    const onlineBooking = await BookingService.createOnlineBooking(customer._id, {
      vehicleId: vehicle._id.toString(),
      rentalPlan: 'HOURLY',
      startDateTime: slot1Start,
      endDateTime: slot1End
    });
    // Manually mark as CONFIRMED for test
    onlineBooking.status = 'CONFIRMED';
    onlineBooking.paymentStatus = 'SUCCESS';
    await onlineBooking.save();
    console.log(`✓ Online booking created (#${onlineBooking.bookingNumber}) from 10:00 AM to 8:00 PM`);

    let test1Passed = false;
    try {
      await BookingService.createOfflineBooking(
        vehicle.vendorId,
        {
          vehicleId: vehicle._id.toString(),
          rentalPlan: 'HOURLY',
          startDateTime: overlapStart,
          endDateTime: overlapEnd,
          offlineCustomer: {
            name: 'Walk-in John',
            phone: '9876543210',
            drivingLicenseNumber: 'DL-WALKIN-1234'
          }
        },
        ROLES.VENDOR
      );
    } catch (err) {
      if (err.statusCode === 409) {
        test1Passed = true;
        console.log(`✅ TEST 1 PASSED: Offline Walk-in correctly rejected with HTTP 409 Conflict!`);
        console.log(`   Reason: "${err.message}"`);
      } else {
        console.error(`❌ Unexpected error code: ${err.statusCode}`, err);
      }
    }

    if (!test1Passed) {
      throw new Error('TEST 1 FAILED: Conflicting offline booking was not rejected!');
    }

    // Clean up Test 1 booking
    await Booking.findByIdAndDelete(onlineBooking._id);

    // ----------------------------------------------------
    // TEST 2: Offline Booking -> Attempt Overlapping Online
    // ----------------------------------------------------
    console.log('\n----------------------------------------------------');
    console.log('TEST 2: Offline Walk-in Booking [10:00 AM - 8:00 PM]');
    console.log('        Attempt Conflicting Online Booking [5:00 PM - 10:00 PM]');
    console.log('----------------------------------------------------');

    const offlineBooking = await BookingService.createOfflineBooking(
      vehicle.vendorId,
      {
        vehicleId: vehicle._id.toString(),
        rentalPlan: 'HOURLY',
        startDateTime: slot1Start,
        endDateTime: slot1End,
        offlineCustomer: {
          name: 'Desk Customer Sharma',
          phone: '9988776655',
          drivingLicenseNumber: 'DL-OFFLINE-9988'
        },
        paymentMethod: 'offline_cash',
        isPaymentCollected: true
      },
      ROLES.VENDOR
    );
    console.log(`✓ Offline walk-in booking created (#${offlineBooking.bookingNumber}) from 10:00 AM to 8:00 PM`);

    let test2Passed = false;
    try {
      await BookingService.createOnlineBooking(customer._id, {
        vehicleId: vehicle._id.toString(),
        rentalPlan: 'HOURLY',
        startDateTime: overlapStart,
        endDateTime: overlapEnd
      });
    } catch (err) {
      if (err.statusCode === 409) {
        test2Passed = true;
        console.log(`✅ TEST 2 PASSED: Online Booking correctly rejected with HTTP 409 Conflict!`);
        console.log(`   Reason: "${err.message}"`);
      } else {
        console.error(`❌ Unexpected error code: ${err.statusCode}`, err);
      }
    }

    if (!test2Passed) {
      throw new Error('TEST 2 FAILED: Conflicting online booking was not rejected!');
    }

    // ----------------------------------------------------
    // TEST 3: Non-Overlapping Slot -> SUT Succeeds
    // ----------------------------------------------------
    console.log('\n----------------------------------------------------');
    console.log('TEST 3: Non-Overlapping Slot [8:06 PM - 11:00 PM]');
    console.log('----------------------------------------------------');

    const nonOverlappingBooking = await BookingService.createOnlineBooking(customer._id, {
      vehicleId: vehicle._id.toString(),
      rentalPlan: 'HOURLY',
      startDateTime: validStart,
      endDateTime: validEnd
    });
    console.log(`✅ TEST 3 PASSED: Non-overlapping booking succeeded (#${nonOverlappingBooking.bookingNumber})!`);

    // Final Clean up
    await Booking.findByIdAndDelete(offlineBooking._id);
    await Booking.findByIdAndDelete(nonOverlappingBooking._id);

    console.log('\n====================================================');
    console.log('🎉 ALL INVENTORY SYNCHRONIZATION TESTS PASSED CLEANLY (100% RELIABLE)');
    console.log('====================================================');
  } catch (error) {
    console.error('\n❌ Collision Test Failed:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
}

runCollisionTests();
