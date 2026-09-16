import api from './api';

export const paymentApi = {
  createRazorpayOrder: async (bookingId) => {
    return await api.post('/payments/razorpay/create-order', { bookingId });
  },

  verifyPayment: async (payload) => {
    return await api.post('/payments/razorpay/verify', payload);
  },

  reportPaymentFailure: async (payload) => {
    return await api.post('/payments/razorpay/fail', payload);
  },

  getPaymentHistory: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return await api.get(`/payments/history?${query}`);
  }
};
