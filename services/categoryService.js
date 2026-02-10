import api from './api';

const categoryService = {
  getAll: async (params = {}) => {
    const response = await api.get('/categories', { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/categories/${id}`);
    return response.data;
  },

  create: async (data) => {
    // data is FormData
    const response = await api.post('/categories', data, {
      headers: {
        'Content-Type': undefined
      }
    });
    return response.data;
  },

  update: async (id, data) => {
    // data is FormData
    const response = await api.put(`/categories/${id}`, data, {
      headers: {
        'Content-Type': undefined
      }
    });
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/categories/${id}`);
    return response.data;
  },
};

export default categoryService;