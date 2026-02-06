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
  FaEye
} from 'react-icons/fa';

const stats = [
  { 
    label: 'Total Products', 
    value: '156', 
    icon: <FaBox className="text-3xl" />, 
    change: '+12%', 
    trend: 'up', 
    color: 'from-[#0295E6] to-[#02b3e6]' 
  },
  { 
    label: 'Total Categories', 
    value: '8', 
    icon: <FaTags className="text-3xl" />, 
    change: '+2', 
    trend: 'up', 
    color: 'from-[#0295E6] to-[#02b3e6]' 
  },
  { 
    label: 'Total Messages', 
    value: '342', 
    icon: <FaEnvelope className="text-3xl" />, 
    change: '-5%', 
    trend: 'down', 
    color: 'from-[#0295E6] to-[#02b3e6]' 
  },
];

const recentMessages = [
  { 
    id: 1, 
    name: 'Alex Turner', 
    email: 'alex@example.com', 
    message: 'Interested in custom steering wheels for my vintage car collection...', 
    date: '2 hours ago', 
    status: 'unread' 
  },
  { 
    id: 2, 
    name: 'Sarah Miller', 
    email: 'sarah@example.com', 
    message: 'Do you provide installation services for the steering wheels?', 
    date: '5 hours ago', 
    status: 'read' 
  },
  { 
    id: 3, 
    name: 'David Wilson', 
    email: 'david@example.com', 
    message: 'Looking for bulk order discount for SUV steering wheels...', 
    date: '1 day ago', 
    status: 'read' 
  },
  { 
    id: 4, 
    name: 'Michael Brown', 
    email: 'michael@example.com', 
    message: 'Need assistance with choosing the right steering wheel for racing setup...', 
    date: '2 days ago', 
    status: 'replied' 
  },
];

export default function AdminDashboard() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const totalProducts = 156;
  const totalCategories = 8;
  const totalMessages = 342;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Dashboard Overview</h1>
        <p className="text-gray-400">
          Welcome back, Administrator! Here's what's happening with your store today.
          <span className="ml-2 text-[#0295E6]">
            {time.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} • 
            {time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
          </span>
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {recentMessages.map((message) => (
            <div
              key={message.id}
              className={`p-4 rounded-xl transition-all hover:scale-[1.02] cursor-pointer border ${
                message.status === 'unread'
                  ? 'bg-gradient-to-r from-[#0295E6]/10 to-[#02b3e6]/5 border-[#0295E6]/20'
                  : 'bg-gray-700/20 border-gray-700/30'
              }`}
              onClick={() => window.location.href = `/admin/messages`}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-semibold text-lg">{message.name}</h4>
                  <p className="text-sm text-gray-400">{message.email}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  message.status === 'unread' ? 'bg-blue-900/50 text-blue-300' :
                  message.status === 'replied' ? 'bg-blue-900/50 text-blue-300' :
                  'bg-gray-700/50 text-gray-400'
                }`}>
                  {message.status}
                </span>
              </div>
              <p className="text-sm text-gray-300 line-clamp-2 mb-3">{message.message}</p>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>{message.date}</span>
                {message.status === 'unread' && (
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 bg-[#0295E6] rounded-full animate-pulse" />
                    <span>Unread</span>
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
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