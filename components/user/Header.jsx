'use client';

import { useState, useEffect } from 'react';
import { usePathname, useParams } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { FaWhatsapp, FaPhone, FaEnvelope, FaUser } from 'react-icons/fa';
import { FiSearch } from 'react-icons/fi';
import { useAppContext } from '@/context/AppContext';
import SearchModal from './SearchModal';
import AdminLoginModal from './AdminLoginModal';

const contactSlides = [
  { id: 1, text: 'Call us: +1234567890', icon: <FaPhone /> },
  { id: 2, text: 'WhatsApp: +1234567890', icon: <FaWhatsapp /> },
  { id: 3, text: 'Email: info@steerflux.com', icon: <FaEnvelope /> },
];

export default function Header() {
  const pathname = usePathname();
  const params = useParams();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { setIsSearchOpen, setIsAdminLoginOpen } = useAppContext();

  // Get the current user from dynamic route
  const currentUser = params?.user || 'user';

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === contactSlides.length - 1 ? 0 : prev + 1));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Correct navigation links for dynamic route
  const navItems = [
    { name: 'Home', href: `/${currentUser}` },
    { name: 'Categories', href: `/${currentUser}/categories` },
    { name: 'Products', href: `/${currentUser}/products` },
    { name: 'Contact', href: `/${currentUser}/contact` },
  ];

  return (
    <>
      <header className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-gray-900/95 backdrop-blur-md shadow-lg' : 'bg-gray-900'} border-b border-gray-700`}>
        <div className="bg-[#0295E6] py-2 overflow-hidden">
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
            {/* Added outline-none to Logo */}
            <Link href={`/${currentUser}`} className="text-2xl font-bold outline-none focus:outline-none">
              <span className="text-[#0295E6]">Steer</span>
              <span className="text-white">Flux</span>
            </Link>

            <nav className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  // Added outline-none and focus:outline-none here
                  className={`transition-colors outline-none focus:outline-none ${
                    pathname === item.href 
                      ? 'text-[#0295E6] font-semibold' 
                      : 'text-gray-300 hover:text-[#0295E6]'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-2 hover:bg-gray-800 rounded-full transition-colors outline-none focus:outline-none"
              >
                <FiSearch className="text-xl text-gray-300" />
              </button>
              <button
                onClick={() => setIsAdminLoginOpen(true)}
                className="p-2 hover:bg-gray-800 rounded-full transition-colors outline-none focus:outline-none"
              >
                <FaUser className="text-xl text-gray-300" />
              </button>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 hover:bg-gray-800 rounded-full outline-none focus:outline-none"
              >
                {isMenuOpen ? '✕' : '☰'}
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
                      // Added outline-none here as well for mobile menu
                      className={`py-2 outline-none focus:outline-none ${
                        pathname === item.href 
                          ? 'text-[#0295E6] font-semibold' 
                          : 'text-gray-300'
                      } hover:text-[#0295E6] transition-colors`}
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
      <AdminLoginModal />
    </>
  );
}