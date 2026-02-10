'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaPlus, FaEdit, FaTrash, FaImage, FaTags, FaEye, FaEyeSlash, FaSearch, FaFilter } from 'react-icons/fa';
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
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [saveLoading, setSaveLoading] = useState(false);
  const [localSearch, setLocalSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [activeFilters, setActiveFilters] = useState({
    search: false,
    status: false
  });

  // Debounce search to avoid too many API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(localSearch);
    }, 500);

    return () => clearTimeout(timer);
  }, [localSearch]);

  // Fetch categories when filters change
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

  const handleSaveCategory = async (formData) => {
    try {
      setSaveLoading(true);
      
      // Create FormData object
      const categoryData = new FormData();
      categoryData.append('name', formData.name);
      
      if (formData.description) {
        categoryData.append('description', formData.description);
      }
      
      if (formData.isActive !== undefined) {
        categoryData.append('isActive', formData.isActive);
      }
      
      // Handle image - file upload or URL
      if (formData.imageType === 'file' && formData.imageFile) {
        categoryData.append('image', formData.imageFile);
      } else if (formData.imageType === 'url' && formData.imageUrl) {
        categoryData.append('image', formData.imageUrl);
      } else if (formData.imageType === 'url' && !formData.imageUrl) {
        // If editing and removing image, send empty string
        categoryData.append('image', '');
      }
      
      let response;
      if (selectedCategory) {
        response = await updateCategory(selectedCategory._id, categoryData);
      } else {
        response = await createCategory(categoryData);
      }
      
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

  const handleEditCategory = (category) => {
    setSelectedCategory(category);
    setShowAddModal(true);
  };

  const handleDeleteClick = (category) => {
    setCategoryToDelete(category);
    setShowDeleteModal(true);
  };

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
      
      if (category.description) {
        formData.append('description', category.description);
      }
      
      formData.append('isActive', !category.isActive);
      
      if (category.image) {
        formData.append('image', category.image);
      }
      
      await updateCategory(category._id, formData);
    } catch (error) {
      console.error('Error toggling status:', error);
    }
  };

  const handleSearchChange = (value) => {
    setLocalSearch(value);
    setActiveFilters(prev => ({ ...prev, search: value.length > 0 }));
  };

  const handleStatusFilterChange = (value) => {
    setStatusFilter(value);
    setActiveFilters(prev => ({ ...prev, status: value !== 'all' }));
  };

  const clearFilters = () => {
    setLocalSearch('');
    setDebouncedSearch('');
    setStatusFilter('all');
    setActiveFilters({ search: false, status: false });
    setCurrentPage(1);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (activeFilters.search) count++;
    if (activeFilters.status) count++;
    return count;
  };

  if (categoriesLoading && categories.length === 0) {
    return <Loading text="Loading categories..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Categories Management</h1>
          <p className="text-gray-400">
            {categoriesPagination?.total || 0} total categories
          </p>
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

      {/* Filters Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <FaFilter />
            Filters
          </h2>
          {getActiveFilterCount() > 0 && (
            <button
              onClick={clearFilters}
              className="text-sm text-gray-400 hover:text-white flex items-center gap-1"
            >
              Clear all filters ({getActiveFilterCount()})
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Search Filter */}
          <div className="relative">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <FaSearch />
            </div>
            <input
              type="text"
              placeholder="Search categories..."
              className="w-full pl-10 pr-4 py-3 bg-gray-800/50 rounded-xl border border-gray-700 focus:border-[#0295E6] focus:outline-none focus:ring-2 focus:ring-[#0295E6]/30"
              value={localSearch}
              onChange={(e) => handleSearchChange(e.target.value)}
            />
            {localSearch && (
              <button
                onClick={() => handleSearchChange('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
              >
                ×
              </button>
            )}
          </div>

          {/* Status Filter */}
          <div className="relative">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <FaEye />
            </div>
            <select
              className="w-full pl-10 pr-10 py-3 bg-gray-800/50 rounded-xl border border-gray-700 focus:border-[#0295E6] focus:outline-none focus:ring-2 focus:ring-[#0295E6]/30 appearance-none"
              value={statusFilter}
              onChange={(e) => handleStatusFilterChange(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="active">Active Only</option>
              <option value="inactive">Inactive Only</option>
            </select>
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              ▼
            </div>
          </div>

          {/* Results Count */}
          <div className="bg-gray-800/30 rounded-xl border border-gray-700/30 p-3 flex items-center justify-between">
            <span className="text-gray-400">Showing</span>
            <span className="font-semibold">
              {categories.length} of {categoriesPagination?.total || 0}
            </span>
          </div>
        </div>
      </div>

      {/* Categories Grid */}
      {categories.length === 0 && !categoriesLoading ? (
        <div className="text-center py-16 bg-gray-800/30 rounded-2xl border border-gray-700/30">
          <FaImage className="text-5xl text-gray-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">No categories found</h3>
          <p className="text-gray-400 mb-6 max-w-md mx-auto">
            {debouncedSearch 
              ? `No categories match "${debouncedSearch}"`
              : 'Start organizing your products by creating categories'}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {debouncedSearch ? (
              <button
                onClick={clearFilters}
                className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-xl font-medium transition-colors"
              >
                Clear Search
              </button>
            ) : (
              <button
                onClick={() => setShowAddModal(true)}
                className="bg-[#0295E6] hover:bg-[#0284c6] text-white px-6 py-3 rounded-xl font-semibold transition-colors"
              >
                Create Your First Category
              </button>
            )}
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <motion.div
                key={category._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/30 overflow-hidden group hover:border-gray-600/50 transition-all duration-300 hover:scale-[1.02]"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={getImageUrl(category.image)}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/placeholder-category.jpg';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <div className="absolute top-4 right-4 flex gap-2">
                    <button
                      onClick={() => handleToggleStatus(category)}
                      className={`p-2 rounded-lg transition-all duration-300 hover:scale-110 ${
                        category.isActive
                          ? 'bg-green-900/90 hover:bg-green-800 backdrop-blur-sm'
                          : 'bg-gray-900/90 hover:bg-gray-800 backdrop-blur-sm'
                      }`}
                      title={category.isActive ? 'Active - Click to deactivate' : 'Inactive - Click to activate'}
                    >
                      {category.isActive ? (
                        <FaEye className="text-green-300" />
                      ) : (
                        <FaEyeSlash className="text-gray-300" />
                      )}
                    </button>
                    <button
                      onClick={() => handleEditCategory(category)}
                      className="p-2 bg-blue-900/90 hover:bg-blue-800 backdrop-blur-sm rounded-lg transition-all duration-300 hover:scale-110"
                      title="Edit"
                    >
                      <FaEdit className="text-blue-300" />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(category)}
                      className="p-2 bg-red-900/90 hover:bg-red-800 backdrop-blur-sm rounded-lg transition-all duration-300 hover:scale-110"
                      title="Delete"
                    >
                      <FaTrash className="text-red-300" />
                    </button>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm ${
                      category.isActive
                        ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                        : 'bg-gray-500/20 text-gray-300 border border-gray-500/30'
                    }`}>
                      {category.isActive ? 'ACTIVE' : 'INACTIVE'}
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-lg truncate pr-2" title={category.name}>
                      {category.name}
                    </h3>
                    <span className={`text-sm font-medium px-2 py-1 rounded-lg ${
                      (category.productCount || 0) > 0
                        ? 'bg-blue-500/10 text-blue-300'
                        : 'bg-gray-500/10 text-gray-400'
                    }`}>
                      {category.productCount || 0} products
                    </span>
                  </div>
                  {category.description && (
                    <p className="text-sm text-gray-400 mb-4 line-clamp-2 leading-relaxed">
                      {category.description}
                    </p>
                  )}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-700/50">
                    <div className="flex items-center gap-2 text-gray-400">
                      <FaTags className="text-gray-500" />
                      <span className="text-xs font-mono">ID: {category._id?.substring(0, 6)}...</span>
                    </div>
                    <div className="text-gray-500 text-xs">
                      {formatDate(category.createdAt)}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Pagination */}
          {categoriesPagination && categoriesPagination.totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-gray-700/50">
              <div className="text-sm text-gray-400">
                Showing <span className="font-semibold">{(currentPage - 1) * categoriesPagination.limit + 1}</span> to{' '}
                <span className="font-semibold">
                  {Math.min(currentPage * categoriesPagination.limit, categoriesPagination.total)}
                </span> of{' '}
                <span className="font-semibold">{categoriesPagination.total}</span> categories
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1 || categoriesLoading}
                  className={`px-4 py-2 rounded-xl transition-colors flex items-center gap-2 ${
                    currentPage === 1
                      ? 'bg-gray-800/30 text-gray-500 cursor-not-allowed'
                      : 'bg-gray-800 hover:bg-gray-700'
                  }`}
                >
                  ← Previous
                </button>
                <div className="flex items-center gap-2">
                  {Array.from({ length: Math.min(5, categoriesPagination.totalPages) }, (_, i) => {
                    let pageNum;
                    if (categoriesPagination.totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= categoriesPagination.totalPages - 2) {
                      pageNum = categoriesPagination.totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`w-10 h-10 rounded-lg transition-colors ${
                          currentPage === pageNum
                            ? 'bg-[#0295E6] text-white'
                            : 'bg-gray-800/50 hover:bg-gray-800'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(categoriesPagination.totalPages, prev + 1))}
                  disabled={currentPage === categoriesPagination.totalPages || categoriesLoading}
                  className={`px-4 py-2 rounded-xl transition-colors flex items-center gap-2 ${
                    currentPage === categoriesPagination.totalPages
                      ? 'bg-gray-800/30 text-gray-500 cursor-not-allowed'
                      : 'bg-gray-800 hover:bg-gray-700'
                  }`}
                >
                  Next →
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Category Modal */}
      <CategoryModal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setSelectedCategory(null);
        }}
        category={selectedCategory}
        onSave={handleSaveCategory}
        loading={saveLoading}
      />

      {/* Confirmation Modal for Delete */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setCategoryToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
        title="Delete Category"
        message={`Are you sure you want to delete "${categoryToDelete?.name}"? This action cannot be undone.`}
        type="danger"
      />
    </div>
  );
}