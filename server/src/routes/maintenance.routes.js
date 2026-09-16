import { Router } from 'express';
import { 
  scheduleMaintenance, 
  getVendorMaintenance, 
  completeMaintenance 
} from '../controllers/maintenance.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { authorize } from '../middleware/role.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { 
  scheduleMaintenanceSchema, 
  completeMaintenanceSchema 
} from '../validators/maintenance.validator.js';
import { ROLES } from '../constants/roles.js';

const router = Router();

// Protect all maintenance routes (Vendor and Admin)
router.use(protect, authorize(ROLES.VENDOR, ROLES.ADMIN));

router.get('/vendor', getVendorMaintenance);
router.post('/', validate(scheduleMaintenanceSchema), scheduleMaintenance);
router.patch('/:id/complete', validate(completeMaintenanceSchema), completeMaintenance);

export default router;
