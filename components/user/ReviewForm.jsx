'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaStar, FaTimes, FaSpinner, FaExclamationCircle, FaCheckCircle } from 'react-icons/fa';
import reviewService from '@/services/reviewService';

export default function ReviewForm({ productId, productTitle, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    userName: '',
    userEmail: '',
    rating: 0,
    comment: ''
  });
  
  const [hoverRating, setHoverRating] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false); // New Success State

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // --- Client Validation ---
    if (!formData.rating) return setError('Please select a star rating.');
    if (!formData.userName || formData.userName.trim().length < 2) return setError('Name must be at least 2 characters.');
    if (!formData.comment || formData.comment.trim().length < 5) return setError('Review must be at least 5 characters.');
    if (!formData.userEmail || !formData.userEmail.includes('@')) return setError('Invalid email address.');

    try {
      setLoading(true);

      const payload = {
        productId,
        userName: formData.userName.trim(),
        userEmail: formData.userEmail.trim().toLowerCase(),
        rating: Number(formData.rating), 
        comment: formData.comment.trim()
      };

      const response = await reviewService.createReview(payload);

      if (response.success) {
        setIsSuccess(true); // Show Success Screen
        setTimeout(() => {
          onSuccess(); // Close modal after delay
        }, 3000);
      } else {
        setError(response.message || 'Failed to submit review');
      }
    } catch (err) {
      const serverMessage = err.response?.data?.message || 'Submission failed. Please check your inputs.';
      setError(serverMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-gray-900 w-full max-w-lg rounded-2xl border border-gray-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh] relative"
          onClick={e => e.stopPropagation()}
        >
          {/* SUCCESS VIEW */}
          {isSuccess ? (
            <div className="flex flex-col items-center justify-center p-12 text-center h-full min-h-[400px]">
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', damping: 12 }}
                className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mb-6"
              >
                <FaCheckCircle className="text-5xl text-green-500" />
              </motion.div>
              <h3 className="text-2xl font-bold text-white mb-2">Thank You!</h3>
              <p className="text-gray-400">Your review has been submitted successfully and is pending approval.</p>
            </div>
          ) : (
            /* FORM VIEW */
            <>
              {/* Header */}
              <div className="flex justify-between items-center p-5 border-b border-gray-800 bg-gray-900/50">
                <div>
                  <h3 className="text-xl font-bold text-white">Write a Review</h3>
                  <p className="text-xs text-gray-500 mt-1 truncate max-w-[250px]">{productTitle}</p>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-gray-800 rounded-full text-gray-400 hover:text-white transition-colors">
                  <FaTimes />
                </button>
              </div>

              {/* Form Content */}
              <div className="overflow-y-auto p-6 custom-scrollbar">
                <form onSubmit={handleSubmit} className="space-y-6">
                  
                  {/* Rating Section */}
                  <div className="flex flex-col items-center justify-center pb-2">
                    <label className="text-sm text-gray-400 mb-3 font-medium">Click stars to rate</label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setFormData({ ...formData, rating: star })}
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          className="p-1 transition-transform hover:scale-110 focus:outline-none"
                        >
                          <FaStar 
                            className={`text-3xl ${star <= (hoverRating || formData.rating) ? 'text-yellow-400' : 'text-gray-700'}`} 
                          />
                        </button>
                      ))}
                    </div>
                    {formData.rating > 0 && (
                      <span className="text-xs text-yellow-500 mt-2 font-medium">
                        {formData.rating === 5 ? 'Excellent!' : formData.rating === 4 ? 'Good' : 'Average'}
                      </span>
                    )}
                  </div>

                  {/* Inputs */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Your Name <span className="text-red-500">*</span></label>
                      <input
                        type="text"
                        required
                        className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-3 text-sm text-white focus:border-[#0295E6] outline-none transition-all placeholder-gray-600"
                        placeholder="e.g. John Doe"
                        value={formData.userName}
                        onChange={e => setFormData({...formData, userName: e.target.value})}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Email Address <span className="text-red-500">*</span></label>
                      <input
                        type="email"
                        required
                        className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-3 text-sm text-white focus:border-[#0295E6] outline-none transition-all placeholder-gray-600"
                        placeholder="john@example.com"
                        value={formData.userEmail}
                        onChange={e => setFormData({...formData, userEmail: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Review <span className="text-red-500">*</span></label>
                    <textarea
                      required
                      rows="4"
                      className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-3 text-sm text-white focus:border-[#0295E6] outline-none transition-all resize-none placeholder-gray-600"
                      placeholder="Tell us what you liked or disliked..."
                      value={formData.comment}
                      onChange={e => setFormData({...formData, comment: e.target.value})}
                    ></textarea>
                  </div>

                  {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-3 rounded-lg flex items-start gap-2">
                      <FaExclamationCircle className="mt-0.5 shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#0295E6] hover:bg-[#0284cc] text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading ? <><FaSpinner className="animate-spin" /> Submitting...</> : 'Submit Review'}
                  </button>
                </form>
              </div>
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}