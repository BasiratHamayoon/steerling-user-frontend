'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaTimes, FaImage, FaBox } from 'react-icons/fa';

export default function CategoryModal({ isOpen, onClose, category, onSave }) {
  const [formData, setFormData] = useState({
    name: '',
    image: '',
    count: ''
  });

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name || '',
        image: category.image || '',
        count: category.count?.toString() || ''
      });
    } else {
      resetForm();
    }
  }, [category]);

  const resetForm = () => {
    setFormData({
      name: '',
      image: '',
      count: ''
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const categoryData = {
      ...formData,
      count: parseInt(formData.count) || 0
    };
    
    onSave(categoryData);
    onClose();
    resetForm();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-gray-900 rounded-2xl p-6 w-full max-w-md border border-gray-700/50"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">
            {category ? 'Edit Category' : 'Add New Category'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-800/50 rounded-lg transition-colors text-gray-400 hover:text-white"
          >
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Category Name */}
          <div>
            <label className="block text-sm font-medium mb-2 flex items-center gap-2">
              <FaImage className="text-[#0295E6]" />
              Category Name
            </label>
            <input
              type="text"
              required
              className="w-full px-4 py-3 bg-gray-800/50 rounded-xl border border-gray-700 focus:border-[#0295E6] focus:outline-none focus:ring-2 focus:ring-[#0295E6]/30"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              placeholder="Enter category name"
            />
          </div>

          {/* Image URL */}
          <div>
            <label className="block text-sm font-medium mb-2 flex items-center gap-2">
              <FaImage className="text-[#0295E6]" />
              Image URL
            </label>
            <input
              type="text"
              required
              className="w-full px-4 py-3 bg-gray-800/50 rounded-xl border border-gray-700 focus:border-[#0295E6] focus:outline-none focus:ring-2 focus:ring-[#0295E6]/30"
              value={formData.image}
              onChange={(e) => setFormData({...formData, image: e.target.value})}
              placeholder="Enter image URL"
            />
            <p className="text-xs text-gray-500 mt-2">
              Use high-quality images (800x600 recommended)
            </p>
          </div>

          {/* Product Count */}
          <div>
            <label className="block text-sm font-medium mb-2 flex items-center gap-2">
              <FaBox className="text-[#0295E6]" />
              Initial Product Count
            </label>
            <input
              type="number"
              required
              min="0"
              className="w-full px-4 py-3 bg-gray-800/50 rounded-xl border border-gray-700 focus:border-[#0295E6] focus:outline-none focus:ring-2 focus:ring-[#0295E6]/30"
              value={formData.count}
              onChange={(e) => setFormData({...formData, count: e.target.value})}
              placeholder="Enter product count"
            />
          </div>

          {/* Preview */}
          {formData.image && (
            <div className="mt-6">
              <label className="block text-sm font-medium mb-2">Preview</label>
              <div className="h-40 rounded-lg overflow-hidden border border-gray-700">
                <img
                  src={formData.image}
                  alt="Preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80';
                  }}
                />
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-4 pt-6 border-t border-gray-700/50">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-gradient-to-r from-[#0295E6] to-[#02b3e6] hover:from-[#0284c6] hover:to-[#0295E6] rounded-xl transition-colors font-semibold"
            >
              {category ? 'Update Category' : 'Create Category'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}