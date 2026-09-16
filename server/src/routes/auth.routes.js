import { Router } from 'express';
import { 
  register, 
  login, 
  logout, 
  getMe, 
  updateProfile, 
  changePassword 
} from '../controllers/auth.controller.js';
import { validate } from '../middleware/validate.middleware.js';
import { 
  registerSchema, 
  loginSchema, 
  updateProfileSchema, 
  changePasswordSchema 
} from '../validators/auth.validator.js';
import { protect } from '../middleware/auth.middleware.js';
import { authRateLimiter } from '../middleware/rateLimiter.middleware.js';

const router = Router();

// Public routes (Rate-limited)
router.post('/register', authRateLimiter, validate(registerSchema), register);
router.post('/login', authRateLimiter, validate(loginSchema), login);
router.post('/logout', logout);

// Protected user routes
router.get('/me', protect, getMe);
router.put('/profile', protect, validate(updateProfileSchema), updateProfile);
router.put('/change-password', protect, validate(changePasswordSchema), changePassword);

export default router;
