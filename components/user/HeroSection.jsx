'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const heroSlides = [
  {
    id: 1,
    image: '/1.png',  
    heading: 'Premium Steering Wheels Collection',
    blueWords: [0, 1], // "Premium", "Steering" in blue
  },
  {
    id: 2,
    image: '/2.png',
    heading: 'Ultimate Racing Experience For You',
    blueWords: [0, 2], // "Ultimate", "Experience" in blue
  },
];

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(1); // 1 for right, -1 for left

  useEffect(() => {
    const interval = setInterval(() => {
      setDirection(prev => -prev);
      setCurrentSlide((prev) => (prev === heroSlides.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const renderHeading = (heading, blueWordIndices) => {
    const words = heading.split(' ');
    
    return words.map((word, index) => (
      <span
        key={index}
        className={`${blueWordIndices.includes(index) ? 'text-[#0295E6]' : 'text-white'} ${index > 0 ? 'ml-2' : ''}`}
      >
        {word}
      </span>
    ));
  };

  return (
    <div className="relative h-[60vh] md:h-[80vh] overflow-hidden">
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={currentSlide}
          custom={direction}
          initial={{ 
            x: direction > 0 ? 300 : -300,
            opacity: 0,
            scale: 0.95
          }}
          animate={{ 
            x: 0,
            opacity: 1,
            scale: 1
          }}
          exit={{ 
            x: direction > 0 ? -300 : 300,
            opacity: 0,
            scale: 0.95
          }}
          transition={{ 
            duration: 0.8,
            ease: "easeInOut"
          }}
          className="absolute inset-0"
        >
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ 
              backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.4), rgba(0,0,0,0.3), rgba(0,0,0,0.4)), url(${heroSlides[currentSlide].image})`
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/30" />
          </div>
          
          <div className="relative h-full flex items-center justify-center px-4 sm:px-6 md:px-8">
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.7 }}
              className="text-center max-w-6xl w-full mx-auto px-2 sm:px-4"
            >
              <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 flex flex-wrap justify-center gap-x-2 gap-y-2">
                {renderHeading(
                  heroSlides[currentSlide].heading, 
                  heroSlides[currentSlide].blueWords
                )}
              </h1>
              
              <div className="w-32 h-1 bg-[#0295E6]/60 mx-auto rounded-full mb-6 sm:mb-8 animate-pulse-glow" />
              
              <p className="text-base sm:text-lg md:text-xl text-gray-300 font-medium px-2">
                Drive in Style & Comfort
              </p>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}