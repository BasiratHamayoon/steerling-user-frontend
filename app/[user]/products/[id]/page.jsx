'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FaWhatsapp, FaChevronLeft, FaChevronRight, FaArrowLeft, FaCheckCircle } from 'react-icons/fa';
import Link from 'next/link';
import { useAppContext } from '@/context/AppContext';
import OrderModal from '@/components/user/OrderModal';
import ProductCard from '@/components/user/ProductCard'; 
import getImageUrl from '@/utils/imageUrl';
import Loading from '@/components/ui/Loading';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { fetchProductById, fetchProductsByCategory } = useAppContext();
  
  // State
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  
  // Modal State
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [modalProduct, setModalProduct] = useState(null); // Tracks which product is in the modal

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // 1. Fetch Main Product
        const productResponse = await fetchProductById(params.id);
        
        if (productResponse.success) {
          const currentProduct = productResponse.data;
          setProduct(currentProduct);
          setModalProduct(currentProduct); // Default to main product

          // 2. Fetch Related Products (if category exists)
          // Handle both populated object or string ID for category
          const categoryId = typeof currentProduct.category === 'object' 
            ? currentProduct.category?._id 
            : currentProduct.category;

          if (categoryId) {
            const relatedResponse = await fetchProductsByCategory(categoryId);
            if (relatedResponse.success) {
              // Filter out the currently viewed product and limit to 4 items
              const filtered = relatedResponse.data.products
                .filter(p => p._id !== currentProduct._id)
                .slice(0, 4);
              setRelatedProducts(filtered);
            }
          }
        } else {
          router.push('/products');
        }
      } catch (error) {
        console.error('Error loading product data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) loadData();
  }, [params.id]);

  if (loading || !product) {
     return <Loading />
  }

  // Handle opening modal for either the main product or a related product card
  const handleOpenOrderModal = (productToOrder) => {
    setModalProduct(productToOrder);
    // If ordering a related product, reset quantity to 1. 
    // If ordering main product, keep the user's selected quantity.
    if (productToOrder._id !== product._id) {
        // ordering related
    }
    setShowOrderModal(true);
  };

  const productImages = product.images?.length > 0 ? product.images.map(img => getImageUrl(img)) : ['/placeholder-product.jpg'];
  const isInStock = product.stockStatus === 'inStock';

  // Calculate modal quantity: usage state 'quantity' for main product, 1 for related cards
  const currentModalQuantity = modalProduct?._id === product?._id ? quantity : 1;

  return (
    <div className="min-h-screen bg-gray-950 text-gray-200 py-6 lg:py-8">
      <div className="container mx-auto px-4 lg:px-8">
        
        {/* Navigation - Compact */}
        <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-4"
        >
          <Link href="/user/products" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#0295E6] transition-colors group">
            <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Back to Collection</span>
          </Link>
        </motion.div>

        {/* Main Grid Layout - Compacted Height */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-start mb-16">
          
          {/* LEFT COLUMN: Gallery */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-3"
          >
            {/* Main Image - 4:3 Aspect Ratio to save vertical space */}
            <div className="relative aspect-[4/3] w-full bg-gray-900 rounded-2xl overflow-hidden border border-gray-800 shadow-xl group">
              <motion.img
                key={selectedImage}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
                src={productImages[selectedImage]}
                alt={product.title}
                className="w-full h-full object-contain bg-gray-900" 
              />
              
              {/* Image Controls */}
              {productImages.length > 1 && (
                <>
                  <button onClick={() => setSelectedImage(prev => prev > 0 ? prev - 1 : productImages.length - 1)} className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/40 backdrop-blur-md p-2 rounded-full text-white hover:bg-[#0295E6] transition-colors opacity-0 group-hover:opacity-100"><FaChevronLeft /></button>
                  <button onClick={() => setSelectedImage(prev => prev < productImages.length - 1 ? prev + 1 : 0)} className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/40 backdrop-blur-md p-2 rounded-full text-white hover:bg-[#0295E6] transition-colors opacity-0 group-hover:opacity-100"><FaChevronRight /></button>
                </>
              )}
            </div>

            {/* Thumbnails */}
            {productImages.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide justify-center lg:justify-start">
                {productImages.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all duration-300 ${
                      selectedImage === index ? 'border-[#0295E6] opacity-100' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* RIGHT COLUMN: Details */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col h-full"
          >
             {/* Header Info */}
             <div className="mb-4 border-b border-gray-800 pb-4">
                <div className="flex items-center gap-2 mb-2">
                    <span className="text-[#0295E6] font-bold text-xs tracking-wider uppercase">{product.brand || "Premium"}</span>
                    {isInStock && <span className="bg-green-500/10 text-green-400 px-1.5 py-0.5 rounded text-[10px] border border-green-500/20 flex items-center gap-1"><FaCheckCircle className="text-[10px]" /> In Stock</span>}
                </div>
                {/* Smaller Title for better fit */}
                <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-2 leading-tight">{product.title}</h1>
                <div className="flex items-end gap-3">
                    <span className="text-3xl font-bold text-[#0295E6]">${product.price.toFixed(2)}</span>
                    <span className="text-gray-500 mb-1 text-sm line-through">${(product.price * 1.2).toFixed(2)}</span>
                </div>
             </div>

             {/* Description - Clamped to 4 lines */}
             <div className="prose prose-invert max-w-none text-gray-400 text-sm mb-6 leading-relaxed line-clamp-4 hover:line-clamp-none transition-all cursor-default">
                 <p>{product.description}</p>
             </div>

             {/* Specs Grid - Compact */}
             <div className="grid grid-cols-2 gap-3 mb-6">
                 <div className="bg-gray-900 p-3 rounded-lg border border-gray-800">
                     <span className="block text-gray-500 text-[10px] uppercase mb-0.5">Model</span>
                     <span className="text-white text-sm font-medium">{product.model}</span>
                 </div>
                 {product.material && (
                    <div className="bg-gray-900 p-3 rounded-lg border border-gray-800">
                        <span className="block text-gray-500 text-[10px] uppercase mb-0.5">Material</span>
                        <span className="text-white text-sm font-medium">{product.material}</span>
                    </div>
                 )}
                 {product.compatibility && (
                    <div className="bg-gray-900 p-3 rounded-lg border border-gray-800 col-span-2">
                        <span className="block text-gray-500 text-[10px] uppercase mb-0.5">Compatibility</span>
                        <span className="text-white text-sm font-medium">{product.compatibility}</span>
                    </div>
                 )}
             </div>

             {/* Actions Area */}
             <div className="mt-auto bg-gray-900/50 p-4 rounded-xl border border-gray-800/50 backdrop-blur-sm">
                <div className="flex flex-col sm:flex-row gap-4 items-center">
                    {/* Quantity */}
                    <div className="flex items-center gap-3 bg-gray-950 p-1.5 rounded-lg border border-gray-800">
                        <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-800 rounded transition">-</button>
                        <span className="w-6 text-center font-bold text-white text-sm">{quantity}</span>
                        <button onClick={() => setQuantity(q => q + 1)} className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-800 rounded transition">+</button>
                    </div>

                    {/* Main CTA - Opens Modal for Main Product */}
                    <button
                        onClick={() => handleOpenOrderModal(product)}
                        className="flex-1 w-full bg-[#0295E6] hover:bg-[#027ab5] text-white py-3 rounded-lg font-bold text-base flex items-center justify-center gap-2 shadow-lg shadow-blue-900/20 hover:scale-[1.01] transition-all duration-300"
                    >
                        <FaWhatsapp className="text-xl" />
                        <span>Order via WhatsApp</span>
                    </button>
                </div>
                <p className="text-center text-gray-600 text-[10px] mt-2">
                    Fast delivery • Cash on Delivery available
                </p>
             </div>
          </motion.div>
        </div>

        {/* RELATED PRODUCTS SECTION */}
        {relatedProducts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="border-t border-gray-800 pt-8"
          >
            <div className="flex items-center justify-between mb-6">
               <h2 className="text-xl md:text-2xl font-bold text-white">Related Products</h2>
               <Link href="/user/products" className="text-sm text-[#0295E6] hover:underline">View All</Link>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProd) => (
                <ProductCard 
                  key={relatedProd._id} 
                  product={relatedProd} 
                  onOrder={handleOpenOrderModal} 
                />
              ))}
            </div>
          </motion.div>
        )}

      </div>

      <OrderModal
        isOpen={showOrderModal}
        onClose={() => setShowOrderModal(false)}
        product={modalProduct}
        quantity={currentModalQuantity}
      />
    </div>
  );
}