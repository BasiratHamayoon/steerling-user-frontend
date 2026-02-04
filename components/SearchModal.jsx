'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { FaSearch, FaTimes } from 'react-icons/fa';
import { useAppContext } from '@/context/AppContext';

export default function SearchModal() {
  const { isSearchOpen, setIsSearchOpen, searchQuery, setSearchQuery } = useAppContext();

  return (
    <AnimatePresence>
      {isSearchOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          onClick={() => setIsSearchOpen(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-gray-800 rounded-xl p-6 w-full max-w-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold">Search Products</h3>
              <button
                onClick={() => setIsSearchOpen(false)}
                className="p-2 hover:bg-gray-700 rounded-full"
              >
                <FaTimes />
              </button>
            </div>
            <div className="relative">
              <FaSearch className="absolute left-4 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search for steering wheels..."
                className="w-full pl-12 pr-4 py-3 bg-gray-900 rounded-lg border border-gray-700 focus:border-green-500 focus:outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}