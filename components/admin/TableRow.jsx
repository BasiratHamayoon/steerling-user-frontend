'use client';

import getImageUrl from '@/utils/imageUrl';
import { motion } from 'framer-motion';
import { FaEye, FaEdit, FaTrash } from 'react-icons/fa';

export default function TableRow({ item, index, onView, onEdit, onDelete, type = 'product' }) {
  const isProduct = type === 'product';

  return (
    <motion.tr
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="border-t border-gray-700/30 hover:bg-gray-700/20 transition-colors"
    >
      <td className="py-4 px-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg overflow-hidden">
            <img
              src={getImageUrl(item.images?.[0]) || '/placeholder-product.jpg'}
              alt={item.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/placeholder-product.jpg';
              }}
            />
          </div>
          <div>
            <p className="font-semibold">{item.title}</p>
            <p className="text-sm text-gray-400">{item.model}</p>
          </div>
        </div>
      </td>
      
      <td className="py-4 px-6">
        <span className="px-3 py-1 bg-gray-700/50 rounded-full text-sm">
          {item.category?.name || 'Uncategorized'}
        </span>
      </td>
      
      <td className="py-4 px-6 font-bold text-[#0295E6]">
        ${item.price}
      </td>
      
      <td className="py-4 px-6">
        {item.quantity}
      </td>
      
      <td className="py-4 px-6">
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
          item.stockStatus === 'inStock' ? 'bg-green-900/30 text-green-300' : 'bg-red-900/30 text-red-300'
        }`}>
          {item.stockStatus === 'inStock' ? 'In Stock' : 'Out of Stock'}
        </span>
      </td>
      
      <td className="py-4 px-6">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onView(item)}
            className="p-2 hover:bg-gray-700/50 rounded-lg transition-colors text-gray-400 hover:text-white"
            title="View"
          >
            <FaEye />
          </button>
          <button
            onClick={() => onEdit(item)}
            className="p-2 hover:bg-blue-900/30 rounded-lg transition-colors text-blue-400"
            title="Edit"
          >
            <FaEdit />
          </button>
          <button
            onClick={() => onDelete(item)}
            className="p-2 hover:bg-red-900/30 rounded-lg transition-colors text-red-400"
            title="Delete"
          >
            <FaTrash />
          </button>
        </div>
      </td>
    </motion.tr>
  );
}