'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { FaWhatsapp, FaTimes, FaTruck } from 'react-icons/fa';

export default function OrderModal({ isOpen, onClose, product, quantity }) {
  const totalAmount = (product?.price * quantity).toFixed(2);
  const whatsappMessage = `Hello, I want to order:\nProduct: ${product?.name}\nModel: ${product?.model}\nQuantity: ${quantity}\nTotal: $${totalAmount}\nDelivery Method: Cash on Delivery`;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25 }}
            className="relative bg-gray-900/90 backdrop-blur-md rounded-2xl p-6 w-full max-w-md border border-gray-700/50"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              className="absolute right-4 top-4 p-2 hover:bg-gray-800/50 rounded-full transition-colors"
            >
              <FaTimes />
            </button>

            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold mb-2">Complete Your Order</h3>
              <div className="flex items-center justify-center gap-2 text-green-400">
                <FaTruck />
                <span>Cash on Delivery Available</span>
              </div>
            </div>

            <div className="mb-6 p-4 bg-gray-800/50 rounded-xl">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-20 h-20 rounded overflow-hidden">
                  <img
                    src={product?.images[0]}
                    alt={product?.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold">{product?.name}</h4>
                  <p className="text-sm text-gray-400">Model: {product?.model}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${product?.inStock ? 'bg-green-900/30 text-green-300' : 'bg-red-900/30 text-red-300'}`}>
                      {product?.inStock ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-400">Price:</span>
                  <span>${product?.price}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Quantity:</span>
                  <span>{quantity}</span>
                </div>
                <div className="flex justify-between border-t border-gray-700 pt-2">
                  <span className="font-semibold">Total Amount:</span>
                  <span className="text-2xl font-bold text-green-400">${totalAmount}</span>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h4 className="font-semibold mb-2">Description:</h4>
              <p className="text-gray-300 text-sm">{product?.description}</p>
            </div>

            <a
              href={`https://wa.me/+1234567890?text=${encodeURIComponent(whatsappMessage)}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={onClose}
              className="flex items-center justify-center gap-3 bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 hover:scale-105 w-full"
            >
              <FaWhatsapp className="text-2xl" />
              Order Now on WhatsApp
            </a>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-400">
                Click above to open WhatsApp and complete your order
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}