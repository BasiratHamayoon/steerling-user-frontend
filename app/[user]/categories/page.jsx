'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAppContext } from '@/context/AppContext';
import CategoryCard from '@/components/user/CategoryCard';
import Loading from '@/components/ui/Loading';

export default function CategoriesPage() {
  const { categories, categoriesLoading, fetchCategories } = useAppContext();

  // ✅ Debug: Log everything
  console.log('=== Categories Page Debug ===');
  console.log('categories:', categories);
  console.log('categoriesLoading:', categoriesLoading);
  console.log('fetchCategories function:', fetchCategories);

  useEffect(() => {
    console.log('useEffect triggered!'); // ✅ Check if useEffect runs
    
    const loadCategories = async () => {
      console.log('Calling fetchCategories...'); // ✅ Check if function is called
      const result = await fetchCategories({ isActive: true });
      console.log('fetchCategories result:', result); // ✅ Check result
    };

    loadCategories();
  }, [fetchCategories]);

  if (categoriesLoading && categories.length === 0) {
    return <Loading text="Loading categories..." />;
  }

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold mb-4">All Categories</h1>
          <p className="text-gray-400">
            Browse our wide range of steering wheel categories
          </p>
          {/* ✅ Debug info */}
          <p className="text-xs text-yellow-500 mt-2">
            Debug: Found {categories.length} categories | Loading: {categoriesLoading ? 'Yes' : 'No'}
          </p>
        </motion.div>

        {categories.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400">No categories found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <motion.div
                key={category._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <CategoryCard category={category} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}