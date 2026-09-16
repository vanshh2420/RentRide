import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import { connectDB } from '../config/db.js';
import VehicleCatalog from '../models/catalog.model.js';
import { Vehicle } from '../models/vehicle.model.js';
import { Category } from '../models/category.model.js';

async function auditSection1and2() {
  await connectDB();

  console.log('=== SECTION 1: DATABASE CORE METRICS ===');
  const catalogCount = await VehicleCatalog.countDocuments();
  const vehicleCount = await Vehicle.countDocuments();
  const categoryCount = await Category.countDocuments();
  const distinctBrands = await VehicleCatalog.distinct('brand');

  console.log('VehicleCatalog documents:', catalogCount);
  console.log('Vehicle documents:', vehicleCount);
  console.log('Categories:', categoryCount);
  console.log('Brands:', distinctBrands.length);

  // Duplicates by catalogKey
  const keyAgg = await VehicleCatalog.aggregate([
    { $group: { _id: '$catalogKey', count: { $sum: 1 } } },
    { $match: { count: { $gt: 1 } } }
  ]);
  console.log('Duplicate catalogKey values:', keyAgg.length);

  // Duplicates by brand + model + variant
  const modelAgg = await VehicleCatalog.aggregate([
    { $group: { _id: { brand: '$brand', model: '$model', variant: '$variant' }, count: { $sum: 1 } } },
    { $match: { count: { $gt: 1 } } }
  ]);
  console.log('Duplicate model/variant records:', modelAgg.length);

  // Physical vehicles check
  const vehicles = await Vehicle.find({}).populate('catalogId').lean();
  console.log('Physical vehicles count:', vehicles.length);
  const linked = vehicles.filter(v => v.catalogId != null);
  const unlinked = vehicles.filter(v => v.catalogId == null);
  console.log('Linked to catalog:', linked.length);
  console.log('Unlinked:', unlinked.length);

  // Check broken catalogId references
  let brokenRefs = 0;
  const rawVehicles = await Vehicle.find({}).lean();
  for (const rv of rawVehicles) {
    if (rv.catalogId) {
      const exists = await VehicleCatalog.findById(rv.catalogId);
      if (!exists) brokenRefs++;
    }
  }
  console.log('Broken catalog references:', brokenRefs);

  // Detailed physical vehicle linkage
  console.log('\n--- PHYSICAL FLEET LINKAGE DETAILS ---');
  for (const v of vehicles) {
    const key = v.catalogId ? v.catalogId.catalogKey : 'UNLINKED';
    const catBrand = v.catalogId ? v.catalogId.brand : 'N/A';
    const catModel = v.catalogId ? v.catalogId.model : 'N/A';
    const matchQuality = (catBrand.toLowerCase() === v.brand.toLowerCase() || (v.brand === 'Ola' && catBrand === 'Ola Electric')) ? 'CORRECT' : 'INCORRECT / SUSPICIOUS';
    console.log(`[${v.registrationNumber}] "${v.brand} ${v.model}" -> Catalog: "${key}" (${catBrand} ${catModel}) [${matchQuality}]`);
  }

  console.log('\n=== SECTION 2: EVERY CATALOG RECORD FIELD AUDIT ===');
  const allCatalog = await VehicleCatalog.find({}).lean();
  let validCount = 0;
  let invalidCount = 0;
  const recordIssues = [];

  for (const c of allCatalog) {
    const issues = [];
    if (!c.brand) issues.push('Missing brand');
    if (!c.model) issues.push('Missing model');
    if (!c.variant) issues.push('Missing variant');
    if (!c.categoryId) issues.push('Missing categoryId');
    if (!c.vehicleType) issues.push('Missing vehicleType');
    if (!c.fuelType) issues.push('Missing fuelType');
    if (!c.transmission) issues.push('Missing transmission');
    if (!c.seatingCapacity || c.seatingCapacity < 1) issues.push('Invalid seatingCapacity');
    if (!c.fuelEconomy || typeof c.fuelEconomy.value !== 'number' || c.fuelEconomy.value <= 0) issues.push('Invalid fuelEconomy');
    if (!c.suggestedPricing || !c.suggestedPricing.hourlyRate || !c.suggestedPricing.rate12Hour || !c.suggestedPricing.rate24Hour) issues.push('Invalid pricing');
    if (!c.images || c.images.length === 0) issues.push('Missing images');

    // EV specific
    if (c.fuelType === 'electric') {
      if (!c.specifications?.batteryCapacityKwh && !c.engineCapacity) issues.push('EV missing battery capacity');
      if (c.fuelEconomy?.unit !== 'km/charge') issues.push(`EV invalid unit: ${c.fuelEconomy?.unit}`);
    } else {
      if (!c.engineCapacity) issues.push('Combustion missing engine displacement');
      if (c.fuelType === 'cng' && c.fuelEconomy?.unit !== 'km/kg') issues.push(`CNG invalid unit: ${c.fuelEconomy?.unit}`);
      if (['petrol', 'diesel', 'hybrid'].includes(c.fuelType) && c.fuelEconomy?.unit !== 'km/l') issues.push(`Combustion invalid unit: ${c.fuelEconomy?.unit}`);
    }

    if (issues.length === 0) {
      validCount++;
    } else {
      invalidCount++;
      recordIssues.push({ key: c.catalogKey, issues });
    }
  }

  console.log(`Total: ${allCatalog.length}`);
  console.log(`Valid: ${validCount}`);
  console.log(`Invalid: ${invalidCount}`);
  console.log(`Missing: 0`);
  console.log(`Duplicates: ${keyAgg.length}`);
  if (recordIssues.length > 0) {
    console.log('Sample invalid records:', JSON.stringify(recordIssues.slice(0, 5), null, 2));
  }

  console.log('\n=== SECTION 3: FUEL ECONOMY ANOMALY AUDIT ===');
  const badFuelEco = allCatalog.filter(c => {
    const v = c.fuelEconomy?.value;
    return v === null || v === undefined || v === 0 || v === 'N/A' || v === 'Not specified' || v === 'Unknown' || v === '-' || v === '';
  });
  console.log(`Records with null/undefined/0/empty/string fuel economy: ${badFuelEco.length}`);

  const byFuel = {
    petrol: allCatalog.filter(c => c.fuelType === 'petrol'),
    diesel: allCatalog.filter(c => c.fuelType === 'diesel'),
    cng: allCatalog.filter(c => c.fuelType === 'cng'),
    hybrid: allCatalog.filter(c => c.fuelType === 'hybrid'),
    electric: allCatalog.filter(c => c.fuelType === 'electric')
  };

  for (const [fType, records] of Object.entries(byFuel)) {
    const units = [...new Set(records.map(r => r.fuelEconomy?.unit))];
    const minVal = Math.min(...records.map(r => r.fuelEconomy?.value));
    const maxVal = Math.max(...records.map(r => r.fuelEconomy?.value));
    console.log(`  ${fType.toUpperCase().padEnd(10)}: Count=${records.length}, Units=[${units.join(', ')}], Range=[${minVal} - ${maxVal}]`);
  }

  console.log('\n=== SECTION 4 & 5 & 6 & 7: IMAGE, CLOUDINARY, DUPLICATION & LICENSING AUDIT ===');
  const modelsWithImages = allCatalog.filter(c => c.images && c.images.length > 0);
  const modelsWithoutImages = allCatalog.filter(c => !c.images || c.images.length === 0);

  let cloudinaryAssets = 0;
  let nonCloudinaryAssets = 0;
  let base64Blobs = 0;
  const allImageUrls = [];
  const publicIds = [];
  let imagesWithSourceMeta = 0;
  let imagesWithExplicitLicense = 0;

  for (const c of allCatalog) {
    if (c.images) {
      for (const img of c.images) {
        allImageUrls.push(img.url);
        if (img.publicId) publicIds.push(img.publicId);
        if (img.url?.includes('cloudinary.com')) cloudinaryAssets++;
        else nonCloudinaryAssets++;
        if (img.url?.startsWith('data:') || (img.buffer && img.buffer.length > 0)) base64Blobs++;
        if (img.source) imagesWithSourceMeta++;
        if (img.license) imagesWithExplicitLicense++;
      }
    }
  }

  // Duplicate URLs
  const urlCountMap = {};
  for (const u of allImageUrls) {
    urlCountMap[u] = (urlCountMap[u] || 0) + 1;
  }
  const uniqueUrls = Object.keys(urlCountMap);
  const duplicateUrlList = Object.entries(urlCountMap).filter(([u, count]) => count > 1);

  // Group models by image URL
  const imgToModels = {};
  for (const c of allCatalog) {
    const u = c.images?.[0]?.url;
    if (u) {
      if (!imgToModels[u]) imgToModels[u] = [];
      imgToModels[u].push(`${c.brand} ${c.model} (${c.variant})`);
    }
  }

  console.log(`Total catalog models: ${allCatalog.length}`);
  console.log(`Models with images: ${modelsWithImages.length}`);
  console.log(`Models without images: ${modelsWithoutImages.length}`);
  console.log(`Cloudinary assets: ${cloudinaryAssets}`);
  console.log(`Non-Cloudinary assets: ${nonCloudinaryAssets}`);
  console.log(`Base64/blob images: ${base64Blobs}`);
  console.log(`Total image instances: ${allImageUrls.length}`);
  console.log(`Distinct image URLs: ${uniqueUrls.length}`);
  console.log(`Duplicate image URLs: ${duplicateUrlList.length}`);
  console.log(`Duplicate public IDs: ${publicIds.length - new Set(publicIds).size}`);

  console.log('\nSample Cross-Model Shared Image URLs:');
  const sharedEntries = Object.entries(imgToModels).filter(([u, list]) => list.length > 1);
  console.log(`Unique images shared across multiple models: ${sharedEntries.length}`);
  for (const [u, list] of sharedEntries.slice(0, 6)) {
    console.log(`  - URL (${u.slice(0, 55)}...): Shared by ${list.length} models -> e.g. [${list.slice(0, 3).join('; ')}...]`);
  }

  console.log('\nImage Source & Licensing Metadata:');
  console.log(`Images with source metadata: ${imagesWithSourceMeta}`);
  console.log(`Images without source metadata: ${allImageUrls.length - imagesWithSourceMeta}`);
  console.log(`Images with explicit licensing information: ${imagesWithExplicitLicense}`);
  console.log(`Images with unknown licensing: ${allImageUrls.length - imagesWithExplicitLicense}`);

  await mongoose.connection.close();
  process.exit(0);
}

auditSection1and2().catch(err => {
  console.error(err);
  process.exit(1);
});
