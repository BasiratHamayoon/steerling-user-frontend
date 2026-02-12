'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBars, FaUserCircle, FaSignOutAlt, FaCog, FaEnvelope } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

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
    <header className="fixed top-0 right-0 left-0 h-20 bg-gray-900/95 backdrop-blur-md border-b border-gray-700/50 z-50 transition-all duration-300">
      <div className="h-full px-6 flex items-center justify-between">
        
        {/* --- Left Section --- */}
        <div className="flex items-center gap-6">
          {/* Mobile Menu Toggle */}
          {isMobile && (
            <button
              onClick={onSidebarToggle}
              className="p-3 hover:bg-gray-800/50 rounded-xl transition-colors text-gray-300 hover:text-white"
            >
              <FaBars className="text-xl" />
            </button>
          )}
          
          {/* Large Logo */}
          <div className="flex items-center select-none cursor-pointer" onClick={() => router.push('/admin/dashboard')}>
            <div className="relative h-12 w-48"> 
              <Image
                src="/logo.png"
                alt="SteerFlux"
                fill
                className="object-contain object-left"
                priority
              />
            </div>
          </div>
        </div>

        {/* --- Right Section --- */}
        <div className="flex items-center gap-6">
          {/* Inbox Shortcut */}
          <button 
            onClick={() => router.push('/admin/messages')}
            className="p-3 hover:bg-gray-800/50 rounded-xl transition-colors text-gray-400 hover:text-white relative group"
            title="Messages"
          >
            <FaEnvelope className="text-xl group-hover:scale-110 transition-transform" />
            <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-[#0295E6] rounded-full border-2 border-gray-900 animate-pulse" />
          </button>

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-3 p-2 pr-4 hover:bg-gray-800/50 rounded-xl transition-colors group"
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0295E6] to-[#0077b6] p-0.5 shadow-lg group-hover:shadow-[#0295E6]/20 transition-all">
                 <div className="w-full h-full rounded-full bg-gray-900 flex items-center justify-center">
                    <span className="text-sm font-bold text-white">{adminUser.name?.charAt(0) || 'A'}</span>
                 </div>
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-bold text-white group-hover:text-[#0295E6] transition-colors">{adminUser.name}</p>
                <p className="text-[10px] uppercase font-bold tracking-wider text-gray-500">Super Admin</p>
              </div>
            </button>

            <AnimatePresence>
              {isProfileOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-3 w-72 bg-gray-900/95 backdrop-blur-xl rounded-2xl border border-gray-700 shadow-2xl overflow-hidden z-50 origin-top-right"
                >
                  {/* Dropdown Header */}
                  <div className="p-5 border-b border-gray-800 bg-gray-900/50">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-[#0295E6] to-[#02b3e6] rounded-full flex items-center justify-center shadow-lg text-white font-bold text-xl">
                        {adminUser.name?.charAt(0) || 'A'}
                      </div>
                      <div className="overflow-hidden">
                        <p className="font-bold text-white truncate">{adminUser.name}</p>
                        <p className="text-xs text-gray-400 truncate">{adminUser.email}</p>
                      </div>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="p-2 space-y-1">
                    <button
                      onClick={() => {
                        setIsProfileOpen(false);
                        router.push('/admin/settings');
                      }}
                      className="flex items-center gap-3 w-full p-3.5 text-left hover:bg-gray-800 rounded-xl transition-all text-gray-300 hover:text-white group"
                    >
                      <FaCog className="text-gray-500 group-hover:text-[#0295E6] transition-colors" />
                      <span className="font-medium">Account Settings</span>
                    </button>
                    
                    <div className="my-1 border-t border-gray-800/50"></div>

                    <button
                      onClick={() => {
                        setIsProfileOpen(false);
                        handleLogout();
                      }}
                      className="flex items-center gap-3 w-full p-3.5 text-left hover:bg-red-900/20 text-red-400 hover:text-red-300 rounded-xl transition-all group"
                    >
                      <FaSignOutAlt className="group-hover:scale-110 transition-transform" />
                      <span className="font-bold text-sm">Sign Out</span>
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