import api from './api';

export const bookingApi = {
  checkAvailability: async (payload) => {
    return await api.post('/bookings/check-availability', payload);
  },

  createOnlineBooking: async (payload) => {
    return await api.post('/bookings/online', payload);
  },

  getMyBookings: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return await api.get(`/bookings/my-bookings?${query}`);
  },

  getBookingById: async (id) => {
    return await api.get(`/bookings/${id}`);
  },

  cancelBooking: async (id, reason) => {
    return await api.post(`/bookings/${id}/cancel`, { reason });
  }
};
