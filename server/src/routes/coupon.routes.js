import { Router } from 'express';
import { 
  createCoupon, 
  getAllCoupons, 
  getCouponById, 
  updateCoupon, 
  deleteCoupon, 
  toggleCouponStatus,
  validateCoupon
} from '../controllers/coupon.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { authorize } from '../middleware/role.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { 
  createCouponSchema, 
  updateCouponSchema, 
  validateCouponSchema 
} from '../validators/coupon.validator.js';
import { ROLES } from '../constants/roles.js';

const router = Router();

// Validate Coupon (Public/Authenticated)
router.post('/validate', validate(validateCouponSchema), validateCoupon);

// Protected: Admin & Vendor coupon listing
router.get('/', protect, authorize(ROLES.ADMIN, ROLES.VENDOR), getAllCoupons);

// Single Coupon Details
router.get('/:id', protect, authorize(ROLES.ADMIN), getCouponById);

// Admin Coupon Management
router.post('/', protect, authorize(ROLES.ADMIN), validate(createCouponSchema), createCoupon);
router.put('/:id', protect, authorize(ROLES.ADMIN), validate(updateCouponSchema), updateCoupon);
router.delete('/:id', protect, authorize(ROLES.ADMIN), deleteCoupon);
router.patch('/:id/status', protect, authorize(ROLES.ADMIN), toggleCouponStatus);

export default router;
