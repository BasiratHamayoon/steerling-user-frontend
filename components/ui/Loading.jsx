'use client';

import { motion } from 'framer-motion';

export default function Loading({ text = "Loading..." }) {
  const dotVariants = {
    animate: {
      y: [0, -10, 0],
      transition: {
        duration: 0.6,
        repeat: Infinity,
        repeatDelay: 0.1
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <div className="relative">
        {/* Outer ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-24 h-24 border-4 border-gray-800 rounded-full"
        >
          {/* Inner ring */}
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            className="w-20 h-20 border-4 border-transparent border-t-[#0295E6] rounded-full absolute top-2 left-2"
          />
        </motion.div>
        
        {/* Floating dots */}
        <div className="absolute inset-0 flex items-center justify-center gap-1">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              variants={dotVariants}
              animate="animate"
              custom={i}
              className="w-2 h-2 bg-[#0295E6] rounded-full"
              style={{ animationDelay: `${i * 0.1}s` }}
            />
          ))}
        </div>
      </div>
      
      {text && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-8 text-gray-400"
        >
          {text}
        </motion.p>
      )}
    </div>
  );
}