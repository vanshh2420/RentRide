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

const { VehicleCatalog } = await import('../models/catalog.model.js');

console.log('============================================================');
console.log('  RENTRIDE VEHICLE CATALOG IMAGE AUDIT');
console.log('============================================================\n');

const totalRecords = await VehicleCatalog.countDocuments();
const allDocs = await VehicleCatalog.find({}).lean();

let cloudinaryImages = 0;
let nonCloudinaryImages = 0;
let verifiedMappings = 0;
let unverifiedMappings = 0;
let knownLicensing = 0;
let unknownLicensing = 0;

const urlFrequency = new Map();
const pidFrequency = new Map();

allDocs.forEach(doc => {
  const primaryImg = doc.images?.find(i => i.isPrimary) || doc.images?.[0];
  if (!primaryImg) return;

  const url = primaryImg.url || '';
  const pid = primaryImg.publicId || '';

  if (url.includes('res.cloudinary.com')) {
    cloudinaryImages++;
  } else {
    nonCloudinaryImages++;
  }

  if (primaryImg.verificationStatus === 'VERIFIED') {
    verifiedMappings++;
  } else {
    unverifiedMappings++;
  }

  if (primaryImg.licenseStatus && primaryImg.licenseStatus !== 'UNKNOWN') {
    knownLicensing++;
  } else {
    unknownLicensing++;
  }

  if (url) urlFrequency.set(url, (urlFrequency.get(url) || 0) + 1);
  if (pid) pidFrequency.set(pid, (pidFrequency.get(pid) || 0) + 1);
});

let duplicateUrlCount = 0;
urlFrequency.forEach(count => {
  if (count > 1) duplicateUrlCount += (count - 1);
});

let duplicatePidCount = 0;
pidFrequency.forEach(count => {
  if (count > 1) duplicatePidCount += (count - 1);
});

console.log(`Total catalog records          : ${totalRecords}`);
console.log(`Cloudinary images              : ${cloudinaryImages} (${((cloudinaryImages/totalRecords)*100).toFixed(1)}%)`);
console.log(`Non-Cloudinary images          : ${nonCloudinaryImages}`);
console.log(`Distinct image URLs            : ${urlFrequency.size}`);
console.log(`Duplicate image URL instances  : ${duplicateUrlCount}`);
console.log(`Distinct public IDs            : ${pidFrequency.size}`);
console.log(`Duplicate public ID instances  : ${duplicatePidCount}`);
console.log(`Verified model mappings        : ${verifiedMappings}`);
console.log(`Unverified model mappings      : ${unverifiedMappings}`);
console.log(`Images with known licensing    : ${knownLicensing}`);
console.log(`Images with unknown licensing  : ${unknownLicensing}`);

console.log('\n============================================================');
await mongoose.disconnect();
