'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useAppContext } from '@/context/AppContext';
import ProductCard from '@/components/user/ProductCard';
import Filters from '@/components/user/Filters';
import OrderModal from '@/components/user/OrderModal'; // Import the Modal

export default function ProductsPage() {
  const { 
    products, 
    fetchProducts, 
    productsLoading, 
    productsPagination 
  } = useAppContext();

  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(24);
  const [productsPerRow, setProductsPerRow] = useState(4);
  
  // Modal State
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [filters, setFilters] = useState({
    sortBy: 'featured',
    availability: 'all',
    // Removed priceRange from initial filter display logic if needed
    category: null
  });

  useEffect(() => {
    fetchProducts({
      page: currentPage,
      limit: productsPerPage,
      sort: filters.sortBy,
      inStock: filters.availability === 'in-stock' ? true : filters.availability === 'out-of-stock' ? false : undefined,
      category: filters.category
    });
  }, [currentPage, productsPerPage, filters]);

  const handleFilterChange = useCallback((newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1); 
  }, []);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handler to open modal from Card
  const handleOpenOrderModal = (product) => {
    setSelectedProduct(product);
    setIsOrderModalOpen(true);
  };

  const totalPages = productsPagination?.totalPages || 1;
  const total = productsPagination?.total || 0;

  // Stagger animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 50 } }
  };

  return (
    <div className="min-h-screen bg-gray-950 py-12">
      <div className="container mx-auto px-4">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center relative"
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#0295E6]/10 blur-[100px] rounded-full -z-10" />
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4 text-white tracking-tight">
            Premium <span className="text-[#0295E6]">Collection</span>
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Discover our exclusive range of high-performance steering wheels.
          </p>
        </motion.div>

        {/* Filters Section (Assuming Filters handles UI, we just pass props) */}
        <div className="mb-8">
            <Filters 
            onFilterChange={handleFilterChange} 
            productsPerRow={productsPerRow}
            setProductsPerRow={setProductsPerRow}
            />
        </div>

        {/* Loading State */}
        {productsLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {[...Array(8)].map((_, index) => (
              <div key={index} className="bg-gray-900/50 rounded-2xl h-[400px] animate-pulse border border-gray-800"></div>
            ))}
          </div>
        ) : (
          /* Products Grid */
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className={`grid grid-cols-1 ${productsPerRow >= 2 ? 'sm:grid-cols-2' : ''} ${productsPerRow >= 3 ? 'lg:grid-cols-3' : ''} ${productsPerRow >= 4 ? 'xl:grid-cols-4' : ''} gap-8`}
          >
            {products.map((product) => (
              <motion.div key={product._id} variants={itemVariants}>
                <ProductCard 
                    product={product} 
                    onOrder={handleOpenOrderModal} // Pass handler
                />
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Empty State */}
        {!productsLoading && products.length === 0 && (
            <div className="text-center py-20">
                <p className="text-gray-500 text-xl">No products found matching your criteria.</p>
            </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-center mt-16 gap-2"
          >
             {/* Pagination Logic (Simplified for brevity, keep your existing logic) */}
             <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-lg bg-gray-900 border border-gray-800 hover:border-[#0295E6] hover:text-[#0295E6] disabled:opacity-50 transition-colors"
              >
                Prev
              </button>
              <span className="text-gray-400 px-4">Page {currentPage} of {totalPages}</span>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-lg bg-gray-900 border border-gray-800 hover:border-[#0295E6] hover:text-[#0295E6] disabled:opacity-50 transition-colors"
              >
                Next
              </button>
          </motion.div>
        )}
      </div>

      {/* Global Order Modal */}
      <OrderModal 
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        product={selectedProduct}
        quantity={1}
      />
    </div>
  );
}