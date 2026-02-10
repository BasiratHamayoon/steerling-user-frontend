'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import getImageUrl from '@/utils/imageUrl';
import { FiArrowRight, FiLayers } from 'react-icons/fi';

export default function CategoryCard({ category, index }) {
  const categoryId = category._id || category.id;
  const categoryName = category.name || 'Untitled Collection';
  const productCount = category.productCount ?? 0;
  const categoryImage = category.image || '/placeholder-category.jpg';
  const categoryDescription = category.description || 'Explore our premium collection of steering wheels designed for performance.';

  // Variants for the card entrance (controlled by parent page)
  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.6, 
        ease: "easeOut" 
      }
    },
    hover: {
      scale: 1.02,
      boxShadow: "0 25px 50px -12px rgba(2, 149, 230, 0.2)",
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  };

  // Badge animation
  const badgeVariants = {
    initial: { y: 0 },
    hover: { 
      y: -3,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  };

  // Content animation
  const contentVariants = {
    initial: { y: 30 },
    hover: { 
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  // Divider animation
  const dividerVariants = {
    initial: { width: "3rem" },
    hover: { 
      width: "100%",
      backgroundColor: "#ffffff",
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  // Description animation
  const descriptionVariants = {
    initial: { 
      opacity: 0,
      height: 0,
      marginBottom: 0
    },
    hover: { 
      opacity: 1,
      height: "auto",
      marginBottom: "1.5rem",
      transition: {
        opacity: {
          duration: 0.3,
          delay: 0.2,
          ease: "easeOut"
        },
        height: {
          duration: 0.5,
          ease: "easeOut"
        },
        marginBottom: {
          duration: 0.3,
          delay: 0.1,
          ease: "easeOut"
        }
      }
    }
  };

  // Button animation
  const buttonVariants = {
    initial: { rotate: 0 },
    hover: { 
      rotate: 45,
      backgroundColor: "#0295E6",
      color: "#ffffff",
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  };

  // Text animation
  const textVariants = {
    initial: { x: 0, color: "#ffffff" },
    hover: { 
      x: 4,
      color: "#0295E6",
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  };

  return (
    <Link href={`/user/categories/${categoryId}`} className="block h-full">
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        whileHover="hover"
        className="group relative h-[420px] w-full overflow-hidden rounded-3xl bg-gray-900 cursor-pointer shadow-xl"
      >
        {/* --- Background Image --- */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.img
            src={getImageUrl(categoryImage)}
            alt={categoryName}
            className="h-full w-full object-cover"
            initial={{ scale: 1 }}
            whileHover={{ 
              scale: 1.1,
              transition: {
                duration: 1.2,
                ease: "easeOut"
              }
            }}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/placeholder-category.jpg';
            }}
          />
          {/* Gradients */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-90" />
          <motion.div 
            className="absolute inset-0 bg-gradient-to-t from-[#0295E6]/80 via-transparent to-transparent"
            initial={{ opacity: 0 }}
            whileHover={{ 
              opacity: 1,
              transition: {
                duration: 0.5,
                ease: "easeOut"
              }
            }}
          />
        </div>

        {/* --- Floating Badge --- */}
        <motion.div 
          className="absolute top-5 right-5 z-20"
          variants={badgeVariants}
          initial="initial"
          whileHover="hover"
        >
          <div className="flex items-center gap-2 overflow-hidden rounded-full bg-white/10 backdrop-blur-md border border-white/20 px-3 py-1.5">
            <FiLayers className="text-[#0295E6] text-xs" />
            <span className="text-[10px] font-bold text-white tracking-widest uppercase">
              {productCount} Items
            </span>
          </div>
        </motion.div>

        {/* --- Content Area --- */}
        <div className="absolute bottom-0 left-0 right-0 z-20 p-8 flex flex-col justify-end h-full">
          
          {/* Animated Container for Text */}
          <motion.div
            variants={contentVariants}
            initial="initial"
            whileHover="hover"
            className="transform"
          >
            
            {/* Title */}
            <h3 className="text-3xl font-black text-white uppercase tracking-tighter mb-3 leading-none drop-shadow-lg">
              {categoryName}
            </h3>
            
            {/* Divider Line */}
            <motion.div 
              variants={dividerVariants}
              initial="initial"
              whileHover="hover"
              className="h-1 bg-[#0295E6] rounded-full mb-4"
            />

            {/* Description Container */}
            <motion.div 
              className="overflow-hidden"
              variants={descriptionVariants}
              initial="initial"
              whileHover="hover"
            >
              {/* Description Text */}
              <p className="text-gray-200 text-sm leading-relaxed font-light mb-0">
                {categoryDescription}
              </p>
            </motion.div>

            {/* Call to Action - Always visible but animated */}
            <div className="flex items-center gap-3">
              <motion.span 
                className="flex items-center justify-center w-10 h-10 rounded-full bg-white text-[#0295E6] shadow-lg"
                variants={buttonVariants}
                initial="initial"
                whileHover="hover"
              >
                <FiArrowRight className="text-lg" />
              </motion.span>
              <motion.span 
                className="font-bold text-sm uppercase tracking-widest text-white"
                variants={textVariants}
                initial="initial"
                whileHover="hover"
              >
                View Collection
              </motion.span>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </Link>
  );
}