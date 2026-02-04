'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaFilter, FaSortAmountDown, FaSortAmountUp, FaFire, FaSortAlphaDown, FaChevronDown, FaCheck } from 'react-icons/fa';
import { FiGrid } from 'react-icons/fi';

export default function Filters({ onFilterChange, productsPerRow, setProductsPerRow }) {
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
  const [availability, setAvailability] = useState('all');
  const [sortBy, setSortBy] = useState('featured');
  
  // State to track which dropdown is currently open ('availability', 'price', 'sort', or null)
  const [activeDropdown, setActiveDropdown] = useState(null);

  // Close dropdowns when clicking outside
  const filterRef = useRef(null);
  useEffect(() => {
    function handleClickOutside(event) {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setActiveDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Sync with parent
  useEffect(() => {
    onFilterChange({ priceRange, availability, sortBy });
  }, [priceRange, availability, sortBy, onFilterChange]);

  const toggleDropdown = (name) => {
    setActiveDropdown(activeDropdown === name ? null : name);
  };

  const sortOptions = [
    { value: 'featured', label: 'Featured', icon: <FaFire className="text-orange-500" /> },
    { value: 'price-low', label: 'Price: Low to High', icon: <FaSortAmountDown className="text-green-500" /> },
    { value: 'price-high', label: 'Price: High to Low', icon: <FaSortAmountUp className="text-red-500" /> },
    { value: 'name', label: 'Name A-Z', icon: <FaSortAlphaDown className="text-blue-500" /> },
  ];

  const availabilityOptions = [
    { value: 'all', label: 'All Products' },
    { value: 'in-stock', label: 'In Stock' },
    { value: 'out-of-stock', label: 'Out of Stock' },
  ];

  const viewOptions = [
    { value: 2, icon: <FiGrid className="text-lg" />, label: '2 per row' },
    { value: 3, icon: <FiGrid className="text-lg" />, label: '3 per row' },
    { value: 4, icon: <FiGrid className="text-lg" />, label: '4 per row' },
  ];

  // Animation variants for dropdowns
  const dropdownVariants = {
    hidden: { opacity: 0, y: -10, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.2 } },
    exit: { opacity: 0, y: -10, scale: 0.95, transition: { duration: 0.15 } }
  };

  // Shared trigger style (Bottom border only)
  const triggerStyle = `
    flex items-center justify-between w-full md:w-48 gap-2 
    bg-transparent border-b border-gray-700 
    text-gray-200 text-sm py-2 px-1 cursor-pointer 
    hover:border-gray-500 transition-colors group select-none
  `;

  return (
    <motion.div
      ref={filterRef}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full mb-8 pb-6 border-b border-gray-800"
    >
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
        
        {/* Left Side: Filter Controls */}
        <div className="flex flex-col gap-6 w-full lg:w-auto">
          
          {/* Header */}
          <div className="flex items-center gap-2 text-green-500 mb-2">
            <FaFilter className="text-sm" />
            <span className="text-sm font-semibold uppercase tracking-wider">Filter & Sort</span>
          </div>
          
          <div className="flex flex-col sm:flex-row flex-wrap gap-x-8 gap-y-6 relative">
            
            {/* 1. AVAILABILITY DROPDOWN */}
            <div className="flex flex-col gap-1 relative">
              <span className="text-xs text-gray-500 uppercase tracking-wide">Availability</span>
              <div 
                onClick={() => toggleDropdown('availability')}
                className={`${triggerStyle} ${activeDropdown === 'availability' ? 'border-green-500' : ''}`}
              >
                <span className="truncate">
                  {availabilityOptions.find(o => o.value === availability)?.label}
                </span>
                <FaChevronDown className={`text-[10px] text-gray-500 transition-transform ${activeDropdown === 'availability' ? 'rotate-180 text-green-500' : ''}`} />
              </div>

              <AnimatePresence>
                {activeDropdown === 'availability' && (
                  <motion.div
                    variants={dropdownVariants}
                    initial="hidden" animate="visible" exit="exit"
                    className="absolute top-full left-0 mt-2 w-full min-w-[180px] bg-gray-900 border border-gray-800 rounded-xl shadow-2xl overflow-hidden z-50 ring-1 ring-white/10 backdrop-blur-md"
                  >
                    {availabilityOptions.map((option) => (
                      <div
                        key={option.value}
                        onClick={() => {
                          setAvailability(option.value);
                          setActiveDropdown(null);
                        }}
                        className={`
                          px-4 py-3 text-sm cursor-pointer flex items-center justify-between
                          hover:bg-gray-800 transition-colors
                          ${availability === option.value ? 'text-green-500 bg-gray-800/50' : 'text-gray-300'}
                        `}
                      >
                        {option.label}
                        {availability === option.value && <FaCheck className="text-xs" />}
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* 2. PRICE RANGE CUSTOM POPOVER */}
            <div className="flex flex-col gap-1 relative">
              <span className="text-xs text-gray-500 uppercase tracking-wide">Price Range</span>
              
              {/* Trigger */}
              <div 
                onClick={() => toggleDropdown('price')}
                className={`${triggerStyle} ${activeDropdown === 'price' ? 'border-green-500' : ''}`}
              >
                <span className="truncate font-mono text-gray-300">
                  ${priceRange.min} - ${priceRange.max}
                </span>
                <FaChevronDown className={`text-[10px] text-gray-500 transition-transform ${activeDropdown === 'price' ? 'rotate-180 text-green-500' : ''}`} />
              </div>

              {/* Popover Content */}
              <AnimatePresence>
                {activeDropdown === 'price' && (
                  <motion.div
                    variants={dropdownVariants}
                    initial="hidden" animate="visible" exit="exit"
                    className="absolute top-full left-0 mt-2 w-64 bg-gray-900 border border-gray-800 rounded-xl shadow-2xl p-4 z-50 ring-1 ring-white/10 backdrop-blur-md"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex-1">
                        <label className="text-[10px] text-gray-500 uppercase font-bold mb-1 block">From</label>
                        <div className="relative group/input">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">$</span>
                          <input
                            type="number"
                            value={priceRange.min}
                            onChange={(e) => setPriceRange({ ...priceRange, min: parseInt(e.target.value) || 0 })}
                            className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2 pl-6 pr-2 text-sm text-white focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all"
                          />
                        </div>
                      </div>
                      <span className="text-gray-600 mt-4">-</span>
                      <div className="flex-1">
                        <label className="text-[10px] text-gray-500 uppercase font-bold mb-1 block">To</label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">$</span>
                          <input
                            type="number"
                            value={priceRange.max}
                            onChange={(e) => setPriceRange({ ...priceRange, max: parseInt(e.target.value) || 1000 })}
                            className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2 pl-6 pr-2 text-sm text-white focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all"
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* 3. SORT DROPDOWN */}
            <div className="flex flex-col gap-1 relative">
              <span className="text-xs text-gray-500 uppercase tracking-wide">Sort By</span>
              <div 
                onClick={() => toggleDropdown('sort')}
                className={`${triggerStyle} ${activeDropdown === 'sort' ? 'border-green-500' : ''}`}
              >
                <div className="flex items-center gap-2 overflow-hidden">
                  <span className="text-gray-400">
                    {sortOptions.find(o => o.value === sortBy)?.icon}
                  </span>
                  <span className="truncate">
                    {sortOptions.find(o => o.value === sortBy)?.label}
                  </span>
                </div>
                <FaChevronDown className={`text-[10px] text-gray-500 transition-transform ${activeDropdown === 'sort' ? 'rotate-180 text-green-500' : ''}`} />
              </div>

              <AnimatePresence>
                {activeDropdown === 'sort' && (
                  <motion.div
                    variants={dropdownVariants}
                    initial="hidden" animate="visible" exit="exit"
                    className="absolute top-full left-0 mt-2 w-full min-w-[200px] bg-gray-900 border border-gray-800 rounded-xl shadow-2xl overflow-hidden z-50 ring-1 ring-white/10 backdrop-blur-md"
                  >
                    {sortOptions.map((option) => (
                      <div
                        key={option.value}
                        onClick={() => {
                          setSortBy(option.value);
                          setActiveDropdown(null);
                        }}
                        className={`
                          px-4 py-3 text-sm cursor-pointer flex items-center gap-3
                          hover:bg-gray-800 transition-colors
                          ${sortBy === option.value ? 'bg-gray-800/50' : ''}
                        `}
                      >
                        <span className={`${sortBy === option.value ? 'opacity-100' : 'opacity-70'}`}>
                          {option.icon}
                        </span>
                        <span className={`flex-1 ${sortBy === option.value ? 'text-green-500 font-medium' : 'text-gray-300'}`}>
                          {option.label}
                        </span>
                        {sortBy === option.value && <FaCheck className="text-xs text-green-500" />}
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
          </div>
        </div>

        {/* Right Side: View Toggle (Hidden on small screens) */}
        <div className="hidden md:flex flex-col items-end gap-2">
          <span className="text-xs text-gray-500 uppercase tracking-wide">Layout</span>
          <div className="flex items-center bg-gray-900/50 rounded-lg p-1 border border-gray-800">
            {viewOptions.map(option => (
              <button
                key={option.value}
                onClick={() => setProductsPerRow(option.value)}
                className={`p-2 rounded-md transition-all duration-300 ${
                  productsPerRow === option.value 
                    ? 'bg-gray-800 text-green-500 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-300'
                }`}
                title={option.label}
              >
                {option.icon}
              </button>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}