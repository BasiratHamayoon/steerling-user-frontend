'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaPlus, FaEdit, FaTrash, FaImage, FaTags } from 'react-icons/fa';
import { categories as initialCategories } from '@/data/categories';
import CategoryModal from '@/components/admin/CategoryModal';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState(initialCategories);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleSaveCategory = (categoryData) => {
    if (selectedCategory) {
      const updatedCategories = categories.map(c =>
        c.id === selectedCategory.id
          ? { ...c, ...categoryData, count: parseInt(categoryData.count) }
          : c
      );
      setCategories(updatedCategories);
      alert('Category updated successfully!');
    } else {
      const newCategory = {
        id: categories.length + 1,
        ...categoryData,
        count: parseInt(categoryData.count)
      };
      setCategories([...categories, newCategory]);
      alert('Category added successfully!');
    }
    setShowAddModal(false);
    setSelectedCategory(null);
  };

  const handleEditCategory = (category) => {
    setSelectedCategory(category);
    setShowAddModal(true);
  };

  const handleDeleteCategory = (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      setCategories(categories.filter(c => c.id !== id));
      alert('Category deleted successfully!');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Categories Management</h1>
          <p className="text-gray-400">Manage product categories and organization</p>
        </div>
        <button
          onClick={() => {
            setSelectedCategory(null);
            setShowAddModal(true);
          }}
          className="flex items-center gap-2 bg-gradient-to-r from-[#0295E6] to-[#02b3e6] hover:from-[#0284c6] hover:to-[#0295E6] text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105"
        >
          <FaPlus />
          Add New Category
        </button>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((category, index) => (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/30 overflow-hidden group"
          >
            <div className="relative h-48 overflow-hidden">
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute top-4 right-4 flex gap-2">
                <button
                  onClick={() => handleEditCategory(category)}
                  className="p-2 bg-blue-900/80 hover:bg-blue-800 rounded-lg transition-colors"
                  title="Edit"
                >
                  <FaEdit className="text-blue-300" />
                </button>
                <button
                  onClick={() => handleDeleteCategory(category.id)}
                  className="p-2 bg-red-900/80 hover:bg-red-800 rounded-lg transition-colors"
                  title="Delete"
                >
                  <FaTrash className="text-red-300" />
                </button>
              </div>
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-lg">{category.name}</h3>
                <span className="text-sm text-gray-400">{category.count} products</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <FaTags />
                <span>ID: {category.id}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Category Modal */}
      {showAddModal && (
        <CategoryModal
          isOpen={showAddModal}
          onClose={() => {
            setShowAddModal(false);
            setSelectedCategory(null);
          }}
          category={selectedCategory}
          onSave={handleSaveCategory}
        />
      )}
    </div>
  );
}