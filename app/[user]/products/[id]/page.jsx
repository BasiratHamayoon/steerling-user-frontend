'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { FaWhatsapp, FaChevronLeft, FaChevronRight, FaTruck } from 'react-icons/fa';
import { products } from '@/data/products';
import ProductCard from '@/components/user/ProductCard';
import OrderModal from '@/components/user/OrderModal';

export default function ProductDetailPage() {
  const params = useParams();
  const productId = parseInt(params.id);
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [showOrderModal, setShowOrderModal] = useState(false);

  useEffect(() => {
    const prod = products.find(p => p.id === productId);
    if (prod) {
      setProduct(prod);
      const related = products
        .filter(p => p.category === prod.category && p.id !== prod.id)
        .slice(0, 4);
      setRelatedProducts(related);
    }
  }, [productId]);

  if (!product) {
    return (
      <div className="py-12 text-center">
        <h1 className="text-2xl">Product not found</h1>
      </div>
    );
  }

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16 items-start">
          <div>
            <div className="relative rounded-2xl overflow-hidden mb-4">
              <div className="h-96">
                <img
                  src={product.images[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-cover object-center"
                  style={{ objectPosition: 'center 30%' }}
                />
              </div>
              <button
                onClick={() => setSelectedImage(prev => prev > 0 ? prev - 1 : product.images.length - 1)}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 p-3 rounded-full hover:bg-black/70 transition-colors"
              >
                <FaChevronLeft />
              </button>
              <button
                onClick={() => setSelectedImage(prev => prev < product.images.length - 1 ? prev + 1 : 0)}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 p-3 rounded-full hover:bg-black/70 transition-colors"
              >
                <FaChevronRight />
              </button>
            </div>
            
            <div className="flex gap-2 justify-center">
              {product.images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`w-16 h-16 rounded-lg overflow-hidden border transition-all ${selectedImage === index ? 'border-[#0295E6] scale-105' : 'border-gray-700/50 hover:border-gray-600'}`}
                >
                  <img src={img} alt={`View ${index + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
              <div className="flex items-center justify-between mb-4">
                <span className="text-2xl font-bold text-[#0295E6]">${product.price}</span>
                <span className={`px-4 py-2 rounded-full text-sm font-medium ${product.inStock ? 'bg-[#0295E6]/30 text-[#0295E6]' : 'bg-red-900/30 text-red-300'}`}>
                  {product.inStock ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>
            </div>

            <div className="p-4 bg-gray-900/30 rounded-xl">
              <h3 className="font-semibold mb-2">Model Information</h3>
              <p className="text-gray-400">{product.model} • {product.category}</p>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-3">Description</h3>
              <p className="text-gray-300 leading-relaxed">{product.description}</p>
            </div>

            {product.inStock && (
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Quantity</h3>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center border border-gray-700 rounded-lg overflow-hidden">
                      <button
                        onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                        className="px-4 py-3 hover:bg-gray-800 transition-colors"
                      >
                        -
                      </button>
                      <span className="px-6 py-3 bg-gray-900">{quantity}</span>
                      <button
                        onClick={() => setQuantity(prev => Math.min(product.stockCount, prev + 1))}
                        className="px-4 py-3 hover:bg-gray-800 transition-colors"
                      >
                        +
                      </button>
                    </div>
                    <span className="text-gray-400">{product.stockCount} items in stock</span>
                  </div>
                </div>

                <button
                  onClick={() => setShowOrderModal(true)}
                  className="flex items-center justify-center gap-3 bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 hover:scale-105 w-full"
                >
                  <FaWhatsapp className="text-2xl" />
                  Order Now on WhatsApp
                </button>
              </div>
            )}
          </div>
        </div>

        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct, index) => (
                <motion.div
                  key={relatedProduct.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <ProductCard product={relatedProduct} />
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>

      <OrderModal
        isOpen={showOrderModal}
        onClose={() => setShowOrderModal(false)}
        product={product}
        quantity={quantity}
      />
    </div>
  );
}