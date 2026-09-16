import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { connectDB } from '../config/db.js';
import VehicleCatalog from '../models/catalog.model.js';
import { Category } from '../models/category.model.js';
import { Vehicle } from '../models/vehicle.model.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../../.env') });

async function runAudit() {
  console.log(`\n======================================================`);
  console.log(`  RentRide Master Catalog & Fleet Inventory Audit`);
  console.log(`======================================================\n`);

  await connectDB();

  try {
    const totalCatalog = await VehicleCatalog.countDocuments();
    const categories = await Category.find({}).lean();
    const totalVehicles = await Vehicle.countDocuments();

    console.log(`📊 MASTER CATALOG OVERVIEW`);
    console.log(`------------------------------------------------------`);
    console.log(`Total Verified Models in Catalog: ${totalCatalog}`);

    if (totalCatalog === 0) {
      console.log(`⚠️ Catalog is currently empty. Run: npm run import:catalog`);
    } else {
      // 1. Category Distribution
      console.log(`\n📁 Category Breakdown:`);
      for (const cat of categories) {
        const count = await VehicleCatalog.countDocuments({ categoryId: cat._id });
        console.log(`  - ${cat.name.padEnd(20)}: ${count} models`);
      }

      // Check unmapped
      const validCategoryIds = categories.map(c => c._id);
      const unmapped = await VehicleCatalog.countDocuments({ categoryId: { $nin: validCategoryIds } });
      if (unmapped > 0) {
        console.error(`  ❌ Unmapped Category Models: ${unmapped}`);
      } else {
        console.log(`  ✅ All models mapped to active Category IDs.`);
      }

      // 2. Fuel Type Distribution
      console.log(`\n⛽ Fuel Type Distribution:`);
      const fuelAgg = await VehicleCatalog.aggregate([
        { $group: { _id: '$fuelType', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]);
      fuelAgg.forEach(f => {
        console.log(`  - ${(f._id || 'unknown').padEnd(15)}: ${f.count} models`);
      });

      // 3. Vehicle Type Distribution
      console.log(`\n🏍️🚗 Vehicle Type Distribution:`);
      const typeAgg = await VehicleCatalog.aggregate([
        { $group: { _id: '$vehicleType', count: { $sum: 1 } } }
      ]);
      typeAgg.forEach(t => {
        console.log(`  - ${(t._id || 'unknown').padEnd(15)}: ${t.count} models`);
      });

      // 4. Transmission Distribution
      console.log(`\n⚙️ Transmission Distribution:`);
      const transAgg = await VehicleCatalog.aggregate([
        { $group: { _id: '$transmission', count: { $sum: 1 } } }
      ]);
      transAgg.forEach(t => {
        console.log(`  - ${(t._id || 'unknown').padEnd(15)}: ${t.count} models`);
      });

      // 5. Unique Brands Count
      const distinctBrands = await VehicleCatalog.distinct('brand');
      console.log(`\n🏷️ Unique Brands Represented: ${distinctBrands.length}`);
      console.log(`  ${distinctBrands.sort().join(', ')}`);

      // 6. Data Integrity Metrics
      const missingFuelEco = await VehicleCatalog.countDocuments({
        $or: [
          { 'fuelEconomy.value': { $exists: false } },
          { 'fuelEconomy.value': null },
          { 'fuelEconomy.value': { $lte: 0 } }
        ]
      });

      const missingImages = await VehicleCatalog.countDocuments({
        $or: [
          { images: { $size: 0 } },
          { images: { $exists: false } }
        ]
      });

      console.log(`\n🛡️ Data Integrity Verification:`);
      console.log(`  - Verified Fuel Economy Coverage: ${missingFuelEco === 0 ? '100% (0 missing)' : `${missingFuelEco} missing`}`);
      console.log(`  - Model Imagery Coverage:         ${missingImages === 0 ? '100% (0 missing)' : `${missingImages} missing`}`);
    }

    // 7. Physical Vehicles Fleet Audit
    console.log(`\n======================================================`);
    console.log(`🚘 PHYSICAL INVENTORY (RENTAL FLEET) AUDIT`);
    console.log(`------------------------------------------------------`);
    console.log(`Total Vendor Fleet Vehicles in Database: ${totalVehicles}`);

    const linkedVehicles = await Vehicle.countDocuments({ catalogId: { $exists: true, $ne: null } });
    const unlinkedVehicles = await Vehicle.countDocuments({ $or: [{ catalogId: { $exists: false } }, { catalogId: null }] });

    console.log(`  - Linked to Master Catalog:   ${linkedVehicles}`);
    console.log(`  - Standalone / Unlinked:      ${unlinkedVehicles}`);

    if (unlinkedVehicles > 0 && totalCatalog > 0) {
      console.log(`\n🔍 Checking auto-link candidates for unlinked fleet vehicles...`);
      const unlinkedList = await Vehicle.find({ $or: [{ catalogId: { $exists: false } }, { catalogId: null }] }).lean();
      let matchableCount = 0;

      for (const v of unlinkedList) {
        // Case-insensitive regex match on brand & model
        const match = await VehicleCatalog.findOne({
          brand: { $regex: new RegExp(`^${v.brand.trim()}$`, 'i') },
          model: { $regex: new RegExp(`^${v.model.trim()}$`, 'i') }
        });
        if (match) {
          matchableCount++;
          console.log(`  💡 [Match Found] Fleet #${v.registrationNumber} (${v.brand} ${v.model}) => Catalog: "${match.catalogKey}"`);
        }
      }
      console.log(`  Auto-linkable fleet vehicles: ${matchableCount}/${unlinkedVehicles}`);
    }

    console.log(`\n======================================================`);
    console.log(`  Audit Completed Successfully.`);
    console.log(`======================================================\n`);

  } catch (err) {
    console.error(`Audit error:`, err);
  } finally {
    await mongoose.connection.close();
    console.log('MongoDB connection closed.');
  }
}

runAudit();
