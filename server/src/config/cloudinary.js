import { v2 as cloudinary } from 'cloudinary';
import { ENV } from './env.js';
import { logger } from '../utils/logger.js';

const isConfigured = Boolean(
  ENV.CLOUDINARY_CLOUD_NAME &&
  ENV.CLOUDINARY_API_KEY &&
  ENV.CLOUDINARY_API_SECRET &&
  !ENV.CLOUDINARY_CLOUD_NAME.includes('your_cloud_name') &&
  !ENV.CLOUDINARY_API_KEY.includes('your_api_key')
);

// Configure Cloudinary
if (isConfigured) {
  cloudinary.config({
    cloud_name: ENV.CLOUDINARY_CLOUD_NAME,
    api_key: ENV.CLOUDINARY_API_KEY,
    api_secret: ENV.CLOUDINARY_API_SECRET,
    secure: true
  });
  logger.info('Cloudinary initialized for cloud asset storage');
} else {
  logger.warn('Cloudinary credentials not provided or placeholder in .env; using mock/fallback asset handling');
}

/**
 * Upload an image buffer or remote image URL to Cloudinary
 * @param {Buffer|string} fileBufferOrPath - File data buffer or remote URL
 * @param {string} folder - Destination folder (default: 'rentride/vehicles')
 * @param {object} options - Optional parameters: { publicId, tags, overwrite }
 */
export const uploadToCloudinary = async (fileBufferOrPath, folder = 'rentride/vehicles', options = {}) => {
  try {
    if (!isConfigured) {
      // Fallback for offline dev or placeholder environments
      const isRemoteUrl = typeof fileBufferOrPath === 'string' && fileBufferOrPath.startsWith('http');
      return {
        url: isRemoteUrl
          ? fileBufferOrPath
          : 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=800&q=80',
        publicId: options.publicId || `mock_${Date.now()}`
      };
    }

    const uploadOptions = {
      folder,
      resource_type: 'image',
      transformation: [{ width: 1400, height: 900, crop: 'limit', quality: 'auto:good', fetch_format: 'auto' }]
    };

    if (options.publicId) {
      uploadOptions.public_id = options.publicId;
      uploadOptions.overwrite = options.overwrite ?? true;
    }

    // If input is a remote HTTP URL or local file path string
    if (typeof fileBufferOrPath === 'string') {
      const result = await cloudinary.uploader.upload(fileBufferOrPath, uploadOptions);
      return {
        url: result.secure_url,
        publicId: result.public_id
      };
    }

    // Otherwise stream the Buffer
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(uploadOptions, (error, result) => {
        if (error) return reject(error);
        resolve({
          url: result.secure_url,
          publicId: result.public_id
        });
      });

      uploadStream.end(fileBufferOrPath);
    });
  } catch (error) {
    logger.error('Error uploading to Cloudinary:', error.message || error);
    // Graceful fallback to avoid halting bulk operations
    return {
      url: typeof fileBufferOrPath === 'string' && fileBufferOrPath.startsWith('http')
        ? fileBufferOrPath
        : 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=800&q=80',
      publicId: options.publicId || `fallback_${Date.now()}`
    };
  }
};

/**
 * Generate optimized Cloudinary delivery URL with dynamic transformations
 * @param {string} url - Original Cloudinary image URL
 * @param {object} transform - { width, height, crop, quality, format }
 */
export const getOptimizedImageUrl = (url, { width = 800, height, crop = 'limit', quality = 'auto', format = 'auto' } = {}) => {
  if (!url || !url.includes('cloudinary.com')) {
    return url;
  }

  const transformParts = [`f_${format}`, `q_${quality}`];
  if (width) transformParts.push(`w_${width}`);
  if (height) transformParts.push(`h_${height}`);
  if (crop) transformParts.push(`c_${crop}`);

  const transformString = transformParts.join(',');
  return url.replace('/upload/', `/upload/${transformString}/`);
};

/**
 * Delete an asset from Cloudinary
 * @param {string} publicId
 */
export const deleteFromCloudinary = async (publicId) => {
  try {
    if (!publicId || publicId.startsWith('mock_') || publicId.startsWith('fallback_') || !isConfigured) {
      return true;
    }
    await cloudinary.uploader.destroy(publicId);
    return true;
  } catch (error) {
    logger.error('Error deleting from Cloudinary:', error);
    return false;
  }
};

export default cloudinary;
