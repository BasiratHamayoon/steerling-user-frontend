'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useAppContext } from '@/context/AppContext';
import ProductCard from '@/components/user/ProductCard';
import Filters from '@/components/user/Filters';

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
  const [filters, setFilters] = useState({
    sortBy: 'featured',
    availability: 'all',
    priceRange: { min: 0, max: 10000 },
    category: null
  });

  useEffect(() => {
    fetchProducts({
      page: currentPage,
      limit: productsPerPage,
      sort: filters.sortBy,
      minPrice: filters.priceRange.min,
      maxPrice: filters.priceRange.max,
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

  if (productsLoading && products.length === 0) {
    return (
      <div className="py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Products</h1>
            <p className="text-gray-400">Loading products...</p>
          </div>
        </div>
      </div>
    );
  }

  const totalPages = productsPagination?.totalPages || 1;
  const total = productsPagination?.total || 0;
  const startIndex = (currentPage - 1) * productsPerPage + 1;
  const endIndex = Math.min(currentPage * productsPerPage, total);

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4"> Products</h1>
          <p className="text-gray-400">Browse our complete collection of premium steering wheels</p>
        </motion.div>

        {/* <Filters 
          onFilterChange={handleFilterChange} 
          productsPerRow={productsPerRow}
          setProductsPerRow={setProductsPerRow}
        /> */}

        <div className="mb-6 flex items-center justify-between">
          <div className="text-gray-400">
            {total > 0 ? (
              <>Showing {startIndex}-{endIndex} of {total} products</>
            ) : (
              'No products found'
            )}
          </div>
        </div>

        {productsLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="bg-gray-800 rounded-xl h-96"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className={`grid grid-cols-1 ${productsPerRow >= 2 ? 'sm:grid-cols-2' : ''} ${productsPerRow >= 3 ? 'lg:grid-cols-3' : ''} ${productsPerRow >= 4 ? 'xl:grid-cols-4' : ''} gap-6`}>
            {products.map((product, index) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-center mt-12"
          >
            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              
              {[...Array(Math.min(5, totalPages))].map((_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`w-10 h-10 rounded-lg transition-all ${currentPage === pageNum ? 'bg-green-600 text-white' : 'bg-gray-800 hover:bg-gray-700'}`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}