'use client';

import { motion } from 'framer-motion';
import { FaEye, FaEdit, FaTrash, FaBox } from 'react-icons/fa';

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
          {isProduct ? (
            <>
              <div className="w-12 h-12 rounded-lg overflow-hidden">
                <img
                  src={item.images?.[0] || 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=800&q=80'}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <p className="font-semibold">{item.name}</p>
                <p className="text-sm text-gray-400">{item.model}</p>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg overflow-hidden">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <p className="font-semibold">{item.name}</p>
                <p className="text-sm text-gray-400">ID: {item.id}</p>
              </div>
            </div>
          )}
        </div>
      </td>
      
      {isProduct && (
        <td className="py-4 px-6">
          <span className="px-3 py-1 bg-gray-700/50 rounded-full text-sm">
            {item.category}
          </span>
        </td>
      )}
      
      {isProduct ? (
        <td className="py-4 px-6 font-bold text-[#0295E6]">
          ${item.price}
        </td>
      ) : (
        <td className="py-4 px-6">
          <span className="px-3 py-1 bg-gray-700/50 rounded-full text-sm">
            {item.count} products
          </span>
        </td>
      )}
      
      {isProduct && (
        <td className="py-4 px-6">
          {item.stockCount}
        </td>
      )}
      
      {isProduct && (
        <td className="py-4 px-6">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
            item.inStock ? 'bg-green-900/30 text-green-300' : 'bg-red-900/30 text-red-300'
          }`}>
            {item.inStock ? 'In Stock' : 'Out of Stock'}
          </span>
        </td>
      )}
      
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