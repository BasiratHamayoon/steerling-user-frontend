'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaEnvelope, FaLock, FaTimes, FaEye, FaEyeSlash, FaCogs, FaSpinner } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { useAppContext } from '@/context/AppContext';

export default function AdminLoginModal() {
  const { 
    isAdminLoginOpen, 
    setIsAdminLoginOpen, 
    login, 
    authLoading,
    isAuthenticated 
  } = useAppContext();
  
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation(); // Add this to stop event bubbling
    
    setError('');
    setIsLoading(true);

    try {
      const result = await login(formData.email, formData.password);

      if (result.success) {
        // Clear form data
        setFormData({ email: '', password: '' });
        
        // Close modal first
        setIsAdminLoginOpen(false);
        
        // Use setTimeout to ensure modal closes before navigation
        setTimeout(() => {
          router.replace('/admin/dashboard'); // Use replace instead of push
        }, 100);
      } else {
        setError(result.error || 'Invalid email or password');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    
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
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={handleClose}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25 }}
            className="relative glass-effect rounded-2xl p-6 w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute right-4 top-4 p-2 hover:bg-gray-800/50 rounded-full transition-colors"
              type="button"
            >
              <FaTimes />
            </button>

            {/* Header */}
            <div className="text-center mb-6">
              <div className="w-16 h-16 mx-auto mb-4 bg-[#0295E6] rounded-full flex items-center justify-center">
                <FaCogs className="text-2xl text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Admin Login</h3>
              <p className="text-gray-400">Access the admin dashboard</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              {/* Email Field */}
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <div className="relative">
                  <FaEnvelope className="absolute left-4 top-3.5 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                    className="w-full pl-12 pr-4 py-3 bg-gray-800/50 rounded-xl border border-gray-700 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    placeholder="admin@example.com"
                    autoComplete="email"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-sm font-medium mb-2">Password</label>
                <div className="relative">
                  <FaLock className="absolute left-4 top-3.5 text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                    className="w-full pl-12 pr-12 py-3 bg-gray-800/50 rounded-xl border border-gray-700 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    placeholder="Enter your password"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                    className="absolute right-4 top-3.5 text-gray-400 hover:text-gray-300 disabled:opacity-50"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              {/* Error Message */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="p-3 bg-red-900/30 border border-red-700/50 rounded-lg"
                  >
                    <p className="text-red-300 text-sm text-center">{error}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading || !formData.email || !formData.password}
                className="w-full flex items-center justify-center gap-2 bg-[#0295E6] to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {isLoading ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    Logging in...
                  </>
                ) : (
                  'Login'
                )}
              </button>
            </form>

            {/* Footer */}
            <div className="mt-6 pt-4 border-t border-gray-700/50">
              <p className="text-center text-sm text-gray-500">
                Authorized personnel only
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}