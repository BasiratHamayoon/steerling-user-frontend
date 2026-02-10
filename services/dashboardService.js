import api from './api';

const dashboardService = {
  getStats: async () => {
    try {
      const response = await api.get('/dashboard/stats');
      console.log('Dashboard stats response:', response.data); // Debug
      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  },

  getRecentMessages: async (limit = 5) => {
    try {
      const response = await api.get('/dashboard/recent-messages', {
        params: { limit }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching recent messages:', error);
      throw error;
    }
  }
};

export default dashboardService;