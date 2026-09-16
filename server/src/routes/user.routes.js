import { Router } from 'express';
import { getProfile, updateProfile, changePassword } from '../controllers/user.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { upload } from '../middleware/upload.middleware.js';
import { updateUserProfileSchema, changeUserPasswordSchema } from '../validators/user.validator.js';

const router = Router();

// Protect all user profile endpoints with JWT authentication
router.use(protect);

// View Authenticated User Profile
router.get('/profile', getProfile);

// Update Authenticated User Profile (supports multipart avatar image upload)
router.patch('/profile', upload.single('avatar'), validate(updateUserProfileSchema), updateProfile);
router.put('/profile', upload.single('avatar'), validate(updateUserProfileSchema), updateProfile);

// Change Authenticated User Password
router.patch('/change-password', validate(changeUserPasswordSchema), changePassword);
router.put('/change-password', validate(changeUserPasswordSchema), changePassword);

export default router;
