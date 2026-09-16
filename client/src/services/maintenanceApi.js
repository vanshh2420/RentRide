import api from './api';

export const maintenanceApi = {
  scheduleMaintenance: async (payload) => {
    return await api.post('/maintenance', payload);
  },

  getVendorMaintenance: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return await api.get(`/maintenance/vendor?${query}`);
  },

  completeMaintenance: async (id, payload) => {
    return await api.patch(`/maintenance/${id}/complete`, payload);
  }
};
