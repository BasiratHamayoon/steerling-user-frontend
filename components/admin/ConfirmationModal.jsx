'use client';

import { motion } from 'framer-motion';
import { FaExclamationTriangle, FaCheck, FaTimes } from 'react-icons/fa';

export default function ConfirmationModal({ isOpen, onClose, onConfirm, title, message, type = 'warning' }) {
  const getIcon = () => {
    switch (type) {
      case 'success':
        return <FaCheck className="text-green-400 text-4xl" />;
      case 'danger':
        return <FaExclamationTriangle className="text-red-400 text-4xl" />;
      default:
        return <FaExclamationTriangle className="text-yellow-400 text-4xl" />;
    }
  };

  const getButtonColor = () => {
    switch (type) {
      case 'success':
        return 'bg-green-600 hover:bg-green-700';
      case 'danger':
        return 'bg-red-600 hover:bg-red-700';
      default:
        return 'bg-yellow-600 hover:bg-yellow-700';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-gray-900 rounded-2xl p-6 w-full max-w-md border border-gray-700/50"
      >
        <div className="text-center">
          <div className="mb-4 flex justify-center">
            {getIcon()}
          </div>
          
          <h3 className="text-xl font-bold mb-2">{title}</h3>
          <p className="text-gray-400 mb-6">{message}</p>

          <div className="flex justify-center gap-4">
            <button
              onClick={onClose}
              className="px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-xl transition-colors flex items-center gap-2"
            >
              <FaTimes />
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className={`px-6 py-3 rounded-xl transition-colors flex items-center gap-2 ${getButtonColor()}`}
            >
              <FaCheck />
              Confirm
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}