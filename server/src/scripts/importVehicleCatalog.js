import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { connectDB } from '../config/db.js';
import VehicleCatalog from '../models/catalog.model.js';
import { Category } from '../models/category.model.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../../.env') });

const catalogFilePath = path.join(__dirname, '../data/vehicle-catalog.json');

async function runImport() {
  const args = process.argv.slice(2);
  const isDryRun = args.includes('--dry-run');
  const categoryFilterIdx = args.indexOf('--category');
  const categoryFilter = categoryFilterIdx !== -1 ? args[categoryFilterIdx + 1] : null;

  console.log(`\n======================================================`);
  console.log(`  RentRide Master Catalog Importer`);
  console.log(`  Mode: ${isDryRun ? '🔍 DRY RUN (Simulation - No Database Writes)' : '🚀 LIVE DATABASE IMPORT'}`);
  if (categoryFilter) console.log(`  Filtered Category: ${categoryFilter}`);
  console.log(`======================================================\n`);

  if (!fs.existsSync(catalogFilePath)) {
    console.error(`❌ Catalog file not found at: ${catalogFilePath}`);
    process.exit(1);
  }

  const rawData = fs.readFileSync(catalogFilePath, 'utf-8');
  let records = JSON.parse(rawData);

  if (categoryFilter) {
    records = records.filter(r => r.categorySlug === categoryFilter);
    console.log(`Matched ${records.length} records for category: "${categoryFilter}".`);
  } else {
    console.log(`Loaded ${records.length} records from dataset.`);
  }

  // Connect to DB
  await connectDB();

  try {
    // 1. Fetch categories
    const categories = await Category.find({});
    const categoryMap = new Map();
    categories.forEach(cat => {
      categoryMap.set(cat.slug, cat._id);
    });

    console.log(`Loaded ${categories.length} categories from database:`);
    categories.forEach(c => console.log(`  - [${c.slug}] => ID: ${c._id} ("${c.name}")`));
    console.log('');

    let insertedCount = 0;
    let updatedCount = 0;
    let skippedCount = 0;
    let errorCount = 0;
    const errors = [];

    const startTime = Date.now();

    for (let i = 0; i < records.length; i++) {
      const item = records[i];
      const categoryId = categoryMap.get(item.categorySlug);

      if (!categoryId) {
        errors.push(`Record ${item.catalogKey}: categorySlug "${item.categorySlug}" not found in DB Category collection.`);
        errorCount++;
        continue;
      }

      const catalogData = {
        catalogKey: item.catalogKey,
        brand: item.brand,
        model: item.model,
        variant: item.variant,
        categoryId: categoryId,
        vehicleType: item.vehicleType,
        fuelType: item.fuelType,
        transmission: item.transmission,
        seatingCapacity: item.seatingCapacity,
        engineCapacity: item.engineCapacity,
        fuelEconomy: {
          value: item.fuelEconomy.value,
          unit: item.fuelEconomy.unit
        },
        specifications: {
          fuelTankCapacityLiters: item.specifications?.fuelTankCapacityLiters ?? null,
          batteryCapacityKwh: item.specifications?.batteryCapacityKwh ?? null,
          maxPowerBhp: item.specifications?.maxPowerBhp ?? null,
          maxTorqueNm: item.specifications?.maxTorqueNm ?? null,
          topSpeedKmph: item.specifications?.topSpeedKmph ?? null,
          dimensions: item.specifications?.dimensions ?? {}
        },
        features: Array.isArray(item.features) ? item.features : [],
        images: Array.isArray(item.images) ? item.images : [],
        suggestedPricing: {
          hourlyRate: item.suggestedPricing?.hourlyRate ?? 100,
          rate12Hour: item.suggestedPricing?.rate12Hour ?? 650,
          rate24Hour: item.suggestedPricing?.rate24Hour ?? 1100
        },
        isActive: true
      };

      if (isDryRun) {
        // Check if would update or insert
        const existing = await VehicleCatalog.findOne({ catalogKey: item.catalogKey }).lean();
        if (existing) {
          updatedCount++;
        } else {
          insertedCount++;
        }
      } else {
        try {
          const res = await VehicleCatalog.findOneAndUpdate(
            { catalogKey: item.catalogKey },
            { $set: catalogData },
            { upsert: true, new: true, rawResult: true }
          );

          if (res.lastErrorObject?.updatedExisting) {
            updatedCount++;
          } else {
            insertedCount++;
          }
        } catch (opErr) {
          errors.push(`Error upserting ${item.catalogKey}: ${opErr.message}`);
          errorCount++;
        }
      }

      if ((i + 1) % 50 === 0 || i === records.length - 1) {
        process.stdout.write(`Processed ${i + 1}/${records.length} records...\r`);
      }
    }

    const durationSec = ((Date.now() - startTime) / 1000).toFixed(2);

    console.log(`\n\n======================================================`);
    console.log(`  Import Summary Report`);
    console.log(`======================================================`);
    console.log(`  Execution Mode:         ${isDryRun ? 'DRY RUN (Simulated)' : 'LIVE DATABASE COMMIT'}`);
    console.log(`  Total Processed:        ${records.length}`);
    console.log(`  ${isDryRun ? 'Would Insert (New):' : 'Successfully Inserted:'}   ${insertedCount}`);
    console.log(`  ${isDryRun ? 'Would Update (Existing):' : 'Successfully Updated:'}  ${updatedCount}`);
    console.log(`  Errors / Skipped:       ${errorCount}`);
    console.log(`  Time Elapsed:           ${durationSec}s`);
    console.log(`======================================================\n`);

    if (errors.length > 0) {
      console.error(`Encountered ${errors.length} issue(s):`);
      errors.slice(0, 10).forEach(e => console.error(`  ❌ ${e}`));
      if (errors.length > 10) console.error(`  ... and ${errors.length - 10} more.`);
    }

    const totalInDb = await VehicleCatalog.countDocuments();
    console.log(`Current Total VehicleCatalog documents in MongoDB: ${totalInDb}\n`);

  } catch (err) {
    console.error(`Fatal import error:`, err);
  } finally {
    await mongoose.connection.close();
    console.log('MongoDB connection closed.');
  }
}

runImport();
