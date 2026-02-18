'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaTachometerAlt,
  FaBox,
  FaTags,
  FaEnvelope,
  FaCog,
  FaTimes,
  FaSignOutAlt,
  FaStar, // Add this import
} from 'react-icons/fa';
import { useAppContext } from '@/context/AppContext';

const menuItems = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: <FaTachometerAlt /> },
  { name: 'Products', href: '/admin/products', icon: <FaBox /> },
  { name: 'Categories', href: '/admin/categories', icon: <FaTags /> },
  { name: 'Reviews', href: '/admin/reviews', icon: <FaStar /> }, // Add this line
  { name: 'Messages', href: '/admin/messages', icon: <FaEnvelope /> },
  { name: 'Settings', href: '/admin/settings', icon: <FaCog /> },
];

export default function AdminSidebar({ isOpen, onClose, isMobile }) {
  const pathname = usePathname();
  const router = useRouter();               
  const { logout } = useAppContext();        

  const handleLogout = () => {
    logout();                               
    router.push('/user');             
  };

  return (
    <>
      <AnimatePresence>
        {isMobile && isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 z-30 md:hidden"
          />
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {(!isMobile || isOpen) && (
          <motion.aside
            key={isMobile ? 'mobile-sidebar' : 'desktop-sidebar'}
            initial={isMobile ? { x: -280 } : false}
            animate={isMobile ? { x: 0 } : false}
            exit={{ x: -280 }}
            className="fixed top-16 left-0 h-[calc(100vh-4rem)] w-64 bg-gray-900/95 backdrop-blur-md border-r border-gray-700/50 flex flex-col z-40 overflow-y-auto"
          >
            <div className="h-full flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between p-4">
                {isMobile && (
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-gray-800/50 rounded-lg transition-colors text-gray-400 hover:text-white"
                  >
                    <FaTimes />
                  </button>
                )}
              </div>

              {/* Menu Items */}
              <nav className="flex-1 p-4 space-y-1">
                {menuItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={isMobile ? onClose : undefined}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                        isActive
                          ? 'bg-gradient-to-r from-[#0295E6]/20 to-[#02b3e6]/10 text-[#0295E6] border-l-4 border-[#0295E6]'
                          : 'text-gray-400 hover:text-white hover:bg-gray-800/30'
                      }`}
                    >
                      <span className={`text-lg ${isActive ? 'text-[#0295E6]' : 'text-gray-400'}`}>
                        {item.icon}
                      </span>
                      <span className="font-medium">{item.name}</span>
                      {isActive && (
                        <span className="ml-auto w-2 h-2 bg-[#0295E6] rounded-full animate-pulse" />
                      )}
                    </Link>
                  );
                })}
              </nav>

              {/* Footer */}
              <div className="p-4 border-t border-gray-700/50">
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 w-full p-3 text-left hover:bg-red-900/30 text-red-400 rounded-lg transition-colors"
                >
                  <FaSignOutAlt />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}