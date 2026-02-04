'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { categories } from '@/data/categories';
import { products } from '@/data/products';
import ProductCard from '@/components/user/ProductCard';

export default function CategoryPage() {
  const params = useParams();
  const categoryId = parseInt(params.id);
  const [categoryProducts, setCategoryProducts] = useState([]);
  const [category, setCategory] = useState(null);

  useEffect(() => {
    const cat = categories.find(c => c.id === categoryId);
    const prods = products.filter(p => p.category === cat?.name);
    setCategory(cat);
    setCategoryProducts(prods);
  }, [categoryId]);

  if (!category) {
    return (
      <div className="py-12 text-center">
        <h1 className="text-2xl">Category not found</h1>
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
          <h1 className="text-4xl font-bold mb-4">{category.name} Steering Wheels</h1>
          <p className="text-gray-400">{categoryProducts.length} products available</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categoryProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>

        {categoryProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400">No products found in this category.</p>
          </div>
        )}
      </div>
    </div>
  );
}