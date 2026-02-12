'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaImage, FaBox, FaLink, FaCloudUploadAlt, FaEye, FaExclamationTriangle, FaTrash, FaCheckCircle } from 'react-icons/fa';
import getImageUrl from '@/utils/imageUrl';

export default function CategoryModal({ isOpen, onClose, category, onSave, loading = false }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    imageType: 'file', // 'file' or 'url'
    imageFile: null,
    imageUrl: '',
    isActive: true
  });
  
  const [imagePreview, setImagePreview] = useState('');
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (category) {
      const imageUrl = category.image ? getImageUrl(category.image) : '';
      setFormData({
        name: category.name || '',
        description: category.description || '',
        imageType: category.image ? 'url' : 'file',
        imageFile: null,
        imageUrl: category.image || '',
        isActive: category.isActive !== undefined ? category.isActive : true
      });
      setImagePreview(imageUrl);
      setError('');
    } else {
      resetForm();
    }
  }, [category]);

  const resetForm = () => {
    setFormData({ name: '', description: '', imageType: 'file', imageFile: null, imageUrl: '', isActive: true });
    setImagePreview('');
    setError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) return setError('File size too large. Max 5MB.');
      if (!file.type.startsWith('image/')) return setError('Please upload a valid image file.');
      
      setFormData({ ...formData, imageType: 'file', imageFile: file, imageUrl: '' });
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);
      setError('');
    }
  };

  const handleImageUrlChange = (url) => {
    setFormData({ ...formData, imageType: 'url', imageUrl: url, imageFile: null });
    setImagePreview(url ? getImageUrl(url) : '');
    setError('');
  };

  const handleRemoveImage = () => {
    setFormData({ ...formData, imageType: 'file', imageFile: null, imageUrl: '' });
    setImagePreview('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const validateForm = () => {
    if (!formData.name.trim()) { setError('Category name is required'); return false; }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    await onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm" 
        onClick={onClose} 
      />
      
      {/* Modal Container */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        className="relative w-full max-w-lg bg-gray-900 border border-gray-700 rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden"
      >
        {/* Sticky Header */}
        <div className="flex items-center justify-between px-8 py-5 bg-gray-900/95 backdrop-blur border-b border-gray-800 z-10">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              {category ? 'Edit Category' : 'New Collection'}
            </h2>
            <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">Catalog Management</p>
          </div>
          <button 
            onClick={onClose} 
            disabled={loading}
            className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white transition-colors"
          >
            <FaTimes />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          {error && (
            <div className="mb-6 p-4 bg-red-900/10 border border-red-500/20 rounded-xl flex items-start gap-3">
              <FaExclamationTriangle className="text-red-400 mt-1 flex-shrink-0" />
              <p className="text-red-300 text-sm font-medium">{error}</p>
            </div>
          )}

          <form id="categoryForm" onSubmit={handleSubmit} className="space-y-6">
            
            {/* Name Input */}
            <div className="group">
              <label className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1 group-focus-within:text-[#0295E6] transition-colors">
                <FaBox /> Category Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                disabled={loading}
                className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-[#0295E6] focus:ring-1 focus:ring-[#0295E6] transition-all"
                value={formData.name}
                onChange={(e) => { setFormData({...formData, name: e.target.value}); setError(''); }}
                placeholder="e.g. Alcantara Wheels"
              />
            </div>

            {/* Description */}
            <div className="group">
              <label className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1 group-focus-within:text-[#0295E6] transition-colors">
                Description
              </label>
              <textarea
                disabled={loading}
                rows="3"
                className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-[#0295E6] focus:ring-1 focus:ring-[#0295E6] transition-all resize-none"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Brief description for SEO..."
              />
            </div>

            {/* Image Section */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">
                <FaImage /> Cover Image
              </label>
              
              {/* Toggle */}
              <div className="flex bg-gray-950 p-1 rounded-xl border border-gray-800">
                <button
                  type="button"
                  onClick={() => setFormData({...formData, imageType: 'file'})}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    formData.imageType === 'file' ? 'bg-gray-800 text-white shadow-sm' : 'text-gray-500 hover:text-gray-300'
                  }`}
                >
                  <FaCloudUploadAlt /> Upload
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({...formData, imageType: 'url'})}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    formData.imageType === 'url' ? 'bg-gray-800 text-white shadow-sm' : 'text-gray-500 hover:text-gray-300'
                  }`}
                >
                  <FaLink /> URL
                </button>
              </div>

              {/* Inputs */}
              {formData.imageType === 'file' ? (
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-gray-700 hover:border-[#0295E6] bg-gray-950/30 hover:bg-gray-900 rounded-xl p-6 cursor-pointer transition-all text-center group"
                >
                  <input type="file" ref={fileInputRef} accept="image/*" onChange={handleImageUpload} disabled={loading} className="hidden" />
                  <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                    <FaCloudUploadAlt className="text-2xl text-gray-400 group-hover:text-[#0295E6]" />
                  </div>
                  <p className="text-sm text-gray-300 font-medium">Click to upload file</p>
                  <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 5MB</p>
                </div>
              ) : (
                <div className="relative group">
                   <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                     <FaLink className="text-gray-500 group-focus-within:text-[#0295E6]" />
                   </div>
                   <input
                    type="text"
                    disabled={loading}
                    className="w-full bg-gray-950 border border-gray-800 rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-[#0295E6] transition-all text-sm"
                    value={formData.imageUrl}
                    onChange={(e) => handleImageUrlChange(e.target.value)}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              )}

              {/* Preview */}
              <AnimatePresence>
                {imagePreview && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                    className="relative mt-4 rounded-xl overflow-hidden border border-gray-700 group"
                  >
                    <img src={imagePreview} alt="Preview" className="w-full h-48 object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                       <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium text-sm transition-colors"
                      >
                        <FaTrash /> Remove
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Status */}
            <div className="group">
              <label className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1">
                Visibility Status
              </label>
              <div className="relative">
                <select
                  disabled={loading}
                  className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-white appearance-none focus:outline-none focus:border-[#0295E6] transition-all cursor-pointer"
                  value={formData.isActive}
                  onChange={(e) => setFormData({...formData, isActive: e.target.value === 'true'})}
                >
                  <option value="true">Active (Visible)</option>
                  <option value="false">Inactive (Hidden)</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  {formData.isActive ? <FaCheckCircle className="text-green-500" /> : <FaTimes className="text-red-500" />}
                </div>
              </div>
            </div>

          </form>
        </div>

        {/* Sticky Footer */}
        <div className="px-8 py-5 bg-gray-900/95 backdrop-blur border-t border-gray-800 flex justify-end gap-3 z-10">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-5 py-2.5 rounded-xl border border-gray-700 text-gray-300 hover:bg-gray-800 transition-colors text-sm font-bold"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="categoryForm"
            disabled={loading}
            className="px-6 py-2.5 bg-gradient-to-r from-[#0295E6] to-[#0077b6] hover:from-[#0284c6] hover:to-[#0295E6] text-white rounded-xl text-sm font-bold shadow-lg hover:shadow-blue-500/20 transition-all flex items-center gap-2 disabled:opacity-50"
          >
            {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : (category ? 'Save Changes' : 'Create Category')}
          </button>
        </div>
      </motion.div>
    </div>
  );
}