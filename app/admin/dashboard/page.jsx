'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FaBox,
  FaTags,
  FaEnvelope,
  FaArrowUp,
  FaArrowDown,
  FaPlus,
  FaCog,
  FaEye,
  FaExclamationTriangle,
  FaCalendarAlt,
  FaClock,
  FaSync,
  FaCommentAlt,
  FaUserCog,
  FaChartBar
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

  // Clock Ticker
  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  // Data Fetching
  const loadDashboardData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [statsResponse, messagesResponse] = await Promise.all([
        fetchDashboardStats(),
        fetchMessages({ limit: 4, isArchived: false })
      ]);

      if (statsResponse.success) {
        setStats(statsResponse.data);
      } else {
        setError(statsResponse.error || 'Failed to load statistics');
      }

      if (messagesResponse.success && messagesResponse.data?.messages) {
        setRecentMessages(messagesResponse.data.messages);
      }
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      const errorMessage = error.response?.data?.message || 'Failed to load dashboard data.';
      setError(errorMessage);
      showNotification(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, [retryCount]);

  // Helpers
  const handleRetry = () => setRetryCount(prev => prev + 1);
  const formatNumber = (value) => value?.toLocaleString('en-US') || '0';

  const getTimeAgo = (dateString) => {
    if (!dateString) return 'Just now';
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffInHours = (now - date) / (1000 * 60 * 60);
      if (diffInHours < 24) {
        if (diffInHours < 1) {
          const minutes = Math.floor(diffInHours * 60);
          return `${minutes} min ago`;
        }
        return `${Math.floor(diffInHours)}h ago`;
      }
      return `${Math.floor(diffInHours / 24)}d ago`;
    } catch {
      return 'Just now';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'unread': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'replied': return 'bg-green-500/20 text-green-300 border-green-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  if (loading) return <Loading text="Initializing Dashboard..." fullScreen />;

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  const dashboardStats = [
    { 
      label: 'Total Products', 
      value: formatNumber(stats?.totalProducts), 
      icon: <FaBox />, 
      change: '+12%', 
      trend: 'up', 
      bg: 'from-blue-600/20 to-blue-900/20',
      border: 'border-blue-500/30',
      text: 'text-blue-400'
    },
    { 
      label: 'Active Categories', 
      value: formatNumber(stats?.totalCategories), 
      icon: <FaTags />, 
      change: '+2', 
      trend: 'up', 
      bg: 'from-purple-600/20 to-purple-900/20',
      border: 'border-purple-500/30',
      text: 'text-purple-400'
    },
    { 
      label: 'Stock Alert', 
      value: formatNumber(stats?.outOfStockProducts), 
      icon: <FaExclamationTriangle />, 
      change: stats?.outOfStockProducts > 0 ? 'Restock needed' : 'Healthy', 
      trend: stats?.outOfStockProducts > 0 ? 'down' : 'up', 
      bg: stats?.outOfStockProducts > 0 ? 'from-red-600/20 to-red-900/20' : 'from-green-600/20 to-green-900/20',
      border: stats?.outOfStockProducts > 0 ? 'border-red-500/30' : 'border-green-500/30',
      text: stats?.outOfStockProducts > 0 ? 'text-red-400' : 'text-green-400'
    },
    { 
      label: 'Inbox', 
      value: formatNumber(stats?.unreadMessages), 
      icon: <FaCommentAlt />, 
      change: stats?.unreadMessages > 0 ? 'Unread messages' : 'Caught up', 
      trend: stats?.unreadMessages > 0 ? 'neutral' : 'up', 
      bg: 'from-amber-600/20 to-amber-900/20',
      border: 'border-amber-500/30',
      text: 'text-amber-400'
    },
  ];

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-8 min-h-screen pb-10"
    >
      {/* --- Ambient Background --- */}
      <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-[#0295E6]/5 blur-[120px] rounded-full pointer-events-none -z-10" />

      {/* --- Header Section --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-gray-800 pb-6">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tight mb-2">
            Admin <span className="text-[#0295E6]">Dashboard</span>
          </h1>
          <p className="text-gray-400 flex flex-wrap items-center gap-3 text-sm">
            <span className="flex items-center gap-2 bg-gray-900 px-3 py-1 rounded-full border border-gray-800">
              <FaUserCog className="text-[#0295E6]" /> Administrator
            </span>
            <span className="flex items-center gap-2 bg-gray-900 px-3 py-1 rounded-full border border-gray-800">
              <FaCalendarAlt className="text-gray-500" />
              {time.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
            </span>
            <span className="flex items-center gap-2 bg-gray-900 px-3 py-1 rounded-full border border-gray-800 font-mono">
              <FaClock className="text-gray-500" />
              {time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
            </span>
          </p>
        </div>
        <button
          onClick={handleRetry}
          className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 hover:bg-gray-800 border border-gray-700 hover:border-[#0295E6] rounded-xl transition-all duration-300 group"
          disabled={loading}
        >
          <FaSync className={`text-gray-400 group-hover:text-[#0295E6] transition-colors ${loading ? 'animate-spin' : ''}`} />
          <span className="text-sm font-medium">Sync Data</span>
        </button>
      </div>

      {/* --- Error Banner --- */}
      {error && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }} 
          animate={{ opacity: 1, height: 'auto' }}
          className="p-4 bg-red-900/10 border border-red-500/20 text-red-300 rounded-xl flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <FaExclamationTriangle className="text-xl" />
            <span className="font-medium">{error}</span>
          </div>
          <button onClick={handleRetry} className="text-sm underline hover:text-white transition-colors">Retry Connection</button>
        </motion.div>
      )}

      {/* --- Stats Cards --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {dashboardStats.map((stat, index) => (
          <motion.div
            key={stat.label}
            variants={itemVariants}
            className={`relative overflow-hidden bg-gray-900/50 backdrop-blur-md border ${stat.border} rounded-2xl p-6 group transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-black/20`}
          >
            {/* Background Gradient */}
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.bg} opacity-30 group-hover:opacity-50 transition-opacity`} />
            
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl bg-gray-950/50 ${stat.text} text-xl shadow-inner`}>
                  {stat.icon}
                </div>
                {stat.trend && (
                  <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full bg-gray-950/30 ${stat.trend === 'up' ? 'text-green-400' : stat.trend === 'down' ? 'text-red-400' : 'text-gray-400'}`}>
                    {stat.trend === 'up' ? <FaArrowUp size={10} /> : <FaArrowDown size={10} />}
                    {stat.change}
                  </div>
                )}
              </div>
              <div>
                <h3 className="text-3xl font-bold text-white mb-1 tracking-tight">{stat.value}</h3>
                <p className="text-sm text-gray-400 font-medium">{stat.label}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* --- Recent Messages (Takes 2/3 width) --- */}
        <motion.div 
          variants={itemVariants}
          className="lg:col-span-2 bg-gray-900/40 backdrop-blur-sm border border-gray-800 rounded-2xl overflow-hidden flex flex-col"
        >
          <div className="p-6 border-b border-gray-800 flex justify-between items-center bg-gray-900/60">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <FaEnvelope className="text-[#0295E6]" /> Recent Inquiries
              </h2>
              <p className="text-xs text-gray-500 mt-1">Latest messages from the contact form</p>
            </div>
            <button 
              onClick={() => window.location.href = '/admin/messages'}
              className="text-xs font-bold uppercase tracking-wider text-gray-500 hover:text-[#0295E6] transition-colors"
            >
              View All
            </button>
          </div>

          <div className="flex-1 p-4 space-y-3">
            {recentMessages.length === 0 ? (
              <div className="h-64 flex flex-col items-center justify-center text-gray-500 bg-gray-900/20 rounded-xl border border-gray-800 border-dashed m-2">
                <FaEnvelope className="text-4xl mb-4 opacity-20" />
                <p>No new messages</p>
              </div>
            ) : (
              recentMessages.map((message) => (
                <div
                  key={message._id}
                  onClick={() => window.location.href = `/admin/messages/${message._id}`}
                  className="group relative flex items-center gap-4 p-4 rounded-xl bg-gray-900 hover:bg-gray-800 border border-gray-800 hover:border-gray-700 transition-all cursor-pointer"
                >
                  {/* Status Indicator Bar */}
                  <div className={`absolute left-0 top-4 bottom-4 w-1 rounded-r-full ${message.status === 'unread' ? 'bg-[#0295E6]' : 'bg-transparent'}`} />

                  {/* Avatar Placeholder */}
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center text-sm font-bold text-gray-300 border border-gray-700 shadow-inner">
                    {message.name?.charAt(0) || '?'}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <h4 className="font-semibold text-gray-200 truncate pr-2 group-hover:text-[#0295E6] transition-colors">
                        {message.name || 'Anonymous'}
                      </h4>
                      <span className="text-xs text-gray-500 whitespace-nowrap">{getTimeAgo(message.createdAt)}</span>
                    </div>
                    <p className="text-sm text-gray-400 truncate mt-0.5">{message.message}</p>
                  </div>

                  {/* Status Badge */}
                  <div className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider border ${getStatusColor(message.status)}`}>
                    {message.status}
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>

        {/* --- Quick Actions (Takes 1/3 width) --- */}
        <motion.div 
          variants={itemVariants}
          className="flex flex-col gap-6"
        >
          {/* Action Card */}
          <div className="bg-gray-900/40 backdrop-blur-sm border border-gray-800 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <FaCog className="text-gray-500" /> Quick Actions
            </h2>
            
            <div className="space-y-3">
              <button
                onClick={() => window.location.href = '/admin/products'}
                className="w-full flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-gray-800 to-gray-800 hover:from-[#0295E6]/20 hover:to-gray-800 border border-gray-700 hover:border-[#0295E6]/50 transition-all group"
              >
                <div className="w-10 h-10 rounded-lg bg-[#0295E6]/10 flex items-center justify-center text-[#0295E6] group-hover:scale-110 transition-transform">
                  <FaPlus />
                </div>
                <div className="text-left">
                  <h4 className="font-bold text-gray-200">Add Product</h4>
                  <p className="text-xs text-gray-500 group-hover:text-gray-400">Update inventory</p>
                </div>
              </button>

              <button
                onClick={() => window.location.href = '/admin/categories'}
                className="w-full flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-gray-800 to-gray-800 hover:from-purple-600/20 hover:to-gray-800 border border-gray-700 hover:border-purple-500/50 transition-all group"
              >
                <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
                  <FaTags />
                </div>
                <div className="text-left">
                  <h4 className="font-bold text-gray-200">Add Category</h4>
                  <p className="text-xs text-gray-500 group-hover:text-gray-400">New collection</p>
                </div>
              </button>
            </div>
          </div>

          {/* Mini Chart/Summary Card */}
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-2xl p-6 relative overflow-hidden flex-1">
             <FaChartBar className="absolute -bottom-4 -right-4 text-9xl text-white/5" />
             <h3 className="relative z-10 text-lg font-bold mb-2">Performance</h3>
             <p className="relative z-10 text-gray-400 text-sm mb-4">
               Your store has seen a <span className="text-green-400 font-bold">+12%</span> increase in product views this week.
             </p>
             <div className="relative z-10 h-2 bg-gray-700 rounded-full overflow-hidden">
               <div className="h-full w-[70%] bg-[#0295E6] rounded-full" />
             </div>
             <p className="relative z-10 text-right text-xs text-gray-500 mt-2">70% to monthly goal</p>
          </div>
        </motion.div>

      </div>
    </motion.div>
  );
}