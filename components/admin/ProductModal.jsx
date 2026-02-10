'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { FaTimes, FaImage, FaBox, FaDollarSign, FaTag, FaList, FaCheck, FaWarehouse, FaCog } from 'react-icons/fa';
import { useAppContext } from '@/context/AppContext';
import getImageUrl from '@/utils/imageUrl';

export default function ProductModal({ isOpen, onClose, product, onSave }) {
  const { categories, categoriesLoading } = useAppContext();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    model: '',
    quantity: 0,
    price: 0,
    category: '',
    brand: '',
    material: '',
    diameter: '',
    compatibility: '',
    specifications: {}
  });
  
  const [specInput, setSpecInput] = useState({ key: '', value: '' });
  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (product) {
      setFormData({
        title: product.title || '',
        description: product.description || '',
        model: product.model || '',
        quantity: product.quantity || 0,
        price: product.price || 0,
        category: product.category?._id || product.category || '',
        brand: product.brand || '',
        material: product.material || '',
        diameter: product.diameter || '',
        compatibility: product.compatibility || '',
        specifications: product.specifications || {}
      });
      
      if (product.images) {
        setExistingImages(product.images);
        // Use getImageUrl for existing image previews
        const fullImageUrls = product.images.map(img => getImageUrl(img));
        setImagePreviews(fullImageUrls);
      }
    } else {
      resetForm();
    }
  }, [product]);

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      model: '',
      quantity: 0,
      price: 0,
      category: '',
      brand: '',
      material: '',
      diameter: '',
      compatibility: '',
      specifications: {}
    });
    setSpecInput({ key: '', value: '' });
    setExistingImages([]);
    setNewImages([]);
    setImagePreviews([]);
  };

  const handleAddSpec = () => {
    if (specInput.key.trim() && specInput.value.trim()) {
      setFormData({
        ...formData,
        specifications: {
          ...formData.specifications,
          [specInput.key.trim()]: specInput.value.trim()
        }
      });
      setSpecInput({ key: '', value: '' });
    }
  };

  const handleRemoveSpec = (key) => {
    const newSpecs = { ...formData.specifications };
    delete newSpecs[key];
    setFormData({ ...formData, specifications: newSpecs });
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    
    if (newImages.length + files.length > 10) {
      alert('Maximum 10 images allowed');
      return;
    }
    
    const newImageFiles = [...newImages, ...files];
    setNewImages(newImageFiles);
    
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setImagePreviews([...imagePreviews, ...newPreviews]);
  };

  const handleRemoveImage = (index) => {
    if (index < existingImages.length) {
      // Remove existing image
      setExistingImages(prev => prev.filter((_, i) => i !== index));
      setImagePreviews(prev => prev.filter((_, i) => i !== index));
    } else {
      // Remove new image (blob URL)
      const adjustedIndex = index - existingImages.length;
      URL.revokeObjectURL(imagePreviews[index]);
      setNewImages(prev => prev.filter((_, i) => i !== adjustedIndex));
      setImagePreviews(prev => prev.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || !formData.model || 
        !formData.category || formData.quantity < 0 || formData.price <= 0) {
      alert('Please fill in all required fields correctly');
      return;
    }

    const productData = {
      ...formData,
      quantity: parseInt(formData.quantity),
      price: parseFloat(formData.price),
      newImages: newImages,
      existingImages: existingImages
    };
    
    onSave(productData);
    onClose();
    resetForm();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-gray-900 rounded-2xl p-6 w-full max-w-4xl max-h-[85vh] overflow-y-auto border border-gray-700/50"
      >
        <div className="flex items-center justify-between mb-6 sticky top-0 bg-gray-900 pb-4 border-b border-gray-700/50">
          <h2 className="text-2xl font-bold">
            {product ? 'Edit Product' : 'Add New Product'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-800/50 rounded-lg transition-colors text-gray-400 hover:text-white"
            aria-label="Close modal"
          >
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-4 text-[#0295E6] flex items-center gap-2">
              <FaBox className="text-[#0295E6]" />
              Basic Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Product Title *
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-3 bg-gray-800/50 rounded-xl border border-gray-700 focus:border-[#0295E6] focus:outline-none focus:ring-2 focus:ring-[#0295E6]/30"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="Enter product title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Model Number *
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-3 bg-gray-800/50 rounded-xl border border-gray-700 focus:border-[#0295E6] focus:outline-none focus:ring-2 focus:ring-[#0295E6]/30"
                  value={formData.model}
                  onChange={(e) => setFormData({...formData, model: e.target.value})}
                  placeholder="Enter model number"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                  <FaDollarSign className="text-[#0295E6]" />
                  Price ($) *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-3 bg-gray-800/50 rounded-xl border border-gray-700 focus:border-[#0295E6] focus:outline-none focus:ring-2 focus:ring-[#0295E6]/30"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                  placeholder="Enter price"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                  <FaTag className="text-[#0295E6]" />
                  Category *
                </label>
                <select
                  required
                  className="w-full px-4 py-3 bg-gray-800/50 rounded-xl border border-gray-700 focus:border-[#0295E6] focus:outline-none focus:ring-2 focus:ring-[#0295E6]/30"
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                >
                  <option value="">Select category</option>
                  {categories.map(cat => (
                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 text-[#0295E6] flex items-center gap-2">
              <FaWarehouse className="text-[#0295E6]" />
              Inventory Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Quantity *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  className="w-full px-4 py-3 bg-gray-800/50 rounded-xl border border-gray-700 focus:border-[#0295E6] focus:outline-none focus:ring-2 focus:ring-[#0295E6]/30"
                  value={formData.quantity}
                  onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                  placeholder="Enter quantity"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Brand
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 bg-gray-800/50 rounded-xl border border-gray-700 focus:border-[#0295E6] focus:outline-none focus:ring-2 focus:ring-[#0295E6]/30"
                  value={formData.brand}
                  onChange={(e) => setFormData({...formData, brand: e.target.value})}
                  placeholder="Enter brand"
                />
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 text-[#0295E6]">Description</h3>
            <div>
              <label className="block text-sm font-medium mb-2">
                Product Description *
              </label>
              <textarea
                required
                rows="4"
                className="w-full px-4 py-3 bg-gray-800/50 rounded-xl border border-gray-700 focus:border-[#0295E6] focus:outline-none focus:ring-2 focus:ring-[#0295E6]/30"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Enter detailed product description"
              />
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 text-[#0295E6] flex items-center gap-2">
              <FaCog className="text-[#0295E6]" />
              Specifications
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Material
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 bg-gray-800/50 rounded-xl border border-gray-700 focus:border-[#0295E6] focus:outline-none focus:ring-2 focus:ring-[#0295E6]/30"
                  value={formData.material}
                  onChange={(e) => setFormData({...formData, material: e.target.value})}
                  placeholder="Enter material"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Diameter
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 bg-gray-800/50 rounded-xl border border-gray-700 focus:border-[#0295E6] focus:outline-none focus:ring-2 focus:ring-[#0295E6]/30"
                  value={formData.diameter}
                  onChange={(e) => setFormData({...formData, diameter: e.target.value})}
                  placeholder="Enter diameter"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">
                  Compatibility
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 bg-gray-800/50 rounded-xl border border-gray-700 focus:border-[#0295E6] focus:outline-none focus:ring-2 focus:ring-[#0295E6]/30"
                  value={formData.compatibility}
                  onChange={(e) => setFormData({...formData, compatibility: e.target.value})}
                  placeholder="Enter compatibility details"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Additional Specifications
              </label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  className="flex-1 px-4 py-3 bg-gray-800/50 rounded-xl border border-gray-700 focus:border-[#0295E6] focus:outline-none focus:ring-2 focus:ring-[#0295E6]/30"
                  value={specInput.key}
                  onChange={(e) => setSpecInput({...specInput, key: e.target.value})}
                  placeholder="Specification key"
                />
                <input
                  type="text"
                  className="flex-1 px-4 py-3 bg-gray-800/50 rounded-xl border border-gray-700 focus:border-[#0295E6] focus:outline-none focus:ring-2 focus:ring-[#0295E6]/30"
                  value={specInput.value}
                  onChange={(e) => setSpecInput({...specInput, value: e.target.value})}
                  placeholder="Specification value"
                />
                <button
                  type="button"
                  onClick={handleAddSpec}
                  className="px-4 py-3 bg-[#0295E6] hover:bg-[#0284c6] rounded-xl transition-colors whitespace-nowrap"
                >
                  Add
                </button>
              </div>
              
              {Object.keys(formData.specifications).length > 0 && (
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Current Specifications:</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {Object.entries(formData.specifications).map(([key, value], index) => (
                      <div
                        key={key}
                        className="flex items-center justify-between px-3 py-2 bg-gray-800/50 rounded-lg border border-gray-700"
                      >
                        <div>
                          <span className="font-medium text-[#0295E6]">{key}:</span>
                          <span className="ml-2">{value}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveSpec(key)}
                          className="text-red-400 hover:text-red-300 ml-2"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 text-[#0295E6] flex items-center gap-2">
              <FaImage className="text-[#0295E6]" />
              Product Images
            </h3>
            <div>
              <label className="block text-sm font-medium mb-2">
                Upload Product Images (Max 10 images)
              </label>
              <div className="mb-4">
                <input
                  type="file"
                  ref={fileInputRef}
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current.click()}
                  className="w-full px-4 py-6 bg-gray-800/50 rounded-xl border-2 border-dashed border-gray-700 hover:border-[#0295E6] transition-colors hover:bg-gray-800"
                >
                  <div className="flex flex-col items-center justify-center text-gray-400 hover:text-[#0295E6]">
                    <FaImage className="text-3xl mb-2" />
                    <span className="font-medium">Click to upload images</span>
                    <span className="text-xs mt-1">PNG, JPG, GIF up to 5MB each</span>
                  </div>
                </button>
              </div>
              
              {imagePreviews.length > 0 && (
                <div>
                  <label className="block text-sm font-medium mb-2">Image Previews:</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {imagePreviews.map((preview, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg border border-gray-700"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/placeholder-product.jpg';
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(index)}
                          className="absolute top-1 right-1 p-1 bg-red-600 hover:bg-red-700 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <FaTimes className="w-3 h-3" />
                        </button>
                        <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs p-1 text-center">
                          {index === 0 ? 'Main Image' : `Image ${index + 1}`}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-6 border-t border-gray-700/50 sticky bottom-0 bg-gray-900 pb-2">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-xl transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-gradient-to-r from-[#0295E6] to-[#02b3e6] hover:from-[#0284c6] hover:to-[#0295E6] rounded-xl transition-colors font-semibold shadow-lg hover:shadow-[#0295E6]/20"
            >
              {product ? 'Update Product' : 'Create Product'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}