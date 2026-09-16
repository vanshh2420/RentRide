import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const catalogPath = path.join(__dirname, '../data/vehicle-catalog.json');

export function validateCatalog(records) {
  const errors = [];
  const warnings = [];
  const seenKeys = new Set();

  const validFuelTypes = ['petrol', 'diesel', 'electric', 'cng', 'hybrid'];
  const validVehicleTypes = ['two_wheeler', 'four_wheeler'];
  const validTransmissions = ['manual', 'automatic'];
  const validCategorySlugs = ['electric-scooters', 'scooters', 'bikes', 'hatchbacks', 'sedans', 'suvs'];

  records.forEach((item, index) => {
    const loc = `[Record #${index + 1} | ${item.brand || 'Unknown'} ${item.model || 'Unknown'} (${item.variant || 'Standard'})]`;

    // 1. Required string identifiers
    if (!item.brand || typeof item.brand !== 'string') errors.push(`${loc} Missing or invalid 'brand'`);
    if (!item.model || typeof item.model !== 'string') errors.push(`${loc} Missing or invalid 'model'`);
    if (!item.variant || typeof item.variant !== 'string') errors.push(`${loc} Missing or invalid 'variant'`);
    if (!item.catalogKey || typeof item.catalogKey !== 'string') errors.push(`${loc} Missing or invalid 'catalogKey'`);

    // 2. Key Uniqueness
    if (item.catalogKey) {
      if (seenKeys.has(item.catalogKey)) {
        errors.push(`${loc} Duplicate catalogKey found: "${item.catalogKey}"`);
      } else {
        seenKeys.add(item.catalogKey);
      }
    }

    // 3. Category & Vehicle Type
    if (!validCategorySlugs.includes(item.categorySlug)) {
      errors.push(`${loc} Invalid categorySlug: "${item.categorySlug}". Allowed: ${validCategorySlugs.join(', ')}`);
    }
    if (!validVehicleTypes.includes(item.vehicleType)) {
      errors.push(`${loc} Invalid vehicleType: "${item.vehicleType}". Allowed: ${validVehicleTypes.join(', ')}`);
    }

    // 4. Fuel & Transmission
    if (!validFuelTypes.includes(item.fuelType)) {
      errors.push(`${loc} Invalid fuelType: "${item.fuelType}". Allowed: ${validFuelTypes.join(', ')}`);
    }
    if (!validTransmissions.includes(item.transmission)) {
      errors.push(`${loc} Invalid transmission: "${item.transmission}". Allowed: ${validTransmissions.join(', ')}`);
    }

    // 5. Seating Capacity
    if (!item.seatingCapacity || typeof item.seatingCapacity !== 'number' || item.seatingCapacity < 1) {
      errors.push(`${loc} Invalid seatingCapacity: ${item.seatingCapacity}`);
    }

    // 6. Fuel Economy & Specs validation
    if (!item.fuelEconomy || typeof item.fuelEconomy.value !== 'number' || item.fuelEconomy.value <= 0) {
      errors.push(`${loc} Missing or invalid fuelEconomy.value`);
    }

    if (item.fuelType === 'electric') {
      if (item.fuelEconomy && item.fuelEconomy.unit !== 'km/charge') {
        errors.push(`${loc} Electric vehicle must use 'km/charge', found '${item.fuelEconomy?.unit}'`);
      }
      if (item.specifications?.fuelTankCapacityLiters) {
        errors.push(`${loc} Electric vehicle must NOT have fuelTankCapacityLiters`);
      }
      if (!item.specifications?.batteryCapacityKwh && !item.engineCapacity) {
        warnings.push(`${loc} Electric vehicle missing battery capacity metric`);
      }
    } else if (item.fuelType === 'cng') {
      if (item.fuelEconomy && item.fuelEconomy.unit !== 'km/kg') {
        errors.push(`${loc} CNG vehicle must use 'km/kg', found '${item.fuelEconomy?.unit}'`);
      }
    } else {
      if (item.fuelEconomy && item.fuelEconomy.unit !== 'km/l') {
        errors.push(`${loc} Combustion vehicle must use 'km/l', found '${item.fuelEconomy?.unit}'`);
      }
    }

    // 7. Suggested Pricing
    if (!item.suggestedPricing) {
      errors.push(`${loc} Missing suggestedPricing object`);
    } else {
      const { hourlyRate, rate12Hour, rate24Hour } = item.suggestedPricing;
      if (typeof hourlyRate !== 'number' || hourlyRate <= 0) errors.push(`${loc} Invalid suggestedPricing.hourlyRate`);
      if (typeof rate12Hour !== 'number' || rate12Hour <= 0) errors.push(`${loc} Invalid suggestedPricing.rate12Hour`);
      if (typeof rate24Hour !== 'number' || rate24Hour <= 0) errors.push(`${loc} Invalid suggestedPricing.rate24Hour`);

      if (hourlyRate && rate12Hour && rate12Hour >= hourlyRate * 12) {
        warnings.push(`${loc} rate12Hour (${rate12Hour}) is not discounted compared to 12 * hourlyRate (${hourlyRate * 12})`);
      }
      if (rate12Hour && rate24Hour && rate24Hour >= rate12Hour * 2) {
        warnings.push(`${loc} rate24Hour (${rate24Hour}) is not discounted compared to 2 * rate12Hour (${rate12Hour * 2})`);
      }
    }

    // 8. Images
    if (!Array.isArray(item.images) || item.images.length === 0) {
      warnings.push(`${loc} No images specified for model`);
    }
  });

  return {
    total: records.length,
    valid: errors.length === 0,
    errors,
    warnings,
    uniqueKeys: seenKeys.size
  };
}

// CLI Execution
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  console.log(`\n======================================================`);
  console.log(`  RentRide Master Catalog Dataset Validation CLI`);
  console.log(`======================================================`);

  if (!fs.existsSync(catalogPath)) {
    console.error(`❌ Catalog data file not found at: ${catalogPath}`);
    console.error(`Please run: node server/src/scripts/generateMasterCatalogData.js first.`);
    process.exit(1);
  }

  try {
    const raw = fs.readFileSync(catalogPath, 'utf-8');
    const records = JSON.parse(raw);
    console.log(`Auditing ${records.length} catalog records from:\n${catalogPath}...\n`);

    const result = validateCatalog(records);

    if (result.warnings.length > 0) {
      console.log(`⚠️  ${result.warnings.length} Warnings detected:`);
      result.warnings.slice(0, 10).forEach(w => console.log(`   - ${w}`));
      if (result.warnings.length > 10) {
        console.log(`   ... and ${result.warnings.length - 10} more warnings.`);
      }
      console.log('');
    }

    if (result.errors.length > 0) {
      console.error(`❌ Validation FAILED with ${result.errors.length} error(s):`);
      result.errors.slice(0, 20).forEach(e => console.error(`   - ${e}`));
      if (result.errors.length > 20) {
        console.error(`   ... and ${result.errors.length - 20} more errors.`);
      }
      console.log('\nPlease fix the errors in generator script and re-run.');
      process.exit(1);
    } else {
      console.log(`✅ Validation PASSED!`);
      console.log(`   - Total Records Checked: ${result.total}`);
      console.log(`   - Unique Catalog Keys:   ${result.uniqueKeys}`);
      console.log(`   - Zero Schema or Logical Inconsistencies Detected.`);
      console.log(`======================================================\n`);
      process.exit(0);
    }
  } catch (err) {
    console.error(`❌ Unexpected error during validation:`, err.message);
    process.exit(1);
  }
}
