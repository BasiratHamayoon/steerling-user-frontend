'use client';

import { useState, useEffect } from 'react';
import { usePathname, useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
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

  const navItems = [
    { name: 'Home', href: `/${currentUser}` },
    { name: 'Categories', href: `/${currentUser}/categories` },
    { name: 'Products', href: `/${currentUser}/products` },
    { name: 'Contact', href: `/${currentUser}/contact` },
  ];

  return (
    <>
      <header className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-gray-900/95 backdrop-blur-md shadow-lg border-b border-gray-800' : 'bg-gray-900 border-b border-gray-800'}`}>
        
        {/* Top Contact Bar */}
        <div className="bg-[#0295E6] py-2 overflow-hidden relative z-50">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center flex items-center justify-center gap-2 text-sm font-medium text-white"
            >
              {contactSlides[currentSlide].icon}
              <span>{contactSlides[currentSlide].text}</span>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="container mx-auto px-4 py-3"> {/* Reduced vertical padding slightly to balance larger logo */}
          <div className="flex items-center justify-between">
            
            {/* LOGO SECTION - Increased Size */}
            <Link 
              href={`/${currentUser}`} 
              className="outline-none focus:outline-none hover:opacity-90 transition-opacity"
            >
              <div className="relative h-14 w-48 md:h-16 md:w-56"> {/* Increased height/width */}
                <Image 
                  src="/logo.png" 
                  alt="SteerFlux" 
                  fill
                  className="object-contain object-left"
                  priority
                  sizes="(max-width: 768px) 192px, 224px"
                />
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`text-sm uppercase tracking-wide font-medium transition-all duration-200 outline-none focus:outline-none hover:-translate-y-0.5 ${
                    pathname === item.href 
                      ? 'text-[#0295E6]' 
                      : 'text-gray-300 hover:text-[#0295E6]'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* Icons */}
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-2.5 hover:bg-gray-800 rounded-xl transition-colors outline-none focus:outline-none group"
              >
                <FiSearch className="text-xl text-gray-300 group-hover:text-[#0295E6] transition-colors" />
              </button>
              <button
                onClick={() => setIsAdminLoginOpen(true)}
                className="p-2.5 hover:bg-gray-800 rounded-xl transition-colors outline-none focus:outline-none group"
              >
                <FaUser className="text-xl text-gray-300 group-hover:text-[#0295E6] transition-colors" />
              </button>
              
              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 hover:bg-gray-800 rounded-xl outline-none focus:outline-none text-gray-300"
              >
                {isMenuOpen ? (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                ) : (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
                )}
              </button>
            </div>
          </div>

          {/* Mobile Dropdown */}
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="md:hidden mt-4 overflow-hidden border-t border-gray-800 pt-4"
              >
                <div className="flex flex-col space-y-2 pb-4">
                  {navItems.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`px-4 py-3 rounded-lg outline-none focus:outline-none font-medium ${
                        pathname === item.href 
                          ? 'bg-[#0295E6]/10 text-[#0295E6]' 
                          : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                      } transition-colors`}
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