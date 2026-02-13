'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { FaWhatsapp, FaEye } from 'react-icons/fa';
import getImageUrl from '@/utils/imageUrl';

export default function ProductCard({ product, onOrder }) {
  // Safe Accessors to prevent crashes if data is missing
  const productId = product._id || product.id;
  const productName = product.title || product.name || 'Untitled Product';
  const productModel = product.model || product.brand || 'Premium';
  
  // Check stock status (support various backend naming conventions)
  const isInStock = product.stockStatus === 'inStock' || product.inStock === true || product.quantity > 0;
  
  // Ensure price is a number
  const productPrice = parseFloat(product.price) || 0;
  
  // Get Image or Placeholder
  const rawImage = product.images?.[0] || product.image;
  const displayImage = rawImage ? getImageUrl(rawImage) : '/placeholder-product.jpg';

  // Safely get category name
  const categoryName = typeof product.category === 'object' ? product.category?.name : null;

  return (
    <motion.div
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      whileHover={{ y: -5 }}
      className="group relative bg-gray-900 rounded-2xl overflow-hidden border border-gray-800 hover:border-[#0295E6]/50 shadow-lg hover:shadow-[#0295E6]/20 transition-all duration-300 flex flex-col h-full"
    >
      {/* 1. Image Section - Fixed Height */}
      <div className="relative h-56 sm:h-64 w-full bg-gray-950 overflow-hidden shrink-0">
        <Link href={`/user/products/${productId}`} className="block w-full h-full">
            <img
              src={displayImage}
              alt={productName}
              className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-110"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/placeholder-product.jpg'; // Ensure you have this image in /public
              }}
            />
            
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-60" />
            
            {/* Category Badge */}
            {categoryName && (
              <div className="absolute top-3 left-3">
                <span className="bg-black/60 backdrop-blur-md text-white px-2 py-1 rounded-md text-[10px] uppercase font-bold tracking-wider border border-white/10">
                  {categoryName}
                </span>
              </div>
            )}

            {/* Stock Badge */}
            {!isInStock && (
               <div className="absolute top-3 right-3 bg-red-600/90 text-white px-2 py-1 rounded text-[10px] font-bold shadow-lg uppercase tracking-wider">
                 Sold Out
               </div>
            )}
            
            {/* Hover Action */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <span className="bg-white/10 backdrop-blur-md text-white px-4 py-2 rounded-full flex items-center gap-2 border border-white/20 text-sm font-medium hover:bg-white/20">
                <FaEye /> View
              </span>
            </div>
        </Link>
      </div>

      {/* 2. Content Section - Fills remaining height */}
      <div className="p-4 flex flex-col flex-grow relative z-10">
        <div className="mb-auto">
          <Link href={`/user/products/${productId}`}>
            <h3 className="font-bold text-base text-white mb-1 group-hover:text-[#0295E6] transition-colors line-clamp-1" title={productName}>
              {productName}
            </h3>
          </Link>
          <p className="text-gray-500 text-xs mb-3 font-medium tracking-wide uppercase line-clamp-1">
            {productModel}
          </p>
        </div>

        {/* Price & Action */}
        <div className="mt-3 pt-3 border-t border-gray-800">
          <div className="flex items-center justify-between mb-3">
            <div className="flex flex-col">
              <span className="text-[10px] text-gray-500 uppercase tracking-wider">Price</span>
              <span className="text-lg font-bold text-[#0295E6]">
                ${productPrice.toFixed(2)}
              </span>
            </div>
            <div className={`text-[10px] px-2 py-0.5 rounded border ${isInStock ? 'border-green-500/20 text-green-400 bg-green-500/5' : 'border-red-500/20 text-red-400 bg-red-500/5'}`}>
               {isInStock ? 'In Stock' : 'Out of Stock'}
            </div>
          </div>

          <button
            onClick={() => onOrder(product)}
            disabled={!isInStock}
            className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 ${
              isInStock 
                ? 'bg-[#0295E6] hover:bg-[#027ab5] text-white shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 hover:-translate-y-0.5' 
                : 'bg-gray-800 text-gray-500 cursor-not-allowed'
            }`}
          >
            <FaWhatsapp className="text-lg" />
            <span>{isInStock ? 'Order Now' : 'Unavailable'}</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}