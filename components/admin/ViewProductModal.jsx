'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaCheckCircle, FaTimesCircle, FaTag, FaBoxOpen } from 'react-icons/fa';
import getImageUrl from '@/utils/imageUrl';
import { useState } from 'react';

export default function ViewProductModal({ isOpen, onClose, product }) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  if (!isOpen || !product) return null;

  const images = product.images?.length > 0 ? product.images : ['/placeholder-product.jpg'];
  const isInStock = product.stockStatus === 'inStock' || product.quantity > 0;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        />

        {/* Modal Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-800 bg-gray-900/50">
            <div>
              <h2 className="text-xl font-bold text-white">Product Details</h2>
              <p className="text-sm text-gray-500">ID: {product._id}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
            >
              <FaTimes size={20} />
            </button>
          </div>

          {/* Scrollable Body */}
          <div className="overflow-y-auto p-6 custom-scrollbar">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Left Column: Images */}
              <div className="space-y-4">
                <div className="aspect-square bg-gray-950 rounded-xl border border-gray-800 overflow-hidden flex items-center justify-center relative group">
                  <img
                    src={getImageUrl(images[selectedImageIndex])}
                    alt={product.title}
                    className="w-full h-full object-contain"
                    onError={(e) => { e.target.onerror = null; e.target.src = '/placeholder-product.jpg'; }}
                  />
                  <div className="absolute top-3 right-3">
                     <span className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-2 ${isInStock ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                        {isInStock ? <FaCheckCircle /> : <FaTimesCircle />}
                        {isInStock ? 'In Stock' : 'Out of Stock'}
                     </span>
                  </div>
                </div>
                
                {/* Thumbnails */}
                {images.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {images.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedImageIndex(idx)}
                        className={`w-16 h-16 rounded-lg border-2 overflow-hidden flex-shrink-0 transition-all ${
                          selectedImageIndex === idx ? 'border-[#0295E6] opacity-100' : 'border-transparent opacity-60 hover:opacity-100'
                        }`}
                      >
                        <img src={getImageUrl(img)} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Right Column: Details */}
              <div className="space-y-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[#0295E6] text-xs font-bold tracking-widest uppercase">{product.brand || 'No Brand'}</span>
                    <span className="text-gray-600">•</span>
                    <span className="text-gray-400 text-xs uppercase">{product.model}</span>
                  </div>
                  <h1 className="text-3xl font-bold text-white mb-4 leading-tight">{product.title}</h1>
                  <div className="flex items-center gap-4 p-4 bg-gray-950 rounded-xl border border-gray-800">
                    <div className="flex flex-col">
                        <span className="text-xs text-gray-500 uppercase font-bold">Price</span>
                        <span className="text-2xl font-mono font-bold text-[#0295E6]">${product.price?.toFixed(2)}</span>
                    </div>
                    <div className="w-px h-10 bg-gray-800"></div>
                    <div className="flex flex-col">
                        <span className="text-xs text-gray-500 uppercase font-bold">Quantity</span>
                        <span className="text-xl font-mono text-white flex items-center gap-2">
                            <FaBoxOpen className="text-gray-600 text-lg" />
                            {product.quantity}
                        </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                    <h3 className="text-sm font-bold text-gray-300 uppercase tracking-wide">Category</h3>
                    <div className="flex items-center gap-2">
                        <FaTag className="text-[#0295E6]" />
                        <span className="text-gray-300">{product.category?.name || 'Uncategorized'}</span>
                    </div>
                </div>

                <div className="space-y-2">
                    <h3 className="text-sm font-bold text-gray-300 uppercase tracking-wide">Description</h3>
                    <p className="text-gray-400 text-sm leading-relaxed whitespace-pre-wrap">{product.description}</p>
                </div>

                {product.specifications && Object.keys(product.specifications).length > 0 && (
                   <div className="space-y-3">
                      <h3 className="text-sm font-bold text-gray-300 uppercase tracking-wide">Specifications</h3>
                      <div className="grid grid-cols-2 gap-3">
                         {Object.entries(product.specifications).map(([key, value]) => (
                            <div key={key} className="bg-gray-950 p-3 rounded-lg border border-gray-800">
                                <span className="block text-[10px] text-gray-500 uppercase mb-1">{key}</span>
                                <span className="text-sm text-gray-200 font-medium">{value}</span>
                            </div>
                         ))}
                      </div>
                   </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}