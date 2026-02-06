'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaUser, FaLock, FaEnvelope, FaSave, FaEye, FaEyeSlash } from 'react-icons/fa';

export default function AdminSettingsPage() {
  const [adminData, setAdminData] = useState({
    username: 'admin',
    email: 'admin@steerflux.com',
    name: 'Administrator'
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

  const handleSaveProfile = () => {
    setIsSaving(true);
    setTimeout(() => {
      alert('Profile information updated successfully!');
      setIsSaving(false);
    }, 1000);
  };

  const handleChangePassword = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('New passwords do not match!');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      alert('New password must be at least 6 characters long!');
      return;
    }

    setIsSaving(true);
    setTimeout(() => {
      alert('Password changed successfully!');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setIsSaving(false);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-gray-400">Manage your account settings and preferences</p>
      </div>

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
              <label className="block text-sm font-medium mb-2">Username</label>
              <input
                type="text"
                className="w-full px-4 py-3 bg-gray-800/50 rounded-xl border border-gray-700 focus:border-[#0295E6] focus:outline-none"
                value={adminData.username}
                onChange={(e) => setAdminData({...adminData, username: e.target.value})}
                disabled
              />
              <p className="text-xs text-gray-500 mt-1">Username cannot be changed</p>
            </div>
            
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
            
            <button
              onClick={handleSaveProfile}
              disabled={isSaving}
              className="flex items-center gap-2 bg-gradient-to-r from-[#0295E6] to-[#02b3e6] hover:from-[#0284c6] hover:to-[#0295E6] text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FaSave />
              {isSaving ? 'Saving...' : 'Save Changes'}
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
              disabled={isSaving}
              className="flex items-center gap-2 bg-gradient-to-r from-[#0295E6] to-[#02b3e6] hover:from-[#0284c6] hover:to-[#0295E6] text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FaSave />
              {isSaving ? 'Updating...' : 'Update Password'}
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
        <h2 className="text-xl font-bold mb-6">System Information</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 bg-gray-900/50 rounded-xl">
            <div className="text-sm text-gray-400 mb-1">SteerFlux Version</div>
            <div className="text-lg font-bold">v1.0.0</div>
          </div>
          
          <div className="p-4 bg-gray-900/50 rounded-xl">
            <div className="text-sm text-gray-400 mb-1">Last Login</div>
            <div className="text-lg font-bold">
              {new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}
            </div>
          </div>
          
          <div className="p-4 bg-gray-900/50 rounded-xl">
            <div className="text-sm text-gray-400 mb-1">Account Created</div>
            <div className="text-lg font-bold">January 1, 2024</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}