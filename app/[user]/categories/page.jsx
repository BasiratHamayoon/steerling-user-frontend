'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAppContext } from '@/context/AppContext';
import CategoryCard from '@/components/user/CategoryCard';

export default function CategoriesPage() {
  const { categories, categoriesLoading, fetchCategories } = useAppContext();

  useEffect(() => {
    fetchCategories({ isActive: true });
  }, [fetchCategories]);

  // --- Animation Variants ---
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: "spring", stiffness: 50 }
    },
  };

  return (
    <div className="min-h-screen bg-gray-950 py-12">
      <div className="container mx-auto px-4">
        
        {/* --- Header Section (Matched to ProductsPage) --- */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16 text-center relative"
        >
          {/* Glowing Backdrop */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#0295E6]/10 blur-[100px] rounded-full -z-10" />
          
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4 text-white tracking-tight">
            Browse <span className="text-[#0295E6]">Categories</span>
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Explore our specialized collections designed for every driving style and vehicle model.
          </p>
        </motion.div>

        {/* --- Loading State (Skeleton Grid) --- */}
        {categoriesLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="bg-gray-900/50 rounded-2xl h-80 animate-pulse border border-gray-800 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-800/30 to-transparent skew-x-12 translate-x-[-100%] animate-[shimmer_1.5s_infinite]"></div>
              </div>
            ))}
          </div>
        ) : (
          /* --- Content Grid --- */
          <>
            {categories.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }}
                className="text-center py-20 bg-gray-900/30 rounded-3xl border border-gray-800"
              >
                <p className="text-gray-400 text-xl">No categories found at the moment.</p>
              </motion.div>
            ) : (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
              >
                {categories.map((category, index) => (
                  <motion.div
                    key={category._id}
                    variants={cardVariants}
                    className="h-full"
                  >
                    <CategoryCard category={category} />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </>
        )}
      </div>
    </div>
  );
}