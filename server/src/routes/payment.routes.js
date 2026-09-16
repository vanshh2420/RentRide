import { Router } from 'express';
import { 
  createRazorpayOrder, 
  verifyPayment, 
  handlePaymentFailure, 
  getPaymentHistory 
} from '../controllers/payment.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { 
  createOrderSchema, 
  verifyPaymentSchema, 
  handlePaymentFailureSchema 
} from '../validators/payment.validator.js';

const router = Router();

// Protect all payment routes
router.use(protect);

// Razorpay Order Creation & Verification
router.post('/razorpay/create-order', validate(createOrderSchema), createRazorpayOrder);
router.post('/razorpay/verify', validate(verifyPaymentSchema), verifyPayment);
router.post('/razorpay/fail', validate(handlePaymentFailureSchema), handlePaymentFailure);

// User Payment History
router.get('/history', getPaymentHistory);

export default router;
