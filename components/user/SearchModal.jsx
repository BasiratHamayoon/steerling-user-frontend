'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiX } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import { useAppContext } from '@/context/AppContext';
import { products } from '@/data/products';

export default function SearchModal() {
  const { isSearchOpen, setIsSearchOpen, searchQuery, setSearchQuery } = useAppContext();
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = (value) => {
    setSearchQuery(value);
    if (value.trim() === '') {
      setSearchResults([]);
      return;
    }
    
    const results = products.filter(product =>
      product.name.toLowerCase().includes(value.toLowerCase()) ||
      product.category.toLowerCase().includes(value.toLowerCase()) ||
      product.description.toLowerCase().includes(value.toLowerCase())
    );
    setSearchResults(results.slice(0, 5)); // Limit to 5 results
  };

  return (
    <AnimatePresence>
      {isSearchOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={() => setIsSearchOpen(false)}
        >
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25 }}
            className="relative bg-gray-900/90 backdrop-blur-md rounded-2xl p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto border border-gray-700/50"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold">Search Products</h3>
              <button
                onClick={() => setIsSearchOpen(false)}
                className="p-2 hover:bg-gray-800/50 rounded-full transition-colors"
              >
                <FiX className="text-xl" />
              </button>
            </div>
            
            <div className="relative mb-6">
              <FiSearch className="absolute left-4 top-3.5 text-gray-400 text-xl" />
              <input
                type="text"
                placeholder="Search for steering wheels, categories, etc..."
                className="w-full pl-12 pr-4 py-3.5 bg-gray-800/50 rounded-xl border border-gray-600 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/30 text-white"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                autoFocus
              />
            </div>

            {searchResults.length > 0 && (
              <div className="mb-6">
                <h4 className="font-semibold mb-3">Search Results</h4>
                <div className="space-y-3">
                  {searchResults.map((product) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center gap-4 p-3 bg-gray-800/30 rounded-lg hover:bg-gray-800/50 transition-colors cursor-pointer"
                      onClick={() => {
                        window.location.href = `/products/${product.id}`;
                        setIsSearchOpen(false);
                      }}
                    >
                      <div className="w-16 h-16 rounded overflow-hidden">
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h5 className="font-medium">{product.name}</h5>
                        <p className="text-sm text-gray-400">${product.price}</p>
                        <p className="text-xs text-gray-500">{product.category}</p>
                      </div>
                      <div className={`px-2 py-1 rounded text-xs ${product.inStock ? 'bg-green-900/30 text-green-300' : 'bg-red-900/30 text-red-300'}`}>
                        {product.inStock ? 'In Stock' : 'Out of Stock'}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {searchQuery && searchResults.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-400">No products found for "{searchQuery}"</p>
              </div>
            )}

            {!searchQuery && (
              <div className="text-center py-8">
                <p className="text-gray-400">Type to search for products</p>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}