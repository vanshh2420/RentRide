import api from './api';

export const authApi = {
  login: async (credentials) => {
    return await api.post('/auth/login', credentials);
  },

  register: async (userData) => {
    return await api.post('/auth/register', userData);
  },

  logout: async () => {
    return await api.post('/auth/logout');
  },

  getMe: async () => {
    return await api.get('/auth/me');
  },

  updateProfile: async (profileData) => {
    return await api.put('/auth/profile', profileData);
  },

  changePassword: async (passwordData) => {
    return await api.put('/auth/change-password', passwordData);
  }
};
