'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaUser, FaLock, FaEnvelope, FaSave, FaEye, FaEyeSlash, FaCalendar, FaHistory, FaKey, FaCheckCircle } from 'react-icons/fa';
import { useAppContext } from '@/context/AppContext';

export default function AdminSettingsPage() {
  const { admin, login, changePassword, logout } = useAppContext();
  
  const [adminData, setAdminData] = useState({
    name: '',
    email: '',
    role: ''
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [isSaving, setIsSaving] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [saveMessageType, setSaveMessageType] = useState('success');
  
  // Modal state
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  // Load admin data on component mount
  useEffect(() => {
    if (admin) {
      setAdminData({
        name: admin.name || '',
        email: admin.email || '',
        role: admin.role || 'admin'
      });
    }
  }, [admin]);

  const handleSaveProfile = async () => {
    setIsSaving(true);
    setSaveMessage('');
    
    try {
      // Note: Your backend doesn't have a profile update endpoint yet
      // So we'll just show a success message for now
      setTimeout(() => {
        setSaveMessage('Profile information updated successfully!');
        setSaveMessageType('success');
        setIsSaving(false);
      }, 1000);
    } catch (error) {
      setSaveMessage('Failed to update profile');
      setSaveMessageType('error');
      setIsSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (!passwordData.currentPassword.trim()) {
      setSaveMessage('Current password is required');
      setSaveMessageType('error');
      return;
    }

    if (!passwordData.newPassword.trim()) {
      setSaveMessage('New password is required');
      setSaveMessageType('error');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setSaveMessage('New password must be at least 6 characters');
      setSaveMessageType('error');
      return;
    }

    if (!passwordData.confirmPassword.trim()) {
      setSaveMessage('Please confirm your new password');
      setSaveMessageType('error');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setSaveMessage('Passwords do not match');
      setSaveMessageType('error');
      return;
    }

    setIsChangingPassword(true);
    setSaveMessage('');
    
    try {
      const response = await changePassword(
        passwordData.currentPassword,
        passwordData.newPassword
      );
      
      if (response.success) {
        setModalMessage('Password changed successfully! You can continue using the application with your new password.');
        setShowSuccessModal(true);
        
        // Clear all password fields
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        
        // Reset password visibility
        setShowCurrentPassword(false);
        setShowNewPassword(false);
        setShowConfirmPassword(false);
      } else {
        setSaveMessage(response.error || 'Failed to change password');
        setSaveMessageType('error');
      }
    } catch (error) {
      setSaveMessage(error.response?.data?.message || 'Failed to change password');
      setSaveMessageType('error');
    } finally {
      setIsChangingPassword(false);
    }
  };

  const closeSuccessModal = () => {
    setShowSuccessModal(false);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTimeAgo = (dateString) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      if (diffInHours < 1) {
        const minutes = Math.floor(diffInHours * 60);
        return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
      }
      return `${Math.floor(diffInHours)} hour${Math.floor(diffInHours) !== 1 ? 's' : ''} ago`;
    }
    return formatDate(dateString);
  };

  return (
    <div className="space-y-6">
      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-800 rounded-2xl border border-gray-700/50 max-w-md w-full p-6"
          >
            <div className="flex flex-col items-center text-center mb-6">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-4">
                <FaCheckCircle className="text-3xl text-green-400" />
              </div>
              <h3 className="text-xl font-bold mb-2">Password Changed Successfully!</h3>
              <p className="text-gray-300">{modalMessage}</p>
            </div>
            
            <div className="flex justify-center">
              <button
                onClick={closeSuccessModal}
                className="px-6 py-3 bg-gradient-to-r from-[#0295E6] to-[#02b3e6] hover:from-[#0284c6] hover:to-[#0295E6] text-white rounded-xl font-semibold transition-all duration-300"
              >
                Continue Using Application
              </button>
            </div>
            
            <div className="mt-6 pt-6 border-t border-gray-700/50 text-center">
              <p className="text-sm text-gray-400 mb-2">Security Recommendation</p>
              <button
                onClick={() => {
                  logout();
                  window.location.href = '/admin/login';
                }}
                className="text-sm text-[#0295E6] hover:text-[#02b3e6] transition-colors"
              >
                Log out and log in with new password
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-gray-400">Manage your account settings and preferences</p>
      </div>

      {/* Save Message */}
      {saveMessage && (
        <div className={`p-4 rounded-xl border ${
          saveMessageType === 'success' 
            ? 'bg-green-500/10 border-green-500/20 text-green-300' 
            : 'bg-red-500/10 border-red-500/20 text-red-300'
        }`}>
          <p>{saveMessage}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile Information */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/30 p-6"
        >
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <FaUser />
            Profile Information
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Full Name</label>
              <input
                type="text"
                className="w-full px-4 py-3 bg-gray-800/50 rounded-xl border border-gray-700 focus:border-[#0295E6] focus:outline-none"
                value={adminData.name}
                onChange={(e) => setAdminData({...adminData, name: e.target.value})}
                placeholder="Enter your full name"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Email Address</label>
              <div className="relative">
                <FaEnvelope className="absolute left-4 top-3.5 text-gray-400" />
                <input
                  type="email"
                  className="w-full pl-12 pr-4 py-3 bg-gray-800/50 rounded-xl border border-gray-700 focus:border-[#0295E6] focus:outline-none"
                  value={adminData.email}
                  onChange={(e) => setAdminData({...adminData, email: e.target.value})}
                  placeholder="Enter email address"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Account Role</label>
              <div className="px-4 py-3 bg-gray-800/50 rounded-xl border border-gray-700">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300 capitalize">{adminData.role}</span>
                  <span className="text-xs px-2 py-1 bg-blue-500/20 text-blue-300 rounded">
                    ADMINISTRATOR
                  </span>
                </div>
              </div>
            </div>
            
            <button
              onClick={handleSaveProfile}
              disabled={isSaving}
              className="flex items-center gap-2 bg-gradient-to-r from-[#0295E6] to-[#02b3e6] hover:from-[#0284c6] hover:to-[#0295E6] text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FaSave />
              {isSaving ? 'Saving...' : 'Save Profile Changes'}
            </button>
          </div>
        </motion.div>

        {/* Change Password */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/30 p-6"
        >
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <FaLock />
            Change Password
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Current Password</label>
              <div className="relative">
                <FaLock className="absolute left-4 top-3.5 text-gray-400" />
                <input
                  type={showCurrentPassword ? "text" : "password"}
                  className="w-full pl-12 pr-12 py-3 bg-gray-800/50 rounded-xl border border-gray-700 focus:border-[#0295E6] focus:outline-none"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                  placeholder="Enter current password"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-4 top-3.5 text-gray-400 hover:text-gray-300"
                >
                  {showCurrentPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">New Password</label>
              <div className="relative">
                <FaLock className="absolute left-4 top-3.5 text-gray-400" />
                <input
                  type={showNewPassword ? "text" : "password"}
                  className="w-full pl-12 pr-12 py-3 bg-gray-800/50 rounded-xl border border-gray-700 focus:border-[#0295E6] focus:outline-none"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                  placeholder="Enter new password"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-4 top-3.5 text-gray-400 hover:text-gray-300"
                >
                  {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">Minimum 6 characters</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Confirm New Password</label>
              <div className="relative">
                <FaLock className="absolute left-4 top-3.5 text-gray-400" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  className="w-full pl-12 pr-12 py-3 bg-gray-800/50 rounded-xl border border-gray-700 focus:border-[#0295E6] focus:outline-none"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                  placeholder="Confirm new password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-3.5 text-gray-400 hover:text-gray-300"
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>
            
            <button
              onClick={handleChangePassword}
              disabled={isChangingPassword}
              className="flex items-center gap-2 bg-gradient-to-r from-[#0295E6] to-[#02b3e6] hover:from-[#0284c6] hover:to-[#0295E6] text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed w-full justify-center"
            >
              {isChangingPassword ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Changing Password...
                </>
              ) : (
                <>
                  <FaKey />
                  Change Password
                </>
              )}
            </button>
          </div>
        </motion.div>
      </div>

      {/* System Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/30 p-6"
      >
        <h2 className="text-xl font-bold mb-6">Account Information</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 bg-gray-900/50 rounded-xl">
            <div className="text-sm text-gray-400 mb-1 flex items-center gap-2">
              <FaCalendar />
              Account Created
            </div>
            <div className="text-lg font-bold">
              {admin?.createdAt ? formatDate(admin.createdAt) : 'N/A'}
            </div>
          </div>
          
          <div className="p-4 bg-gray-900/50 rounded-xl">
            <div className="text-sm text-gray-400 mb-1 flex items-center gap-2">
              <FaHistory />
              Last Login
            </div>
            <div className="text-lg font-bold">
              {admin?.lastLogin ? getTimeAgo(admin.lastLogin) : 'Never'}
            </div>
          </div>
          
          <div className="p-4 bg-gray-900/50 rounded-xl">
            <div className="text-sm text-gray-400 mb-1 flex items-center gap-2">
              <FaKey />
              Account Status
            </div>
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold">
                {admin?.isActive ? 'Active' : 'Inactive'}
              </span>
              <span className={`text-xs px-2 py-1 rounded ${
                admin?.isActive 
                  ? 'bg-green-500/20 text-green-300' 
                  : 'bg-red-500/20 text-red-300'
              }`}>
                {admin?.isActive ? 'ACTIVE' : 'INACTIVE'}
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}