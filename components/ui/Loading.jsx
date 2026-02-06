'use client';

import { motion } from 'framer-motion';

export default function Loading({ text = 'Loading...', fullScreen = false }) {
  const content = (
    <div className="flex flex-col items-center justify-center py-12">
      <motion.div
        className="w-12 h-12 border-4 border-gray-600 border-t-red-500 rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      />
      <p className="mt-4 text-gray-400">{text}</p>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
        {content}
      </div>
    );
  }

  return content;
}