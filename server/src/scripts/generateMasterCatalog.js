import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import models definition or construct structured data
import { catalogDefinitions } from './catalogDefinitions.js';

console.log(`Compiling master vehicle catalog...`);
console.log(`Total model definitions found: ${catalogDefinitions.length}`);

// Ensure data directory exists
const dataDir = path.join(__dirname, '../data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Generate catalog keys and validate uniqueness
const catalog = [];
const seenKeys = new Set();

catalogDefinitions.forEach((item, index) => {
  const brandSlug = item.brand.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const modelSlug = item.model.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const variantSlug = item.variant ? item.variant.toLowerCase().replace(/[^a-z0-9]+/g, '-') : '';
  
  let baseKey = `${brandSlug}-${modelSlug}${variantSlug ? `-${variantSlug}` : ''}`.replace(/-+/g, '-').replace(/(^-|-$)/g, '');
  let catalogKey = baseKey;
  let counter = 1;
  while (seenKeys.has(catalogKey)) {
    catalogKey = `${baseKey}-${counter}`;
    counter++;
  }
  seenKeys.add(catalogKey);

  catalog.push({
    catalogKey,
    brand: item.brand,
    model: item.model,
    variant: item.variant || '',
    categorySlug: item.categorySlug,
    vehicleType: item.vehicleType,
    fuelType: item.fuelType,
    transmission: item.transmission,
    seatingCapacity: item.seatingCapacity,
    engineCapacity: item.engineCapacity,
    fuelEconomy: {
      value: item.fuelEconomyValue,
      unit: item.fuelEconomyUnit,
      source: 'ARAI / Manufacturer Certified'
    },
    features: item.features || [],
    specifications: item.specs || {},
    images: [
      {
        url: item.imageUrl,
        publicId: `rentride/catalog/${catalogKey}`,
        isPrimary: true,
        altText: `${item.brand} ${item.model} ${item.variant || ''}`.trim()
      }
    ],
    suggestedPricing: item.pricing || {
      hourlyRate: 80,
      rate12Hour: 500,
      rate24Hour: 850
    },
    isActive: true
  });
});

const outputPath = path.join(dataDir, 'vehicle-catalog.json');
fs.writeFileSync(outputPath, JSON.stringify(catalog, null, 2), 'utf-8');
console.log(`Successfully generated ${catalog.length} verified vehicle catalog models.`);
console.log(`Saved to: ${outputPath}`);
