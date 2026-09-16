import { connectDB } from '../config/db.js';
import { v2 as cloudinary } from 'cloudinary';
import { ENV } from '../config/env.js';
import mongoose from 'mongoose';

async function testConnections() {
  console.log('\n==============================================');
  console.log('🔍 TESTING MONGODB & CLOUDINARY CONNECTIONS');
  console.log('==============================================\n');

  // --- 1. MONGODB TEST ---
  console.log('1️⃣ Testing MongoDB Connection...');
  let mongoStatus = 'UNKNOWN';
  let mongoDetails = {};
  try {
    const conn = await connectDB();
    const adminDb = mongoose.connection.db.admin();
    const pingResult = await adminDb.ping();
    const collections = await mongoose.connection.db.listCollections().toArray();
    
    // Test write and delete
    const testCol = mongoose.connection.db.collection('__connection_test__');
    const writeRes = await testCol.insertOne({ test: true, timestamp: new Date() });
    await testCol.deleteOne({ _id: writeRes.insertedId });

    mongoStatus = 'SUCCESS';
    mongoDetails = {
      host: mongoose.connection.host,
      database: mongoose.connection.name,
      readyState: mongoose.connection.readyState,
      ping: pingResult,
      collectionCount: collections.length,
      collections: collections.map(c => c.name),
      readWriteTest: 'PASSED'
    };
    console.log('  ✅ MongoDB Connected & Read/Write Test Passed!');
    console.log('     Host:', mongoDetails.host);
    console.log('     Database:', mongoDetails.database);
    console.log('     Collections found:', collections.map(c => c.name).join(', '));
  } catch (err) {
    mongoStatus = 'FAILED';
    mongoDetails = { error: err.message, stack: err.stack };
    console.error('  ❌ MongoDB Connection FAILED:', err.message);
  }

  // --- 2. CLOUDINARY TEST ---
  console.log('\n2️⃣ Testing Cloudinary Connection...');
  let cloudinaryStatus = 'UNKNOWN';
  let cloudinaryDetails = {};
  try {
    console.log('     Cloud Name:', ENV.CLOUDINARY_CLOUD_NAME);
    console.log('     API Key:', ENV.CLOUDINARY_API_KEY ? `${ENV.CLOUDINARY_API_KEY.slice(0, 5)}...` : 'NONE');

    cloudinary.config({
      cloud_name: ENV.CLOUDINARY_CLOUD_NAME,
      api_key: ENV.CLOUDINARY_API_KEY,
      api_secret: ENV.CLOUDINARY_API_SECRET,
      secure: true
    });

    // Cloudinary ping API
    const pingRes = await cloudinary.api.ping();
    console.log('     Cloudinary Ping Response:', pingRes);

    // Test a real small 1x1 pixel image upload to test write permissions
    const sampleBase64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
    const uploadRes = await cloudinary.uploader.upload(sampleBase64, {
      folder: 'rentride/test',
      public_id: `test_${Date.now()}`
    });
    console.log('     Cloudinary Upload Test Succeeded! URL:', uploadRes.secure_url);

    // Cleanup test upload
    await cloudinary.uploader.destroy(uploadRes.public_id);
    console.log('     Cloudinary Test Image Cleaned Up.');

    cloudinaryStatus = 'SUCCESS';
    cloudinaryDetails = {
      cloudName: ENV.CLOUDINARY_CLOUD_NAME,
      ping: pingRes,
      testUploadUrl: uploadRes.secure_url,
      uploadAndDestroy: 'PASSED'
    };
    console.log('  ✅ Cloudinary Connected & Upload/Delete Test Passed!');
  } catch (err) {
    cloudinaryStatus = 'FAILED';
    cloudinaryDetails = {
      error: err.message,
      http_code: err.http_code,
      name: err.name
    };
    console.error('  ❌ Cloudinary Connection FAILED:', err.message, err.http_code ? `(HTTP ${err.http_code})` : '');
  }

  console.log('\n==============================================');
  console.log('📋 SUMMARY:');
  console.log(`  MongoDB:    ${mongoStatus}`);
  console.log(`  Cloudinary: ${cloudinaryStatus}`);
  console.log('==============================================\n');

  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.close();
  }
  process.exit(mongoStatus === 'SUCCESS' && cloudinaryStatus === 'SUCCESS' ? 0 : 1);
}

testConnections();
