'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { products } from '@/data/products';
import ProductCard from '@/components/ProductCard';
import Filters from '@/components/Filters';

export default function ProductsPage() {
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(8);
  const [productsPerRow, setProductsPerRow] = useState(4);

  const handleFilterChange = (filters) => {
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
      case 'newest':
        filtered.reverse();
        break;
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }

    setFilteredProducts(filtered);
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-1/4">
            <Filters onFilterChange={handleFilterChange} />
          </div>

          <div className="lg:w-3/4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <h1 className="text-4xl font-bold mb-4">All Products</h1>
              <p className="text-gray-400">Browse our complete collection of steering wheels</p>
            </motion.div>

            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <span>Show per row:</span>
                <select
                  value={productsPerRow}
                  onChange={(e) => setProductsPerRow(parseInt(e.target.value))}
                  className="px-3 py-2 bg-gray-800 rounded border border-gray-700"
                >
                  <option value={2}>2</option>
                  <option value={3}>3</option>
                  <option value={4}>4</option>
                </select>
              </div>
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
              <div className="flex items-center justify-center mt-12">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-gray-800 rounded disabled:opacity-50"
                  >
                    Previous
                  </button>
                  
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`px-4 py-2 rounded ${currentPage === i + 1 ? 'bg-green-600' : 'bg-gray-800'}`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 bg-gray-800 rounded disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}