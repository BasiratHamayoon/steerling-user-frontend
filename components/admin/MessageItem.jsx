'use client';

import { motion } from 'framer-motion';
import { FaUser, FaClock, FaEnvelope } from 'react-icons/fa';

export default function MessageItem({ message, isSelected, onClick }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      onClick={onClick}
      className={`p-4 border-b border-gray-700/30 cursor-pointer transition-all hover:bg-gray-700/20 ${
        isSelected ? 'bg-gradient-to-r from-[#0295E6]/10 to-[#02b3e6]/5' : ''
      } ${!message.read ? 'border-l-4 border-[#0295E6]' : ''}`}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center">
            <FaUser className="text-gray-400" />
          </div>
          <div>
            <h3 className="font-semibold">{message.name}</h3>
            <p className="text-sm text-gray-400">{message.email}</p>
          </div>
        </div>
        <span className={`text-xs px-2 py-1 rounded-full ${
          message.status === 'unread' ? 'bg-blue-900/30 text-blue-300' :
          message.status === 'replied' ? 'bg-blue-900/30 text-blue-300' :
          'bg-gray-700/50 text-gray-400'
        }`}>
          {message.status}
        </span>
      </div>
      <p className="text-sm text-gray-300 line-clamp-2 mb-2">{message.message}</p>
      <div className="flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center gap-2">
          <FaClock />
          {message.date}
        </div>
        <div className="flex items-center gap-2">
          <FaEnvelope className="text-xs" />
          {!message.read && (
            <span className="w-2 h-2 bg-[#0295E6] rounded-full animate-pulse" />
          )}
        </div>
      </div>
    </motion.div>
  );
}