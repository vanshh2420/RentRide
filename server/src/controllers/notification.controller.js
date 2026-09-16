import { NotificationService } from '../services/notification.service.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getMyNotifications = asyncHandler(async (req, res) => {
  const { page, limit } = req.query;
  const result = await NotificationService.getUserNotifications(req.user._id, req.user.role, { page, limit });
  return res.status(200).json(new ApiResponse(200, result, 'Notifications retrieved successfully'));
});

export const markNotificationRead = asyncHandler(async (req, res) => {
  const notification = await NotificationService.markAsRead(req.params.id, req.user._id);
  return res.status(200).json(new ApiResponse(200, { notification }, 'Notification marked as read'));
});

export const markAllNotificationsRead = asyncHandler(async (req, res) => {
  const result = await NotificationService.markAllAsRead(req.user._id, req.user.role);
  return res.status(200).json(new ApiResponse(200, result, 'All notifications marked as read'));
});
