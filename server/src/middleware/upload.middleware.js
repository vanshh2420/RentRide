import multer from 'multer';
import { ApiError } from '../utils/ApiError.js';

// Memory storage keeps file buffers in memory for direct Cloudinary streaming
const storage = multer.memoryStorage();

// File filter: accept only jpeg, png, webp, and avif
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/avif'];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new ApiError(400, 'Invalid file type. Only JPG, PNG, WEBP, and AVIF images are allowed.'), false);
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5 MB max per file
  }
});
