'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { FiArrowLeft, FiShoppingBag } from 'react-icons/fi';
import { useAppContext } from '@/context/AppContext';
import ProductCard from '@/components/user/ProductCard';
import Loading from '@/components/ui/Loading';
import getImageUrl from '@/utils/imageUrl';

export default function CategoryDetailPage() {
  const params = useParams();
  const router = useRouter();
  const categoryId = params?.id;
  
  const { fetchCategoryById, fetchProductsByCategory } = useAppContext();
  
  const [category, setCategory] = useState(null);
  const [categoryProducts, setCategoryProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState('all');

  useEffect(() => {
    // Prevent execution if no ID
    if (!categoryId) return;

    let isMounted = true;
    
    const loadData = async () => {
      setLoading(true);
      setError(null);

      try {
        console.log("Fetching Category ID:", categoryId); // Debug log

        const [catResponse, prodResponse] = await Promise.all([
          fetchCategoryById(categoryId),
          fetchProductsByCategory(categoryId)
        ]);

        if (isMounted) {
          if (catResponse.success) {
            setCategory(catResponse.data);
          } else {
            setError('Category not found');
          }

          if (prodResponse.success) {
             // Handle both array format and object format
            const products = prodResponse.data.products || prodResponse.data || [];
            setCategoryProducts(Array.isArray(products) ? products : []);
          }
        }
      } catch (err) {
        console.error("Error loading category page:", err);
        if (isMounted) setError("An unexpected error occurred.");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadData();

    return () => { isMounted = false; };
    
    // CRITICAL CHANGE: Only depend on categoryId. 
    // We removed the functions from the dependency array to prevent loops
    // if the Context isn't perfectly memoized.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryId]); 

  // --- Loading View ---
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <Loading text="Loading category..." />
      </div>
    );
  }

  // --- Error View ---
  if (error || !category) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-4">
            {error || 'Category not found'}
          </h1>
          <button
            onClick={() => router.back()}
            className="px-6 py-3 bg-[#0295E6] text-white rounded-lg hover:bg-[#0278B8] transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // --- Main Content ---
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black py-12 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-7xl mx-auto z-10 relative">
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors group"
        >
          <FiArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          Back to Categories
        </motion.button>

        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <div>
              <div className="flex items-center gap-4 mb-4">
                <div className="relative w-20 h-20 overflow-hidden rounded-2xl border border-gray-700 shadow-lg bg-black/50">
                   <img 
                      src={getImageUrl(category.image)} 
                      alt={category.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/placeholder-category.jpg';
                      }}
                   />
                </div>
                <div>
                  <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
                    {category.name}
                  </h1>
                  <p className="text-gray-400 max-w-2xl text-lg">{category.description}</p>
                </div>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-4">
              <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-xl px-6 py-3">
                <div className="text-2xl font-bold text-white">{categoryProducts.length}</div>
                <div className="text-gray-400 text-sm">Products</div>
              </div>
            </div>
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {categoryProducts.length === 0 ? (
            <motion.div
              key="empty-state"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-20 bg-gray-800/20 rounded-3xl border border-gray-800"
            >
              <div className="text-gray-500 text-6xl mb-6 flex justify-center">
                <FiShoppingBag />
              </div>
              <h3 className="text-2xl font-semibold text-white mb-2">No products found</h3>
              <p className="text-gray-400">This category is currently empty.</p>
            </motion.div>
          ) : (
            <motion.div
              key="products-grid"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
              }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8"
            >
              {categoryProducts.map((product, index) => (
                <motion.div
                  key={product._id}
                  variants={{
                    hidden: { y: 20, opacity: 0 },
                    visible: { y: 0, opacity: 1 }
                  }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}