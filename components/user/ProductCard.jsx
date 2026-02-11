'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { FaWhatsapp, FaEye } from 'react-icons/fa';
import getImageUrl from '@/utils/imageUrl';

export default function ProductCard({ product, onOrder }) {
  const productId = product._id || product.id;
  const productName = product.title || product.name;
  const productModel = product.model || '';
  const isInStock = product.stockStatus === 'inStock' || product.inStock;
  const productPrice = product.price || 0;
  const productImage = product.images?.[0] || '/placeholder-product.jpg';

  return (
    <motion.div
      layout
      whileHover={{ y: -8 }}
      className="group relative bg-gray-900 rounded-2xl overflow-hidden border border-gray-800 hover:border-[#0295E6]/50 shadow-lg hover:shadow-[#0295E6]/20 transition-all duration-500"
    >
      {/* Image Section */}
      <div className="relative h-64 overflow-hidden">
        <Link href={`/user/products/${productId}`}>
          <div className="w-full h-full">
             <img
              src={getImageUrl(productImage)}
              alt={productName}
              className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-110"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/placeholder-product.jpg';
              }}
            />
            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-60" />
            
            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-2">
              {product.category?.name && (
                <span className="bg-black/60 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-medium border border-white/10">
                  {product.category.name}
                </span>
              )}
            </div>

            {!isInStock && (
               <div className="absolute top-3 right-3 bg-red-600/90 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                 Out of Stock
               </div>
            )}
            
            {/* Hover Action - Quick View */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
              <span className="bg-white/10 backdrop-blur-md text-white px-4 py-2 rounded-full flex items-center gap-2 border border-white/20">
                <FaEye /> View Details
              </span>
            </div>
          </div>
        </Link>
      </div>

      {/* Content Section */}
      <div className="p-5 flex flex-col h-full relative z-10">
        <div className="mb-auto">
          <Link href={`/user/products/${productId}`}>
            <h3 className="font-bold text-lg text-white mb-1 group-hover:text-[#0295E6] transition-colors line-clamp-1">
              {productName}
            </h3>
          </Link>
          <p className="text-gray-400 text-xs mb-3 font-medium tracking-wide uppercase">
            {productModel}
          </p>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <div className="flex flex-col">
              <span className="text-xs text-gray-500">Price</span>
              <span className="text-2xl font-bold text-[#0295E6]">
                ${productPrice.toFixed(2)}
              </span>
            </div>
            <div className={`text-xs px-2 py-1 rounded border ${isInStock ? 'border-green-500/30 text-green-400' : 'border-red-500/30 text-red-400'}`}>
               {isInStock ? 'Available' : 'Unavailable'}
            </div>
          </div>

          <button
            onClick={() => onOrder(product)}
            disabled={!isInStock}
            className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold transition-all duration-300 relative overflow-hidden ${
              isInStock 
                ? 'bg-gradient-to-r from-[#0295E6] to-[#0077b6] text-white shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-[1.02]' 
                : 'bg-gray-800 text-gray-500 cursor-not-allowed'
            }`}
          >
            <FaWhatsapp className="text-xl" />
            <span>{isInStock ? 'Order via WhatsApp' : 'Out of Stock'}</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}