import api from './api';

export const categoryApi = {
  getAllCategories: async (includeInactive = false) => {
    return await api.get(`/categories?includeInactive=${includeInactive}`);
  },

  getCategoryById: async (id) => {
    return await api.get(`/categories/${id}`);
  },

  createCategory: async (categoryData) => {
    return await api.post('/categories', categoryData);
  },

  updateCategory: async (id, categoryData) => {
    return await api.put(`/categories/${id}`, categoryData);
  },

  deleteCategory: async (id) => {
    return await api.delete(`/categories/${id}`);
  }
};
