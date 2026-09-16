import { Router } from 'express';
import { 
  getMyNotifications, 
  markNotificationRead, 
  markAllNotificationsRead 
} from '../controllers/notification.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = Router();

// Protect all notification routes
router.use(protect);

router.get('/', getMyNotifications);
router.patch('/read-all', markAllNotificationsRead);
router.patch('/:id/read', markNotificationRead);

export default router;
