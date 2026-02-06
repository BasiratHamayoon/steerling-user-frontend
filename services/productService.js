import api from './api';

const productService = {
  // Get all products (Public)
  getAll: async (params = {}) => {
    const response = await api.get('/products', { params });
    return response.data;
  },

  // Get single product (Public)
  getById: async (id) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  // Get products by category (Public)
  getByCategory: async (categoryId, params = {}) => {
    const response = await api.get(`/products/category/${categoryId}`, { params });
    return response.data;
  },

  // Get product stats (Admin)
  getStats: async () => {
    const response = await api.get('/products/stats');
    return response.data;
  },

  // Create product (Admin)
  create: async (formData) => {
    const response = await api.post('/products', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Update product (Admin)
  update: async (id, formData) => {
    const response = await api.put(`/products/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Update stock (Admin)
  updateStock: async (id, quantity) => {
    const response = await api.patch(`/products/${id}/stock`, { quantity });
    return response.data;
  },

  // Delete image (Admin)
  deleteImage: async (id, imageUrl) => {
    const response = await api.delete(`/products/${id}/image`, {
      data: { imageUrl },
    });
    return response.data;
  },

  // Delete product (Admin)
  delete: async (id) => {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  },
};

export default productService;