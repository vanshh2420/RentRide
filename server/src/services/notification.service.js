import { Notification } from '../models/notification.model.js';
import { ApiError } from '../utils/ApiError.js';

export class NotificationService {
  /**
   * Get notifications for the current logged-in user
   */
  static async getUserNotifications(userId, userRole, { page = 1, limit = 20 } = {}) {
    const query = {
      $or: [
        { recipientId: userId },
        { recipientRole: userRole, isGlobal: true }
      ]
    };

    const skip = (Number(page) - 1) * Number(limit);
    const [notifications, total, unreadCount] = await Promise.all([
      Notification.find(query).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      Notification.countDocuments(query),
      Notification.countDocuments({ ...query, isRead: false })
    ]);

    return {
      notifications,
      unreadCount,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit))
      }
    };
  }

  /**
   * Mark single notification as read
   */
  static async markAsRead(notificationId, userId) {
    const notification = await Notification.findById(notificationId);
    if (!notification) {
      throw new ApiError(404, 'Notification not found');
    }

    notification.isRead = true;
    await notification.save();
    return notification;
  }

  /**
   * Mark all user notifications as read
   */
  static async markAllAsRead(userId, userRole) {
    const query = {
      $or: [
        { recipientId: userId },
        { recipientRole: userRole, isGlobal: true }
      ],
      isRead: false
    };

    await Notification.updateMany(query, { $set: { isRead: true } });
    return { message: 'All notifications marked as read' };
  }
}
