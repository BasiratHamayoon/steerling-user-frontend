'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FaBox,
  FaTags,
  FaEnvelope,
  FaChartLine,
  FaArrowUp,
  FaArrowDown,
  FaPlus,
  FaCog,
  FaEye,
  FaExclamationTriangle,
  FaMoneyBillWave,
  FaCalendarAlt,
  FaClock,
  FaSync,
  FaCommentAlt
} from 'react-icons/fa';
import { useAppContext } from '@/context/AppContext';
import Loading from '@/components/ui/Loading';

export default function AdminDashboard() {
  const { 
    fetchDashboardStats,
    fetchMessages,
    showNotification 
  } = useAppContext();
  
  const [time, setTime] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [recentMessages, setRecentMessages] = useState([]);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [statsResponse, messagesResponse] = await Promise.all([
        fetchDashboardStats(),
        fetchMessages({ limit: 4, isArchived: false })
      ]);

      console.log('Dashboard stats response:', statsResponse); // Debug
      console.log('Messages response:', messagesResponse); // Debug

      if (statsResponse.success) {
        console.log('Setting stats:', statsResponse.data); // Debug
        setStats(statsResponse.data);
      } else {
        console.error('Stats response failed:', statsResponse.error);
        setError(statsResponse.error || 'Failed to load statistics');
      }

      if (messagesResponse.success && messagesResponse.data?.messages) {
        setRecentMessages(messagesResponse.data.messages);
      } else if (messagesResponse.error) {
        console.error('Messages response failed:', messagesResponse.error);
      }
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to load dashboard data. Please try again.';
      setError(errorMessage);
      showNotification(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, [retryCount]);

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatNumber = (value) => {
    return value?.toLocaleString('en-US') || '0';
  };

  const getTimeAgo = (dateString) => {
    if (!dateString) return 'Just now';
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffInHours = (now - date) / (1000 * 60 * 60);
      
      if (diffInHours < 24) {
        if (diffInHours < 1) {
          const minutes = Math.floor(diffInHours * 60);
          return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
        }
        return `${Math.floor(diffInHours)} hour${Math.floor(diffInHours) !== 1 ? 's' : ''} ago`;
      }
      return `${Math.floor(diffInHours / 24)} day${Math.floor(diffInHours / 24) !== 1 ? 's' : ''} ago`;
    } catch {
      return 'Just now';
    }
  };

  const getMessagePreview = (message) => {
    if (!message || !message.message) return 'No message content';
    return message.message.length > 60 
      ? `${message.message.substring(0, 60)}...` 
      : message.message;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'unread':
        return 'bg-blue-500/20 text-blue-300 border border-blue-500/30';
      case 'replied':
        return 'bg-green-500/20 text-green-300 border border-green-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border border-gray-500/30';
    }
  };

  if (loading) {
    return <Loading text="Loading dashboard data..." fullScreen />;
  }

  const dashboardStats = [
    { 
      label: 'Total Products', 
      value: formatNumber(stats?.totalProducts), 
      icon: <FaBox className="text-3xl" />, 
      change: '+12%', 
      trend: 'up', 
      color: 'from-[#0295E6] to-[#02b3e6]' 
    },
    { 
      label: 'Total Categories', 
      value: formatNumber(stats?.totalCategories), 
      icon: <FaTags className="text-3xl" />, 
      change: '+2', 
      trend: 'up', 
      color: 'from-[#0295E6] to-[#02b3e6]' 
    },
    { 
      label: 'Out of Stock', 
      value: formatNumber(stats?.outOfStockProducts), 
      icon: <FaExclamationTriangle className="text-3xl" />, 
      change: stats?.outOfStockProducts > 0 ? 'Need restocking' : 'All stocked', 
      trend: stats?.outOfStockProducts > 0 ? 'down' : 'up', 
      color: 'from-[#0295E6] to-[#02b3e6]' 
    },
    { 
      label: 'Unread Messages', 
      value: formatNumber(stats?.unreadMessages), 
      icon: <FaCommentAlt className="text-3xl" />, 
      change: stats?.unreadMessages > 0 ? `${stats.unreadMessages} unread` : 'All read', 
      trend: stats?.unreadMessages > 0 ? 'up' : 'down', 
      color: 'from-[#0295E6] to-[#02b3e6]'
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header with refresh button */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold mb-2">Dashboard Overview</h1>
          <p className="text-gray-400">
            Welcome back, Administrator! Here's what's happening with your store today.
            <span className="ml-2 text-[#0295E6] flex items-center gap-2">
              <FaCalendarAlt />
              {time.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} • 
              <FaClock className="ml-2" />
              {time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
            </span>
          </p>
        </div>
        <button
          onClick={handleRetry}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#0295E6] to-[#02b3e6] text-white rounded-lg hover:opacity-90 transition-opacity"
          disabled={loading}
        >
          <FaSync className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-300 rounded-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FaExclamationTriangle />
              <span>{error}</span>
            </div>
            <button
              onClick={handleRetry}
              className="text-sm underline hover:text-red-200"
            >
              Try Again
            </button>
          </div>
        </div>
      )}

      {/* Debug info (remove in production) */}
      {stats && (
        <div className="text-xs text-gray-500 bg-gray-800/30 p-2 rounded">
          Debug: Categories in DB: {stats?.totalCategories}, Products: {stats?.totalProducts}
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {dashboardStats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`bg-gradient-to-br ${stat.color} rounded-2xl p-6 text-white shadow-lg`}
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm opacity-90">{stat.label}</p>
                <p className="text-4xl font-bold mt-2">{stat.value}</p>
              </div>
              <div className="opacity-80">{stat.icon}</div>
            </div>
            <div className="flex items-center gap-2">
              {stat.trend === 'up' ? (
                <FaArrowUp className="text-blue-200" />
              ) : (
                <FaArrowDown className="text-red-200" />
              )}
              <span className="text-sm font-medium">{stat.change} from last month</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Recent Messages */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/30"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold mb-2">Recent Customer Messages</h2>
            <p className="text-gray-400">Latest inquiries from customers</p>
          </div>
          <button 
            onClick={() => window.location.href = '/admin/messages'}
            className="flex items-center gap-2 text-[#0295E6] hover:text-blue-300 transition-colors"
          >
            <span>View All</span>
            <FaEye />
          </button>
        </div>
        
        {recentMessages.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <FaEnvelope className="text-4xl mx-auto mb-4 opacity-50" />
            <p>No recent messages</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {recentMessages.map((message) => (
              <div
                key={message._id}
                className={`p-4 rounded-xl transition-all hover:scale-[1.02] cursor-pointer border relative ${
                  message.status === 'unread'
                    ? 'bg-gradient-to-r from-[#0295E6]/10 to-[#02b3e6]/5 border-[#0295E6]/20'
                    : 'bg-gray-700/20 border-gray-700/30'
                }`}
                onClick={() => window.location.href = `/admin/messages/${message._id}`}
              >
                {/* Fixed badge position */}
                <div className="absolute top-3 right-3">
                  <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(message.status)} whitespace-nowrap`}>
                    {message.status.charAt(0).toUpperCase() + message.status.slice(1)}
                  </span>
                </div>
                
                <div className="pr-12">
                  <h4 className="font-semibold text-lg mb-1 truncate">{message.name || 'Unknown User'}</h4>
                  <p className="text-sm text-gray-400 mb-3 truncate">{message.email || 'No email'}</p>
                </div>
                
                <p className="text-sm text-gray-300 line-clamp-2 mb-3 h-12">
                  {getMessagePreview(message)}
                </p>
                
                <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-700/30">
                  <span className="truncate mr-2">{getTimeAgo(message.createdAt)}</span>
                  {message.status === 'unread' && (
                    <span className="flex items-center gap-1 flex-shrink-0">
                      <span className="w-2 h-2 bg-[#0295E6] rounded-full animate-pulse" />
                      <span>Unread</span>
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/30"
      >
        <h2 className="text-2xl font-bold mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => window.location.href = '/admin/products'}
            className="flex items-center justify-center gap-3 p-4 bg-gradient-to-r from-[#0295E6]/20 to-[#02b3e6]/10 border border-[#0295E6]/30 rounded-xl hover:scale-105 transition-all group"
          >
            <FaPlus className="text-2xl text-[#0295E6] group-hover:text-blue-300" />
            <div className="text-left">
              <div className="font-semibold text-lg">Add Product</div>
              <div className="text-sm text-gray-400">Create new product listing</div>
            </div>
          </button>
          
          <button
            onClick={() => window.location.href = '/admin/categories'}
            className="flex items-center justify-center gap-3 p-4 bg-gradient-to-r from-[#0295E6]/20 to-[#02b3e6]/10 border border-[#0295E6]/30 rounded-xl hover:scale-105 transition-all group"
          >
            <FaTags className="text-2xl text-[#0295E6] group-hover:text-blue-300" />
            <div className="text-left">
              <div className="font-semibold text-lg">Add Category</div>
              <div className="text-sm text-gray-400">Create new category</div>
            </div>
          </button>
          
          <button
            onClick={() => window.location.href = '/admin/settings'}
            className="flex items-center justify-center gap-3 p-4 bg-gradient-to-r from-[#0295E6]/20 to-[#02b3e6]/10 border border-[#0295E6]/30 rounded-xl hover:scale-105 transition-all group"
          >
            <FaCog className="text-2xl text-[#0295E6] group-hover:text-blue-300" />
            <div className="text-left">
              <div className="font-semibold text-lg">Settings</div>
              <div className="text-sm text-gray-400">Manage account settings</div>
            </div>
          </button>
        </div>
      </motion.div>
    </div>
  );
}