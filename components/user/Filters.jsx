'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaFilter, FaSortAmountDown, FaSortAmountUp, FaFire, FaSortAlphaDown, FaChevronDown, FaCheck } from 'react-icons/fa';
import { FiGrid } from 'react-icons/fi';

export default function Filters({ onFilterChange, productsPerRow, setProductsPerRow }) {
  // Constants for defaults
  const DEFAULT_MIN = 0;
  const DEFAULT_MAX = 10000;

  const [priceRange, setPriceRange] = useState({ min: DEFAULT_MIN, max: DEFAULT_MAX });
  const [availability, setAvailability] = useState('all');
  const [sortBy, setSortBy] = useState('featured');
  
  // State to track which dropdown is currently open
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

  // Helper to display price label nicely
  const getPriceLabel = () => {
    if (priceRange.min === DEFAULT_MIN && priceRange.max === DEFAULT_MAX) {
      return "Any";
    }
    return `$${priceRange.min} - $${priceRange.max}`;
  };

  const sortOptions = [
    { value: 'featured', label: 'Featured', icon: <FaFire className="text-orange-500" /> },
    { value: 'price-low', label: 'Price: Low to High', icon: <FaSortAmountDown className="text-[#0295E6]" /> },
    { value: 'price-high', label: 'Price: High to Low', icon: <FaSortAmountUp className="text-red-500" /> },
    { value: 'name', label: 'Name A-Z', icon: <FaSortAlphaDown className="text-blue-500" /> },
  ];

  const availabilityOptions = [
    { value: 'all', label: 'All' },
    { value: 'in-stock', label: 'In Stock' },
    { value: 'out-of-stock', label: 'Out of Stock' },
  ];

  const viewOptions = [
    { value: 2, icon: <FiGrid className="text-sm" />, label: '2 per row' },
    { value: 3, icon: <FiGrid className="text-sm" />, label: '3 per row' },
    { value: 4, icon: <FiGrid className="text-sm" />, label: '4 per row' },
  ];

  // Animation variants
  const dropdownVariants = {
    hidden: { opacity: 0, y: -4, scale: 0.98 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.15, ease: "easeOut" } },
    exit: { opacity: 0, y: -4, scale: 0.98, transition: { duration: 0.1, ease: "easeIn" } }
  };

  // Shared trigger style - REDUCED HEIGHT (h-10) and PADDING
  const triggerStyle = `
    flex items-center justify-between w-full md:min-w-[160px] gap-2 
    bg-gray-900 border border-gray-700 rounded-lg
    text-gray-300 text-xs sm:text-sm h-10 px-3 cursor-pointer 
    hover:border-[#0295E6]/50 hover:bg-gray-800 transition-all duration-300 group select-none relative
  `;

  return (
    <motion.div
      ref={filterRef}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full mb-8"
    >
      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
        
        {/* Left Side: Filter Controls */}
        <div className="flex flex-col gap-3 w-full xl:w-auto">
          
          <div className="flex flex-col sm:flex-row flex-wrap gap-3 relative">
            
            {/* Filter Icon Label (Desktop) - Adjusted to h-10 w-10 */}
            <div className="hidden xl:flex items-center justify-center w-10 h-10 rounded-lg bg-gray-900 border border-gray-800 text-[#0295E6] text-sm shadow-sm">
               <FaFilter />
            </div>

            {/* 1. AVAILABILITY DROPDOWN */}
            <div className="relative flex-1 sm:flex-none">
              <div 
                onClick={() => toggleDropdown('availability')}
                className={`${triggerStyle} ${activeDropdown === 'availability' ? 'border-[#0295E6] ring-1 ring-[#0295E6]/20' : ''}`}
              >
                <div className="flex items-center gap-2 overflow-hidden">
                   <span className="text-gray-500 font-medium whitespace-nowrap">Status:</span>
                   <span className="truncate font-medium text-white">
                      {availabilityOptions.find(o => o.value === availability)?.label}
                   </span>
                </div>
                <FaChevronDown className={`text-[10px] text-gray-500 transition-transform duration-300 ${activeDropdown === 'availability' ? 'rotate-180 text-[#0295E6]' : ''}`} />
              </div>

              <AnimatePresence>
                {activeDropdown === 'availability' && (
                  <motion.div
                    variants={dropdownVariants}
                    initial="hidden" animate="visible" exit="exit"
                    className="absolute top-full left-0 mt-1 w-full min-w-[160px] bg-gray-900 border border-gray-700 rounded-lg shadow-xl overflow-hidden z-50 ring-1 ring-black/50"
                  >
                    {availabilityOptions.map((option) => (
                      <div
                        key={option.value}
                        onClick={() => {
                          setAvailability(option.value);
                          setActiveDropdown(null);
                        }}
                        className={`
                          px-3 py-2 text-xs cursor-pointer flex items-center justify-between
                          hover:bg-gray-800 transition-colors border-b border-gray-800/50 last:border-0
                          ${availability === option.value ? 'text-[#0295E6] bg-gray-800/50' : 'text-gray-300'}
                        `}
                      >
                        {option.label}
                        {availability === option.value && <FaCheck className="text-[10px]" />}
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* 2. PRICE RANGE DROPDOWN */}
            <div className="relative flex-1 sm:flex-none">
              <div 
                onClick={() => toggleDropdown('price')}
                className={`${triggerStyle} ${activeDropdown === 'price' ? 'border-[#0295E6] ring-1 ring-[#0295E6]/20' : ''}`}
              >
                <div className="flex items-center gap-2 overflow-hidden">
                   <span className="text-gray-500 font-medium whitespace-nowrap">Price:</span>
                   <span className="truncate font-medium text-white font-mono text-xs">
                      {getPriceLabel()}
                   </span>
                </div>
                <FaChevronDown className={`text-[10px] text-gray-500 transition-transform duration-300 ${activeDropdown === 'price' ? 'rotate-180 text-[#0295E6]' : ''}`} />
              </div>

              <AnimatePresence>
                {activeDropdown === 'price' && (
                  <motion.div
                    variants={dropdownVariants}
                    initial="hidden" animate="visible" exit="exit"
                    className="absolute top-full left-0 mt-1 w-full sm:w-64 bg-gray-900 border border-gray-700 rounded-lg shadow-xl p-4 z-50 ring-1 ring-black/50"
                  >
                    <div className="flex items-center gap-2">
                      <div className="flex-1">
                        <label className="text-[10px] text-gray-500 uppercase font-bold mb-1 block">Min</label>
                        <div className="relative">
                          <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-500 text-xs">$</span>
                          <input
                            type="number"
                            placeholder="0"
                            value={priceRange.min === 0 ? '' : priceRange.min}
                            onChange={(e) => setPriceRange({ ...priceRange, min: Number(e.target.value) })}
                            className="w-full bg-gray-950 border border-gray-700 rounded-md py-1.5 pl-5 pr-2 text-xs text-white focus:outline-none focus:border-[#0295E6] transition-all placeholder-gray-700"
                          />
                        </div>
                      </div>
                      <span className="text-gray-600 mt-4">-</span>
                      <div className="flex-1">
                        <label className="text-[10px] text-gray-500 uppercase font-bold mb-1 block">Max</label>
                        <div className="relative">
                          <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-500 text-xs">$</span>
                          <input
                            type="number"
                            placeholder="10k+"
                            value={priceRange.max === DEFAULT_MAX ? '' : priceRange.max}
                            onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value === '' ? DEFAULT_MAX : Number(e.target.value) })}
                            className="w-full bg-gray-950 border border-gray-700 rounded-md py-1.5 pl-5 pr-2 text-xs text-white focus:outline-none focus:border-[#0295E6] transition-all placeholder-gray-700"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 pt-2 border-t border-gray-800 flex justify-end">
                        <button 
                            onClick={() => {
                                setPriceRange({ min: DEFAULT_MIN, max: DEFAULT_MAX });
                                setActiveDropdown(null);
                            }}
                            className="text-[10px] text-[#0295E6] hover:text-white transition-colors font-medium"
                        >
                            Reset Range
                        </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* 3. SORT DROPDOWN */}
            <div className="relative flex-1 sm:flex-none">
              <div 
                onClick={() => toggleDropdown('sort')}
                className={`${triggerStyle} ${activeDropdown === 'sort' ? 'border-[#0295E6] ring-1 ring-[#0295E6]/20' : ''}`}
              >
                <div className="flex items-center gap-2 overflow-hidden">
                   <span className="text-gray-500 font-medium whitespace-nowrap">Sort:</span>
                   <span className="truncate font-medium text-white flex items-center gap-1.5">
                     {sortOptions.find(o => o.value === sortBy)?.icon}
                     {sortOptions.find(o => o.value === sortBy)?.label}
                   </span>
                </div>
                <FaChevronDown className={`text-[10px] text-gray-500 transition-transform duration-300 ${activeDropdown === 'sort' ? 'rotate-180 text-[#0295E6]' : ''}`} />
              </div>

              <AnimatePresence>
                {activeDropdown === 'sort' && (
                  <motion.div
                    variants={dropdownVariants}
                    initial="hidden" animate="visible" exit="exit"
                    className="absolute top-full left-0 mt-1 w-full min-w-[200px] bg-gray-900 border border-gray-700 rounded-lg shadow-xl overflow-hidden z-50 ring-1 ring-black/50"
                  >
                    {sortOptions.map((option) => (
                      <div
                        key={option.value}
                        onClick={() => {
                          setSortBy(option.value);
                          setActiveDropdown(null);
                        }}
                        className={`
                          px-3 py-2.5 text-xs cursor-pointer flex items-center gap-2
                          hover:bg-gray-800 transition-colors border-b border-gray-800/50 last:border-0
                          ${sortBy === option.value ? 'bg-gray-800/50' : ''}
                        `}
                      >
                        <span className={`${sortBy === option.value ? 'opacity-100' : 'opacity-70'}`}>
                          {option.icon}
                        </span>
                        <span className={`flex-1 ${sortBy === option.value ? 'text-[#0295E6] font-medium' : 'text-gray-300'}`}>
                          {option.label}
                        </span>
                        {sortBy === option.value && <FaCheck className="text-[10px] text-[#0295E6]" />}
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
          </div>
        </div>

        {/* Right Side: View Toggle - Compacted to match h-10 */}
        <div className="hidden xl:flex items-center gap-3">
          <span className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Layout</span>
          <div className="flex items-center bg-gray-900 rounded-lg p-1 border border-gray-700 h-10">
            {viewOptions.map(option => (
              <button
                key={option.value}
                onClick={() => setProductsPerRow(option.value)}
                className={`h-full px-3 rounded-md transition-all duration-300 flex items-center justify-center ${
                  productsPerRow === option.value 
                    ? 'bg-gray-800 text-[#0295E6] shadow-sm' 
                    : 'text-gray-600 hover:text-gray-300 hover:bg-gray-800/50'
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