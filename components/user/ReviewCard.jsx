'use client';

import { motion } from 'framer-motion';
import { FaStar, FaRegStar } from 'react-icons/fa';
import { formatDistanceToNow } from 'date-fns';

export default function ReviewCard({ review }) {
  const getInitials = (name) => name?.substring(0, 2).toUpperCase() || '??';
  
  const date = review.createdAt 
    ? formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })
    : 'Recently';

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-4 hover:border-[#0295E6]/30 transition-colors"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0295E6] to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-inner">
            {getInitials(review.userName)}
          </div>
          <div>
            <h4 className="font-semibold text-white text-sm">{review.userName}</h4>
            <div className="flex text-yellow-400 text-xs mt-0.5 gap-0.5">
              {[...Array(5)].map((_, i) => (
                i < review.rating ? <FaStar key={i} /> : <FaRegStar key={i} className="text-gray-700" />
              ))}
            </div>
          </div>
        </div>
        <span className="text-xs text-gray-500">{date}</span>
      </div>

      <p className="text-gray-300 text-sm leading-relaxed">
        {review.comment}
      </p>

      {review.status === 'pending' && (
        <div className="mt-4 inline-block px-2 py-1 bg-yellow-500/10 text-yellow-500 text-[10px] rounded border border-yellow-500/20 uppercase tracking-wider font-bold">
          Pending Approval
        </div>
      )}
    </motion.div>
  );
}