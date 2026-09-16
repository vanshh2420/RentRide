import api from './api';

export const couponApi = {
  validateCoupon: async (code, bookingAmount) => {
    return await api.post('/coupons/validate', { code, bookingAmount });
  },

  getAllCoupons: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return await api.get(`/coupons?${query}`);
  },

  createCoupon: async (couponData) => {
    return await api.post('/coupons', couponData);
  },

  updateCoupon: async (id, couponData) => {
    return await api.put(`/coupons/${id}`, couponData);
  },

  deleteCoupon: async (id) => {
    return await api.delete(`/coupons/${id}`);
  },

  toggleCouponStatus: async (id) => {
    return await api.patch(`/coupons/${id}/status`);
  }
};
