'use client';

import getImageUrl from '@/utils/imageUrl';
import { motion } from 'framer-motion';
import { FaEye, FaEdit, FaTrash, FaCircle } from 'react-icons/fa';

export default function TableRow({ item, index, onView, onEdit, onDelete }) {
  const isInStock = item.stockStatus === 'inStock' || item.quantity > 0;

  return (
    <motion.tr
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="group border-b border-gray-800/50 hover:bg-gray-800/40 transition-colors"
    >
      {/* Product / Image */}
      <td className="py-4 px-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg border border-gray-700 overflow-hidden bg-gray-800 flex-shrink-0">
            <img
              src={getImageUrl(item.images?.[0]) || '/placeholder-product.jpg'}
              alt={item.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              onError={(e) => { e.target.onerror = null; e.target.src = '/placeholder-product.jpg'; }}
            />
          </div>
          <div>
            <p className="font-bold text-white group-hover:text-[#0295E6] transition-colors line-clamp-1">{item.title}</p>
            <p className="text-xs text-gray-500 font-mono uppercase tracking-wide">{item.model}</p>
          </div>
        </div>
      </td>
      
      {/* Category */}
      <td className="py-4 px-6">
        <span className="inline-block px-3 py-1 rounded-md bg-gray-900 border border-gray-700 text-xs text-gray-300 font-medium">
          {item.category?.name || 'Uncategorized'}
        </span>
      </td>
      
      {/* Price */}
      <td className="py-4 px-6">
        <span className="font-mono text-[#0295E6] font-bold">${item.price?.toFixed(2)}</span>
      </td>
      
      {/* Quantity */}
      <td className="py-4 px-6 text-gray-300 font-mono text-sm">
        {item.quantity} units
      </td>
      
      {/* Status */}
      <td className="py-4 px-6">
        <div className={`flex items-center gap-2 text-xs font-bold uppercase tracking-wide ${isInStock ? 'text-green-400' : 'text-red-400'}`}>
          <FaCircle size={8} className={isInStock ? 'animate-pulse' : ''} />
          {isInStock ? 'In Stock' : 'Out of Stock'}
        </div>
      </td>
      
      {/* Actions - Always Visible */}
      <td className="py-4 px-6 text-right">
        <div className="flex items-center justify-end gap-2">
          <button onClick={() => onView(item)} className="p-2 rounded-lg bg-gray-900 text-gray-400 hover:text-white hover:bg-gray-700 transition-colors" title="View Details">
            <FaEye />
          </button>
          <button onClick={() => onEdit(item)} className="p-2 rounded-lg bg-gray-900 text-blue-400 hover:text-white hover:bg-blue-600 transition-colors" title="Edit Product">
            <FaEdit />
          </button>
          <button onClick={() => onDelete(item)} className="p-2 rounded-lg bg-gray-900 text-red-400 hover:text-white hover:bg-red-600 transition-colors" title="Delete Product">
            <FaTrash />
          </button>
        </div>
      </td>
    </motion.tr>
  );
}