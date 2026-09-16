import { Router } from 'express';
import { 
  getAllCategories, 
  getCategoryById, 
  createCategory, 
  updateCategory, 
  deleteCategory 
} from '../controllers/category.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { authorize } from '../middleware/role.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { createCategorySchema, updateCategorySchema } from '../validators/category.validator.js';
import { ROLES } from '../constants/roles.js';

const router = Router();

// Public Category Routes
router.get('/', getAllCategories);
router.get('/:id', getCategoryById);

// Admin Category Management Routes
router.post('/', protect, authorize(ROLES.ADMIN), validate(createCategorySchema), createCategory);
router.put('/:id', protect, authorize(ROLES.ADMIN), validate(updateCategorySchema), updateCategory);
router.delete('/:id', protect, authorize(ROLES.ADMIN), deleteCategory);

export default router;
