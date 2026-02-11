'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FaWhatsapp, FaChevronLeft, FaChevronRight, FaArrowLeft, FaStar, FaCheckCircle } from 'react-icons/fa';
import Link from 'next/link';
import { useAppContext } from '@/context/AppContext';
import OrderModal from '@/components/user/OrderModal';
import getImageUrl from '@/utils/imageUrl';
import Loading from '@/components/ui/Loading';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { fetchProductById } = useAppContext();
  
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [showOrderModal, setShowOrderModal] = useState(false);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        const productResponse = await fetchProductById(params.id);
        if (productResponse.success) {
          setProduct(productResponse.data);
        } else {
          router.push('/products');
        }
      } catch (error) {
        console.error('Error loading product:', error);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) loadProduct();
  }, [params.id]);

  if (loading || !product) {
     return <Loading />
  }

  const productImages = product.images?.length > 0 ? product.images.map(img => getImageUrl(img)) : ['/placeholder-product.jpg'];
  const isInStock = product.stockStatus === 'inStock';

  return (
    <div className="min-h-screen bg-gray-950 text-gray-200 py-12">
      <div className="container mx-auto px-4 lg:px-8">
        
        {/* Navigation */}
        <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-8"
        >
          <Link href="/products" className="inline-flex items-center gap-2 text-gray-500 hover:text-[#0295E6] transition-colors group">
            <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Back to Collection</span>
          </Link>
        </motion.div>

        {/* Main Grid Layout - Aligned Top & Bottom */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-20 items-start">
          
          {/* LEFT COLUMN: Gallery */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:sticky lg:top-24 space-y-4"
          >
            {/* Main Image */}
            <div className="relative aspect-square w-full bg-gray-900 rounded-3xl overflow-hidden border border-gray-800 shadow-2xl">
              <motion.img
                key={selectedImage}
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                src={productImages[selectedImage]}
                alt={product.title}
                className="w-full h-full object-cover"
              />
              
              {/* Image Controls */}
              {productImages.length > 1 && (
                <>
                  <button onClick={() => setSelectedImage(prev => prev > 0 ? prev - 1 : productImages.length - 1)} className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/40 backdrop-blur-md p-3 rounded-full text-white hover:bg-[#0295E6] transition-colors"><FaChevronLeft /></button>
                  <button onClick={() => setSelectedImage(prev => prev < productImages.length - 1 ? prev + 1 : 0)} className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/40 backdrop-blur-md p-3 rounded-full text-white hover:bg-[#0295E6] transition-colors"><FaChevronRight /></button>
                </>
              )}
            </div>

            {/* Thumbnails */}
            {productImages.length > 1 && (
              <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                {productImages.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all duration-300 ${
                      selectedImage === index ? 'border-[#0295E6] opacity-100' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* RIGHT COLUMN: Details - Aligned with top of image */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col h-full justify-start"
          >
             {/* Header Info */}
             <div className="mb-6 border-b border-gray-800 pb-6">
                <div className="flex items-center gap-2 mb-3">
                    <span className="text-[#0295E6] font-bold text-sm tracking-wider uppercase">{product.brand || "Premium"}</span>
                    {isInStock && <span className="bg-green-500/10 text-green-400 px-2 py-0.5 rounded text-xs border border-green-500/20 flex items-center gap-1"><FaCheckCircle className="text-[10px]" /> In Stock</span>}
                </div>
                <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 leading-tight">{product.title}</h1>
                <div className="flex items-end gap-4">
                    <span className="text-4xl font-bold text-[#0295E6]">${product.price.toFixed(2)}</span>
                    <span className="text-gray-500 mb-2 text-sm line-through">${(product.price * 1.2).toFixed(2)}</span>
                </div>
             </div>

             {/* Description */}
             <div className="prose prose-invert max-w-none text-gray-400 mb-8 leading-relaxed">
                 <p>{product.description}</p>
             </div>

             {/* Specs Grid */}
             <div className="grid grid-cols-2 gap-4 mb-8">
                 <div className="bg-gray-900 p-4 rounded-xl border border-gray-800">
                     <span className="block text-gray-500 text-xs uppercase mb-1">Model</span>
                     <span className="text-white font-medium">{product.model}</span>
                 </div>
                 {product.material && (
                    <div className="bg-gray-900 p-4 rounded-xl border border-gray-800">
                        <span className="block text-gray-500 text-xs uppercase mb-1">Material</span>
                        <span className="text-white font-medium">{product.material}</span>
                    </div>
                 )}
                 {product.compatibility && (
                    <div className="bg-gray-900 p-4 rounded-xl border border-gray-800 col-span-2">
                        <span className="block text-gray-500 text-xs uppercase mb-1">Compatibility</span>
                        <span className="text-white font-medium">{product.compatibility}</span>
                    </div>
                 )}
             </div>

             {/* Actions Area - Pushed to bottom if content is short, or flows naturally */}
             <div className="mt-auto bg-gray-900/50 p-6 rounded-2xl border border-gray-800/50 backdrop-blur-sm">
                <div className="flex flex-col sm:flex-row gap-6 items-center">
                    {/* Quantity */}
                    <div className="flex items-center gap-4 bg-gray-950 p-2 rounded-xl border border-gray-800">
                        <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition">-</button>
                        <span className="w-8 text-center font-bold text-white">{quantity}</span>
                        <button onClick={() => setQuantity(q => q + 1)} className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition">+</button>
                    </div>

                    {/* Main CTA */}
                    <button
                        onClick={() => setShowOrderModal(true)}
                        className="flex-1 w-full bg-[#0295E6] hover:bg-[#027ab5] text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 shadow-lg shadow-blue-900/20 hover:scale-[1.02] transition-all duration-300"
                    >
                        <FaWhatsapp className="text-2xl" />
                        <span>Order via WhatsApp</span>
                    </button>
                </div>
                <p className="text-center text-gray-500 text-sm mt-4">
                    Fast delivery • Cash on Delivery available
                </p>
             </div>
          </motion.div>
        </div>
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