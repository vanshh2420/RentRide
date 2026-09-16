import api from './api';

export const catalogApi = {
  /**
   * Get paginated catalog models with optional filtering
   */
  getCatalogModels: async (params = {}) => {
    return await api.get('/catalog', { params });
  },

  /**
   * Get distinct brands in catalog
   */
  getDistinctBrands: async (params = {}) => {
    return await api.get('/catalog/brands', { params });
  },

  /**
   * Get all verified models/variants for a selected brand
   */
  getModelsByBrand: async (brand, vehicleType = null) => {
    const params = vehicleType ? { vehicleType } : {};
    return await api.get(`/catalog/brands/${encodeURIComponent(brand)}/models`, { params });
  },

  /**
   * Lookup model by catalogKey
   */
  getCatalogModelByKey: async (catalogKey) => {
    return await api.get(`/catalog/key/${encodeURIComponent(catalogKey)}`);
  },

  /**
   * Get model by MongoDB ID
   */
  getCatalogModelById: async (id) => {
    return await api.get(`/catalog/${id}`);
  }
};
