'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaPlus, FaEdit, FaTrash, FaImage, FaTags, FaEye, FaEyeSlash, FaSearch, FaFilter, FaCalendarAlt, FaBox } from 'react-icons/fa';
import { useAppContext } from '@/context/AppContext';
import CategoryModal from '@/components/admin/CategoryModal';
import ConfirmationModal from '@/components/admin/ConfirmationModal';
import getImageUrl from '@/utils/imageUrl';
import Loading from '@/components/ui/Loading';

export default function AdminCategoriesPage() {
  const {
    categories,
    categoriesLoading,
    categoriesPagination,
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory
  } = useAppContext();

  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('all');
  const [saveLoading, setSaveLoading] = useState(false);
  const [localSearch, setLocalSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(localSearch), 500);
    return () => clearTimeout(timer);
  }, [localSearch]);

  // Fetch Data
  useEffect(() => {
    const loadCategories = async () => {
      const params = {
        page: currentPage,
        limit: 12,
        search: debouncedSearch || undefined,
        isActive: statusFilter !== 'all' ? (statusFilter === 'active') : undefined
      };
      await fetchCategories(params);
    };
    loadCategories();
  }, [currentPage, debouncedSearch, statusFilter, fetchCategories]);

  // Handlers
  const handleSaveCategory = async (formData) => {
    try {
      setSaveLoading(true);
      const categoryData = new FormData();
      categoryData.append('name', formData.name);
      if (formData.description) categoryData.append('description', formData.description);
      categoryData.append('isActive', formData.isActive);
      
      if (formData.imageType === 'file' && formData.imageFile) categoryData.append('image', formData.imageFile);
      else if (formData.imageType === 'url' && formData.imageUrl) categoryData.append('image', formData.imageUrl);
      else if (formData.imageType === 'url' && !formData.imageUrl) categoryData.append('image', ''); // Remove image
      
      const response = selectedCategory 
        ? await updateCategory(selectedCategory._id, categoryData)
        : await createCategory(categoryData);
      
      if (response.success) {
        setShowAddModal(false);
        setSelectedCategory(null);
      }
    } catch (error) {
      console.error('Error saving category:', error);
    } finally {
      setSaveLoading(false);
    }
  };

  const handleEditCategory = (category) => { setSelectedCategory(category); setShowAddModal(true); };
  const handleDeleteClick = (category) => { setCategoryToDelete(category); setShowDeleteModal(true); };
  
  const handleDeleteConfirm = async () => {
    if (categoryToDelete) {
      await deleteCategory(categoryToDelete._id);
      setShowDeleteModal(false);
      setCategoryToDelete(null);
    }
  };

  const handleToggleStatus = async (category) => {
    try {
      const formData = new FormData();
      formData.append('name', category.name);
      if (category.description) formData.append('description', category.description);
      formData.append('isActive', !category.isActive);
      if (category.image) formData.append('image', category.image);
      await updateCategory(category._id, formData);
    } catch (error) {
      console.error('Error toggling status:', error);
    }
  };

  const clearFilters = () => {
    setLocalSearch('');
    setStatusFilter('all');
    setCurrentPage(1);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  // --- UI RENDER ---

  if (categoriesLoading && categories.length === 0) return <Loading text="Loading Catalog..." />;

  return (
    <div className="space-y-8 min-h-screen">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-gray-800">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tight mb-2">
            Category <span className="text-[#0295E6]">Manager</span>
          </h1>
          <p className="text-gray-400">Organize your products into collections.</p>
        </div>
        <button
          onClick={() => { setSelectedCategory(null); setShowAddModal(true); }}
          className="flex items-center gap-2 bg-gradient-to-r from-[#0295E6] to-[#0077b6] hover:from-[#0284c6] hover:to-[#00669c] text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-blue-900/20 hover:shadow-blue-900/40 hover:-translate-y-1 transition-all"
        >
          <FaPlus /> <span>New Category</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-4 flex flex-col md:flex-row gap-4 items-center justify-between shadow-lg">
        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
          {/* Search */}
          <div className="relative group w-full md:w-80">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#0295E6] transition-colors">
              <FaSearch />
            </div>
            <input
              type="text"
              placeholder="Search categories..."
              className="w-full pl-11 pr-10 py-3 bg-gray-950 border border-gray-800 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-[#0295E6] focus:ring-1 focus:ring-[#0295E6] transition-all"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
            />
            {localSearch && (
              <button onClick={() => setLocalSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"><FaPlus className="rotate-45" /></button>
            )}
          </div>

          {/* Status Select */}
          <div className="relative w-full md:w-48">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
              <FaFilter />
            </div>
            <select
              className="w-full pl-11 pr-8 py-3 bg-gray-950 border border-gray-800 rounded-xl text-white appearance-none focus:outline-none focus:border-[#0295E6] transition-all cursor-pointer"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="active">Active Only</option>
              <option value="inactive">Hidden Only</option>
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none text-xs">▼</div>
          </div>
        </div>

        {/* Counts & Clear */}
        <div className="flex items-center gap-4 text-sm text-gray-400">
          <span className="bg-gray-800 px-3 py-1 rounded-lg border border-gray-700">
            <span className="text-white font-bold">{categoriesPagination?.total || 0}</span> Found
          </span>
          {(localSearch || statusFilter !== 'all') && (
            <button onClick={clearFilters} className="text-[#0295E6] hover:text-white underline decoration-dashed">
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Grid Content */}
      {categories.length === 0 && !categoriesLoading ? (
        <div className="text-center py-20 bg-gray-900/30 rounded-3xl border border-gray-800 border-dashed">
          <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-600 text-3xl">
            <FaImage />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">No categories found</h3>
          <p className="text-gray-500 max-w-sm mx-auto mb-6">
            We couldn't find any categories matching your criteria. Try different filters or create a new one.
          </p>
          <button onClick={clearFilters} className="px-6 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors">
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <motion.div
              key={category._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="group bg-gray-900 border border-gray-800 hover:border-gray-700 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full"
            >
              {/* Image Area */}
              <div className="relative h-48 overflow-hidden bg-gray-950">
                <img
                  src={getImageUrl(category.image)}
                  alt={category.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  onError={(e) => { e.target.onerror = null; e.target.src = '/placeholder-category.jpg'; }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent opacity-80" />
                
                {/* Floating Actions */}
                <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-[-10px] group-hover:translate-y-0">
                  <button 
                    onClick={() => handleEditCategory(category)} 
                    className="p-2 bg-white/10 backdrop-blur-md text-white hover:bg-[#0295E6] rounded-lg transition-colors shadow-lg" 
                    title="Edit"
                  >
                    <FaEdit />
                  </button>
                  <button 
                    onClick={() => handleDeleteClick(category)} 
                    className="p-2 bg-white/10 backdrop-blur-md text-white hover:bg-red-500 rounded-lg transition-colors shadow-lg" 
                    title="Delete"
                  >
                    <FaTrash />
                  </button>
                </div>

                {/* Status Badge */}
                <div className="absolute top-3 left-3">
                  <button
                    onClick={() => handleToggleStatus(category)}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide backdrop-blur-md border shadow-lg transition-all ${
                      category.isActive 
                        ? 'bg-green-500/20 text-green-400 border-green-500/30 hover:bg-green-500/30' 
                        : 'bg-red-500/20 text-red-400 border-red-500/30 hover:bg-red-500/30'
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${category.isActive ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`} />
                    {category.isActive ? 'Active' : 'Hidden'}
                  </button>
                </div>
              </div>

              {/* Content Area */}
              <div className="p-5 flex flex-col flex-1">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold text-white line-clamp-1 group-hover:text-[#0295E6] transition-colors">{category.name}</h3>
                  <div className="flex items-center gap-1 text-xs text-gray-500 bg-gray-800 px-2 py-1 rounded-md border border-gray-700">
                    <FaBox className="text-[#0295E6]" /> 
                    <span>{category.productCount || 0}</span>
                  </div>
                </div>
                
                <p className="text-sm text-gray-400 line-clamp-2 mb-4 flex-1">
                  {category.description || 'No description provided.'}
                </p>

                <div className="pt-4 border-t border-gray-800 flex justify-between items-center text-xs text-gray-500 font-mono">
                  <div className="flex items-center gap-1.5">
                    <FaTags className="opacity-50" />
                    <span className="truncate max-w-[80px]" title={category._id}>#{category._id.slice(-6)}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <FaCalendarAlt className="opacity-50" />
                    <span>{formatDate(category.createdAt)}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {categoriesPagination && categoriesPagination.totalPages > 1 && (
        <div className="flex justify-between items-center bg-gray-900/50 backdrop-blur-sm p-4 rounded-xl border border-gray-800">
          <span className="text-sm text-gray-400">
            Page <span className="text-white font-bold">{currentPage}</span> of {categoriesPagination.totalPages}
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-gray-800 hover:bg-gray-700 disabled:opacity-50 rounded-lg text-sm font-bold transition-colors"
            >
              Prev
            </button>
            <button
              onClick={() => setCurrentPage(prev => Math.min(categoriesPagination.totalPages, prev + 1))}
              disabled={currentPage === categoriesPagination.totalPages}
              className="px-4 py-2 bg-gray-800 hover:bg-gray-700 disabled:opacity-50 rounded-lg text-sm font-bold transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}

      <CategoryModal
        isOpen={showAddModal}
        onClose={() => { setShowAddModal(false); setSelectedCategory(null); }}
        category={selectedCategory}
        onSave={handleSaveCategory}
        loading={saveLoading}
      />

      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => { setShowDeleteModal(false); setCategoryToDelete(null); }}
        onConfirm={handleDeleteConfirm}
        title="Delete Category"
        message={`Are you sure you want to delete "${categoryToDelete?.name}"? Items in this category will be uncategorized.`}
        type="danger"
      />
    </div>
  );
}