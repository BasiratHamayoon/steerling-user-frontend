'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { FaTimes, FaImage, FaBox, FaDollarSign, FaTag, FaList, FaCheck, FaTrash, FaWarehouse } from 'react-icons/fa';

const categories = ['Sports Car', 'SUV/Truck', 'Luxury', 'Racing', 'Classic', 'Universal', 'Gaming', 'Custom'];

export default function ProductModal({ isOpen, onClose, product, onSave }) {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: '',
    description: '',
    inStock: 'true',
    stockCount: '',
    model: '',
    features: []
  });
  
  const [featureInput, setFeatureInput] = useState('');
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        price: product.price?.toString() || '',
        category: product.category || '',
        description: product.description || '',
        inStock: product.inStock?.toString() || 'true',
        stockCount: product.stockCount?.toString() || '',
        model: product.model || '',
        features: product.features || []
      });
      
      if (product.images) {
        setImagePreviews(product.images);
      }
    } else {
      resetForm();
    }
  }, [product]);

  const resetForm = () => {
    setFormData({
      name: '',
      price: '',
      category: '',
      description: '',
      inStock: 'true',
      stockCount: '',
      model: '',
      features: []
    });
    setFeatureInput('');
    setImageFiles([]);
    setImagePreviews([]);
  };

  const handleAddFeature = () => {
    if (featureInput.trim() && !formData.features.includes(featureInput.trim())) {
      setFormData({
        ...formData,
        features: [...formData.features, featureInput.trim()]
      });
      setFeatureInput('');
    }
  };

  const handleRemoveFeature = (index) => {
    const newFeatures = [...formData.features];
    newFeatures.splice(index, 1);
    setFormData({ ...formData, features: newFeatures });
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    
    // Check if adding these files would exceed 5 total
    if (imageFiles.length + files.length > 5) {
      alert('Maximum 5 images allowed');
      return;
    }
    
    const newImageFiles = [...imageFiles, ...files];
    setImageFiles(newImageFiles);
    
    // Create previews for new files
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setImagePreviews([...imagePreviews, ...newPreviews]);
  };

  const handleRemoveImage = (index) => {
    const newFiles = [...imageFiles];
    const newPreviews = [...imagePreviews];
    
    // Revoke object URL if it's a newly uploaded file
    if (index >= imagePreviews.length - imageFiles.length) {
      URL.revokeObjectURL(newPreviews[index]);
    }
    
    newPreviews.splice(index, 1);
    
    // Only remove from imageFiles if it was a file (not a URL)
    if (index < newFiles.length) {
      newFiles.splice(index, 1);
      setImageFiles(newFiles);
    }
    
    setImagePreviews(newPreviews);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.name || !formData.price || !formData.category || !formData.description || 
        !formData.stockCount || !formData.model) {
      alert('Please fill in all required fields');
      return;
    }

    // Convert price and stockCount to numbers
    const price = parseFloat(formData.price);
    const stockCount = parseInt(formData.stockCount);
    
    if (isNaN(price) || price <= 0) {
      alert('Please enter a valid price');
      return;
    }
    
    if (isNaN(stockCount) || stockCount < 0) {
      alert('Please enter a valid stock count');
      return;
    }

    // Create product data object matching your structure
    const productData = {
      name: formData.name,
      price: price,
      category: formData.category,
      description: formData.description,
      inStock: formData.inStock === 'true',
      stockCount: stockCount,
      model: formData.model,
      features: formData.features,
      images: imagePreviews.length > 0 ? imagePreviews : [
        'https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=800&q=80'
      ]
    };
    
    // Add id if editing existing product
    if (product && product.id) {
      productData.id = product.id;
    }
    
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
          {/* Basic Information */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-[#0295E6] flex items-center gap-2">
              <FaBox className="text-[#0295E6]" />
              Basic Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Product Name */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-3 bg-gray-800/50 rounded-xl border border-gray-700 focus:border-[#0295E6] focus:outline-none focus:ring-2 focus:ring-[#0295E6]/30"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Enter product name"
                />
              </div>

              {/* Model Number */}
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
                  placeholder="Enter model number (e.g., PR-GT2023)"
                />
              </div>

              {/* Price */}
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

              {/* Category */}
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
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Inventory Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-[#0295E6] flex items-center gap-2">
              <FaWarehouse className="text-[#0295E6]" />
              Inventory Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Stock Count */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Stock Count *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  className="w-full px-4 py-3 bg-gray-800/50 rounded-xl border border-gray-700 focus:border-[#0295E6] focus:outline-none focus:ring-2 focus:ring-[#0295E6]/30"
                  value={formData.stockCount}
                  onChange={(e) => setFormData({...formData, stockCount: e.target.value})}
                  placeholder="Enter available stock"
                />
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Stock Status *
                </label>
                <select
                  required
                  className="w-full px-4 py-3 bg-gray-800/50 rounded-xl border border-gray-700 focus:border-[#0295E6] focus:outline-none focus:ring-2 focus:ring-[#0295E6]/30"
                  value={formData.inStock}
                  onChange={(e) => setFormData({...formData, inStock: e.target.value})}
                >
                  <option value="true">In Stock</option>
                  <option value="false">Out of Stock</option>
                </select>
              </div>
            </div>
          </div>

          {/* Description */}
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

          {/* Features */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-[#0295E6] flex items-center gap-2">
              <FaList className="text-[#0295E6]" />
              Product Features
            </h3>
            <div>
              <label className="block text-sm font-medium mb-2">
                Add Features (e.g., Carbon Fiber, LED Display, Quick Release)
              </label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  className="flex-1 px-4 py-3 bg-gray-800/50 rounded-xl border border-gray-700 focus:border-[#0295E6] focus:outline-none focus:ring-2 focus:ring-[#0295E6]/30"
                  value={featureInput}
                  onChange={(e) => setFeatureInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddFeature())}
                  placeholder="Enter a feature and press Enter"
                />
                <button
                  type="button"
                  onClick={handleAddFeature}
                  className="px-4 py-3 bg-[#0295E6] hover:bg-[#0284c6] rounded-xl transition-colors whitespace-nowrap"
                >
                  Add Feature
                </button>
              </div>
              
              {/* Features List */}
              {formData.features.length > 0 && (
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Current Features:</label>
                  <div className="flex flex-wrap gap-2">
                    {formData.features.map((feature, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 px-3 py-2 bg-gray-800/50 rounded-lg border border-gray-700"
                      >
                        <FaCheck className="text-[#0295E6] text-xs" />
                        <span className="text-sm">{feature}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveFeature(index)}
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

          {/* Image Upload */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-[#0295E6] flex items-center gap-2">
              <FaImage className="text-[#0295E6]" />
              Product Images
            </h3>
            <div>
              <label className="block text-sm font-medium mb-2">
                Upload Product Images (Max 5 images) *
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
                    <span className="text-xs text-gray-500 mt-1">First image will be used as main display</span>
                  </div>
                </button>
              </div>
              
              {/* Image Previews */}
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
              
              {/* Default Images Info */}
              {imagePreviews.length === 0 && (
                <div className="mt-2">
                  <p className="text-xs text-gray-500">
                    If no images are uploaded, default product images will be used.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Form Actions */}
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