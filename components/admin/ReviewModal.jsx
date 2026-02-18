'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaTimes, FaStar, FaRegStar, FaStarHalfAlt, FaUser, 
  FaEnvelope, FaCalendarAlt, FaBox, FaCheck, FaBan,
  FaTrash, FaExternalLinkAlt, FaSpinner
} from 'react-icons/fa';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';
import { useState } from 'react';

export default function ReviewModal({ isOpen, onClose, review, onApprove, onReject, onDelete }) {
  const [processing, setProcessing] = useState(false);

  if (!review) return null;

  const handleApprove = async () => {
    setProcessing(true);
    await onApprove(review._id);
    setProcessing(false);
    onClose();
  };

  const handleReject = async () => {
    setProcessing(true);
    await onReject(review._id);
    setProcessing(false);
    onClose();
  };

  const handleDelete = () => {
    onDelete(review);
    onClose();
  };

  // Rating stars component
  const RatingStars = ({ rating, size = 'text-lg' }) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <div className="flex items-center gap-1">
        {[...Array(fullStars)].map((_, i) => (
          <FaStar key={`full-${i}`} className={`${size} text-yellow-400`} />
        ))}
        {hasHalfStar && <FaStarHalfAlt className={`${size} text-yellow-400`} />}
        {[...Array(emptyStars)].map((_, i) => (
          <FaRegStar key={`empty-${i}`} className={`${size} text-gray-600`} />
        ))}
      </div>
    );
  };

  const getStatusBadge = () => {
    switch(review.status) {
      case 'pending':
        return <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-xs font-medium border border-yellow-500/30">Pending</span>;
      case 'approved':
        return <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-medium border border-green-500/30">Approved</span>;
      case 'rejected':
        return <span className="px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-xs font-medium border border-red-500/30">Rejected</span>;
      default:
        return null;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="bg-gradient-to-br from-gray-900 to-gray-950 rounded-2xl border border-gray-800 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 bg-gray-900/95 backdrop-blur-md border-b border-gray-800 p-6 flex items-center justify-between z-10">
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-bold text-white">Review Details</h2>
                {getStatusBadge()}
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
              >
                <FaTimes className="text-gray-400" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Reviewer Info */}
              <div className="bg-gray-800/30 rounded-xl p-5 border border-gray-700/50">
                <h3 className="text-sm font-medium text-gray-400 mb-4 flex items-center gap-2">
                  <FaUser className="text-[#0295E6]" />
                  Reviewer Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Name</p>
                    <p className="text-white font-medium">{review.userName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Email</p>
                    <a href={`mailto:${review.userEmail}`} className="text-[#0295E6] hover:underline">
                      {review.userEmail}
                    </a>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Submitted</p>
                    <p className="text-white flex items-center gap-2">
                      <FaCalendarAlt className="text-xs text-gray-500" />
                      {formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Last Updated</p>
                    <p className="text-white flex items-center gap-2">
                      <FaCalendarAlt className="text-xs text-gray-500" />
                      {formatDistanceToNow(new Date(review.updatedAt), { addSuffix: true })}
                    </p>
                  </div>
                </div>
              </div>

              {/* Product Info */}
              {review.product && (
                <div className="bg-gray-800/30 rounded-xl p-5 border border-gray-700/50">
                  <h3 className="text-sm font-medium text-gray-400 mb-4 flex items-center gap-2">
                    <FaBox className="text-[#0295E6]" />
                    Product Information
                  </h3>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-800 border border-gray-700">
                      <img
                        src={review.product.images?.[0] ? `/uploads/products/${review.product.images[0]}` : '/placeholder-product.jpg'}
                        alt={review.product.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <Link href={`/admin/products/${review.product._id}`} className="text-white font-bold hover:text-[#0295E6] transition-colors flex items-center gap-1">
                        {review.product.title}
                        <FaExternalLinkAlt className="text-xs" />
                      </Link>
                      <p className="text-sm text-gray-500 mt-1">Model: {review.product.model}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Review Content */}
              <div className="bg-gray-800/30 rounded-xl p-5 border border-gray-700/50">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-gray-400 flex items-center gap-2">
                    <FaStar className="text-yellow-400" />
                    Review Content
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="text-yellow-400 font-bold text-lg">{review.rating}</span>
                    <RatingStars rating={review.rating} size="text-lg" />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-2">Comment</p>
                    <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700">
                      <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                        {review.comment}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                {review.status === 'pending' && (
                  <>
                    <button
                      onClick={handleApprove}
                      disabled={processing}
                      className="flex-1 bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {processing ? <FaSpinner className="animate-spin" /> : <FaCheck />}
                      Approve Review
                    </button>
                    <button
                      onClick={handleReject}
                      disabled={processing}
                      className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white py-3 rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {processing ? <FaSpinner className="animate-spin" /> : <FaBan />}
                      Reject Review
                    </button>
                  </>
                )}
                <button
                  onClick={handleDelete}
                  disabled={processing}
                  className={`${
                    review.status === 'pending' ? 'flex-1' : 'w-full'
                  } bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 py-3 rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2`}
                >
                  <FaTrash />
                  Delete Review
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}