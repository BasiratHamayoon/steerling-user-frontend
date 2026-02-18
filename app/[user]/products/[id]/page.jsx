'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  FaWhatsapp, FaChevronLeft, FaChevronRight, FaArrowLeft, 
  FaCheckCircle, FaRegStar
} from 'react-icons/fa';
import Link from 'next/link';

// Context & Services
import { useAppContext } from '@/context/AppContext';
import reviewService from '@/services/reviewService';
import getImageUrl from '@/utils/imageUrl';

// Components
import OrderModal from '@/components/user/OrderModal';
import ProductCard from '@/components/user/ProductCard'; 
import Loading from '@/components/ui/Loading';

// NEW Review Components
import ReviewSummary from '@/components/user/ReviewSummary';
import ReviewCard from '@/components/user/ReviewCard';
import ReviewForm from '@/components/user/ReviewForm';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { fetchProductById, fetchProductsByCategory } = useAppContext();
  
  // Product Data State
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Gallery & Order State
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [modalProduct, setModalProduct] = useState(null);
  
  // Review State
  const [reviews, setReviews] = useState([]);
  const [reviewStats, setReviewStats] = useState(null);
  const [isReviewFormOpen, setIsReviewFormOpen] = useState(false);
  const [reviewSuccessMsg, setReviewSuccessMsg] = useState('');

  // Initial Data Load
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // 1. Fetch Main Product
        const productResponse = await fetchProductById(params.id);
        
        if (productResponse.success) {
          const currentProduct = productResponse.data;
          setProduct(currentProduct);
          setModalProduct(currentProduct);

          // 2. Fetch Reviews
          await loadReviews(currentProduct._id);

          // 3. Fetch Related Products
          const categoryId = typeof currentProduct.category === 'object' 
            ? currentProduct.category?._id 
            : currentProduct.category;

          if (categoryId) {
            const relatedResponse = await fetchProductsByCategory(categoryId);
            if (relatedResponse.success) {
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

  // Helper: Load Reviews
  const loadReviews = async (productId) => {
    try {
      // Fetching first 10 reviews for the list
      const response = await reviewService.getProductReviews(productId, { page: 1, limit: 10 });
      if (response.success) {
        setReviews(response.data.reviews);
        setReviewStats(response.data.ratingSummary);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  // Helper: Handle successful review submission from Modal
  const handleReviewSuccess = () => {
    setIsReviewFormOpen(false);
    setReviewSuccessMsg('Review submitted successfully! It will appear after approval.');
    loadReviews(product._id); // Refresh data
    setTimeout(() => setReviewSuccessMsg(''), 5000); // Hide toast after 5s
  };

  // Helper: Open Order Modal
  const handleOpenOrderModal = (productToOrder) => {
    setModalProduct(productToOrder);
    setShowOrderModal(true);
  };

  if (loading || !product) return <Loading />;

  // Derived Values
  const productImages = product.images?.length > 0 ? product.images.map(img => getImageUrl(img)) : ['/placeholder-product.jpg'];
  const isInStock = product.stockStatus === 'inStock';
  const currentModalQuantity = modalProduct?._id === product?._id ? quantity : 1;

  // Rating Stars Component (Small version for Header)
  const HeaderRatingStars = ({ rating }) => {
    // Simple inline component for the header area specifically
    return (
      <div className="flex items-center gap-0.5 text-sm text-yellow-400">
        <FaCheckCircle className="text-green-500 mr-1" /> 
        <span className="font-bold text-white mr-1">{rating.toFixed(1)}</span>
        Rating
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-200 py-6 lg:py-8">
      <div className="container mx-auto px-4 lg:px-8">
        
        {/* Navigation */}
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

        {/* Main Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-start mb-12">
          
          {/* LEFT COLUMN: Gallery */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-3"
          >
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
              
              {productImages.length > 1 && (
                <>
                  <button 
                    onClick={() => setSelectedImage(prev => prev > 0 ? prev - 1 : productImages.length - 1)} 
                    className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/40 backdrop-blur-md p-2 rounded-full text-white hover:bg-[#0295E6] transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <FaChevronLeft />
                  </button>
                  <button 
                    onClick={() => setSelectedImage(prev => prev < productImages.length - 1 ? prev + 1 : 0)} 
                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/40 backdrop-blur-md p-2 rounded-full text-white hover:bg-[#0295E6] transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <FaChevronRight />
                  </button>
                </>
              )}
            </div>

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
                    <img src={img} className="w-full h-full object-cover" alt={`Thumbnail ${index + 1}`} />
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
                    <span className="text-[#0295E6] font-bold text-xs tracking-wider uppercase">
                      {product.brand || "Premium"}
                    </span>
                    {isInStock && (
                      <span className="bg-green-500/10 text-green-400 px-1.5 py-0.5 rounded text-[10px] border border-green-500/20 flex items-center gap-1">
                        <FaCheckCircle className="text-[10px]" /> In Stock
                      </span>
                    )}
                </div>
                <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-2 leading-tight">
                  {product.title}
                </h1>
                
                {/* Rating Link */}
                {reviewStats && reviewStats.total > 0 ? (
                  <div className="flex items-center gap-3 mb-2">
                    <HeaderRatingStars rating={reviewStats.average} />
                    <Link href="#reviews" className="text-sm text-gray-500 hover:text-[#0295E6] transition-colors">
                      ({reviewStats.total} reviews)
                    </Link>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 mb-2">No reviews yet</p>
                )}
                
                <div className="flex items-end gap-3 mt-4">
                    <span className="text-3xl font-bold text-[#0295E6]">
                      ${product.price?.toFixed(2)}
                    </span>
                    <span className="text-gray-500 mb-1 text-sm line-through">
                      ${((product.price || 0) * 1.2).toFixed(2)}
                    </span>
                </div>
             </div>

             {/* Description */}
             <div className="prose prose-invert max-w-none text-gray-400 text-sm mb-6 leading-relaxed line-clamp-4 hover:line-clamp-none transition-all cursor-default">
                 <p>{product.description}</p>
             </div>

             {/* Specs Grid */}
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
                 {product.diameter && (
                    <div className="bg-gray-900 p-3 rounded-lg border border-gray-800">
                        <span className="block text-gray-500 text-[10px] uppercase mb-0.5">Diameter</span>
                        <span className="text-white text-sm font-medium">{product.diameter}</span>
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
                        <button 
                          onClick={() => setQuantity(q => Math.max(1, q - 1))} 
                          className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-800 rounded transition"
                        >
                          -
                        </button>
                        <span className="w-6 text-center font-bold text-white text-sm">{quantity}</span>
                        <button 
                          onClick={() => setQuantity(q => q + 1)} 
                          className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-800 rounded transition"
                        >
                          +
                        </button>
                    </div>

                    {/* Main CTA */}
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

        {/* ========================================================= */}
        {/* REVIEWS SECTION - REPLACED WITH MODULAR COMPONENTS       */}
        {/* ========================================================= */}
        <div id="reviews" className="border-t border-gray-800 pt-10 mb-12">
          
          <div className="flex flex-col lg:flex-row gap-12">
            
            {/* Left: Rating Summary & Stats Component */}
            <div className="lg:w-1/3">
              <ReviewSummary 
                stats={reviewStats} 
                onWriteReview={() => setIsReviewFormOpen(true)} 
              />
            </div>

            {/* Right: Reviews List Component */}
            <div className="lg:w-2/3">
              
              {/* Success Notification */}
              {reviewSuccessMsg && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-xl flex items-center gap-3 text-green-400"
                >
                  <FaCheckCircle /> {reviewSuccessMsg}
                </motion.div>
              )}

              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                 <h3 className="text-xl font-bold text-white">Latest Comments</h3>
              </div>

              {/* List */}
              {reviews.length > 0 ? (
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <ReviewCard key={review._id} review={review} />
                  ))}
                  {/* Note: Pagination button removed for simplicity, can be added back if needed */}
                </div>
              ) : (
                <div className="bg-gray-900/30 border border-gray-800 border-dashed rounded-xl p-12 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-800 mb-4 text-gray-600">
                    <FaRegStar className="text-2xl" />
                  </div>
                  <h4 className="text-lg font-semibold text-white mb-2">No reviews yet</h4>
                  <p className="text-gray-500 mb-6">Be the first to share your thoughts on this product.</p>
                  <button 
                    onClick={() => setIsReviewFormOpen(true)}
                    className="text-[#0295E6] font-medium hover:underline"
                  >
                    Write a Review
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RELATED PRODUCTS */}
        {relatedProducts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="border-t border-gray-800 pt-8"
          >
            <div className="flex items-center justify-between mb-6">
               <h2 className="text-xl md:text-2xl font-bold text-white">Related Products</h2>
               <Link href="/user/products" className="text-sm text-[#0295E6] hover:underline">
                 View All
               </Link>
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

      {/* MODALS */}
      
      {/* 1. Review Form Modal (Modular) */}
      {isReviewFormOpen && (
        <ReviewForm
          productId={product._id}
          productTitle={product.title}
          onClose={() => setIsReviewFormOpen(false)}
          onSuccess={handleReviewSuccess}
        />
      )}

      {/* 2. Order Modal (Existing) */}
      <OrderModal
        isOpen={showOrderModal}
        onClose={() => setShowOrderModal(false)}
        product={modalProduct}
        quantity={currentModalQuantity}
      />
    </div>
  );
}