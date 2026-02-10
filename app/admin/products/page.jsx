'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { FaPlus, FaEdit, FaTrash, FaSearch, FaEye, FaBox, FaTimes } from 'react-icons/fa';
import ProductModal from '@/components/admin/ProductModal';
import { useAppContext } from '@/context/AppContext';
import TableRow from '@/components/admin/TableRow';
import Loading from '@/components/ui/Loading';
import { useRouter } from 'next/navigation';
import getImageUrl from '@/utils/imageUrl';
import ConfirmationModal from '@/components/admin/ConfirmationModal';

export default function AdminProductsPage() {
  const router = useRouter();
  const {
    products,
    productsLoading,
    productsPagination,
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    categories,
    fetchCategories,
    searchProducts
  } = useAppContext();

  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchResults, setSearchResults] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const searchRef = useRef(null);

  useEffect(() => {
    fetchProducts({ page: currentPage });
    fetchCategories();
    
    // Close suggestions when clicking outside
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [currentPage]);

  const debouncedSearch = useCallback(
    debounce(async (query) => {
      if (query.trim() === '') {
        setSearchResults([]);
        setShowSuggestions(false);
        return;
      }

      setSearchLoading(true);
      try {
        const response = await searchProducts(query);
        if (response.success) {
          setSearchResults(response.data.products || []);
          setShowSuggestions(true);
        }
      } catch (error) {
        console.error('Search error:', error);
        setSearchResults([]);
      } finally {
        setSearchLoading(false);
      }
    }, 300),
    []
  );

  useEffect(() => {
    debouncedSearch(searchTerm);
  }, [searchTerm, debouncedSearch]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
  };

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      await fetchProducts({ search: searchTerm, page: 1 });
      setCurrentPage(1);
      setShowSuggestions(false);
    } else {
      await fetchProducts({ page: 1 });
      setCurrentPage(1);
    }
  };

  const handleClearSearch = async () => {
    setSearchTerm('');
    setSearchResults([]);
    setShowSuggestions(false);
    await fetchProducts({ page: 1 });
    setCurrentPage(1);
  };

  const handleSelectSuggestion = (product) => {
    router.push(`/products/${product._id}`);
    setSearchTerm('');
    setShowSuggestions(false);
  };

  const handleSaveProduct = async (productData) => {
    const formData = new FormData();
    
    formData.append('title', productData.title);
    formData.append('description', productData.description);
    formData.append('model', productData.model);
    formData.append('quantity', productData.quantity);
    formData.append('price', productData.price);
    formData.append('category', productData.category);
    if (productData.brand) formData.append('brand', productData.brand);
    if (productData.material) formData.append('material', productData.material);
    if (productData.diameter) formData.append('diameter', productData.diameter);
    if (productData.compatibility) formData.append('compatibility', productData.compatibility);
    
    if (productData.specifications) {
      formData.append('specifications', JSON.stringify(productData.specifications));
    }
    
    productData.newImages?.forEach((file) => {
      formData.append('images', file);
    });

    if (selectedProduct) {
      await updateProduct(selectedProduct._id, formData);
    } else {
      await createProduct(formData);
    }
    
    setShowAddModal(false);
    setSelectedProduct(null);
    await fetchProducts({ page: currentPage });
  };

  const handleDeleteClick = (product) => {
    setProductToDelete(product);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (productToDelete) {
      await deleteProduct(productToDelete._id);
      await fetchProducts({ page: currentPage });
    }
    setDeleteModalOpen(false);
    setProductToDelete(null);
  };

  const handleCancelDelete = () => {
    setDeleteModalOpen(false);
    setProductToDelete(null);
  };

  const handleViewProduct = (product) => {
    router.push(`/user/products/${product._id}`);
  };

  const handleEditProduct = (product) => {
    const selectedCategory = categories.find(cat => cat._id === product.category?._id);
    setSelectedProduct({
      ...product,
      category: selectedCategory?._id || product.category,
      existingImages: product.images || [],
      newImages: []
    });
    setShowAddModal(true);
  };

  const totalPages = productsPagination?.totalPages || 1;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Products Management</h1>
          <p className="text-gray-400">Manage your store products and inventory</p>
        </div>
        <button
          onClick={() => {
            setSelectedProduct(null);
            setShowAddModal(true);
          }}
          className="flex items-center gap-2 bg-gradient-to-r from-[#0295E6] to-[#02b3e6] hover:from-[#0284c6] hover:to-[#0295E6] text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105"
        >
          <FaPlus />
          Add New Product
        </button>
      </div>

      {/* Search Bar with Suggestions */}
      <div className="relative" ref={searchRef}>
        <form onSubmit={handleSearchSubmit} className="relative">
          <FaSearch className="absolute left-4 top-3.5 text-gray-400" />
          <input
            type="text"
            placeholder="Search products by title, model, or description..."
            className="w-full pl-12 pr-12 py-3 bg-gray-800/50 rounded-xl border border-gray-700 focus:border-[#0295E6] focus:outline-none focus:ring-2 focus:ring-[#0295E6]/30"
            value={searchTerm}
            onChange={handleSearchChange}
            onFocus={() => {
              if (searchTerm && searchResults.length > 0) {
                setShowSuggestions(true);
              }
            }}
          />
          {searchTerm && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="absolute right-12 top-3.5 text-gray-400 hover:text-white"
            >
              <FaTimes />
            </button>
          )}
          <button
            type="submit"
            className="absolute right-2 top-2 px-4 py-2 bg-[#0295E6] hover:bg-[#0284c6] rounded-lg transition-colors"
          >
            Search
          </button>
        </form>

        {/* Search Suggestions */}
        {showSuggestions && searchResults.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-gray-800/95 backdrop-blur-sm rounded-xl border border-gray-700/50 shadow-2xl z-50 max-h-96 overflow-y-auto">
            <div className="p-2">
              {searchResults.map((product) => (
                <div
                  key={product._id}
                  className="flex items-center gap-3 p-3 hover:bg-gray-700/50 rounded-lg cursor-pointer transition-colors"
                  onClick={() => handleSelectSuggestion(product)}
                >
                  <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={getImageUrl(product.images?.[0])}
                      alt={product.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/placeholder-product.jpg';
                      }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold truncate">{product.title}</p>
                    <p className="text-sm text-gray-400 truncate">{product.model}</p>
                  </div>
                  <div className="text-[#0295E6] font-bold">
                    ${product.price}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {showSuggestions && searchLoading && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-gray-800/95 backdrop-blur-sm rounded-xl border border-gray-700/50 p-4 text-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#0295E6] mx-auto"></div>
            <p className="mt-2 text-gray-400">Searching...</p>
          </div>
        )}
        
        {showSuggestions && !searchLoading && searchResults.length === 0 && searchTerm && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-gray-800/95 backdrop-blur-sm rounded-xl border border-gray-700/50 p-4 text-center">
            <p className="text-gray-400">No products found</p>
          </div>
        )}
      </div>

      <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/30 overflow-hidden">
        {productsLoading ? (
          <Loading text="Loading products..." />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-800/80">
                    <th className="py-4 px-6 text-left">Product</th>
                    <th className="py-4 px-6 text-left">Category</th>
                    <th className="py-4 px-6 text-left">Price</th>
                    <th className="py-4 px-6 text-left">Stock</th>
                    <th className="py-4 px-6 text-left">Status</th>
                    <th className="py-4 px-6 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product, index) => (
                    <TableRow
                      key={product._id}
                      item={product}
                      index={index}
                      onView={() => handleViewProduct(product)}
                      onEdit={() => handleEditProduct(product)}
                      onDelete={() => handleDeleteClick(product)}
                      type="product"
                    />
                  ))}
                </tbody>
              </table>
            </div>

            {products.length === 0 && (
              <div className="text-center py-12">
                <FaBox className="text-4xl text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">No products found</p>
              </div>
            )}

            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 py-6 border-t border-gray-700/30">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-gray-800 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
                >
                  Previous
                </button>
                <span className="text-gray-400">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 bg-gray-800 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {showAddModal && (
        <ProductModal
          isOpen={showAddModal}
          onClose={() => {
            setShowAddModal(false);
            setSelectedProduct(null);
          }}
          product={selectedProduct}
          onSave={handleSaveProduct}
        />
      )}

      {/* Confirmation Modal for Delete */}
      <ConfirmationModal
        isOpen={deleteModalOpen}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title="Delete Product"
        message={`Are you sure you want to delete "${productToDelete?.title}"? This action cannot be undone.`}
        type="danger"
      />
    </div>
  );
}

// Debounce utility function
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}