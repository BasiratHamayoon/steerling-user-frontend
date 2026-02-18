import api from './api';

const reviewService = {
  // Create a new review
  createReview: async (data) => {
    try {
      const response = await api.post('/reviews', data);
      return response.data;
    } catch (error) {
      console.error('Create review error:', error.response?.data || error.message);
      throw error;
    }
  },

  // Get reviews for a product (public)
  getProductReviews: async (productId, params = {}) => {
    try {
      const response = await api.get(`/reviews/product/${productId}`, { params });
      return response.data;
    } catch (error) {
      console.error('Get reviews error:', error.response?.data || error.message);
      throw error;
    }
  },

  // Check if email can review
  checkReviewEligibility: async (productId, email) => {
    try {
      if (!productId || !email) {
        return {
          success: false,
          error: 'Product ID and email are required'
        };
      }
      
      const response = await api.post('/reviews/check', { 
        productId: productId.toString(), 
        email: email.toLowerCase().trim() 
      });
      return response.data;
    } catch (error) {
      console.error('Check eligibility error:', error.response?.data || error.message);
      // Return a fallback response instead of throwing
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to check eligibility',
        data: {
          canReview: true, // Allow review if check fails
          hasPendingReview: false
        }
      };
    }
  },

  // Admin: Get all reviews
  getAllReviews: async (params = {}) => {
    try {
      const response = await api.get('/reviews/admin/all', { params });
      return response.data;
    } catch (error) {
      console.error('Get all reviews error:', error.response?.data || error.message);
      throw error;
    }
  },

  // Admin: Update review status
  updateReviewStatus: async (reviewId, status) => {
    try {
      const response = await api.put(`/reviews/${reviewId}/status`, { status });
      return response.data;
    } catch (error) {
      console.error('Update status error:', error.response?.data || error.message);
      throw error;
    }
  },

  // Admin: Delete review
  deleteReview: async (reviewId) => {
    try {
      const response = await api.delete(`/reviews/${reviewId}`);
      return response.data;
    } catch (error) {
      console.error('Delete review error:', error.response?.data || error.message);
      throw error;
    }
  },

  // Admin: Get review stats
  getReviewStats: async () => {
    try {
      const response = await api.get('/reviews/admin/stats');
      return response.data;
    } catch (error) {
      console.error('Get stats error:', error.response?.data || error.message);
      throw error;
    }
  },
};

export default reviewService;