import { connectDB } from '../config/db.js';
import VehicleCatalog from '../models/catalog.model.js';
import { Vehicle } from '../models/vehicle.model.js';
import { Category } from '../models/category.model.js';
import { getOptimizedImageUrl } from '../../../client/src/utils/imageUtils.js';

async function verifyAutofillAndRegression() {
  await connectDB();

  console.log('=== SECTION 10: VENDOR AUTO-FILL SIMULATION (6 CATEGORIES) ===\n');
  const sampleKeys = [
    { type: 'Electric Scooter', key: 'ather-450x-gen-3-3-7-kwh' },
    { type: 'Petrol Scooter', key: 'honda-activa-6g-deluxe-smart-key' },
    { type: 'Bike', key: 'royal-enfield-classic-350-halcyon-series' },
    { type: 'Hatchback', key: 'maruti-suzuki-swift-zxi-plus-dual-tone' },
    { type: 'Sedan', key: 'honda-city-zx-1-5-i-vtec-manual' },
    { type: 'SUV', key: 'mahindra-thar-4x4-lx-hard-top-diesel-at' }
  ];

  for (const s of sampleKeys) {
    const doc = await VehicleCatalog.findOne({ catalogKey: s.key }).populate('categoryId').lean();
    if (!doc) {
      console.log(`❌ Model not found: ${s.key}`);
      continue;
    }

    console.log(`[${s.type}] -> ${doc.brand} ${doc.model} (${doc.variant})`);
    console.log(`  - Category: ${doc.categoryId?.name} (slug: ${doc.categoryId?.slug})`);
    console.log(`  - Vehicle Type: ${doc.vehicleType}`);
    console.log(`  - Fuel Type: ${doc.fuelType}`);
    console.log(`  - Transmission: ${doc.transmission}`);
    console.log(`  - Seating Capacity: ${doc.seatingCapacity}`);
    console.log(`  - Engine/Battery Capacity: ${doc.engineCapacity} ${doc.fuelType === 'electric' ? 'kWh' : 'cc'}`);
    console.log(`  - Fuel Economy: ${doc.fuelEconomy.value} ${doc.fuelEconomy.unit}`);
    console.log(`  - Suggested Pricing: Hourly=₹${doc.suggestedPricing.hourlyRate}, 12h=₹${doc.suggestedPricing.rate12Hour}, 24h=₹${doc.suggestedPricing.rate24Hour}`);
    console.log(`  - Features Count: ${doc.features?.length} [${doc.features?.slice(0, 2).join(', ')}...]`);
    console.log(`  - Photography: ${doc.images?.[0]?.url?.slice(0, 45)}...`);
    console.log('');
  }

  console.log('=== SECTION 11: EXISTING PHYSICAL VEHICLES REGRESSION (3 VEHICLES) ===\n');
  const targetRegs = ['MP09TH4004', 'MP09EV2022', 'MP04CR7007'];
  for (const reg of targetRegs) {
    const v = await Vehicle.findOne({ registrationNumber: reg })
      .populate('categoryId')
      .populate('catalogId')
      .populate('vendorId')
      .lean();

    console.log(`Vehicle #${v.registrationNumber} (${v.brand} ${v.model}):`);
    console.log(`  - Status: ${v.status}`);
    console.log(`  - Location: ${v.location?.address}, ${v.location?.city}`);
    console.log(`  - Hourly Rate: ₹${v.pricing?.hourlyRate}`);
    console.log(`  - Linked Catalog ID: ${v.catalogId?._id}`);
    console.log(`  - Linked Catalog Model: ${v.catalogId?.brand} ${v.catalogId?.model} (${v.catalogId?.catalogKey})`);
    console.log(`  - Certified Economy: ${v.fuelEconomy} ${v.fuelEconomyUnit}`);
    console.log(`  - Identity Preserved: ${v.registrationNumber === reg && v.vendorId != null}`);
    console.log('');
  }

  console.log('=== SECTION 15: CLOUDINARY & CDN TRANSFORMATION TEST ===\n');
  const testUrls = [
    'https://res.cloudinary.com/rentride/image/upload/v1725400000/rentride/vehicles/sample.jpg',
    'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1200&q=80'
  ];

  for (const u of testUrls) {
    console.log(`Source URL: ${u.slice(0, 60)}...`);
    const thumb = getOptimizedImageUrl(u, 'thumbnail');
    const card = getOptimizedImageUrl(u, 'card');
    const detail = getOptimizedImageUrl(u, 'detail');
    console.log(`  -> Thumbnail (250px): ${thumb.slice(0, 85)}...`);
    console.log(`  -> Card (550px):      ${card.slice(0, 85)}...`);
    console.log(`  -> Detail (1200px):   ${detail.slice(0, 85)}...`);
    console.log('');
  }

  process.exit(0);
}

verifyAutofillAndRegression().catch(err => {
  console.error(err);
  process.exit(1);
});
