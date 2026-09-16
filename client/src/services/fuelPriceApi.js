import api from './api';

export const fuelPriceApi = {
  getFuelPrices: async (city = 'Indore') => {
    return await api.get(`/fuel-prices?city=${encodeURIComponent(city)}`);
  },

  getCityFuelPrices: async (city) => {
    return await api.get(`/fuel-prices/${encodeURIComponent(city)}`);
  },

  estimateFuelCost: async (payload) => {
    return await api.post('/fuel-prices/estimate', payload);
  },

  updateFuelPrice: async (payload) => {
    return await api.put('/fuel-prices', payload);
  }
};
