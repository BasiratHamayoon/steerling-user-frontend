'use client';

import { motion } from 'framer-motion';
import { FaExclamationTriangle, FaCheckCircle, FaTimes, FaShieldAlt } from 'react-icons/fa';

export default function ConfirmationModal({ isOpen, onClose, onConfirm, title, message, type = 'warning' }) {
  if (!isOpen) return null;

  const isDanger = type === 'danger';

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative bg-gray-900 border border-gray-800 rounded-3xl p-8 w-full max-w-md shadow-2xl overflow-hidden text-center"
      >
        {/* Glow Effect */}
        <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${isDanger ? 'from-red-600 to-orange-600' : 'from-green-600 to-emerald-600'}`} />
        
        <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-6 ${isDanger ? 'bg-red-900/20 text-red-500' : 'bg-green-900/20 text-green-500'}`}>
           {isDanger ? <FaExclamationTriangle className="text-4xl" /> : <FaCheckCircle className="text-4xl" />}
        </div>

        <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>
        <p className="text-gray-400 mb-8 leading-relaxed">{message}</p>

        <div className="flex gap-4">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl border border-gray-700 text-gray-300 hover:bg-gray-800 transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 py-3 rounded-xl text-white font-bold shadow-lg transition-all transform hover:-translate-y-1 ${
                isDanger 
                ? 'bg-gradient-to-r from-red-600 to-red-700 hover:shadow-red-900/30' 
                : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:shadow-green-900/30'
            }`}
          >
            Confirm
          </button>
        </div>
      </motion.div>
    </div>
  );
}