import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '../../..');

// CLI Arguments
const args = process.argv.slice(2);
const isDryRun = args.includes('--dry-run');
const limitArg = args.find(a => a.startsWith('--limit='));
const batchArg = args.find(a => a.startsWith('--batch='));
const categoryArg = args.find(a => a.startsWith('--category='));

const limit = limitArg ? parseInt(limitArg.split('=')[1], 10) : null;
const batchSize = batchArg ? parseInt(batchArg.split('=')[1], 10) : 5;
const filterCategory = categoryArg ? categoryArg.split('=')[1] : null;

console.log('============================================================');
console.log(`  RENTRIDE CATALOG IMAGE MIGRATION`);
console.log(`  Mode: ${isDryRun ? '🔍 DRY RUN (Simulation - No Writes)' : '🚀 LIVE PRODUCTION MIGRATION'}`);
if (limit) console.log(`  Limit: ${limit} records`);
if (filterCategory) console.log(`  Category filter: ${filterCategory}`);
console.log('============================================================\n');

// Connect to MongoDB
let mongoUri = 'mongodb://127.0.0.1:27017/rentride';
const activeUriPath = path.resolve(__dirname, '../../.mongo-storage/active_uri.txt');
if (fs.existsSync(activeUriPath)) {
  const fileContent = fs.readFileSync(activeUriPath, 'utf8').trim();
  if (fileContent) mongoUri = fileContent;
}

await mongoose.connect(mongoUri);

const { VehicleCatalog } = await import('../models/catalog.model.js');
const { uploadToCloudinary, getOptimizedImageUrl } = await import('../config/cloudinary.js');

const registryPath = path.join(__dirname, '../data/catalog-model-images.json');
if (!fs.existsSync(registryPath)) {
  console.error(`[ERROR] Image registry file not found at ${registryPath}`);
  process.exit(1);
}

let registry = JSON.parse(fs.readFileSync(registryPath, 'utf8'));

if (filterCategory) {
  registry = registry.filter(r => r.categorySlug === filterCategory);
}
if (limit) {
  registry = registry.slice(0, limit);
}

console.log(`Ready to process ${registry.length} catalog items.\n`);

const summary = {
  totalProcessed: 0,
  uploaded: 0,
  reusedOrSkipped: 0,
  failed: 0,
  verifiedMappings: 0,
  unverifiedMappings: 0,
  mongoUpdates: 0
};

// Process in batches
for (let i = 0; i < registry.length; i += batchSize) {
  const batch = registry.slice(i, i + batchSize);
  console.log(`Processing batch ${Math.floor(i / batchSize) + 1} (${batch.length} items)...`);

  for (const item of batch) {
    summary.totalProcessed++;
    const doc = await VehicleCatalog.findOne({ catalogKey: item.catalogKey });
    if (!doc) {
      console.warn(`  [WARN] Catalog record not found in MongoDB: ${item.catalogKey}`);
      summary.failed++;
      continue;
    }

    // Check if already using Cloudinary
    const currentPrimary = doc.images?.find(img => img.isPrimary) || doc.images?.[0];
    if (currentPrimary?.url?.includes('res.cloudinary.com')) {
      console.log(`  [SKIP] Already migrated to Cloudinary: ${item.catalogKey}`);
      summary.reusedOrSkipped++;
      continue;
    }

    if (item.verificationStatus === 'VERIFIED') summary.verifiedMappings++;
    else summary.unverifiedMappings++;

    if (isDryRun) {
      console.log(`  [DRY-RUN] Would upload & update: [${item.catalogKey}] -> ${item.targetPublicId} (${item.verificationStatus})`);
      summary.uploaded++;
      summary.mongoUpdates++;
      continue;
    }

    // LIVE UPLOAD
    try {
      // Clean folder and filename separation for Cloudinary SDK
      const lastSlash = item.targetPublicId.lastIndexOf('/');
      const folder = item.targetPublicId.substring(0, lastSlash);
      const filename = item.targetPublicId.substring(lastSlash + 1);

      console.log(`  [UPLOADING] ${item.catalogKey} -> ${folder}/${filename}`);
      let uploadResult = null;
      let lastError = null;

      for (let attempt = 1; attempt <= 3; attempt++) {
        try {
          uploadResult = await uploadToCloudinary(item.sourceUrl, folder, {
            publicId: filename,
            overwrite: true
          });
          if (uploadResult?.url && !uploadResult.publicId?.startsWith('fallback_')) {
            break;
          }
        } catch (e) {
          lastError = e;
          if (attempt < 3) await new Promise(r => setTimeout(r, 1500 * attempt));
        }
      }

      if (!uploadResult || !uploadResult.url || uploadResult.publicId?.startsWith('fallback_')) {
        throw lastError || new Error('Cloudinary upload returned fallback URL');
      }

      // Verify HTTP accessibility with retry
      let fetchOk = false;
      for (let attempt = 1; attempt <= 2; attempt++) {
        try {
          const fetchCheck = await fetch(uploadResult.url);
          if (fetchCheck.ok) {
            fetchOk = true;
            break;
          }
        } catch (e) {
          if (attempt < 2) await new Promise(r => setTimeout(r, 1000));
        }
      }

      if (!fetchOk) {
        throw new Error('Cloudinary asset not HTTP accessible');
      }

      // Verify responsive transformation
      const transformedUrl = getOptimizedImageUrl(uploadResult.url, { width: 550, quality: 'auto', format: 'auto' });
      const transformCheck = await fetch(transformedUrl);
      if (!transformCheck.ok) {
        console.warn(`    [WARN] Transformed URL check returned status ${transformCheck.status}`);
      }

      // Atomic MongoDB update
      doc.images = [
        {
          url: uploadResult.url,
          publicId: uploadResult.publicId,
          isPrimary: true,
          altText: `${item.brand} ${item.model} ${item.variant}`.trim(),
          sourceUrl: item.sourceUrl,
          sourceProvider: item.sourceProvider,
          licenseStatus: item.licenseStatus,
          attribution: item.attribution,
          verificationStatus: item.verificationStatus
        }
      ];

      await doc.save();
      summary.uploaded++;
      summary.mongoUpdates++;
      console.log(`    [SUCCESS] Updated MongoDB: ${item.catalogKey} (${uploadResult.url.substring(0, 60)}...)`);

    } catch (err) {
      console.error(`    [FAILED] ${item.catalogKey}: ${err.message}`);
      summary.failed++;
    }
  }

  // Small delay between batches to be gentle with rate limits
  if (!isDryRun && i + batchSize < registry.length) {
    await new Promise(r => setTimeout(r, 600));
  }
}

console.log('\n============================================================');
console.log('  MIGRATION SUMMARY');
console.log('============================================================');
console.log(`  Total Processed        : ${summary.totalProcessed}`);
console.log(`  Uploads / Would Upload : ${summary.uploaded}`);
console.log(`  Reused / Skipped       : ${summary.reusedOrSkipped}`);
console.log(`  Failed                 : ${summary.failed}`);
console.log(`  MongoDB Updates        : ${summary.mongoUpdates}`);
console.log(`  Verified Mappings      : ${summary.verifiedMappings}`);
console.log(`  Unverified Mappings    : ${summary.unverifiedMappings}`);
console.log('============================================================\n');

await mongoose.disconnect();
