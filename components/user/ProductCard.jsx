'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { FaWhatsapp } from 'react-icons/fa';

export default function ProductCard({ product }) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      whileTap={{ scale: 0.98 }}
      className="bg-gray-900/50 rounded-xl overflow-hidden border border-gray-700/50 hover:border-[#0295E6]/30 transition-all duration-300"
    >
      <Link href={`/products/${product.id}`}>
        <div className="h-48 overflow-hidden relative">
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover object-center scale-110"
            style={{ objectPosition: 'center 30%' }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          {!product.inStock && (
            <div className="absolute top-3 right-3 bg-red-600/90 text-white px-3 py-1 rounded-full text-xs font-medium">
              Out of Stock
            </div>
          )}
        </div>
      </Link>
      
      <div className="p-4">
        <Link href={`/products/${product.id}`}>
          <h3 className="font-semibold text-lg mb-2 hover:text-[#0295E6] transition-colors line-clamp-1">
            {product.name}
          </h3>
        </Link>
        
        <div className="flex items-center justify-between mb-3">
          <span className="text-2xl font-bold text-[#0295E6]">${product.price}</span>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${product.inStock ? 'bg-[#0295E6]/30 text-[#0295E6]' : 'bg-red-900/30 text-red-300'}`}>
            {product.inStock ? 'In Stock' : 'Out of Stock'}
          </span>
        </div>
        
        <a
          href={`https://wa.me/+1234567890?text=${encodeURIComponent(`Hello, I'm interested in ${product.name} (Model: ${product.model})`)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-all duration-300 hover:scale-105 w-full"
        >
          <FaWhatsapp />
          <span>Order Now</span>
        </a>
      </div>
    </motion.div>
  );
}