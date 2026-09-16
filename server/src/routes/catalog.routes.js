import { Router } from 'express';
import {
  getCatalogModels,
  getDistinctBrands,
  getModelsByBrand,
  getCatalogModelByKey,
  getCatalogModelById,
  createCatalogModel,
  updateCatalogModel,
  deleteCatalogModel
} from '../controllers/catalog.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { authorize } from '../middleware/role.middleware.js';
import { ROLES } from '../constants/roles.js';

const router = Router();

// Public routes for vehicle discovery, vendor catalog picker, and model specs
router.get('/', getCatalogModels);
router.get('/brands', getDistinctBrands);
router.get('/brands/:brand/models', getModelsByBrand);
router.get('/key/:key', getCatalogModelByKey);
router.get('/:id', getCatalogModelById);

// Admin-only catalog management
router.post('/', protect, authorize(ROLES.ADMIN), createCatalogModel);
router.put('/:id', protect, authorize(ROLES.ADMIN), updateCatalogModel);
router.delete('/:id', protect, authorize(ROLES.ADMIN), deleteCatalogModel);

export default router;
