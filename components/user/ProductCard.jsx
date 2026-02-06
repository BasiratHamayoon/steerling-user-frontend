'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { FaWhatsapp, FaShoppingCart } from 'react-icons/fa';
import { useAppContext } from '@/context/AppContext';
import getImageUrl from '@/utils/imageUrl';

export default function ProductCard({ product }) {
  const { addToCart } = useAppContext();
  
  const productId = product._id || product.id;
  const productName = product.title || product.name;
  const productModel = product.model || '';
  const isInStock = product.stockStatus === 'inStock' || product.inStock;
  const productPrice = product.price || 0;
  const productImage = product.images?.[0] || '/placeholder-product.jpg';

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isInStock) {
      addToCart(product, 1);
    }
  };

  const whatsappNumber = '+1234567890'; 
  const whatsappMessage = encodeURIComponent(
    `Hello, I'm interested in ${productName}${productModel ? ` (Model: ${productModel})` : ''}`
  );
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  return (
    <motion.div
      whileHover={{ y: -5 }}
      whileTap={{ scale: 0.98 }}
      className="bg-gray-900/50 rounded-xl overflow-hidden border border-gray-700/50 hover:border-green-500/30 transition-all duration-300"
    >
      <Link href={`/products/${productId}`}>
        <div className="h-48 overflow-hidden relative">
          <img
            src={getImageUrl(productImage)}
            alt={productName}
            className="w-full h-full object-cover object-center scale-110"
            style={{ objectPosition: 'center 30%' }}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/placeholder-product.jpg';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          
          {!isInStock && (
            <div className="absolute top-3 right-3 bg-red-600/90 text-white px-3 py-1 rounded-full text-xs font-medium">
              Out of Stock
            </div>
          )}
          
          {product.category?.name && (
            <div className="absolute top-3 left-3 bg-black/70 text-white px-3 py-1 rounded-full text-xs font-medium">
              {product.category.name}
            </div>
          )}
        </div>
      </Link>
      
      <div className="p-4">
        <Link href={`/products/${productId}`}>
          <h3 className="font-semibold text-lg mb-1 hover:text-green-400 transition-colors line-clamp-1">
            {productName}
          </h3>
        </Link>
        
        {productModel && (
          <p className="text-gray-500 text-xs mb-2">{productModel}</p>
        )}
        
        <div className="flex items-center justify-between mb-3">
          <span className="text-2xl font-bold text-green-400">
            ${productPrice.toFixed(2)}
          </span>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
            isInStock 
              ? 'bg-green-900/30 text-green-300' 
              : 'bg-red-900/30 text-red-300'
          }`}>
            {isInStock ? 'In Stock' : 'Out of Stock'}
          </span>
        </div>
        
        <div className="flex gap-2">
      
          
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg transition-all duration-300 hover:scale-105"
          >
            <FaWhatsapp className="text-lg" />
            <span className="text-sm">Order Now</span>
          </a>
        </div>
      </div>
    </motion.div>
  );
}