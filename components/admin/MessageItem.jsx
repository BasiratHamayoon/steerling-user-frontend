'use client';

import { motion } from 'framer-motion';
import { FaUser, FaClock, FaEnvelope, FaPhone, FaReply, FaCheckCircle, FaEye, FaEyeSlash } from 'react-icons/fa';

export default function MessageItem({ message, isSelected, onClick, onStatusToggle, onArchive, onDelete }) {
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      if (diffInHours < 1) {
        const minutes = Math.floor(diffInHours * 60);
        return `${minutes} min${minutes !== 1 ? 's' : ''} ago`;
      }
      return `${Math.floor(diffInHours)} hour${Math.floor(diffInHours) !== 1 ? 's' : ''} ago`;
    }
    
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'unread':
        return 'bg-red-500/20 text-red-300 border-red-500/30';
      case 'read':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'replied':
        return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'archived':
        return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
      default:
        return 'bg-gray-500/20 text-gray-300';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'unread':
        return <FaEyeSlash className="text-red-400 text-xs" />;
      case 'read':
        return <FaEye className="text-blue-400 text-xs" />;
      case 'replied':
        return <FaReply className="text-green-400 text-xs" />;
      case 'archived':
        return <FaCheckCircle className="text-gray-400 text-xs" />;
      default:
        return <FaEnvelope className="text-gray-400 text-xs" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      onClick={onClick}
      className={`p-4 border-b border-gray-700/30 cursor-pointer transition-all hover:bg-gray-700/20 group ${
        isSelected ? 'bg-gradient-to-r from-[#0295E6]/10 to-[#02b3e6]/5' : ''
      } ${message.status === 'unread' ? 'border-l-4 border-red-500 bg-red-500/5' : ''}`}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-3 min-w-0">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
            message.status === 'unread' 
              ? 'bg-red-500/10 border border-red-500/20' 
              : 'bg-gray-800'
          }`}>
            {message.name ? (
              <span className="font-semibold text-white">
                {message.name.charAt(0).toUpperCase()}
              </span>
            ) : (
              <FaUser className="text-gray-400" />
            )}
          </div>
          <div className="min-w-0">
            <h3 className="font-semibold truncate" title={message.name || 'Anonymous'}>
              {message.name || 'Anonymous'}
            </h3>
            <p className="text-sm text-gray-400 truncate" title={message.email}>
              {message.email}
            </p>
          </div>
        </div>
        <span className={`text-xs px-2 py-1 rounded-full border flex items-center gap-1 flex-shrink-0 ${getStatusColor(message.status)}`}>
          {getStatusIcon(message.status)}
          {message.status.charAt(0).toUpperCase() + message.status.slice(1)}
        </span>
      </div>
      
      <p className="text-sm text-gray-300 line-clamp-2 mb-2 leading-relaxed">
        {message.message}
      </p>
      
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-2 text-gray-500">
          {message.phone && (
            <span className="flex items-center gap-1" title="Phone">
              <FaPhone />
              {message.phone}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-gray-500">
            <FaClock />
            {formatDate(message.createdAt)}
          </div>
          {message.replies && message.replies.length > 0 && (
            <span className="text-blue-400 flex items-center gap-1">
              <FaReply />
              {message.replies.length}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}