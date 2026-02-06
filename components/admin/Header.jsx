'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBars, FaBell, FaUserCircle, FaSignOutAlt, FaCog, FaEnvelope } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

export default function AdminHeader({ onSidebarToggle, onLogout, isMobile }) {
  const router = useRouter();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const getAdminUser = () => {
    if (typeof window !== 'undefined') {
      const user = localStorage.getItem('adminUser');
      return user ? JSON.parse(user) : { name: 'Administrator', email: 'admin@steerflux.com' };
    }
    return { name: 'Administrator', email: 'admin@steerflux.com' };
  };

  const adminUser = getAdminUser();

  const handleLogout = () => {
    localStorage.removeItem('adminAuth');
    localStorage.removeItem('adminUser');
    if (onLogout) onLogout();
    router.push('/user');
  };

  return (
    <header className="fixed top-0 right-0 left-0 h-16 bg-gray-900/95 backdrop-blur-md border-b border-gray-700/50 z-50">
      <div className="h-full px-4 flex items-center justify-between">
        {/* Left Section - Only show burger menu on mobile */}
        <div className="flex items-center gap-4">
          {isMobile && (
            <button
              onClick={onSidebarToggle}
              className="p-2 hover:bg-gray-800/50 rounded-lg transition-colors text-gray-300 hover:text-white"
            >
              <FaBars className="text-xl" />
            </button>
          )}
          <div className="hidden md:block">
            <h1 className="text-xl font-bold">
              <span className="text-[#0295E6]">SteerFlux</span>
              <span className="text-gray-300"> Admin</span>
            </h1>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <div className="relative">
            <button 
              onClick={() => router.push('/admin/messages')}
              className="p-2 hover:bg-gray-800/50 rounded-lg transition-colors text-gray-300 hover:text-white relative"
            >
              <FaEnvelope className="text-xl" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-[#0295E6] rounded-full" />
            </button>
          </div>

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-2 p-2 hover:bg-gray-800/50 rounded-lg transition-colors text-gray-300 hover:text-white"
            >
              <FaUserCircle className="text-2xl text-[#0295E6]" />
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium">{adminUser.name}</p>
                <p className="text-xs text-gray-400">Administrator</p>
              </div>
            </button>

            <AnimatePresence>
              {isProfileOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 mt-2 w-64 bg-gray-900/95 backdrop-blur-md rounded-xl border border-gray-700/50 shadow-2xl overflow-hidden z-50"
                >
                  <div className="p-4 border-b border-gray-700/50">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-[#0295E6] to-[#02b3e6] rounded-full flex items-center justify-center">
                        <FaUserCircle className="text-2xl text-white" />
                      </div>
                      <div>
                        <p className="font-semibold">{adminUser.name}</p>
                        <p className="text-sm text-gray-400">{adminUser.email}</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-2">
                    <button
                      onClick={() => {
                        setIsProfileOpen(false);
                        router.push('/admin/settings');
                      }}
                      className="flex items-center gap-3 w-full p-3 text-left hover:bg-gray-800/50 rounded-lg transition-colors text-gray-300 hover:text-white"
                    >
                      <FaCog />
                      <span>Settings</span>
                    </button>
                    <button
                      onClick={() => {
                        setIsProfileOpen(false);
                        handleLogout();
                      }}
                      className="flex items-center gap-3 w-full p-3 text-left hover:bg-red-900/30 text-red-400 rounded-lg transition-colors"
                    >
                      <FaSignOutAlt />
                      <span>Logout</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
}