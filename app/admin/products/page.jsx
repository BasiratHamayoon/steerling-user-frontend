'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { FaPlus, FaSearch, FaBox, FaTimes, FaSpinner } from 'react-icons/fa';
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
    
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [currentPage]);

  // Debounce logic
  function debounce(func, wait) {
    let timeout;
    return function (...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  }

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
      } finally {
        setSearchLoading(false);
      }
    }, 300),
    []
  );

  useEffect(() => {
    debouncedSearch(searchTerm);
  }, [searchTerm, debouncedSearch]);

  // --- MISSING FUNCTION ADDED HERE ---
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      await fetchProducts({ search: searchTerm, page: 1 });
      setCurrentPage(1);
      setShowSuggestions(false);
    } else {
      await fetchProducts({ page: 1 });
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
    handleEditProduct(product);
    setSearchTerm('');
    setShowSuggestions(false);
  };

  const handleSaveProduct = async (productData) => {
    const formData = new FormData();
    Object.keys(productData).forEach(key => {
      if (key === 'specifications') formData.append(key, JSON.stringify(productData[key]));
      else if (key === 'newImages') productData.newImages.forEach(file => formData.append('images', file));
      else if (key !== 'existingImages') formData.append(key, productData[key]);
    });

    if (selectedProduct) await updateProduct(selectedProduct._id, formData);
    else await createProduct(formData);
    
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

  const handleViewProduct = (product) => router.push(`/user/products/${product._id}`);
  
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
    <div className="space-y-8 min-h-screen">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-gray-800">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tight mb-2">
            Product <span className="text-[#0295E6]">Inventory</span>
          </h1>
          <p className="text-gray-400">Manage catalog, track stock, and update pricing.</p>
        </div>
        <button
          onClick={() => { setSelectedProduct(null); setShowAddModal(true); }}
          className="flex items-center gap-2 bg-gradient-to-r from-[#0295E6] to-[#0077b6] hover:from-[#0284c6] hover:to-[#00669c] text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-blue-900/20 hover:shadow-blue-900/40 hover:-translate-y-1 transition-all"
        >
          <FaPlus /> <span>New Product</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-2xl" ref={searchRef}>
        <form onSubmit={handleSearchSubmit} className="relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
             <FaSearch className="text-gray-500 group-focus-within:text-[#0295E6] transition-colors" />
          </div>
          <input
            type="text"
            placeholder="Search by title, model number..."
            className="w-full pl-12 pr-20 py-4 bg-gray-900 border border-gray-800 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:border-[#0295E6] focus:ring-1 focus:ring-[#0295E6] transition-all shadow-sm"
            value={searchTerm}
            onChange={handleSearchChange}
            onFocus={() => { if (searchTerm && searchResults.length > 0) setShowSuggestions(true); }}
          />
          {searchTerm && (
            <button type="button" onClick={handleClearSearch} className="absolute right-20 top-1/2 -translate-y-1/2 p-2 text-gray-500 hover:text-white">
              <FaTimes />
            </button>
          )}
          <button type="submit" className="absolute right-2 top-2 bottom-2 px-4 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl font-medium transition-colors text-sm">
            Search
          </button>
        </form>

        {/* Suggestions Dropdown */}
        {showSuggestions && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl z-50 overflow-hidden">
            {searchLoading ? (
              <div className="p-4 text-center text-gray-400 flex items-center justify-center gap-2">
                <FaSpinner className="animate-spin" /> Searching...
              </div>
            ) : searchResults.length > 0 ? (
              <div className="py-2">
                {searchResults.map((product) => (
                  <div
                    key={product._id}
                    onClick={() => handleSelectSuggestion(product)}
                    className="flex items-center gap-4 px-4 py-3 hover:bg-gray-800 cursor-pointer transition-colors border-b border-gray-800/50 last:border-0"
                  >
                    <img
                      src={getImageUrl(product.images?.[0]) || '/placeholder-product.jpg'}
                      alt=""
                      className="w-10 h-10 rounded-lg object-cover bg-gray-800"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-white truncate">{product.title}</p>
                      <p className="text-xs text-gray-500 truncate">{product.model}</p>
                    </div>
                    <span className="text-[#0295E6] font-mono font-bold text-sm">${product.price}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 text-center text-gray-500 text-sm">No products found.</div>
            )}
          </div>
        )}
      </div>

      {/* Table Container */}
      <div className="bg-gray-900/50 backdrop-blur-sm rounded-3xl border border-gray-800 overflow-hidden shadow-xl">
        {productsLoading ? (
          <Loading text="Loading Inventory..." />
        ) : products.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-900/80 text-xs uppercase tracking-wider text-gray-500 font-bold border-b border-gray-800">
                    <th className="py-5 px-6">Product Details</th>
                    <th className="py-5 px-6">Category</th>
                    <th className="py-5 px-6">Price</th>
                    <th className="py-5 px-6">Inventory</th>
                    <th className="py-5 px-6">Status</th>
                    <th className="py-5 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/50">
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
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-between items-center px-6 py-4 bg-gray-900/50 border-t border-gray-800">
                <span className="text-sm text-gray-500">Page {currentPage} of {totalPages}</span>
                <div className="flex gap-2">
                  <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg disabled:opacity-50 text-sm font-medium">Prev</button>
                  <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg disabled:opacity-50 text-sm font-medium">Next</button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20 flex flex-col items-center">
            <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mb-4 text-gray-600 text-3xl">
              <FaBox />
            </div>
            <h3 className="text-xl font-bold text-white">No products found</h3>
            <p className="text-gray-500 mt-2">Try adjusting your search or add a new product.</p>
          </div>
        )}
      </div>

      {showAddModal && (
        <ProductModal
          isOpen={showAddModal}
          onClose={() => { setShowAddModal(false); setSelectedProduct(null); }}
          product={selectedProduct}
          onSave={handleSaveProduct}
        />
      )}

      <ConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Product"
        message={`Are you sure you want to permanently delete "${productToDelete?.title}"?`}
        type="danger"
      />
    </div>
  );
}