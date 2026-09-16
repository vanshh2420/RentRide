import api from './api';

export const adminApi = {
  // Platform Overview & Financial KPIs
  getPlatformStats: async () => {
    return await api.get('/admin/dashboard');
  },

  // User Governance
  getAllUsers: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return await api.get(`/admin/users?${query}`);
  },

  getUserById: async (id) => {
    return await api.get(`/admin/users/${id}`);
  },

  updateUserStatus: async (id, payload) => {
    return await api.patch(`/admin/users/${id}/status`, payload);
  },

  // Vendor Governance
  getAllVendors: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return await api.get(`/admin/vendors?${query}`);
  },

  getVendorById: async (id) => {
    return await api.get(`/admin/vendors/${id}`);
  },

  approveVendor: async (id, payload = {}) => {
    return await api.patch(`/admin/vendors/${id}/approve`, payload);
  },

  rejectVendor: async (id, payload = {}) => {
    return await api.patch(`/admin/vendors/${id}/reject`, payload);
  },

  suspendVendor: async (id, payload = {}) => {
    return await api.patch(`/admin/vendors/${id}/suspend`, payload);
  },

  activateVendor: async (id, payload = {}) => {
    return await api.patch(`/admin/vendors/${id}/activate`, payload);
  },

  // Fleet & Vehicle Management
  getAllVehicles: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return await api.get(`/admin/vehicles?${query}`);
  },

  getVehicleById: async (id) => {
    return await api.get(`/admin/vehicles/${id}`);
  },

  approveOrRejectVehicle: async (id, payload) => {
    return await api.patch(`/admin/vehicles/${id}/approval`, payload);
  },

  approveVehicle: async (id, payload = {}) => {
    return await api.patch(`/admin/vehicles/${id}/approve`, payload);
  },

  rejectVehicle: async (id, payload = {}) => {
    return await api.patch(`/admin/vehicles/${id}/reject`, payload);
  },

  activateVehicle: async (id, payload = {}) => {
    return await api.patch(`/admin/vehicles/${id}/activate`, payload);
  },

  deactivateVehicle: async (id, payload = {}) => {
    return await api.patch(`/admin/vehicles/${id}/deactivate`, payload);
  },

  // Bookings Audit
  getAllBookings: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return await api.get(`/admin/bookings?${query}`);
  },

  getBookingById: async (id) => {
    return await api.get(`/admin/bookings/${id}`);
  },

  // Payment Audit
  getAllPayments: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return await api.get(`/admin/payments?${query}`);
  },

  getPaymentById: async (id) => {
    return await api.get(`/admin/payments/${id}`);
  },

  // Fleet Maintenance
  getAllMaintenance: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return await api.get(`/admin/maintenance?${query}`);
  },

  // Reviews Moderation
  getAllReviews: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return await api.get(`/admin/reviews?${query}`);
  },

  moderateReview: async (id, payload) => {
    return await api.patch(`/admin/reviews/${id}/moderate`, payload);
  }
};
