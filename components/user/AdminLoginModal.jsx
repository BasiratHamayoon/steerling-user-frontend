'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaEnvelope, FaLock, FaTimes, FaEye, FaEyeSlash, FaSpinner, FaExclamationCircle } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import Image from 'next/image'; // Import Image
import { useAppContext } from '@/context/AppContext';

export default function AdminLoginModal() {
  const { 
    isAdminLoginOpen, 
    setIsAdminLoginOpen, 
    login, 
  } = useAppContext();
  
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Animation for invalid credentials
  const [isShaking, setIsShaking] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    setError('');
    setIsLoading(true);

    try {
      const result = await login(formData.email, formData.password);

      if (result.success) {
        setFormData({ email: '', password: '' });
        setIsAdminLoginOpen(false);
        setTimeout(() => {
          router.replace('/admin/dashboard');
        }, 100);
      } else {
        setError(result.error || 'Invalid email or password');
        setIsShaking(true);
        setTimeout(() => setIsShaking(false), 500); // Reset shake
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleClose = () => {
    setIsAdminLoginOpen(false);
    setError('');
    setFormData({ email: '', password: '' });
  };

  return (
    <AnimatePresence>
      {isAdminLoginOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          onClick={handleClose}
        >
          {/* Backdrop with Blur */}
          <div className="absolute inset-0 bg-black/70 backdrop-blur-md" />
          
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 30 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-md bg-gray-900/90 border border-gray-700/50 rounded-3xl overflow-hidden shadow-2xl shadow-black/50"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Decorative Glow */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#0295E6] to-transparent shadow-[0_0_20px_#0295E6]" />

            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute right-4 top-4 p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-colors z-10"
              type="button"
            >
              <FaTimes />
            </button>

            {/* Header */}
            <div className="pt-12 pb-8 px-8 text-center bg-gradient-to-b from-gray-800/50 to-transparent relative overflow-hidden">
               {/* Background noise texture optional */}
               <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
               
               {/* Logo Image */}
               <div className="mb-4 relative h-16 w-full max-w-[200px] mx-auto">
                  <Image 
                    src="/logo.png" 
                    alt="SteerFlux Logo" 
                    fill
                    className="object-contain"
                    priority
                  />
               </div>
               
               <div className="flex items-center justify-center gap-2 mt-2">
                 <div className="h-[1px] w-8 bg-gradient-to-r from-transparent to-gray-600"></div>
                 <p className="text-gray-400 text-xs font-semibold uppercase tracking-widest">Admin Access</p>
                 <div className="h-[1px] w-8 bg-gradient-to-l from-transparent to-gray-600"></div>
               </div>
            </div>

            {/* Form */}
            <div className="px-8 pb-10">
              <motion.form 
                onSubmit={handleSubmit} 
                className="space-y-5" 
                noValidate
                animate={isShaking ? { x: [-10, 10, -10, 10, 0] } : {}}
                transition={{ type: "spring", stiffness: 500, damping: 20 }}
              >
                {/* Email Field */}
                <div className="space-y-1.5 group">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1 group-focus-within:text-[#0295E6] transition-colors">Email Address</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <FaEnvelope className="text-gray-500 group-focus-within:text-[#0295E6] transition-colors duration-300" />
                    </div>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      disabled={isLoading}
                      className="block w-full pl-11 pr-4 py-3.5 bg-gray-950 border border-gray-800 rounded-xl text-gray-200 placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-[#0295E6] focus:border-[#0295E6] transition-all duration-300 sm:text-sm"
                      placeholder="admin@steerflux.com"
                      autoComplete="email"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-1.5 group">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1 group-focus-within:text-[#0295E6] transition-colors">Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <FaLock className="text-gray-500 group-focus-within:text-[#0295E6] transition-colors duration-300" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      disabled={isLoading}
                      className="block w-full pl-11 pr-12 py-3.5 bg-gray-950 border border-gray-800 rounded-xl text-gray-200 placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-[#0295E6] focus:border-[#0295E6] transition-all duration-300 sm:text-sm"
                      placeholder="••••••••"
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={isLoading}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-white transition-colors"
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>

                {/* Error Message */}
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="flex items-center gap-2 text-red-400 bg-red-900/10 border border-red-500/20 p-3 rounded-lg text-sm"
                    >
                      <FaExclamationCircle className="flex-shrink-0" />
                      <p>{error}</p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading || !formData.email || !formData.password}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#0295E6] to-[#0077b6] hover:from-[#0284c6] hover:to-[#00669c] text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-blue-900/20 hover:shadow-blue-900/40 transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:shadow-none"
                >
                  {isLoading ? (
                    <>
                      <FaSpinner className="animate-spin text-xl" />
                      <span>Authenticating...</span>
                    </>
                  ) : (
                    'Secure Login'
                  )}
                </button>
              </motion.form>

              {/* Footer */}
              <div className="mt-8 flex items-center justify-center gap-2 text-xs text-gray-600">
                <FaLock className="text-[10px]" />
                <span>End-to-end encrypted connection</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}