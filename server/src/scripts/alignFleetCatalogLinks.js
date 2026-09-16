import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '../../..');

// Connect to MongoDB
let mongoUri = 'mongodb://127.0.0.1:27017/rentride';
const activeUriPath = path.resolve(__dirname, '../../.mongo-storage/active_uri.txt');
if (fs.existsSync(activeUriPath)) {
  const fileContent = fs.readFileSync(activeUriPath, 'utf8').trim();
  if (fileContent) mongoUri = fileContent;
}

await mongoose.connect(mongoUri);

const { Vehicle } = await import('../models/vehicle.model.js');
const { VehicleCatalog } = await import('../models/catalog.model.js');

console.log('=== RENTRIDE: REALIGNING PHYSICAL FLEET CATALOG LINKS ===\n');

const fleetCorrections = [
  {
    reg: 'MP09CT5555',
    expectedPhysical: 'Honda City ZX e:HEV Hybrid',
    targetCatalogKey: 'honda-city-e-hev-hybrid-zx-e-cvt',
    rationale: 'Physical vehicle is Hybrid e:HEV; re-linked from Petrol Manual to exact e:HEV Hybrid ZX e-CVT'
  },
  {
    reg: 'MP09AC6006',
    expectedPhysical: 'Honda Activa 6G Smart',
    targetCatalogKey: 'honda-activa-6g-deluxe-smart-key',
    rationale: 'Physical vehicle is 109.5cc Activa 6G Smart; re-linked from Activa 125 to exact Activa 6G Deluxe Smart Key'
  },
  {
    reg: 'MP04OL3003',
    expectedPhysical: 'Ola S1 Pro Gen 2',
    targetCatalogKey: 'ola-electric-s1-pro-gen-2-4-0-kwh',
    rationale: 'Physical vehicle is 4.0 kWh S1 Pro Gen 2; re-linked from S1 Air 3.0 kWh to exact S1 Pro Gen 2 4.0 kWh'
  },
  {
    reg: 'MP07DI1250',
    expectedPhysical: 'Honda Dio 125 Smart',
    targetCatalogKey: 'honda-dio-125-smart-125cc',
    rationale: 'Physical vehicle is 123.9cc Dio 125 Smart; re-linked from Dio 110 Sports Edition to exact Dio 125 Smart'
  },
  {
    reg: 'MP04JP5005',
    expectedPhysical: 'TVS Jupiter 125 SmartXonnect',
    targetCatalogKey: 'tvs-jupiter-125-disc-with-33l-boot',
    rationale: 'Physical vehicle is 124.8cc Jupiter 125; re-linked from Jupiter 110 ZX to exact Jupiter 125 Disc'
  }
];

let correctedCount = 0;

for (const corr of fleetCorrections) {
  const vehicle = await Vehicle.findOne({ registrationNumber: corr.reg });
  if (!vehicle) {
    console.warn(`[WARN] Vehicle with registration ${corr.reg} not found!`);
    continue;
  }

  const targetCatalog = await VehicleCatalog.findOne({ catalogKey: corr.targetCatalogKey });
  if (!targetCatalog) {
    console.error(`[ERROR] Target catalog model ${corr.targetCatalogKey} not found!`);
    continue;
  }

  const previousCatalogId = vehicle.catalogId;
  vehicle.catalogId = targetCatalog._id;
  await vehicle.save();
  correctedCount++;

  console.log(`[REALIGNED] [${corr.reg}] "${vehicle.brand} ${vehicle.model}"`);
  console.log(`  Previous catalogId: ${previousCatalogId}`);
  console.log(`  New catalogId:      ${targetCatalog._id} (${targetCatalog.catalogKey})`);
  console.log(`  Rationale:          ${corr.rationale}\n`);
}

console.log(`Total physical fleet realignments completed: ${correctedCount}/5`);
await mongoose.disconnect();
