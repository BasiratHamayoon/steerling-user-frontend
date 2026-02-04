'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { FaWhatsapp, FaSearch, FaTimes, FaPhone, FaEnvelope } from 'react-icons/fa';
import { useAppContext } from '@/context/AppContext';
import SearchModal from './SearchModal';

const contactSlides = [
  { id: 1, text: 'Call us: +1234567890', icon: <FaPhone /> },
  { id: 2, text: 'WhatsApp: +1234567890', icon: <FaWhatsapp /> },
  { id: 3, text: 'Email: info@steeringpro.com', icon: <FaEnvelope /> },
];

export default function Header() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { setIsSearchOpen } = useAppContext();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === contactSlides.length - 1 ? 0 : prev + 1));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'Categories', href: '/categories' },
    { name: 'Products', href: '/products' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 bg-gray-900 border-b border-gray-800">
        <div className="bg-green-600 py-2 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center flex items-center justify-center gap-2"
            >
              {contactSlides[currentSlide].icon}
              <span className="font-medium">{contactSlides[currentSlide].text}</span>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold text-green-400">
              Steering<span className="text-white">Pro</span>
            </Link>

            <nav className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-gray-300 hover:text-green-400 transition-colors"
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-2 hover:bg-gray-800 rounded-full transition-colors"
              >
                <FaSearch className="text-xl" />
              </button>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 hover:bg-gray-800 rounded-full"
              >
                {isMenuOpen ? <FaTimes /> : '☰'}
              </button>
            </div>
          </div>

          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="md:hidden mt-4 overflow-hidden"
              >
                <div className="flex flex-col space-y-3 pb-4">
                  {navItems.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="py-2 text-gray-300 hover:text-green-400 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>
      <SearchModal />
    </>
  );
}