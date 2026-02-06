import api from './api';

const messageService = {
  sendMessage: async (data) => {
    const response = await api.post('/messages', data);
    return response.data;
  },

  getAll: async (params = {}) => {
    const response = await api.get('/messages', { params });
    return response.data;
  },

  
  getById: async (id) => {
    const response = await api.get(`/messages/${id}`);
    return response.data;
  },

  
  reply: async (id, replyData) => {
    const response = await api.post(`/messages/${id}/reply`, replyData);
    return response.data;
  },

  
  updateStatus: async (id, status) => {
    const response = await api.patch(`/messages/${id}/status`, { status });
    return response.data;
  },

  
  toggleArchive: async (id) => {
    const response = await api.patch(`/messages/${id}/archive`);
    return response.data;
  },

  
  delete: async (id) => {
    const response = await api.delete(`/messages/${id}`);
    return response.data;
  },

  
  bulkUpdate: async (ids, action) => {
    const response = await api.patch('/messages/bulk', { ids, action });
    return response.data;
  },

  
  getStats: async () => {
    const response = await api.get('/messages/stats');
    return response.data;
  }
};

export default messageService;