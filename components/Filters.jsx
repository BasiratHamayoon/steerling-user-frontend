'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

export default function Filters({ onFilterChange }) {
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
  const [availability, setAvailability] = useState('all');
  const [sortBy, setSortBy] = useState('featured');

  const handleFilterChange = () => {
    onFilterChange({
      priceRange,
      availability,
      sortBy,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-gray-800 p-6 rounded-xl"
    >
      <h3 className="font-semibold text-lg mb-6">Filters</h3>
      
      <div className="space-y-6">
        <div>
          <h4 className="font-medium mb-3">Availability</h4>
          <div className="space-y-2">
            {['all', 'in-stock', 'out-of-stock'].map((option) => (
              <label key={option} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="availability"
                  checked={availability === option}
                  onChange={() => {
                    setAvailability(option);
                    handleFilterChange();
                  }}
                  className="text-green-500"
                />
                <span className="capitalize">{option.replace('-', ' ')}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-medium mb-3">Price Range</h4>
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <input
                type="number"
                value={priceRange.min}
                onChange={(e) => {
                  setPriceRange({ ...priceRange, min: parseInt(e.target.value) || 0 });
                  handleFilterChange();
                }}
                className="w-24 px-3 py-2 bg-gray-900 rounded border border-gray-700"
                placeholder="Min"
              />
              <span>to</span>
              <input
                type="number"
                value={priceRange.max}
                onChange={(e) => {
                  setPriceRange({ ...priceRange, max: parseInt(e.target.value) || 1000 });
                  handleFilterChange();
                }}
                className="w-24 px-3 py-2 bg-gray-900 rounded border border-gray-700"
                placeholder="Max"
              />
            </div>
          </div>
        </div>

        <div>
          <h4 className="font-medium mb-3">Sort By</h4>
          <select
            value={sortBy}
            onChange={(e) => {
              setSortBy(e.target.value);
              handleFilterChange();
            }}
            className="w-full px-3 py-2 bg-gray-900 rounded border border-gray-700"
          >
            <option value="featured">Featured</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="newest">Newest</option>
            <option value="name">Name A-Z</option>
          </select>
        </div>
      </div>
    </motion.div>
  );
}