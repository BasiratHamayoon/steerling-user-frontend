'use client';

import { FaClock, FaCheckDouble, FaReply } from 'react-icons/fa';

export default function MessageItem({ message, isSelected, onClick }) {
  
  // Helper to format concise time
  const getTimeDisplay = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = (now - date) / (1000 * 60 * 60 * 24); // Days
    
    if (diff < 1) return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    if (diff < 7) return date.toLocaleDateString([], { weekday: 'short' });
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  const isUnread = message.status === 'unread';
  const isReplied = message.status === 'replied';

  return (
    <div 
      onClick={onClick}
      className={`
        relative p-4 border-b border-gray-800/50 cursor-pointer transition-all duration-200 group
        ${isSelected 
          ? 'bg-[#0295E6]/10 border-l-4 border-l-[#0295E6]' 
          : 'hover:bg-gray-800/50 border-l-4 border-l-transparent'
        }
      `}
    >
      {/* Unread Indicator Dot */}
      {isUnread && (
        <div className="absolute top-4 right-4 w-2.5 h-2.5 bg-[#0295E6] rounded-full shadow-[0_0_8px_#0295E6]" />
      )}

      <div className="flex justify-between items-start mb-1">
        <h4 className={`text-sm truncate pr-6 ${isUnread ? 'font-bold text-white' : 'font-medium text-gray-300'}`}>
          {message.name || 'Anonymous'}
        </h4>
        <span className={`text-[10px] whitespace-nowrap ${isUnread ? 'text-[#0295E6]' : 'text-gray-500'}`}>
          {getTimeDisplay(message.createdAt)}
        </span>
      </div>

      <p className={`text-xs line-clamp-2 leading-relaxed mb-2 ${isUnread ? 'text-gray-300' : 'text-gray-500'}`}>
        {message.message}
      </p>

      <div className="flex items-center gap-3">
        {/* Reply Status Icon */}
        {isReplied ? (
          <div className="flex items-center gap-1 text-[10px] text-green-400 bg-green-400/10 px-1.5 py-0.5 rounded">
            <FaCheckDouble /> Replied
          </div>
        ) : (
          message.replies?.length > 0 && (
             <div className="flex items-center gap-1 text-[10px] text-blue-400 bg-blue-400/10 px-1.5 py-0.5 rounded">
               <FaReply /> {message.replies.length}
             </div>
          )
        )}
      </div>
    </div>
  );
}