import api from './api';

export const vehicleApi = {
  searchVehicles: async (params = {}, options = {}) => {
    const cleanParams = {};
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined && v !== null && v !== '' && v !== 'all') {
        cleanParams[k] = v;
      }
    }
    const query = new URLSearchParams(cleanParams).toString();
    return await api.get(`/vehicles${query ? `?${query}` : ''}`, options);
  },

  getNearbyVehicles: async (params = {}, options = {}) => {
    const cleanParams = {};
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined && v !== null && v !== '' && v !== 'all') {
        cleanParams[k] = v;
      }
    }
    const query = new URLSearchParams(cleanParams).toString();
    return await api.get(`/vehicles/nearby${query ? `?${query}` : ''}`, options);
  },

  getVehicleById: async (id) => {
    return await api.get(`/vehicles/${id}`);
  },

  getVendorVehicles: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return await api.get(`/vehicles/vendor/my-vehicles?${query}`);
  },

  createVehicle: async (formData) => {
    return await api.post('/vehicles', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },

  updateVehicle: async (id, vehicleData) => {
    return await api.put(`/vehicles/${id}`, vehicleData);
  },

  deleteVehicle: async (id) => {
    return await api.delete(`/vehicles/${id}`);
  },

  updateVehicleStatus: async (id, status) => {
    return await api.patch(`/vehicles/${id}/status`, { status });
  }
};
