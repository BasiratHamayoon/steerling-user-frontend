'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiX, FiArrowRight, FiPackage } from 'react-icons/fi';
import { FaFire, FaBoxOpen } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { useAppContext } from '@/context/AppContext';
import getImageUrl from '@/utils/imageUrl';

export default function SearchModal() {
  const { isSearchOpen, setIsSearchOpen, products } = useAppContext();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const inputRef = useRef(null);
  const router = useRouter();

  // Focus input when modal opens
  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      // Reset search when opening
      setQuery('');
      setResults([]);
    }
  }, [isSearchOpen]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setIsSearchOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setIsSearchOpen]);

  // Frontend Search Logic
  const handleSearch = (value) => {
    setQuery(value);
    
    if (!value.trim()) {
      setResults([]);
      return;
    }

    // Filter from the 'products' array coming from Context (Backend data)
    const filtered = products.filter(product => {
      const searchTerm = value.toLowerCase();
      const name = (product.title || product.name || '').toLowerCase();
      const model = (product.model || '').toLowerCase();
      const category = (product.category?.name || '').toLowerCase();
      
      return name.includes(searchTerm) || 
             model.includes(searchTerm) || 
             category.includes(searchTerm);
    });

    setResults(filtered.slice(0, 8)); // Limit to 8 results for cleaner UI
  };

  const navigateToProduct = (id) => {
    setIsSearchOpen(false);
    router.push(`/user/products/${id}`);
  };

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.2 } },
    exit: { opacity: 0, scale: 0.95, transition: { duration: 0.15 } }
  };

  const listVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <AnimatePresence>
      {isSearchOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[10vh] px-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setIsSearchOpen(false)}
          />

          {/* Modal Container */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative w-full max-w-3xl bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[70vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Search Header */}
            <div className="relative border-b border-gray-800">
              <div className="absolute left-6 top-1/2 -translate-y-1/2 text-[#0295E6] text-xl">
                <FiSearch />
              </div>
              <input
                ref={inputRef}
                type="text"
                placeholder="Search products, categories, or models..."
                className="w-full bg-transparent text-white text-lg placeholder-gray-500 py-6 pl-16 pr-16 focus:outline-none"
                value={query}
                onChange={(e) => handleSearch(e.target.value)}
              />
              <button
                onClick={() => setIsSearchOpen(false)}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-white bg-gray-800/50 hover:bg-gray-700 rounded-lg transition-all text-xs border border-gray-700"
              >
                ESC
              </button>
            </div>

            {/* Results Area */}
            <div className="overflow-y-auto custom-scrollbar p-2">
              
              {/* State: Empty Search (Show Suggestions) */}
              {!query && (
                <div className="py-12 px-6 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-800/50 mb-4 text-gray-600">
                     <FiSearch className="text-2xl" />
                  </div>
                  <p className="text-gray-400 text-sm">Start typing to search across {products.length} products</p>
                  
                  {/* Quick Suggestions */}
                  <div className="mt-8">
                     <p className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-4">Popular Categories</p>
                     <div className="flex flex-wrap justify-center gap-3">
                        {['Carbon Fiber', 'Alcantara', 'LED Display', 'Leather'].map((tag) => (
                           <button 
                             key={tag}
                             onClick={() => handleSearch(tag)}
                             className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-full text-xs text-gray-300 hover:text-white border border-gray-700 transition-colors"
                           >
                             {tag}
                           </button>
                        ))}
                     </div>
                  </div>
                </div>
              )}

              {/* State: No Results */}
              {query && results.length === 0 && (
                <div className="py-12 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-900/10 mb-4 text-red-500">
                     <FaBoxOpen className="text-2xl" />
                  </div>
                  <h3 className="text-white font-medium mb-1">No results found</h3>
                  <p className="text-gray-500 text-sm">We couldn't find anything matching "{query}"</p>
                </div>
              )}

              {/* State: Show Results */}
              {query && results.length > 0 && (
                <motion.div 
                  variants={listVariants}
                  initial="hidden"
                  animate="visible"
                  className="space-y-1"
                >
                  <div className="px-4 py-2 text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Products ({results.length})
                  </div>
                  
                  {results.map((product) => {
                     const imageSrc = product.images?.[0] ? getImageUrl(product.images[0]) : '/placeholder-product.jpg';
                     
                     return (
                      <motion.div
                        key={product._id || product.id}
                        variants={itemVariants}
                        onClick={() => navigateToProduct(product._id || product.id)}
                        className="group flex items-center gap-4 p-3 rounded-xl hover:bg-gray-800/80 cursor-pointer transition-all border border-transparent hover:border-gray-700"
                      >
                        {/* Thumbnail */}
                        <div className="w-14 h-14 rounded-lg overflow-hidden bg-gray-800 flex-shrink-0 relative">
                           <img 
                             src={imageSrc} 
                             alt={product.title} 
                             className="w-full h-full object-cover" 
                           />
                        </div>

                        {/* Details */}
                        <div className="flex-1 min-w-0">
                          <h4 className="text-gray-200 font-medium truncate group-hover:text-[#0295E6] transition-colors">
                            {product.title || product.name}
                          </h4>
                          <div className="flex items-center gap-2 mt-0.5">
                             <span className="text-xs text-gray-500">{product.model}</span>
                             {product.category && (
                                <>
                                  <span className="w-1 h-1 rounded-full bg-gray-600" />
                                  <span className="text-xs text-gray-500">{product.category.name}</span>
                                </>
                             )}
                          </div>
                        </div>

                        {/* Price & Action */}
                        <div className="text-right flex items-center gap-4">
                           <div className="flex flex-col items-end">
                             <span className="text-[#0295E6] font-bold text-sm">${product.price}</span>
                             <span className={`text-[10px] px-1.5 py-0.5 rounded ${product.inStock || product.stockStatus === 'inStock' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                                {product.inStock || product.stockStatus === 'inStock' ? 'In Stock' : 'Out Stock'}
                             </span>
                           </div>
                           <FiArrowRight className="text-gray-600 group-hover:text-white transition-colors" />
                        </div>
                      </motion.div>
                    );
                  })}
                </motion.div>
              )}
            </div>

            {/* Footer */}
            <div className="bg-gray-900 border-t border-gray-800 px-6 py-3 flex items-center justify-between text-xs text-gray-500">
               <div className="flex gap-4">
                 <span className="flex items-center gap-1"><kbd className="bg-gray-800 px-1.5 py-0.5 rounded text-gray-400 font-sans">↑↓</kbd> Navigate</span>
                 <span className="flex items-center gap-1"><kbd className="bg-gray-800 px-1.5 py-0.5 rounded text-gray-400 font-sans">↵</kbd> Select</span>
                 <span className="flex items-center gap-1"><kbd className="bg-gray-800 px-1.5 py-0.5 rounded text-gray-400 font-sans">esc</kbd> Close</span>
               </div>
               <div className="hidden sm:block">
                 <span className="text-[#0295E6]">Steer</span>Flux Search
               </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}