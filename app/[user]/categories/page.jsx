'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAppContext } from '@/context/AppContext';
import CategoryCard from '@/components/user/CategoryCard';
import Loading from '@/components/ui/Loading';

export default function CategoriesPage() {
  const { categories, categoriesLoading, fetchCategories } = useAppContext();

  useEffect(() => {
    fetchCategories({ isActive: true });
  }, [fetchCategories]);

  // --- Animation Variants ---

  // Container controls the staggered timing of children
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15, // Time between each card appearing
        delayChildren: 0.1,
      },
    },
  };

  // Individual card entrance animation
  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 50, 
      scale: 0.95 
    },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { 
        type: "spring", 
        stiffness: 100, 
        damping: 15,
        mass: 1 
      }
    },
  };

  // Header text animation
  const headerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" } 
    }
  };

  if (categoriesLoading && categories.length === 0) {
    return <Loading text="Loading categories..." />;
  }

  return (
    <div className="min-h-screen py-16 relative overflow-hidden">
      {/* Background Decorative Gradient */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-[#0295E6]/5 blur-[120px] rounded-full pointer-events-none -z-10" />

      <div className="container mx-auto px-4">
        
        {/* --- Header Section --- */}
        <motion.div
          variants={headerVariants}
          initial="hidden"
          animate="visible"
          className="text-center mb-16 max-w-2xl mx-auto"
        >
          <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">
            Our <span className="text-[#0295E6]">Collections</span>
          </h1>
          <p className="text-gray-400 text-lg leading-relaxed">
            Discover precision engineering and premium materials across our specialized steering wheel categories.
          </p>
        </motion.div>

        {/* --- Grid Section --- */}
        {categories.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
            className="text-center py-20 bg-gray-900/50 rounded-3xl border border-gray-800"
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
                {/* 
                  Passing index helps if the card component has internal logic, 
                  but here the parent controls the entrance via variants 
                */}
                <CategoryCard category={category} index={index} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}