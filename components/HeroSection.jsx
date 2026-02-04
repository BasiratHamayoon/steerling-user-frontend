'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const heroSlides = [
  {
    id: 1,
    image: '/1.png',  
    heading: 'Premium Automotive Steering Wheels Collection',
    greenWords: [0, 4], // "Premium", "Automotive", "Collection" in green
  },
  {
    id: 2,
    image: '/2.png',
    heading: 'Experience Ultimate Racing Steering Performance',
    greenWords: [0, 2], // "Ultimate", "Racing" in green
  },
];

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === heroSlides.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const renderHeading = (heading, greenWordIndices) => {
    const words = heading.split(' ');
    
    return (
      <>
        {words.map((word, index) => (
          <span
            key={index}
            className={`inline-block ${
              greenWordIndices.includes(index) 
                ? 'text-green-600 font-extrabold' 
                : 'text-white font-bold'
            } ${index === 0 ? '' : 'ml-2'}`}
          >
            {word}
          </span>
        ))}
      </>
    );
  };

  return (
    <div className="relative h-[60vh] md:h-[80vh] overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="absolute inset-0"
        >
          {/* Background with Multiple Gradients for Depth */}
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ 
              backgroundImage: `
                
                url(${heroSlides[currentSlide].image})
              `,
              backgroundColor: '#1a202c'
            }}
          >
            {/* Vignette Effect */}
            <div className="absolute inset-0 shadow-[inset_0_0_150px_rgba(0,0,0,0.8)]" />
            
            {/* Radial Gradient */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.3)_0%,rgba(0,0,0,0.7)_70%)]" />
          </div>
          
          {/* Content */}
          <div className="relative h-full flex items-center justify-center px-4">
            <motion.div
              initial={{ y: 30, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              transition={{ 
                delay: 0.3, 
                duration: 0.8,
                type: "spring",
                stiffness: 100
              }}
              className="text-center max-w-4xl"
            >
              <div className="inline-block px-8 py-6 rounded-2xl  shadow-2xl">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight">
                  {renderHeading(
                    heroSlides[currentSlide].heading, 
                    heroSlides[currentSlide].greenWords
                  )}
                </h1>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}