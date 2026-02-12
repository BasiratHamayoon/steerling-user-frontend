'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { FaTimes, FaImage, FaBox, FaDollarSign, FaWarehouse, FaCog, FaCloudUploadAlt, FaTrash } from 'react-icons/fa';
import { useAppContext } from '@/context/AppContext';
import getImageUrl from '@/utils/imageUrl';

// ✅ Must match backend limit (5MB)
const MAX_FILE_SIZE = 5 * 1024 * 1024;

const InputGroup = ({ label, icon, required, ...props }) => (
  <div className="group">
    <label className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1 group-focus-within:text-[#0295E6] transition-colors">
      {icon} {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-gray-200 focus:outline-none focus:border-[#0295E6] focus:ring-1 focus:ring-[#0295E6] transition-all placeholder-gray-700"
      {...props}
    />
  </div>
);

export default function ProductModal({ isOpen, onClose, product, onSave }) {
  const { categories } = useAppContext();
  const fileInputRef = useRef(null);
  
  const [formData, setFormData] = useState({
    title: '', description: '', model: '', quantity: 0, price: 0,
    category: '', brand: '', material: '', diameter: '', compatibility: '', specifications: {}
  });
  
  const [specInput, setSpecInput] = useState({ key: '', value: '' });
  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  // Cleanup blob URLs on unmount
  useEffect(() => {
    return () => {
      imagePreviews.forEach(preview => {
        if (preview.startsWith('blob:')) URL.revokeObjectURL(preview);
      });
    };
  }, [imagePreviews]);

  useEffect(() => {
    if (product) {
      setFormData({
        title: product.title || '', description: product.description || '', model: product.model || '',
        quantity: product.quantity || 0, price: product.price || 0,
        category: product.category?._id || product.category || '',
        brand: product.brand || '', material: product.material || '', diameter: product.diameter || '',
        compatibility: product.compatibility || '', specifications: product.specifications || {}
      });
      if (product.images) {
        setExistingImages(product.images);
        setImagePreviews(product.images.map(img => getImageUrl(img)));
      }
    } else {
      resetForm();
    }
  }, [product]);

  const resetForm = () => {
    imagePreviews.forEach(preview => {
      if (preview.startsWith('blob:')) URL.revokeObjectURL(preview);
    });
    setFormData({ title: '', description: '', model: '', quantity: 0, price: 0, category: '', brand: '', material: '', diameter: '', compatibility: '', specifications: {} });
    setSpecInput({ key: '', value: '' });
    setExistingImages([]);
    setNewImages([]);
    setImagePreviews([]);
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    
    // File size validation
    const oversized = files.find(file => file.size > MAX_FILE_SIZE);
    if (oversized) {
      alert(`Image "${oversized.name}" exceeds the ${MAX_FILE_SIZE / 1024 / 1024}MB limit.`);
      e.target.value = '';
      return;
    }

    // Max 10 images total
    if (newImages.length + files.length > 10) {
      alert('Maximum 10 images allowed');
      e.target.value = '';
      return;
    }

    setNewImages([...newImages, ...files]);
    setImagePreviews([
      ...imagePreviews,
      ...files.map(file => URL.createObjectURL(file))
    ]);
    
    e.target.value = ''; // allow re-upload of same file
  };

  const handleRemoveImage = (index) => {
    if (imagePreviews[index]?.startsWith('blob:')) {
      URL.revokeObjectURL(imagePreviews[index]);
    }

    if (index < existingImages.length) {
      setExistingImages(prev => prev.filter((_, i) => i !== index));
      setImagePreviews(prev => prev.filter((_, i) => i !== index));
    } else {
      const adjustedIndex = index - existingImages.length;
      setNewImages(prev => prev.filter((_, i) => i !== adjustedIndex));
      setImagePreviews(prev => prev.filter((_, i) => i !== index));
    }
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.category) {
      alert('Please fill required fields (Title, Category)');
      return;
    }
    
    onSave({
      ...formData,
      quantity: parseInt(formData.quantity) || 0,
      price: parseFloat(formData.price) || 0,
      newImages,
      existingImages
    });
    onClose();
    resetForm();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="relative w-full max-w-5xl h-[90vh] bg-gray-900 border border-gray-700 rounded-3xl shadow-2xl flex flex-col overflow-hidden"
      >
        {/* Sticky Header */}
        <div className="flex items-center justify-between px-8 py-5 bg-gray-900/95 backdrop-blur border-b border-gray-800 z-10">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              {product ? 'Edit Product' : 'Create Product'}
            </h2>
            <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">Inventory Management</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white transition-colors">
            <FaTimes />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <form id="productForm" onSubmit={handleSubmit} className="space-y-10">
            
            {/* Section 1: Basic Info */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-white border-l-4 border-[#0295E6] pl-3 flex items-center gap-2">
                <FaBox className="text-[#0295E6]" /> Basic Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputGroup 
                  label="Product Title" 
                  required 
                  value={formData.title} 
                  onChange={e => setFormData({...formData, title: e.target.value})} 
                  placeholder="e.g. Alcantara Sport Wheel" 
                />
                <InputGroup 
                  label="Model Number" 
                  value={formData.model} 
                  onChange={e => setFormData({...formData, model: e.target.value})} 
                  placeholder="e.g. SF-2024-X" 
                />
                <div className="group">
                  <label className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-gray-200 focus:outline-none focus:border-[#0295E6] transition-all"
                    value={formData.category}
                    onChange={e => setFormData({...formData, category: e.target.value})}
                  >
                    <option value="">Select Category...</option>
                    {categories.map(cat => (
                      <option key={cat._id} value={cat._id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                <InputGroup 
                  label="Brand" 
                  value={formData.brand} 
                  onChange={e => setFormData({...formData, brand: e.target.value})} 
                  placeholder="e.g. BMW, Mercedes" 
                />
              </div>
              <div className="group">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1 block">
                  Description
                </label>
                <textarea
                  rows="4"
                  className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-gray-200 focus:outline-none focus:border-[#0295E6] transition-all placeholder-gray-700 resize-none"
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  placeholder="Describe the product..."
                />
              </div>
            </div>

            {/* Section 2: Pricing & Inventory */}
            <div className="p-6 bg-gray-950/50 rounded-2xl border border-gray-800 space-y-6">
              <h3 className="text-lg font-semibold text-white border-l-4 border-green-500 pl-3 flex items-center gap-2">
                <FaWarehouse className="text-green-500" /> Pricing & Inventory
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="relative group">
                  <InputGroup 
                    label="Price ($)" 
                    type="number" step="0.01" 
                    value={formData.price} 
                    onChange={e => setFormData({...formData, price: e.target.value})} 
                  />
                  <FaDollarSign className="absolute right-4 bottom-3.5 text-gray-600 group-focus-within:text-green-500" />
                </div>
                <InputGroup 
                  label="Quantity in Stock" 
                  type="number" 
                  value={formData.quantity} 
                  onChange={e => setFormData({...formData, quantity: e.target.value})} 
                />
              </div>
            </div>

            {/* Section 3: Specifications */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-white border-l-4 border-purple-500 pl-3 flex items-center gap-2">
                <FaCog className="text-purple-500" /> Tech Specs
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <InputGroup 
                  label="Material" 
                  value={formData.material} 
                  onChange={e => setFormData({...formData, material: e.target.value})} 
                />
                <InputGroup 
                  label="Diameter" 
                  value={formData.diameter} 
                  onChange={e => setFormData({...formData, diameter: e.target.value})} 
                />
                <InputGroup 
                  label="Compatibility" 
                  value={formData.compatibility} 
                  onChange={e => setFormData({...formData, compatibility: e.target.value})} 
                />
              </div>

              {/* Dynamic Specs */}
              <div className="bg-gray-800/30 p-4 rounded-xl border border-gray-800">
                <div className="flex gap-2 mb-4">
                  <input 
                    placeholder="Spec Name (e.g. Stitch Color)" 
                    value={specInput.key} 
                    onChange={e => setSpecInput({...specInput, key: e.target.value})} 
                    className="flex-1 bg-gray-950 border border-gray-800 rounded-lg px-3 py-2 text-sm text-white" 
                  />
                  <input 
                    placeholder="Value (e.g. Red)" 
                    value={specInput.value} 
                    onChange={e => setSpecInput({...specInput, value: e.target.value})} 
                    className="flex-1 bg-gray-950 border border-gray-800 rounded-lg px-3 py-2 text-sm text-white" 
                  />
                  <button 
                    type="button" 
                    onClick={handleAddSpec} 
                    className="px-4 bg-[#0295E6] hover:bg-[#0284c6] text-white rounded-lg text-sm font-bold"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(formData.specifications).map(([k, v]) => (
                    <span key={k} className="inline-flex items-center gap-2 px-3 py-1 bg-gray-900 border border-gray-700 rounded-full text-xs text-gray-300">
                      <span className="text-[#0295E6] font-bold">{k}:</span> {v}
                      <button type="button" onClick={() => handleRemoveSpec(k)} className="hover:text-red-400">
                        <FaTimes />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Section 4: Images */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white border-l-4 border-yellow-500 pl-3 flex items-center gap-2">
                <FaImage className="text-yellow-500" /> Media Gallery
              </h3>
              
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-gray-700 hover:border-[#0295E6] bg-gray-950/50 hover:bg-gray-900 rounded-2xl p-8 cursor-pointer transition-all text-center group"
              >
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  multiple 
                  accept="image/*" 
                  onChange={handleImageUpload} 
                  className="hidden" 
                />
                <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                  <FaCloudUploadAlt className="text-3xl text-gray-400 group-hover:text-[#0295E6]" />
                </div>
                <p className="text-gray-300 font-medium">Click to upload images</p>
                <p className="text-xs text-gray-500 mt-1">
                  Supports JPG, PNG, WEBP (Max 10 images, {MAX_FILE_SIZE / 1024 / 1024}MB each)
                </p>
              </div>

              {imagePreviews.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
                  {imagePreviews.map((src, idx) => (
                    <div key={idx} className="relative aspect-square group rounded-xl overflow-hidden border border-gray-700">
                      <img src={src} alt="" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button 
                          type="button" 
                          onClick={() => handleRemoveImage(idx)} 
                          className="p-2 bg-red-600 rounded-full text-white hover:bg-red-700"
                        >
                          <FaTrash size={12} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </form>
        </div>

        {/* Sticky Footer */}
        <div className="px-8 py-5 bg-gray-900/95 backdrop-blur border-t border-gray-800 flex justify-end gap-4 z-10">
          <button 
            onClick={onClose} 
            className="px-6 py-2.5 rounded-xl border border-gray-700 text-gray-300 hover:bg-gray-800 transition-colors"
          >
            Cancel
          </button>
          <button 
            form="productForm" 
            type="submit" 
            className="px-8 py-2.5 rounded-xl bg-gradient-to-r from-[#0295E6] to-[#0077b6] text-white font-bold shadow-lg hover:shadow-blue-500/20 hover:scale-105 transition-all"
          >
            {product ? 'Save Changes' : 'Create Product'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}