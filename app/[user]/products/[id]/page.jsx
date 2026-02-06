'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FaWhatsapp, FaChevronLeft, FaChevronRight, FaShoppingCart, FaArrowLeft } from 'react-icons/fa';
import Link from 'next/link';
import { useAppContext } from '@/context/AppContext';
import ProductCard from '@/components/user/ProductCard';
import OrderModal from '@/components/user/OrderModal';
import getImageUrl from '@/utils/imageUrl';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { 
    fetchProductById, 
    fetchProductsByCategory, 
    addToCart,
    showNotification 
  } = useAppContext();
  
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [showOrderModal, setShowOrderModal] = useState(false);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        setSelectedImage(0);
        setQuantity(1);
        
        const productResponse = await fetchProductById(params.id);
        
        if (productResponse.success) {
          setProduct(productResponse.data);
          
          if (productResponse.data.category?._id) {
            const relatedResponse = await fetchProductsByCategory(
              productResponse.data.category._id, 
              { limit: 5 }
            );
            
            if (relatedResponse.success) {
              const filtered = relatedResponse.data.products.filter(
                p => p._id !== productResponse.data._id
              );
              setRelatedProducts(filtered.slice(0, 4));
            }
          }
        } else {
          showNotification('Product not found', 'error');
          router.push('/products');
        }
      } catch (error) {
        console.error('Error loading product:', error);
        showNotification('Error loading product', 'error');
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      loadProduct();
    }
  }, [params.id]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
    }
  };

  const handleImageNavigation = (direction) => {
    if (!product?.images?.length) return;
    
    if (direction === 'prev') {
      setSelectedImage(prev => prev > 0 ? prev - 1 : product.images.length - 1);
    } else {
      setSelectedImage(prev => prev < product.images.length - 1 ? prev + 1 : 0);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="animate-pulse">
              <div className="bg-gray-800 rounded-2xl h-96 mb-4"></div>
              <div className="flex gap-2 justify-center">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="w-16 h-16 bg-gray-800 rounded-lg"></div>
                ))}
              </div>
            </div>
            <div className="space-y-4 animate-pulse">
              <div className="h-8 bg-gray-800 rounded w-3/4"></div>
              <div className="h-6 bg-gray-800 rounded w-1/4"></div>
              <div className="h-32 bg-gray-800 rounded"></div>
              <div className="h-12 bg-gray-800 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Not found state
  if (!product) {
    return (
      <div className="py-12 text-center">
        <h1 className="text-2xl mb-4">Product not found</h1>
        <Link href="/products" className="text-green-400 hover:underline">
          ← Back to Products
        </Link>
      </div>
    );
  }

  // Process images - use helper function
  const productImages = product.images?.length > 0 
    ? product.images.map(img => getImageUrl(img))
    : ['/placeholder-product.jpg'];
  
  const isInStock = product.stockStatus === 'inStock' && product.quantity > 0;
  
  // WhatsApp
  const whatsappNumber = '+1234567890';
  const whatsappMessage = encodeURIComponent(
    `Hello, I'm interested in:\n\n` +
    `Product: ${product.title}\n` +
    `Model: ${product.model}\n` +
    `Price: $${product.price.toFixed(2)}\n` +
    `Quantity: ${quantity}\n\n` +
    `Please provide more information.`
  );
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        {/* Back Button */}
        <Link 
          href="/products" 
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
        >
          <FaArrowLeft />
          <span>Back to Products</span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16 items-start">
          {/* Image Gallery */}
          <div>
            <div className="relative rounded-2xl overflow-hidden mb-4 bg-gray-900">
              <div className="h-96">
                <img
                  src={productImages[selectedImage]}
                  alt={product.title}
                  className="w-full h-full object-cover object-center"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/placeholder-product.jpg';
                  }}
                />
              </div>
              
              {productImages.length > 1 && (
                <>
                  <button
                    onClick={() => handleImageNavigation('prev')}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 p-3 rounded-full hover:bg-black/70 transition-colors"
                  >
                    <FaChevronLeft />
                  </button>
                  <button
                    onClick={() => handleImageNavigation('next')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 p-3 rounded-full hover:bg-black/70 transition-colors"
                  >
                    <FaChevronRight />
                  </button>
                </>
              )}

              {/* Image Counter */}
              {productImages.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 px-3 py-1 rounded-full text-sm">
                  {selectedImage + 1} / {productImages.length}
                </div>
              )}
            </div>
            
            {/* Thumbnail Gallery */}
            {productImages.length > 1 && (
              <div className="flex gap-2 justify-center flex-wrap">
                {productImages.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === index 
                        ? 'border-green-500 scale-105' 
                        : 'border-gray-700/50 hover:border-gray-600'
                    }`}
                  >
                    <img 
                      src={img} 
                      alt={`View ${index + 1}`} 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/placeholder-product.jpg';
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Title & Price */}
            <div>
              {product.category?.name && (
                <span className="text-green-400 text-sm font-medium">
                  {product.category.name}
                </span>
              )}
              <h1 className="text-3xl font-bold mb-2">{product.title}</h1>
              <div className="flex items-center justify-between mb-4">
                <span className="text-3xl font-bold text-green-400">
                  ${product.price.toFixed(2)}
                </span>
                <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                  isInStock 
                    ? 'bg-green-900/30 text-green-300' 
                    : 'bg-red-900/30 text-red-300'
                }`}>
                  {isInStock ? `In Stock (${product.quantity})` : 'Out of Stock'}
                </span>
              </div>
            </div>

            {/* Product Info Box */}
            <div className="p-4 bg-gray-900/30 rounded-xl border border-gray-700/50">
              <h3 className="font-semibold mb-3 text-green-400">Product Information</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-gray-400">Model:</div>
                <div className="text-white">{product.model}</div>
                
                {product.brand && (
                  <>
                    <div className="text-gray-400">Brand:</div>
                    <div className="text-white">{product.brand}</div>
                  </>
                )}
                
                {product.material && (
                  <>
                    <div className="text-gray-400">Material:</div>
                    <div className="text-white">{product.material}</div>
                  </>
                )}
                
                {product.diameter && (
                  <>
                    <div className="text-gray-400">Diameter:</div>
                    <div className="text-white">{product.diameter}</div>
                  </>
                )}
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="font-semibold text-lg mb-3">Description</h3>
              <p className="text-gray-300 leading-relaxed">{product.description}</p>
            </div>

            {/* Compatibility */}
            {product.compatibility && (
              <div>
                <h3 className="font-semibold text-lg mb-3">Compatibility</h3>
                <p className="text-gray-300">{product.compatibility}</p>
              </div>
            )}

            {/* Specifications */}
            {product.specifications && Object.keys(product.specifications).length > 0 && (
              <div>
                <h3 className="font-semibold text-lg mb-3">Specifications</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="flex justify-between p-3 bg-gray-900/30 rounded-lg border border-gray-700/30">
                      <span className="text-gray-400 capitalize">{key}</span>
                      <span className="text-white font-medium">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity & Actions */}
            {isInStock ? (
              <div className="space-y-4 pt-4 border-t border-gray-700/50">
                {/* Quantity Selector */}
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
                      <span className="px-6 py-3 bg-gray-900 min-w-[60px] text-center">{quantity}</span>
                      <button
                        onClick={() => setQuantity(prev => Math.min(product.quantity, prev + 1))}
                        className="px-4 py-3 hover:bg-gray-800 transition-colors"
                      >
                        +
                      </button>
                    </div>
                    <span className="text-gray-400 text-sm">
                      {product.quantity} available
                    </span>
                  </div>
                </div>

                {/* Total Price */}
                <div className="p-4 bg-gray-900/50 rounded-xl">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Total:</span>
                    <span className="text-2xl font-bold text-green-400">
                      ${(product.price * quantity).toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4">
                  <button
                    onClick={handleAddToCart}
                    className="flex-1 flex items-center justify-center gap-3 bg-gray-800 hover:bg-gray-700 text-white px-6 py-4 rounded-xl font-semibold transition-all duration-300 hover:scale-[1.02]"
                  >
                    <FaShoppingCart className="text-xl" />
                    Add to Cart
                  </button>
                  
                  <a
                    href={whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-3 bg-green-600 hover:bg-green-700 text-white px-6 py-4 rounded-xl font-semibold transition-all duration-300 hover:scale-[1.02]"
                  >
                    <FaWhatsapp className="text-2xl" />
                    Order Now
                  </a>
                </div>

                {/* Or use modal */}
                <button
                  onClick={() => setShowOrderModal(true)}
                  className="w-full text-center text-gray-400 hover:text-white text-sm underline transition-colors"
                >
                  Or fill out order form
                </button>
              </div>
            ) : (
              <div className="space-y-4 pt-4 border-t border-gray-700/50">
                <div className="p-4 bg-red-900/20 rounded-xl text-center">
                  <p className="text-red-400 font-medium">This product is currently out of stock</p>
                  <p className="text-gray-400 text-sm mt-1">Contact us for availability</p>
                </div>
                
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-3 bg-green-600 hover:bg-green-700 text-white px-6 py-4 rounded-xl font-semibold transition-all duration-300 w-full"
                >
                  <FaWhatsapp className="text-2xl" />
                  Contact for Availability
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct, index) => (
                <motion.div
                  key={relatedProduct._id}
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

      {/* Order Modal */}
      <OrderModal
        isOpen={showOrderModal}
        onClose={() => setShowOrderModal(false)}
        product={product}
        quantity={quantity}
      />
    </div>
  );
}