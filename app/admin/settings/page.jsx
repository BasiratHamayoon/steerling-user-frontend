'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaUser, FaLock, FaEnvelope, FaEye, FaEyeSlash, 
  FaCalendarAlt, FaClock, FaShieldAlt, FaCheckCircle, 
  FaExclamationTriangle, FaUserShield, FaFingerprint, FaIdBadge 
} from 'react-icons/fa';
import { useAppContext } from '@/context/AppContext';

export default function AdminSettingsPage() {
  const { admin, changePassword, logout } = useAppContext();
  
  // Profile data is just for display now
  const [adminData, setAdminData] = useState({ name: '', email: '', role: '', id: '' });
  
  // Password state remains interactive
  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [feedback, setFeedback] = useState({ message: '', type: '' });
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    if (admin) {
      setAdminData({
        name: admin.name || 'Administrator',
        email: admin.email || 'admin@example.com',
        role: admin.role || 'Super Admin',
        id: admin.id || admin._id || 'UNKNOWN'
      });
    }
  }, [admin]);

  const handleChangePassword = async () => {
    setFeedback({ message: '', type: '' });
    
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      return setFeedback({ message: 'All password fields are required', type: 'error' });
    }
    if (passwordData.newPassword.length < 6) return setFeedback({ message: 'Password must be 6+ characters', type: 'error' });
    if (passwordData.newPassword !== passwordData.confirmPassword) return setFeedback({ message: 'Passwords do not match', type: 'error' });

    setIsChangingPassword(true);
    try {
      const response = await changePassword(passwordData.currentPassword, passwordData.newPassword);
      if (response.success) {
        setShowSuccessModal(true);
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        setFeedback({ message: response.error || 'Failed to change password', type: 'error' });
      }
    } catch (error) {
      setFeedback({ message: 'An error occurred', type: 'error' });
    } finally {
      setIsChangingPassword(false);
    }
  };

  const formatDate = (date) => new Date(date).toLocaleDateString('en-US', { month: 'short', year: 'numeric', day: 'numeric' });
  const getTimeAgo = (date) => {
    if (!date) return 'Never';
    const diff = (new Date() - new Date(date)) / (1000 * 60 * 60);
    return diff < 24 ? `${Math.floor(diff)}h ago` : formatDate(date);
  };

  return (
    <div className="min-h-screen space-y-8 pb-10">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-gray-800">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tight mb-2">
            Account <span className="text-[#0295E6]">Settings</span>
          </h1>
          <p className="text-gray-400">View profile details and manage security preferences.</p>
        </div>
        
        {/* Feedback Toast */}
        <AnimatePresence>
          {feedback.message && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className={`px-4 py-3 rounded-xl flex items-center gap-3 shadow-lg ${
                feedback.type === 'success' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
              }`}
            >
              {feedback.type === 'success' ? <FaCheckCircle /> : <FaExclamationTriangle />}
              <span className="text-sm font-medium">{feedback.message}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* --- LEFT COLUMN: Profile (Read Only) --- */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-5 space-y-6"
        >
          <div className="bg-gray-900 border border-gray-800 rounded-3xl p-8 relative overflow-hidden h-full flex flex-col">
            {/* Decorative Background */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#0295E6]/5 blur-[80px] rounded-full pointer-events-none" />
            
            <div className="flex items-center gap-2 mb-8">
              <FaIdBadge className="text-[#0295E6] text-xl" />
              <h2 className="text-xl font-bold text-white">Profile Details</h2>
            </div>

            {/* Avatar Section */}
            <div className="flex flex-col items-center text-center mb-8">
              <div className="relative mb-4">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#0295E6] to-[#0077b6] p-0.5 shadow-xl shadow-blue-900/20">
                  <div className="w-full h-full bg-gray-900 rounded-full flex items-center justify-center">
                    <span className="text-3xl font-bold text-white">{adminData.name?.charAt(0) || 'A'}</span>
                  </div>
                </div>
                <div className="absolute bottom-1 right-1 w-6 h-6 bg-green-500 border-4 border-gray-900 rounded-full" title="Online"></div>
              </div>
              <h3 className="text-xl font-bold text-white">{adminData.name}</h3>
              <p className="text-sm text-gray-500 mt-1 flex items-center gap-1.5">
                <FaUserShield className="text-[#0295E6]" /> {adminData.role}
              </p>
            </div>

            {/* Read-Only Info Cards */}
            <div className="space-y-4 mt-auto">
              <div className="bg-gray-950/50 border border-gray-800 rounded-xl p-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-gray-900 flex items-center justify-center text-gray-500">
                  <FaUser />
                </div>
                <div className="overflow-hidden">
                  <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Full Name</p>
                  <p className="text-white font-medium truncate">{adminData.name}</p>
                </div>
              </div>

              <div className="bg-gray-950/50 border border-gray-800 rounded-xl p-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-gray-900 flex items-center justify-center text-gray-500">
                  <FaEnvelope />
                </div>
                <div className="overflow-hidden">
                  <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Email Address</p>
                  <p className="text-white font-medium truncate">{adminData.email}</p>
                </div>
              </div>

              <div className="bg-gray-950/50 border border-gray-800 rounded-xl p-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-gray-900 flex items-center justify-center text-gray-500">
                  <FaFingerprint />
                </div>
                <div className="overflow-hidden">
                  <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Admin ID</p>
                  <p className="text-gray-400 font-mono text-xs truncate">#{adminData.id}</p>
                </div>
              </div>
            </div>
            
            <p className="text-xs text-center text-gray-600 mt-6 flex items-center justify-center gap-1">
              <FaLock size={10} /> Profile details are managed by the system.
            </p>
          </div>
        </motion.div>

        {/* --- RIGHT COLUMN: Security (Editable) --- */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="lg:col-span-7 space-y-6"
        >
          <div className="bg-gray-900 border border-gray-800 rounded-3xl p-8 relative overflow-hidden h-full">
            <div className="absolute top-0 left-0 w-64 h-64 bg-purple-500/5 blur-[80px] rounded-full pointer-events-none" />

            <div className="flex items-center gap-2 mb-8">
              <FaLock className="text-purple-500 text-xl" />
              <h2 className="text-xl font-bold text-white">Security Settings</h2>
            </div>

            <div className="space-y-6">
              <div className="bg-gray-950/30 p-4 rounded-xl border border-gray-800 mb-6">
                <p className="text-sm text-gray-400 leading-relaxed">
                  Ensure your account stays secure by using a strong password. We recommend combining uppercase letters, numbers, and symbols.
                </p>
              </div>

              <div className="group">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Current Password</label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all pr-12"
                    placeholder="Enter current password"
                  />
                  <button onClick={() => setShowCurrentPassword(!showCurrentPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors">
                    {showCurrentPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="group">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">New Password</label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                      className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all pr-12"
                      placeholder="Min 6 chars"
                    />
                    <button onClick={() => setShowNewPassword(!showNewPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors">
                      {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>

                <div className="group">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Confirm Password</label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                      className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all pr-12"
                      placeholder="Repeat new password"
                    />
                    <button onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors">
                      {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <button
                  onClick={handleChangePassword}
                  disabled={isChangingPassword}
                  className="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-gray-800 to-gray-700 hover:from-purple-900/40 hover:to-purple-800/40 text-white px-6 py-4 rounded-xl font-bold border border-gray-700 hover:border-purple-500/50 shadow-lg transition-all hover:scale-[1.01] disabled:opacity-50 disabled:scale-100"
                >
                  {isChangingPassword ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <FaShieldAlt className="text-purple-400" /> Update Password
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* --- Footer Stats --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Member Since', value: admin?.createdAt ? formatDate(admin.createdAt) : 'N/A', icon: <FaCalendarAlt />, color: 'text-blue-400' },
          { label: 'Last Login', value: admin?.lastLogin ? getTimeAgo(admin.lastLogin) : 'First Session', icon: <FaClock />, color: 'text-amber-400' },
          { label: 'Security Level', value: 'Administrator', icon: <FaUserShield />, color: 'text-green-400' }
        ].map((stat, i) => (
          <motion.div 
            key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + (i * 0.1) }}
            className="bg-gray-900 border border-gray-800 rounded-2xl p-5 flex items-center justify-between group hover:border-gray-700 transition-colors"
          >
            <div>
              <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">{stat.label}</p>
              <p className="text-lg font-bold text-white">{stat.value}</p>
            </div>
            <div className={`text-2xl opacity-50 group-hover:opacity-100 transition-opacity ${stat.color}`}>{stat.icon}</div>
          </motion.div>
        ))}
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            className="bg-gray-900 border border-gray-800 rounded-3xl p-8 max-w-sm w-full text-center relative overflow-hidden shadow-2xl"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 to-emerald-600" />
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4 text-green-500">
              <FaCheckCircle className="text-3xl" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Password Updated!</h3>
            <p className="text-gray-400 text-sm mb-6">Your password has been changed securely. Please login again to confirm.</p>
            
            <button 
              onClick={() => { logout(); window.location.href = '/admin/login'; }}
              className="w-full bg-gradient-to-r from-[#0295E6] to-[#0077b6] text-white font-bold py-3 rounded-xl hover:shadow-lg transition-all"
            >
              Logout & Re-login
            </button>
            <button 
              onClick={() => setShowSuccessModal(false)}
              className="mt-3 text-sm text-gray-500 hover:text-white transition-colors"
            >
              Close & Stay Logged In
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
}