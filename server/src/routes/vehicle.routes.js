import { Router } from 'express';
import { 
  createVehicle, 
  updateVehicle, 
  deleteVehicle, 
  getVehicleById, 
  getMyVendorVehicles, 
  updateVehicleStatus,
  searchVehicles,
  getNearbyVehicles
} from '../controllers/vehicle.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { authorize } from '../middleware/role.middleware.js';
import { upload } from '../middleware/upload.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { 
  createVehicleSchema, 
  updateVehicleSchema, 
  updateVehicleStatusSchema,
  searchVehiclesSchema,
  nearbyVehiclesSchema
} from '../validators/vehicle.validator.js';
import { ROLES } from '../constants/roles.js';

const router = Router();

// Public Vehicle Search & Filter Engine
router.get('/', validate(searchVehiclesSchema), searchVehicles);

// Discover Nearest Available Vehicles (Feature E)
router.get('/nearby', validate(nearbyVehiclesSchema), getNearbyVehicles);

// Vendor Fleet List (Protected)
router.get('/vendor/my-vehicles', protect, authorize(ROLES.VENDOR, ROLES.ADMIN), getMyVendorVehicles);

// Single Vehicle Details (Public)
router.get('/:id', getVehicleById);

// Vendor/Admin Vehicle Management
router.post(
  '/',
  protect,
  authorize(ROLES.VENDOR, ROLES.ADMIN),
  upload.array('images', 5),
  validate(createVehicleSchema),
  createVehicle
);

router.put(
  '/:id',
  protect,
  authorize(ROLES.VENDOR, ROLES.ADMIN),
  validate(updateVehicleSchema),
  updateVehicle
);

router.delete(
  '/:id',
  protect,
  authorize(ROLES.VENDOR, ROLES.ADMIN),
  deleteVehicle
);

router.patch(
  '/:id/status',
  protect,
  authorize(ROLES.VENDOR, ROLES.ADMIN),
  validate(updateVehicleStatusSchema),
  updateVehicleStatus
);

export default router;
