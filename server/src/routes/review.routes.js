import { Router } from 'express';
import { createReview, getVehicleReviews } from '../controllers/review.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { createReviewSchema } from '../validators/review.validator.js';

const router = Router();

// Public: Get reviews for a vehicle
router.get('/vehicle/:vehicleId', getVehicleReviews);

// Protected: Submit verified customer review
router.post('/', protect, validate(createReviewSchema), createReview);

export default router;
