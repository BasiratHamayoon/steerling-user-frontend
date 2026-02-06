'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaPlus, FaEdit, FaTrash, FaSearch, FaEye, FaBox } from 'react-icons/fa';
import { products as initialProducts } from '@/data/products';
import ProductModal from '@/components/admin/ProductModal';

export default function AdminProductsPage() {
  const [products, setProducts] = useState(initialProducts);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: '',
    description: '',
    inStock: true,
    stockCount: 0,
    model: '',
    features: []
  });

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddProduct = (productData) => {
    const newProduct = {
      id: products.length + 1,
      ...productData,
      price: parseFloat(productData.price),
      stockCount: parseInt(productData.stockCount),
      inStock: productData.inStock === 'true' || productData.inStock === true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setProducts([...products, newProduct]);
    alert('Product added successfully!');
  };

  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setShowAddModal(true);
  };

  const handleUpdateProduct = (productData) => {
    const updatedProducts = products.map(p =>
      p.id === selectedProduct.id
        ? { 
            ...p, 
            ...productData, 
            price: parseFloat(productData.price), 
            stockCount: parseInt(productData.stockCount),
            inStock: productData.inStock === 'true' || productData.inStock === true,
            updatedAt: new Date().toISOString()
          }
        : p
    );
    setProducts(updatedProducts);
    setSelectedProduct(null);
    alert('Product updated successfully!');
  };

  const handleDeleteProduct = (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      setProducts(products.filter(p => p.id !== id));
      alert('Product deleted successfully!');
    }
  };

  const handleSaveProduct = (productData) => {
    if (selectedProduct) {
      handleUpdateProduct(productData);
    } else {
      handleAddProduct(productData);
    }
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Products Management</h1>
          <p className="text-gray-400">Manage your store products and inventory</p>
        </div>
        <button
          onClick={() => {
            setSelectedProduct(null);
            setShowAddModal(true);
          }}
          className="flex items-center gap-2 bg-gradient-to-r from-[#0295E6] to-[#02b3e6] hover:from-[#0284c6] hover:to-[#0295E6] text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105"
        >
          <FaPlus />
          Add New Product
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <FaSearch className="absolute left-4 top-3.5 text-gray-400" />
        <input
          type="text"
          placeholder="Search products by name, category, or description..."
          className="w-full pl-12 pr-4 py-3 bg-gray-800/50 rounded-xl border border-gray-700 focus:border-[#0295E6] focus:outline-none focus:ring-2 focus:ring-[#0295E6]/30"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Products Table */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/30 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-800/80">
                <th className="py-4 px-6 text-left">Product</th>
                <th className="py-4 px-6 text-left">Category</th>
                <th className="py-4 px-6 text-left">Price</th>
                <th className="py-4 px-6 text-left">Stock</th>
                <th className="py-4 px-6 text-left">Status</th>
                <th className="py-4 px-6 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product, index) => (
                <motion.tr
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-t border-gray-700/30 hover:bg-gray-700/20 transition-colors"
                >
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg overflow-hidden">
                        <img
                          src={product.images?.[0] || 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=800&q=80'}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-semibold">{product.name}</p>
                        <p className="text-sm text-gray-400">{product.model}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="px-3 py-1 bg-gray-700/50 rounded-full text-sm">
                      {product.category}
                    </span>
                  </td>
                  <td className="py-4 px-6 font-bold text-[#0295E6]">
                    ${product.price}
                  </td>
                  <td className="py-4 px-6">
                    {product.stockCount}
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      product.inStock ? 'bg-green-900/30 text-green-300' : 'bg-red-900/30 text-red-300'
                    }`}>
                      {product.inStock ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => window.open(`/user/products/${product.id}`, '_blank')}
                        className="p-2 hover:bg-gray-700/50 rounded-lg transition-colors"
                        title="View"
                      >
                        <FaEye className="text-gray-400" />
                      </button>
                      <button
                        onClick={() => handleEditProduct(product)}
                        className="p-2 hover:bg-blue-900/30 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <FaEdit className="text-blue-400" />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        className="p-2 hover:bg-red-900/30 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <FaTrash className="text-red-400" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <FaBox className="text-4xl text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">No products found</p>
          </div>
        )}
      </div>

      {/* Product Modal */}
      {showAddModal && (
        <ProductModal
          isOpen={showAddModal}
          onClose={() => {
            setShowAddModal(false);
            setSelectedProduct(null);
          }}
          product={selectedProduct}
          onSave={handleSaveProduct}
        />
      )}
    </div>
  );
}