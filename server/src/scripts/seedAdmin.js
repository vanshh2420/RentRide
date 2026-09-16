import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import { connectDB } from '../config/db.js';
import { User } from '../models/user.model.js';
import { ROLES } from '../constants/roles.js';
import { logger } from '../utils/logger.js';

/**
 * Idempotent Admin Account Setup Script
 * Usage: npm run seed:admin
 */
const seedAdmin = async () => {
  try {
    logger.info('Connecting to database for Admin provisioning...');
    await connectDB();

    const adminEmail = (process.env.ADMIN_EMAIL || 'admin@rentride.in').trim().toLowerCase();
    const adminPassword = process.env.ADMIN_INITIAL_PASSWORD || process.env.ADMIN_PASSWORD || 'Admin@123';
    const adminName = process.env.ADMIN_NAME || 'RentRide Super Admin';
    const adminPhone = process.env.ADMIN_PHONE || '+919900000001';

    // Check if admin user already exists
    let admin = await User.findOne({ email: adminEmail });

    if (admin) {
      logger.info(`Admin account already exists for ${adminEmail}. Ensuring ADMIN role and active status...`);
      admin.role = ROLES.ADMIN;
      admin.isActive = true;
      admin.name = adminName;
      admin.phone = adminPhone;
      // If requested to reset password via flag
      if (process.argv.includes('--reset-password')) {
        admin.password = adminPassword; // Pre-save hook will hash it with bcrypt
        logger.info('Admin password reset flag detected; updated password hash.');
      }
      await admin.save();
    } else {
      logger.info(`Creating fresh Admin account: ${adminEmail}...`);
      admin = await User.create({
        name: adminName,
        email: adminEmail,
        password: adminPassword, // Pre-save hook in user.model hashes with bcrypt (10 rounds)
        phone: adminPhone,
        role: ROLES.ADMIN,
        isActive: true
      });
      logger.info(`Admin account successfully created with ID: ${admin._id}`);
    }

    logger.info('Admin provisioning completed successfully.');
    process.exit(0);
  } catch (error) {
    logger.error('Failed to provision Admin account:', error);
    process.exit(1);
  }
};

seedAdmin();
