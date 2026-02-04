'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { FaWhatsapp, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { products } from '@/data/products';
import ProductCard from '@/components/ProductCard';

export default function ProductDetailPage() {
  const params = useParams();
  const productId = parseInt(params.productId);
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [relatedProducts, setRelatedProducts] = useState([]);

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

  const whatsappMessage = `Hello, I want to order:\nProduct: ${product.name}\nModel: ${product.model}\nQuantity: ${quantity}\nTotal: $${(product.price * quantity).toFixed(2)}`;

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div>
            <div className="relative h-96 rounded-xl overflow-hidden mb-4">
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setSelectedImage(prev => prev > 0 ? prev - 1 : product.images.length - 1)}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 p-2 rounded-full"
              >
                <FaChevronLeft />
              </button>
              <button
                onClick={() => setSelectedImage(prev => prev < product.images.length - 1 ? prev + 1 : 0)}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 p-2 rounded-full"
              >
                <FaChevronRight />
              </button>
            </div>
            
            <div className="flex gap-2">
              {product.images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`w-20 h-20 rounded overflow-hidden border-2 ${selectedImage === index ? 'border-green-500' : 'border-gray-700'}`}
                >
                  <img src={img} alt={`View ${index + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          <div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
              
              <div className="flex items-center justify-between mb-6">
                <span className="text-3xl font-bold text-green-400">${product.price}</span>
                <span className={`px-4 py-2 rounded-full ${product.inStock ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'}`}>
                  {product.inStock ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>

              <div className="mb-6">
                <h3 className="font-semibold mb-2">Model</h3>
                <p className="text-gray-400">{product.model}</p>
              </div>

              <div className="mb-6">
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-gray-400">{product.description}</p>
              </div>

              <div className="mb-6">
                <h3 className="font-semibold mb-2">Features</h3>
                <ul className="grid grid-cols-2 gap-2">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2 text-gray-400">
                      <span className="text-green-400">✓</span> {feature}
                    </li>
                  ))}
                </ul>
              </div>

              {product.inStock && (
                <div className="mb-8">
                  <h3 className="font-semibold mb-2">Quantity</h3>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center border border-gray-700 rounded">
                      <button
                        onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                        className="px-4 py-2 hover:bg-gray-800"
                      >
                        -
                      </button>
                      <span className="px-4 py-2">{quantity}</span>
                      <button
                        onClick={() => setQuantity(prev => Math.min(product.stockCount, prev + 1))}
                        className="px-4 py-2 hover:bg-gray-800"
                      >
                        +
                      </button>
                    </div>
                    <span className="text-gray-400">Only {product.stockCount} left in stock</span>
                  </div>
                </div>
              )}

              <a
                href={`https://wa.me/+1234567890?text=${encodeURIComponent(whatsappMessage)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-colors w-full"
              >
                <FaWhatsapp className="text-2xl" />
                Order Now on WhatsApp (${(product.price * quantity).toFixed(2)})
              </a>
            </motion.div>
          </div>
        </div>

        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-3xl font-bold mb-8">Related Products</h2>
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
    </div>
  );
}