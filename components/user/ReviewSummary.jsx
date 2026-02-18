'use client';

import { motion } from 'framer-motion';
import { FaStar, FaStarHalfAlt, FaRegStar, FaPen } from 'react-icons/fa';

export default function ReviewSummary({ stats, onWriteReview }) {
  if (!stats) return null;

  const { average = 0, total = 0, distribution = {} } = stats;

  const RatingStars = ({ rating }) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <div className="flex text-yellow-400 text-lg gap-0.5">
        {[...Array(fullStars)].map((_, i) => <FaStar key={`full-${i}`} />)}
        {hasHalfStar && <FaStarHalfAlt />}
        {[...Array(emptyStars)].map((_, i) => <FaRegStar key={`empty-${i}`} className="text-gray-600" />)}
      </div>
    );
  };

  return (
    <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-6 lg:p-8 sticky top-24">
      <h3 className="text-xl font-bold text-white mb-6">Customer Reviews</h3>

      <div className="flex items-center gap-4 mb-8">
        <div className="text-5xl font-extrabold text-white">{average.toFixed(1)}</div>
        <div className="flex flex-col">
          <RatingStars rating={average} />
          <span className="text-gray-400 text-sm mt-1">{total} Verification Reviews</span>
        </div>
      </div>

      <div className="space-y-3 mb-8">
        {[5, 4, 3, 2, 1].map((star) => {
          const count = distribution[star] || 0;
          const percentage = total > 0 ? (count / total) * 100 : 0;

          return (
            <div key={star} className="flex items-center gap-3 text-sm">
              <span className="text-gray-400 font-medium w-3">{star}</span>
              <FaStar className="text-gray-600 w-4" />
              <div className="flex-1 h-2.5 bg-gray-800 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  whileInView={{ width: `${percentage}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="h-full bg-[#0295E6] rounded-full"
                />
              </div>
              <span className="text-gray-500 w-8 text-right">{Math.round(percentage)}%</span>
            </div>
          );
        })}
      </div>

      <button
        onClick={onWriteReview}
        className="w-full py-3.5 rounded-xl bg-white text-black font-bold hover:bg-gray-200 transition-all flex items-center justify-center gap-2 shadow-lg shadow-white/5"
      >
        <FaPen className="text-sm" /> Write a Review
      </button>
    </div>
  );
}