import api from './api';

export const userApi = {
  /**
   * Get authenticated user's current profile
   */
  getProfile: async () => {
    return await api.get('/users/profile');
  },

  /**
   * Update profile information & avatar
   * @param {Object|FormData} profileData - Form data or JSON payload
   */
  updateProfile: async (profileData) => {
    const isFormData = profileData instanceof FormData;
    return await api.patch('/users/profile', profileData, {
      headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : {}
    });
  },

  /**
   * Change authenticated user password
   * @param {Object} passwordData - { currentPassword, newPassword, confirmPassword }
   */
  changePassword: async (passwordData) => {
    return await api.patch('/users/change-password', passwordData);
  }
};
