import api from './api';

export const vendorApi = {
  createOfflineBooking: async (payload) => {
    return await api.post('/vendor/bookings/offline', payload);
  },

  getVendorBookings: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return await api.get(`/vendor/bookings?${query}`);
  },

  startTrip: async (bookingId, payload) => {
    return await api.post(`/vendor/bookings/${bookingId}/start-trip`, payload);
  },

  completeTrip: async (bookingId, payload) => {
    return await api.post(`/vendor/bookings/${bookingId}/complete-trip`, payload);
  },

  getVendorStats: async () => {
    return await api.get('/vendor/stats');
  }
};
