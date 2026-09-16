import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { connectDB } from '../config/db.js';
import VehicleCatalog from '../models/catalog.model.js';
import { Vehicle } from '../models/vehicle.model.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../../.env') });

async function linkFleet() {
  console.log(`\n======================================================`);
  console.log(`  RentRide Fleet Auto-Link to Master Catalog`);
  console.log(`======================================================\n`);

  await connectDB();

  try {
    const unlinked = await Vehicle.find({ $or: [{ catalogId: { $exists: false } }, { catalogId: null }] });
    console.log(`Scanning ${unlinked.length} unlinked physical vehicles in inventory...\n`);

    let linkedCount = 0;

    for (const v of unlinked) {
      // Look for brand and model substring match
      const cleanBrand = v.brand.trim().replace(/^Ola$/i, 'Ola Electric');
      const brandRegex = new RegExp(`^${cleanBrand}$`, 'i');
      const modelFirstWord = v.model.trim().split(' ')[0];
      const modelRegex = new RegExp(modelFirstWord, 'i');

      const match = await VehicleCatalog.findOne({
        brand: brandRegex,
        model: modelRegex
      });

      if (match) {
        v.catalogId = match._id;
        if (!v.fuelEconomy && match.fuelEconomy?.value) {
          v.fuelEconomy = match.fuelEconomy.value;
        }
        await v.save();
        linkedCount++;
        console.log(`  🔗 Linked Fleet [${v.registrationNumber}] (${v.brand} ${v.model}) => Catalog: [${match.catalogKey}]`);
      } else {
        console.log(`  ℹ️ No exact catalog match for [${v.registrationNumber}] (${v.brand} ${v.model})`);
      }
    }

    console.log(`\n======================================================`);
    console.log(`  Successfully linked ${linkedCount}/${unlinked.length} physical vehicles.`);
    console.log(`======================================================\n`);

  } catch (err) {
    console.error('Fleet linking error:', err);
  } finally {
    await mongoose.connection.close();
    console.log('MongoDB connection closed.');
  }
}

linkFleet();
