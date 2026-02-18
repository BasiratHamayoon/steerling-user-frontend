'use client';

import { useState, useEffect, useRef } from 'react';
import { 
  FaSearch, FaFilter, FaCheck, FaTimes, 
  FaEye, FaTrash, FaSpinner, FaStar, FaBox, FaCalendarAlt 
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppContext } from '@/context/AppContext';
import Loading from '@/components/ui/Loading';
import ReviewModal from '@/components/admin/ReviewModal';
import ConfirmationModal from '@/components/admin/ConfirmationModal';
import { formatDistanceToNow } from 'date-fns';
import reviewService from '@/services/reviewService';
import Link from 'next/link';

export default function AdminReviewsPage() {
  const { fetchProducts } = useAppContext();
  
  // State Management
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  
  // Filter States
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    status: 'pending',
    search: '',
    productId: '',
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });
  
  // UI States
  const [showFilters, setShowFilters] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState(null);
  const [processingId, setProcessingId] = useState(null);
  
  useEffect(() => {
    fetchReviews();
  }, [currentPage, filters.status, filters.productId, filters.sortBy, filters.sortOrder]);

  useEffect(() => {
    const loadProducts = async () => {
      const response = await fetchProducts({ limit: 100 });
      if (response.success) {
        setProducts(response.data.products);
      }
    };
    loadProducts();
  }, []);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: 10,
        status: filters.status !== 'all' ? filters.status : undefined,
        productId: filters.productId || undefined,
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder
      };

      if (filters.search) {
        params.search = filters.search;
      }

      const response = await reviewService.getAllReviews(params);
      if (response.success) {
        setReviews(response.data.reviews);
        setTotalPages(response.data.pagination.totalPages);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (reviewId) => {
    try {
      setProcessingId(reviewId);
      await reviewService.updateReviewStatus(reviewId, 'approved');
      await fetchReviews();
    } catch (error) {
      console.error('Error approving review:', error);
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (reviewId) => {
    try {
      setProcessingId(reviewId);
      await reviewService.updateReviewStatus(reviewId, 'rejected');
      await fetchReviews();
    } catch (error) {
      console.error('Error rejecting review:', error);
    } finally {
      setProcessingId(null);
    }
  };

  const handleDeleteClick = (review) => {
    setReviewToDelete(review);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (reviewToDelete) {
      try {
        await reviewService.deleteReview(reviewToDelete._id);
        await fetchReviews();
      } catch (error) {
        console.error('Error deleting review:', error);
      }
    }
    setDeleteModalOpen(false);
    setReviewToDelete(null);
  };

  const handleViewReview = (review) => {
    setSelectedReview(review);
    setShowViewModal(true);
  };

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    setCurrentPage(1);
    await fetchReviews();
  };

  const clearFilters = () => {
    setFilters({
      status: 'pending',
      search: '',
      productId: '',
      sortBy: 'createdAt',
      sortOrder: 'desc'
    });
    setCurrentPage(1);
  };

  return (
    <div className="space-y-8 min-h-screen">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-gray-800">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tight mb-2">
            Review <span className="text-[#0295E6]">Management</span>
          </h1>
          <p className="text-gray-400">Moderate customer feedback and ratings.</p>
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${
            showFilters 
              ? 'bg-[#0295E6] text-white shadow-lg shadow-blue-900/20' 
              : 'bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700'
          }`}
        >
          <FaFilter /> <span>{showFilters ? 'Hide Filters' : 'Show Filters'}</span>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="space-y-4">
        <form onSubmit={handleSearchSubmit} className="relative group max-w-2xl">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
             <FaSearch className="text-gray-500 group-focus-within:text-[#0295E6] transition-colors" />
          </div>
          <input
            type="text"
            placeholder="Search by reviewer name, email, or content..."
            className="w-full pl-12 pr-4 py-4 bg-gray-900 border border-gray-800 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:border-[#0295E6] focus:ring-1 focus:ring-[#0295E6] transition-all shadow-sm"
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          />
          {filters.search && (
            <button 
              type="button" 
              onClick={() => { setFilters({...filters, search: ''}); fetchReviews(); }}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
            >
              <FaTimes />
            </button>
          )}
        </form>

        {/* Expanded Filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 overflow-hidden"
            >
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div>
                  <label className="block text-xs uppercase tracking-wide text-gray-500 font-bold mb-2">Status</label>
                  <select
                    value={filters.status}
                    onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-[#0295E6]"
                  >
                    <option value="all">All Reviews</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wide text-gray-500 font-bold mb-2">Product</label>
                  <select
                    value={filters.productId}
                    onChange={(e) => setFilters({ ...filters, productId: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-[#0295E6]"
                  >
                    <option value="">All Products</option>
                    {products.map(product => (
                      <option key={product._id} value={product._id}>{product.title}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wide text-gray-500 font-bold mb-2">Sort By</label>
                  <select
                    value={filters.sortBy}
                    onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-[#0295E6]"
                  >
                    <option value="createdAt">Date</option>
                    <option value="rating">Rating</option>
                    <option value="userName">Reviewer</option>
                  </select>
                </div>
                <div className="flex items-end">
                   <button onClick={clearFilters} className="w-full py-3 text-sm font-bold text-gray-400 hover:text-white transition-colors underline">Reset Filters</button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Table Container */}
      <div className="bg-gray-900/50 backdrop-blur-sm rounded-3xl border border-gray-800 overflow-hidden shadow-xl">
        {loading ? (
          <Loading text="Loading Reviews..." />
        ) : reviews.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-900/80 text-xs uppercase tracking-wider text-gray-500 font-bold border-b border-gray-800">
                    <th className="py-5 px-6">Reviewer</th>
                    <th className="py-5 px-6">Product</th>
                    <th className="py-5 px-6">Rating</th>
                    <th className="py-5 px-6">Status</th>
                    <th className="py-5 px-6">Date</th>
                    <th className="py-5 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/50">
                  {reviews.map((review, index) => (
                    <motion.tr
                      key={review._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="group border-b border-gray-800/50 hover:bg-gray-800/40 transition-colors"
                    >
                      {/* Reviewer */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#0295E6] to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                            {review.userName?.charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-white text-sm truncate">{review.userName}</p>
                            <p className="text-xs text-gray-500 truncate max-w-[150px]">{review.userEmail}</p>
                          </div>
                        </div>
                      </td>

                      {/* Product */}
                      <td className="py-4 px-6">
                         {review.product ? (
                            <Link href={`/admin/products/${review.product._id}`} className="group/link flex items-center gap-2">
                               <div className="w-8 h-8 rounded bg-gray-800 flex items-center justify-center text-gray-600">
                                  <FaBox size={12}/>
                               </div>
                               <span className="text-sm font-medium text-gray-300 group-hover/link:text-[#0295E6] transition-colors truncate max-w-[180px]">
                                  {review.product.title}
                               </span>
                            </Link>
                         ) : (
                            <span className="text-sm text-gray-600 italic">Product Deleted</span>
                         )}
                      </td>

                      {/* Rating */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-1.5">
                          <span className="text-yellow-400 font-bold font-mono">{review.rating}</span>
                          <FaStar className="text-yellow-400 text-xs" />
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wide border
                          ${review.status === 'approved' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 
                            review.status === 'rejected' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 
                            'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'}`}>
                          {review.status === 'approved' && <FaCheck size={10} />}
                          {review.status === 'rejected' && <FaTimes size={10} />}
                          {review.status === 'pending' && <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse"></span>}
                          {review.status}
                        </span>
                      </td>

                      {/* Date */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2 text-xs text-gray-400 font-medium">
                          <FaCalendarAlt />
                          <span>{formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })}</span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {review.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleApprove(review._id)}
                                disabled={processingId === review._id}
                                className="p-2 rounded-lg bg-gray-900 text-green-400 hover:text-white hover:bg-green-600 transition-colors"
                                title="Approve"
                              >
                                {processingId === review._id ? <FaSpinner className="animate-spin" /> : <FaCheck />}
                              </button>
                              <button
                                onClick={() => handleReject(review._id)}
                                disabled={processingId === review._id}
                                className="p-2 rounded-lg bg-gray-900 text-red-400 hover:text-white hover:bg-red-600 transition-colors"
                                title="Reject"
                              >
                                {processingId === review._id ? <FaSpinner className="animate-spin" /> : <FaTimes />}
                              </button>
                            </>
                          )}
                          <button
                            onClick={() => handleViewReview(review)}
                            className="p-2 rounded-lg bg-gray-900 text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
                            title="View Full Details"
                          >
                            <FaEye />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(review)}
                            className="p-2 rounded-lg bg-gray-900 text-red-400 hover:text-white hover:bg-red-600 transition-colors"
                            title="Delete"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-between items-center px-6 py-4 bg-gray-900/50 border-t border-gray-800">
                <span className="text-sm text-gray-500">Page {currentPage} of {totalPages}</span>
                <div className="flex gap-2">
                  <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg disabled:opacity-50 text-sm font-medium text-white">Prev</button>
                  <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg disabled:opacity-50 text-sm font-medium text-white">Next</button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20 flex flex-col items-center">
            <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mb-4 text-gray-600 text-3xl">
              <FaStar />
            </div>
            <h3 className="text-xl font-bold text-white">No Reviews found</h3>
            <p className="text-gray-500 mt-2">Adjust your filters or wait for new feedback.</p>
          </div>
        )}
      </div>

      {/* View Review Modal */}
      {showViewModal && selectedReview && (
        <ReviewModal
          isOpen={showViewModal}
          onClose={() => { setShowViewModal(false); setSelectedReview(null); }}
          review={selectedReview}
          onApprove={handleApprove}
          onReject={handleReject}
          onDelete={handleDeleteClick}
        />
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Review"
        message={`Are you sure you want to permanently delete this review from ${reviewToDelete?.userName}?`}
        type="danger"
      />
    </div>
  );
}