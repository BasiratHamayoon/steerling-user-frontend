'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { useRouter } from 'next/navigation';

const heroSlides = [
  {
    id: 1,
    image: '/1.png',  
    heading: 'Premium Steering Wheels Collection',
    blueWords: [0, 1],
    description: 'Crafted for precision and luxury driving experience'
  },
  {
    id: 2,
    image: '/2.png',
    heading: 'Ultimate Racing Experience For You',
    blueWords: [0, 2],
    description: 'Professional-grade wheels for the track and road'
  },
];

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const router = useRouter();
  
  // In a real app, you would get the user from your auth context/state
  // For demo purposes, I'll use a placeholder or you can pass it as a prop
  const currentUser = 'current-user'; // Replace with actual user from your auth system

  // Auto slide with pause on hover
  useEffect(() => {
    if (isHovered) return;
    
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);
    
    return () => clearInterval(interval);
  }, [isHovered]);

  const nextSlide = useCallback(() => {
    setCurrentSlide(prev => 
      prev === heroSlides.length - 1 ? 0 : prev + 1
    );
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlide(prev => 
      prev === 0 ? heroSlides.length - 1 : prev - 1
    );
  }, []);

  // Handle Explore Collection button click
  const handleExploreClick = () => {
    if (currentUser) {
      // Navigate to the products page with the user parameter
      router.push(`/${currentUser}/products`);
    } else {
      // If no user is available, you might want to:
      // 1. Redirect to login page
      // 2. Use a default user
      // 3. Show an error message
      console.log('No user found. Please log in.');
      // Example: router.push('/login');
      // For now, we'll use a fallback
      router.push('/guest/products');
    }
  };

  // Render heading with blue words
  const renderHeading = (heading, blueWordIndices) => {
    const words = heading.split(' ');
    
    return words.map((word, index) => (
      <motion.span
        key={index}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1, duration: 0.5 }}
        className={`inline-block ${
          blueWordIndices.includes(index) 
            ? 'text-[#0295E6] drop-shadow-lg' 
            : 'text-white'
        } ${index > 0 ? 'ml-2' : ''}`}
      >
        {word}
      </motion.span>
    ));
  };

  // Slide variants for animation
  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.9,
      rotateY: direction > 0 ? 10 : -10
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      rotateY: 0,
      transition: {
        duration: 0.8,
        ease: [0.23, 1, 0.32, 1]
      }
    },
    exit: (direction) => ({
      x: direction > 0 ? -1000 : 1000,
      opacity: 0,
      scale: 0.9,
      rotateY: direction > 0 ? -10 : 10,
      transition: {
        duration: 0.8,
        ease: [0.23, 1, 0.32, 1]
      }
    })
  };

  return (
    <div 
      className="relative h-[70vh] md:h-[90vh] lg:h-screen overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background pattern overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-transparent to-black/30 z-10" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-black/20 to-black/60 z-10" />
      
      {/* Slide indicator dots */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30 flex space-x-3">
        {heroSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className="focus:outline-none"
            aria-label={`Go to slide ${index + 1}`}
          >
            <motion.div
              className={`w-3 h-3 rounded-full ${
                index === currentSlide 
                  ? 'bg-[#0295E6] scale-125' 
                  : 'bg-white/50 hover:bg-white/80'
              }`}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              animate={{
                scale: index === currentSlide ? [1, 1.2, 1] : 1
              }}
              transition={{
                repeat: index === currentSlide ? Infinity : 0,
                repeatDelay: 0.5,
                duration: 1.5
              }}
            />
          </button>
        ))}
      </div>

      {/* Navigation buttons */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 z-30 bg-black/30 hover:bg-black/50 backdrop-blur-sm p-3 rounded-full group transition-all duration-300"
        aria-label="Previous slide"
      >
        <motion.svg
          className="w-6 h-6 text-white group-hover:text-[#0295E6]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          whileHover={{ x: -3 }}
          whileTap={{ scale: 0.9 }}
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </motion.svg>
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 z-30 bg-black/30 hover:bg-black/50 backdrop-blur-sm p-3 rounded-full group transition-all duration-300"
        aria-label="Next slide"
      >
        <motion.svg
          className="w-6 h-6 text-white group-hover:text-[#0295E6]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          whileHover={{ x: 3 }}
          whileTap={{ scale: 0.9 }}
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </motion.svg>
      </button>

      {/* Slide content */}
      <AnimatePresence mode="wait" custom={1}>
        <motion.div
          key={currentSlide}
          custom={1}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          className="absolute inset-0"
        >
          {/* Animated background image with zoom effect */}
          <motion.div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ 
              backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.4)), url(${heroSlides[currentSlide].image})`
            }}
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ 
              duration: 10,
              ease: "linear"
            }}
          >
            {/* Gradient overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/40" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/30" />
            
            {/* Animated glow effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-[#0295E6]/10 via-transparent to-[#0295E6]/10"
              animate={{
                opacity: [0.3, 0.5, 0.3],
                scale: [1, 1.02, 1],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            />
          </motion.div>

          {/* Content */}
          <div className="relative h-full flex items-center justify-center px-4 sm:px-6 md:px-8 z-20">
            <div className="text-center max-w-6xl w-full mx-auto">
              {/* Heading with staggered word animation */}
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-4 sm:mb-6 flex flex-wrap justify-center gap-x-2 gap-y-3 md:gap-y-4"
              >
                {renderHeading(
                  heroSlides[currentSlide].heading, 
                  heroSlides[currentSlide].blueWords
                )}
              </motion.h1>
              
              {/* Animated divider line */}
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "12rem" }}
                transition={{ delay: 0.8, duration: 1, ease: "easeOut" }}
                className="h-1 bg-gradient-to-r from-transparent via-[#0295E6] to-transparent mx-auto mb-6 sm:mb-8 rounded-full overflow-hidden"
              >
                <motion.div
                  className="h-full w-full bg-gradient-to-r from-[#0295E6]/0 via-[#0295E6] to-[#0295E6]/0"
                  animate={{
                    x: ["-100%", "100%"],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                />
              </motion.div>
              
              {/* Description with fade-in */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.6 }}
                className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-200 font-light px-2 mb-8 max-w-2xl mx-auto"
              >
                {heroSlides[currentSlide].description}
              </motion.p>
              
              {/* CTA Button - Now redirects to products page */}
              <motion.button
                onClick={handleExploreClick}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.2, duration: 0.5 }}
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 0 30px rgba(2, 149, 230, 0.4)"
                }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 bg-gradient-to-r from-[#0295E6] to-[#0278B8] text-white font-semibold rounded-full hover:shadow-xl transition-all duration-300 relative overflow-hidden group"
              >
                <span className="relative z-10 flex items-center justify-center">
                  Explore Collection
                  <motion.svg
                    className="ml-2 w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    initial={{ x: 0 }}
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.3 }}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </motion.svg>
                </span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-[#0278B8] to-[#0295E6]"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: 0 }}
                  transition={{ duration: 0.4 }}
                />
              </motion.button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Slide progress indicator */}
      <div className="absolute bottom-4 left-0 right-0 h-1 z-30 px-4">
        <motion.div
          className="h-full bg-gradient-to-r from-[#0295E6] to-cyan-400 rounded-full"
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ 
            duration: 5, 
            ease: "linear",
            repeat: Infinity 
          }}
          key={currentSlide}
        />
      </div>

      {/* Floating elements for visual interest */}
      <motion.div
        className="absolute top-1/4 left-10 w-4 h-4 rounded-full bg-[#0295E6]/30"
        animate={{
          y: [0, -20, 0],
          opacity: [0.3, 0.6, 0.3]
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        className="absolute bottom-1/3 right-16 w-6 h-6 rounded-full bg-[#0295E6]/20"
        animate={{
          y: [0, 15, 0],
          scale: [1, 1.2, 1]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.5
        }}
      />
      <motion.div
        className="absolute top-16 right-1/4 w-3 h-3 rounded-full bg-white/20"
        animate={{
          y: [0, -10, 0],
          x: [0, 10, 0]
        }}
        transition={{
          duration: 3.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
      />
    </div>
  );
}