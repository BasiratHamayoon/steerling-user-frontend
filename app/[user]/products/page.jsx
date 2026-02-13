'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useAppContext } from '@/context/AppContext';
import ProductCard from '@/components/user/ProductCard';
import Filters from '@/components/user/Filters';
import OrderModal from '@/components/user/OrderModal';
import Loading from '@/components/ui/Loading'; // Ensure you have this

export default function ProductsPage() {
  const { 
    products, 
    fetchProducts, 
    productsLoading, 
    productsPagination 
  } = useAppContext();

  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(12); // Reduced for better grid view
  const [productsPerRow, setProductsPerRow] = useState(4);
  
  // Modal State
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [filters, setFilters] = useState({
    sortBy: 'featured',
    availability: 'all',
    priceRange: { min: 0, max: 10000 },
    category: null
  });

  // --- THE FIX: Transform UI filters to API parameters ---
  useEffect(() => {
    // 1. Map Sort Options
    let sortField = 'createdAt';
    let sortOrder = 'desc';

    switch (filters.sortBy) {
        case 'price-low':
            sortField = 'price';
            sortOrder = 'asc';
            break;
        case 'price-high':
            sortField = 'price';
            sortOrder = 'desc';
            break;
        case 'name':
            sortField = 'title'; // Assuming DB field is 'title'
            sortOrder = 'asc';
            break;
        case 'featured':
        default:
            sortField = 'createdAt';
            sortOrder = 'desc';
            break;
    }

    // 2. Map Availability (kebab-case to camelCase)
    let stockStatus = undefined;
    if (filters.availability === 'in-stock') stockStatus = 'inStock';
    else if (filters.availability === 'out-of-stock') stockStatus = 'outOfStock';

    // 3. Call API
    fetchProducts({
      page: currentPage,
      limit: productsPerPage,
      sortBy: sortField,
      sortOrder: sortOrder,
      stockStatus: stockStatus,
      minPrice: filters.priceRange.min,
      maxPrice: filters.priceRange.max,
      category: filters.category
    });
  }, [currentPage, productsPerPage, filters, fetchProducts]);

  const handleFilterChange = useCallback((newFilters) => {
    // Merge new filters with existing state to prevent data loss
    setFilters(prev => ({ ...prev, ...newFilters }));
    setCurrentPage(1); 
  }, []);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenOrderModal = (product) => {
    setSelectedProduct(product);
    setIsOrderModalOpen(true);
  };

  const totalPages = productsPagination?.totalPages || 1;

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-gray-950 py-12">
      <div className="container mx-auto px-4">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 text-center relative"
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#0295E6]/10 blur-[100px] rounded-full -z-10" />
          <h1 className="text-4xl md:text-5xl font-extrabold mb-3 text-white tracking-tight">
            Premium <span className="text-[#0295E6]">Collection</span>
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto text-base">
            Discover our exclusive range of high-performance products.
          </p>
        </motion.div>

        {/* Filters */}
        <Filters 
          onFilterChange={handleFilterChange} 
          productsPerRow={productsPerRow}
          setProductsPerRow={setProductsPerRow}
        />

        {/* Grid */}
        {productsLoading ? (
          <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-${productsPerRow} gap-6`}>
            {[...Array(8)].map((_, index) => (
              <div key={index} className="bg-gray-900/50 rounded-2xl h-[380px] animate-pulse border border-gray-800"></div>
            ))}
          </div>
        ) : (
          <>
            {products.length === 0 ? (
                <div className="text-center py-20 bg-gray-900/30 rounded-3xl border border-gray-800 border-dashed">
                    <p className="text-gray-400 text-lg">No products found matching your filters.</p>
                    <button 
                        onClick={() => window.location.reload()} 
                        className="mt-4 text-[#0295E6] hover:underline"
                    >
                        Clear all filters
                    </button>
                </div>
            ) : (
                <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    animate="show"
                    className={`grid grid-cols-1 ${productsPerRow >= 2 ? 'sm:grid-cols-2' : ''} ${productsPerRow >= 3 ? 'lg:grid-cols-3' : ''} ${productsPerRow >= 4 ? 'xl:grid-cols-4' : ''} gap-6`}
                >
                    {products.map((product) => (
                    <motion.div key={product._id} variants={itemVariants}>
                        <div className="h-full">
                            <ProductCard 
                                product={product} 
                                onOrder={handleOpenOrderModal} 
                            />
                        </div>
                    </motion.div>
                    ))}
                </motion.div>
            )}
          </>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-center mt-12 gap-3"
          >
             <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-lg bg-gray-900 border border-gray-800 text-gray-400 hover:border-[#0295E6] hover:text-[#0295E6] disabled:opacity-50 disabled:hover:border-gray-800 disabled:hover:text-gray-400 transition-all"
              >
                Previous
              </button>
              
              <div className="flex items-center gap-1">
                <span className="text-[#0295E6] font-bold">{currentPage}</span>
                <span className="text-gray-600">/</span>
                <span className="text-gray-400">{totalPages}</span>
              </div>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-lg bg-gray-900 border border-gray-800 text-gray-400 hover:border-[#0295E6] hover:text-[#0295E6] disabled:opacity-50 disabled:hover:border-gray-800 disabled:hover:text-gray-400 transition-all"
              >
                Next
              </button>
          </motion.div>
        )}
      </div>

      <OrderModal 
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        product={selectedProduct}
        quantity={1}
      />
    </div>
  );
}