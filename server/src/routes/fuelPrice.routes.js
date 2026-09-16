import { Router } from 'express';
import { 
  getFuelPrices, 
  getCityFuelPrices, 
  estimateFuelCost, 
  updateFuelPrice 
} from '../controllers/fuelPrice.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { authorize } from '../middleware/role.middleware.js';
import { ROLES } from '../constants/roles.js';

const router = Router();

// Public / Authenticated discovery
router.get('/', getFuelPrices);
router.get('/:city', getCityFuelPrices);
router.post('/estimate', estimateFuelCost);

// Admin-only price management
router.put('/', protect, authorize(ROLES.ADMIN), updateFuelPrice);

export default router;
