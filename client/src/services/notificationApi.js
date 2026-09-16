import api from './api';

export const notificationApi = {
  getMyNotifications: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return await api.get(`/notifications?${query}`);
  },

  markAsRead: async (id) => {
    return await api.patch(`/notifications/${id}/read`);
  },

  markAllAsRead: async () => {
    return await api.patch('/notifications/read-all');
  }
};
