import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config();

export const ENV = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173',
  
  MONGODB_URI: (process.env.MONGODB_URI || process.env.MONGO_URI || '').trim().replace(/[<>]/g, ''),
  
  JWT_SECRET: process.env.JWT_SECRET || 'rentride_fallback_secret_key_change_me',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  JWT_COOKIE_EXPIRES_IN: Number(process.env.JWT_COOKIE_EXPIRES_IN) || 7,
  
  RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID || '',
  RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET || '',
  RAZORPAY_WEBHOOK_SECRET: process.env.RAZORPAY_WEBHOOK_SECRET || '',
  
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME || '',
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY || '',
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET || '',
  
  AI_SERVICE_URL: process.env.AI_SERVICE_URL || 'http://localhost:8000',
  AI_SERVICE_API_KEY: process.env.AI_SERVICE_API_KEY || 'rentride_ai_internal_secret_key_2026',
  
  PLATFORM_COMMISSION_RATE: Number(process.env.PLATFORM_COMMISSION_RATE) || 0.12,
  PLATFORM_FEE_RATE: Number(process.env.PLATFORM_FEE_RATE) || 0.05,
  GST_RATE: Number(process.env.GST_RATE) || 0.18
};
