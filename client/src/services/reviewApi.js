import api from './api';

export const reviewApi = {
  createReview: async (payload) => {
    return await api.post('/reviews', payload);
  },

  getVehicleReviews: async (vehicleId, params = {}) => {
    const query = new URLSearchParams(params).toString();
    return await api.get(`/reviews/vehicle/${vehicleId}?${query}`);
  }
};
