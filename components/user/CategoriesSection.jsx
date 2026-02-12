'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAppContext } from '@/context/AppContext';
import CategoryCard from '@/components/user/CategoryCard';
import Link from 'next/link';
import { FaArrowRight } from 'react-icons/fa';

export default function CategoriesSection() {
  const { fetchCategories } = useAppContext();
  const [recentCategories, setRecentCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      // Fetch only the 4 most recent/active categories
      const response = await fetchCategories({ 
        isActive: true, 
        limit: 4, 
        sort: 'createdAt', // Ensure backend supports this or default to newest
        order: 'desc' 
      });
      
      if (response.success) {
        setRecentCategories(response.data.categories);
      }
      setLoading(false);
    };
    
    loadData();
  }, [fetchCategories]);

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 50 } }
  };

  return (
    <section className="py-24 bg-gray-950 relative overflow-hidden">
      {/* Background Decorative Element */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-[#0295E6]/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-2">
              Featured <span className="text-[#0295E6]">Collections</span>
            </h2>
            <p className="text-gray-400 max-w-lg">
              Explore our curated selection of high-performance steering wheels.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Link 
              href="/categories" 
              className="group flex items-center gap-2 text-white font-semibold hover:text-[#0295E6] transition-colors"
            >
              View All Categories 
              <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-80 bg-gray-900/50 rounded-2xl animate-pulse border border-gray-800" />
            ))}
          </div>
        ) : recentCategories.length > 0 ? (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {recentCategories.map((category) => (
              <motion.div key={category._id} variants={itemVariants} className="h-full">
                <CategoryCard category={category} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            No categories available at the moment.
          </div>
        )}
      </div>
    </section>
  );
}