'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { products } from '@/data/products';
import ProductCard from '@/components/user/ProductCard';
import Filters from '@/components/user/Filters';

export default function ProductsPage() {
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(24);
  const [productsPerRow, setProductsPerRow] = useState(4);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Use useCallback to memoize the function and prevent infinite re-renders
  const handleFilterChange = useCallback((filters) => {
    let filtered = [...products];

    if (filters.availability === 'in-stock') {
      filtered = filtered.filter(p => p.inStock);
    } else if (filters.availability === 'out-of-stock') {
      filtered = filtered.filter(p => !p.inStock);
    }

    filtered = filtered.filter(p => 
      p.price >= filters.priceRange.min && 
      p.price <= filters.priceRange.max
    );

    switch (filters.sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'featured':
        // Keep default/featured order
        break;
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        break;
    }

    setFilteredProducts(filtered);
    setCurrentPage(1);
  }, []); // Empty dependency array since we don't use any external variables

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  // Don't render anything on server to avoid hydration mismatch
  if (!isClient) {
    return (
      <div className="py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">All Products</h1>
            <p className="text-gray-400">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">All Products</h1>
          <p className="text-gray-400">Browse our complete collection of premium steering wheels</p>
        </motion.div>

        <Filters 
          onFilterChange={handleFilterChange} 
          productsPerRow={productsPerRow}
          setProductsPerRow={setProductsPerRow}
        />

        <div className="mb-6 flex items-center justify-between">
          <div className="text-gray-400">
            Showing {indexOfFirstProduct + 1}-{Math.min(indexOfLastProduct, filteredProducts.length)} of {filteredProducts.length} products
          </div>
        </div>

        <div className={`grid grid-cols-1 ${productsPerRow >= 2 ? 'sm:grid-cols-2' : ''} ${productsPerRow >= 3 ? 'lg:grid-cols-3' : ''} ${productsPerRow >= 4 ? 'xl:grid-cols-4' : ''} gap-6`}>
          {currentProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>

        {totalPages > 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-center mt-12"
          >
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
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
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-10 h-10 rounded-lg transition-all ${currentPage === pageNum ? 'bg-green-600 text-white' : 'bg-gray-800 hover:bg-gray-700'}`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
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