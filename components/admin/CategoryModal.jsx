'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { FaTimes, FaImage, FaBox, FaLink, FaUpload, FaEye, FaExclamationTriangle } from 'react-icons/fa';
import getImageUrl from '@/utils/imageUrl';

export default function CategoryModal({ isOpen, onClose, category, onSave, loading = false }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    imageType: 'file',
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
    setFormData({
      name: '',
      description: '',
      imageType: 'file',
      imageFile: null,
      imageUrl: '',
      isActive: true
    });
    setImagePreview('');
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setError('File size too large. Maximum size is 5MB.');
        return;
      }
      
      // Check file type
      if (!file.type.startsWith('image/')) {
        setError('Please upload an image file (JPG, PNG, GIF, etc.)');
        return;
      }
      
      setFormData({
        ...formData,
        imageType: 'file',
        imageFile: file,
        imageUrl: ''
      });
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
      setError('');
    }
  };

  const handleImageUrlChange = (url) => {
    setFormData({
      ...formData,
      imageType: 'url',
      imageUrl: url,
      imageFile: null
    });
    
    if (url) {
      const fullUrl = getImageUrl(url);
      setImagePreview(fullUrl);
    } else {
      setImagePreview('');
    }
    setError('');
  };

  const handleRemoveImage = () => {
    setFormData({
      ...formData,
      imageType: 'file',
      imageFile: null,
      imageUrl: ''
    });
    setImagePreview('');
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('Category name is required');
      return false;
    }

    if (formData.imageType === 'url' && formData.imageUrl && 
        !formData.imageUrl.match(/^https?:\/\/.+\/.+$/) && 
        !formData.imageUrl.startsWith('/uploads/')) {
      setError('Please enter a valid image URL (starting with http://, https://, or /uploads/)');
      return false;
    }

    if (formData.imageType === 'file' && formData.imageFile) {
      if (formData.imageFile.size > 5 * 1024 * 1024) {
        setError('File size too large. Maximum size is 5MB.');
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    await onSave(formData);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-gray-900 rounded-2xl p-6 w-full max-w-md border border-gray-700/50 max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-6 sticky top-0 bg-gray-900 pb-4 border-b border-gray-700/50">
          <h2 className="text-2xl font-bold">
            {category ? 'Edit Category' : 'Add New Category'}
          </h2>
          <button
            onClick={handleClose}
            disabled={loading}
            className="p-2 hover:bg-gray-800/50 rounded-lg transition-colors text-gray-400 hover:text-white disabled:opacity-50"
          >
            <FaTimes />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-900/20 border border-red-800/50 rounded-lg flex items-start gap-3">
            <FaExclamationTriangle className="text-red-400 mt-0.5 flex-shrink-0" />
            <p className="text-red-300 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Category Name */}
          <div>
            <label className="block text-sm font-medium mb-2 flex items-center gap-2">
              <FaBox className="text-[#0295E6]" />
              Category Name *
            </label>
            <input
              type="text"
              required
              disabled={loading}
              className="w-full px-4 py-3 bg-gray-800/50 rounded-xl border border-gray-700 focus:border-[#0295E6] focus:outline-none focus:ring-2 focus:ring-[#0295E6]/30 disabled:opacity-50"
              value={formData.name}
              onChange={(e) => {
                setFormData({...formData, name: e.target.value});
                setError('');
              }}
              placeholder="Enter category name"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Description
            </label>
            <textarea
              disabled={loading}
              className="w-full px-4 py-3 bg-gray-800/50 rounded-xl border border-gray-700 focus:border-[#0295E6] focus:outline-none focus:ring-2 focus:ring-[#0295E6]/30 disabled:opacity-50"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="Enter category description (optional)"
              rows="3"
            />
          </div>

          {/* Image Selection */}
          <div>
            <label className="block text-sm font-medium mb-2 flex items-center gap-2">
              <FaImage className="text-[#0295E6]" />
              Category Image
            </label>
            
            <div className="flex gap-2 mb-4">
              <button
                type="button"
                onClick={() => setFormData({...formData, imageType: 'file'})}
                disabled={loading}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl transition-colors disabled:opacity-50 ${
                  formData.imageType === 'file' 
                    ? 'bg-[#0295E6] text-white' 
                    : 'bg-gray-800/50 text-gray-400 hover:bg-gray-800'
                }`}
              >
                <FaUpload />
                Upload File
              </button>
              <button
                type="button"
                onClick={() => setFormData({...formData, imageType: 'url'})}
                disabled={loading}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl transition-colors disabled:opacity-50 ${
                  formData.imageType === 'url' 
                    ? 'bg-[#0295E6] text-white' 
                    : 'bg-gray-800/50 text-gray-400 hover:bg-gray-800'
                }`}
              >
                <FaLink />
                Image URL
              </button>
            </div>

            {formData.imageType === 'file' ? (
              <div className="mb-4">
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={loading}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={loading}
                  className="w-full px-4 py-6 bg-gray-800/50 rounded-xl border-2 border-dashed border-gray-700 hover:border-[#0295E6] transition-colors hover:bg-gray-800 disabled:opacity-50"
                >
                  <div className="flex flex-col items-center justify-center text-gray-400 hover:text-[#0295E6]">
                    <FaUpload className="text-3xl mb-2" />
                    <span className="font-medium">
                      {formData.imageFile ? formData.imageFile.name : 'Click to upload image'}
                    </span>
                    <span className="text-xs mt-1">PNG, JPG, GIF up to 5MB</span>
                  </div>
                </button>
              </div>
            ) : (
              <div className="mb-4">
                <input
                  type="text"
                  disabled={loading}
                  className="w-full px-4 py-3 bg-gray-800/50 rounded-xl border border-gray-700 focus:border-[#0295E6] focus:outline-none focus:ring-2 focus:ring-[#0295E6]/30 disabled:opacity-50"
                  value={formData.imageUrl}
                  onChange={(e) => handleImageUrlChange(e.target.value)}
                  placeholder="Enter image URL or /uploads/... path"
                />
                <p className="text-xs text-gray-500 mt-2">
                  Enter full URL (https://...) or upload path (/uploads/products/filename.jpg)
                </p>
              </div>
            )}
          </div>

          {/* Image Preview */}
          {imagePreview && (
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                <FaEye className="text-[#0295E6]" />
                Image Preview
              </label>
              <div className="relative">
                <div className="h-40 rounded-lg overflow-hidden border border-gray-700">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/placeholder-category.jpg';
                    }}
                  />
                </div>
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  disabled={loading}
                  className="absolute top-2 right-2 p-2 bg-red-600 hover:bg-red-700 rounded-full text-white disabled:opacity-50"
                >
                  <FaTimes className="w-3 h-3" />
                </button>
              </div>
            </div>
          )}

          {/* Status */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Status
            </label>
            <select
              disabled={loading}
              className="w-full px-4 py-3 bg-gray-800/50 rounded-xl border border-gray-700 focus:border-[#0295E6] focus:outline-none focus:ring-2 focus:ring-[#0295E6]/30 disabled:opacity-50"
              value={formData.isActive}
              onChange={(e) => setFormData({...formData, isActive: e.target.value === 'true'})}
            >
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-4 pt-6 border-t border-gray-700/50 sticky bottom-0 bg-gray-900 pb-2">
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-xl transition-colors font-medium disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-gradient-to-r from-[#0295E6] to-[#02b3e6] hover:from-[#0284c6] hover:to-[#0295E6] rounded-xl transition-colors font-semibold flex items-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  {category ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                category ? 'Update Category' : 'Create Category'
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}