'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { FaWhatsapp, FaTimes, FaShieldAlt } from 'react-icons/fa';
import getImageUrl from '@/utils/imageUrl';

export default function OrderModal({ isOpen, onClose, product, quantity = 1 }) {
  if (!product) return null;

  const totalAmount = (product.price * quantity).toFixed(2);
  const contactNumber = "1234567890"; // Replace with your actual WhatsApp number (no +)
  
  const handleOrderClick = () => {
    const message = encodeURIComponent(
      `*New Order Request*\n\n` +
      `Product: ${product.title || product.name}\n` +
      `Model: ${product.model}\n` +
      `Price: $${product.price}\n` +
      `Quantity: ${quantity}\n` +
      `*Total: $${totalAmount}*\n\n` +
      `Please confirm availability and delivery details.`
    );
    
    window.open(`https://wa.me/${contactNumber}?text=${message}`, '_blank');
    onClose();
  };

  const imageSrc = product.images && product.images.length > 0 
    ? getImageUrl(product.images[0]) 
    : '/placeholder-product.jpg';

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
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
            initial={{ scale: 0.9, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 50 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-md bg-gray-900 border border-gray-700 rounded-3xl overflow-hidden shadow-2xl shadow-blue-500/10"
          >
            {/* Header */}
            <div className="bg-[#0295E6] p-6 text-center relative overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
               <button onClick={onClose} className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors bg-black/20 rounded-full p-2">
                 <FaTimes />
               </button>
               <h3 className="text-2xl font-bold text-white relative z-10">Confirm Order</h3>
               <p className="text-blue-100 text-sm mt-1 relative z-10">Complete your purchase via WhatsApp</p>
            </div>

            <div className="p-6">
              {/* Product Summary */}
              <div className="flex gap-4 mb-6 bg-gray-800/50 p-3 rounded-2xl border border-gray-700/50">
                <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-gray-800">
                  <img
                    src={imageSrc}
                    alt={product.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex flex-col justify-center">
                  <h4 className="font-semibold text-white line-clamp-1">{product.title || product.name}</h4>
                  <p className="text-gray-400 text-sm mb-1">{product.model}</p>
                  <span className="text-[#0295E6] font-bold">${product.price} x {quantity}</span>
                </div>
              </div>

              {/* Total Calculation */}
              <div className="flex justify-between items-center py-4 border-t border-b border-gray-800 mb-6">
                 <span className="text-gray-400 font-medium">Total Amount</span>
                 <span className="text-3xl font-bold text-white">${totalAmount}</span>
              </div>

              {/* Action Button */}
              <button
                onClick={handleOrderClick}
                className="w-full group flex items-center justify-center gap-3 bg-green-600 hover:bg-green-500 text-white py-4 rounded-xl text-lg font-bold transition-all duration-300 hover:shadow-lg hover:shadow-green-500/20 transform hover:-translate-y-1"
              >
                <FaWhatsapp className="text-2xl group-hover:scale-110 transition-transform" />
                Proceed to WhatsApp
              </button>

              <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-500">
                <FaShieldAlt />
                <span>Secure direct communication with seller</span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}