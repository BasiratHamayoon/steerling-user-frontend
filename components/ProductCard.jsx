'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { FaWhatsapp, FaStar } from 'react-icons/fa';

export default function ProductCard({ product }) {
  const whatsappMessage = `Hello, I'm interested in ${product.name} (Model: ${product.model})`;

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="card-hover bg-gray-800 rounded-xl overflow-hidden border border-gray-700"
    >
      <Link href={`/products/${product.id}`}>
        <div className="h-48 overflow-hidden relative">
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
          />
          {!product.inStock && (
            <div className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded text-sm">
              Out of Stock
            </div>
          )}
        </div>
      </Link>
      
      <div className="p-4">
        <Link href={`/products/${product.id}`}>
          <h3 className="font-semibold text-lg mb-2 hover:text-green-400 transition-colors">
            {product.name}
          </h3>
        </Link>
        
        <div className="flex items-center justify-between mb-3">
          <span className="text-2xl font-bold text-green-400">${product.price}</span>
          <div className="flex items-center gap-1 text-yellow-400">
            <FaStar />
            <span className="text-sm">4.8</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <span className={`px-3 py-1 rounded-full text-sm ${product.inStock ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'}`}>
            {product.inStock ? 'In Stock' : 'Out of Stock'}
          </span>
          
          <a
            href={`https://wa.me/+1234567890?text=${encodeURIComponent(whatsappMessage)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-full transition-colors"
          >
            <FaWhatsapp />
            <span>Order</span>
          </a>
        </div>
      </div>
    </motion.div>
  );
}