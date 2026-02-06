'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useState } from 'react';

export default function CategoryCard({ category }) {
  const [imageError, setImageError] = useState(false);

  const BACKEND_URL = 'http://localhost:5000'; // for now, hardcoded; env later

  let src = null;
  if (category.image) {
    if (category.image.startsWith('http')) {
      src = category.image;
    } else {
      src = `${BACKEND_URL}${category.image}`;
    }
  }

  return (
    <Link href={`/categories/${category._id}`}>
      <motion.div
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.95 }}
        className="card-hover  bg-gray-900 rounded-xl overflow-hidden border border-gray-700"
      >
        <div className="h-48 overflow-hidden">
          {src && !imageError ? (
            <img
              src={src}
              alt={category.name}
              className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full bg-gray-800 flex items-center justify-center">
              <span className="text-gray-500 text-4xl">🏎️</span>
            </div>
          )}
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-lg mb-2">{category.name}</h3>
          <p className="text-gray-400 text-sm">
            {category.productCount ?? 0} products
          </p>
        </div>
      </motion.div>
    </Link>
  );
}