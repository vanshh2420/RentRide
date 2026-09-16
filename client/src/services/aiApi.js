import api from './api';

export const aiApi = {
  getRecommendations: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return await api.get(`/ai/recommendations?${query}`);
  },

  getDemandForecast: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return await api.get(`/ai/demand-forecast?${query}`);
  },

  getDynamicPricing: async (payload) => {
    return await api.post('/ai/dynamic-pricing', payload);
  },

  getPersonalizedOffers: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return await api.get(`/ai/personalized-offers${query ? `?${query}` : ''}`);
  },

  sendAssistantMessage: async (payload) => {
    return await api.post('/ai/assistant', payload);
  }
};
