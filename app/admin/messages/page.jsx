'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaEnvelope, FaUser, FaClock, FaCheck, FaReply, FaTrash, FaPaperPlane, FaSearch, FaFilter } from 'react-icons/fa';
import { useAppContext } from '@/context/AppContext';
import ConfirmationModal from '@/components/admin/ConfirmationModal';
import MessageItem from '@/components/admin/MessageItem';
import Loading from '@/components/ui/Loading';

export default function AdminMessagesPage() {
  const {
    messages, messagesLoading, messagesPagination, unreadMessagesCount,
    fetchMessages, replyToMessage, updateMessageStatus, deleteMessage
  } = useAppContext();

  const [localMessages, setLocalMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [sendingReply, setSendingReply] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [messageToDelete, setMessageToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');

  // Initial Load
  useEffect(() => {
    loadMessages();
  }, [currentPage]);

  const loadMessages = async () => {
    await fetchMessages({ page: currentPage, limit: 20, sortBy: 'createdAt', sortOrder: 'desc' });
  };

  // Sync State
  useEffect(() => {
    if (messages) {
      setLocalMessages(messages);
      // Auto-select first message on desktop if none selected
      if (!selectedMessage && messages.length > 0 && window.innerWidth >= 1024) {
        handleSelectMessage(messages[0]);
      }
    }
  }, [messages]);

  // Handlers
  const handleSelectMessage = async (message) => {
    setSelectedMessage(message);
    if (message.status === 'unread') {
      try {
        await updateMessageStatus(message._id, 'read');
        setLocalMessages(prev => prev.map(msg => msg._id === message._id ? { ...msg, status: 'read' } : msg));
      } catch (error) { console.error(error); }
    }
  };

  const handleMarkAsReplied = async () => {
    if (!selectedMessage) return;
    try {
      await updateMessageStatus(selectedMessage._id, 'replied');
      const updatedMsg = { ...selectedMessage, status: 'replied' };
      setLocalMessages(prev => prev.map(msg => msg._id === selectedMessage._id ? updatedMsg : msg));
      setSelectedMessage(updatedMsg);
    } catch (error) { console.error(error); }
  };

  const handleDeleteClick = (message) => { setMessageToDelete(message); setShowDeleteModal(true); };

  const handleDeleteConfirm = async () => {
    if (messageToDelete) {
      await deleteMessage(messageToDelete._id);
      setShowDeleteModal(false);
      setMessageToDelete(null);
      setLocalMessages(prev => prev.filter(msg => msg._id !== messageToDelete._id));
      if (selectedMessage?._id === messageToDelete._id) setSelectedMessage(null);
    }
  };

  const handleSendReply = async () => {
    if (!replyText.trim() || !selectedMessage) return;
    setSendingReply(true);
    try {
      const response = await replyToMessage(selectedMessage._id, { reply: replyText, sendEmail: true });
      if (response.success && response.data) {
        setSelectedMessage(response.data);
        setLocalMessages(prev => prev.map(msg => msg._id === selectedMessage._id ? response.data : msg));
        setReplyText('');
      }
    } catch (error) { console.error(error); } 
    finally { setSendingReply(false); }
  };

  // UI Helpers
  const formatDate = (date) => new Date(date).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  const filteredMessages = localMessages.filter(msg => 
    msg.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    msg.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (messagesLoading && localMessages.length === 0) return <Loading text="Loading Inbox..." />;

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col gap-6">
      {/* Header */}
      <div className="flex justify-between items-end pb-4 border-b border-gray-800">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight mb-1">Inbox</h1>
          <p className="text-gray-400 text-sm">Customer inquiries & support tickets</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl flex items-center px-4 py-2">
           <FaEnvelope className="text-[#0295E6] mr-2" />
           <span className="text-white font-bold mr-1">{unreadMessagesCount}</span>
           <span className="text-gray-500 text-sm">Unread</span>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-0">
        
        {/* Left: Message List */}
        <div className="lg:col-span-4 flex flex-col bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-800 overflow-hidden">
          {/* Search Bar */}
          <div className="p-4 border-b border-gray-800 bg-gray-900/80 backdrop-blur">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input 
                type="text" 
                placeholder="Search messages..." 
                className="w-full bg-gray-950 border border-gray-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#0295E6] transition-colors"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {filteredMessages.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <p>No messages found</p>
              </div>
            ) : (
              filteredMessages.map((message) => (
                <MessageItem
                  key={message._id}
                  message={message}
                  isSelected={selectedMessage?._id === message._id}
                  onClick={() => handleSelectMessage(message)}
                />
              ))
            )}
          </div>

          {/* Pagination */}
          {messagesPagination?.totalPages > 1 && (
            <div className="p-3 border-t border-gray-800 flex justify-between bg-gray-900/80">
               <button onClick={() => setCurrentPage(p => Math.max(1, p-1))} disabled={currentPage===1} className="px-3 py-1.5 text-xs bg-gray-800 rounded-lg hover:bg-gray-700 disabled:opacity-50">Prev</button>
               <span className="text-xs text-gray-500 self-center">Page {currentPage}</span>
               <button onClick={() => setCurrentPage(p => Math.min(messagesPagination.totalPages, p+1))} disabled={currentPage===messagesPagination.totalPages} className="px-3 py-1.5 text-xs bg-gray-800 rounded-lg hover:bg-gray-700 disabled:opacity-50">Next</button>
            </div>
          )}
        </div>

        {/* Right: Message Detail */}
        <div className="lg:col-span-8 flex flex-col bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden relative shadow-2xl">
          {selectedMessage ? (
            <>
              {/* Detail Header */}
              <div className="p-6 border-b border-gray-800 bg-gray-900/95 backdrop-blur flex justify-between items-start z-10">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#0295E6] to-[#0077b6] rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                    {selectedMessage.name?.charAt(0).toUpperCase() || '?'}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">{selectedMessage.name}</h2>
                    <p className="text-sm text-gray-400">{selectedMessage.email}</p>
                    <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                       <span className="flex items-center gap-1"><FaClock /> {formatDate(selectedMessage.createdAt)}</span>
                       {selectedMessage.phone && <span>• {selectedMessage.phone}</span>}
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <button onClick={handleMarkAsReplied} className="p-2.5 bg-gray-800 hover:bg-green-900/30 text-gray-400 hover:text-green-400 rounded-xl transition-colors" title="Mark Replied">
                    <FaCheck />
                  </button>
                  <button onClick={() => handleDeleteClick(selectedMessage)} className="p-2.5 bg-gray-800 hover:bg-red-900/30 text-gray-400 hover:text-red-400 rounded-xl transition-colors" title="Delete">
                    <FaTrash />
                  </button>
                </div>
              </div>

              {/* Chat Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-950/50 custom-scrollbar">
                
                {/* Customer Message */}
                <div className="flex gap-4">
                   <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 flex-shrink-0 mt-1"><FaUser size={12} /></div>
                   <div className="bg-gray-800 rounded-2xl rounded-tl-none p-4 max-w-[85%] text-gray-200 leading-relaxed shadow-sm border border-gray-700">
                      {selectedMessage.message}
                   </div>
                </div>

                {/* Replies History */}
                {selectedMessage.replies?.map((reply, i) => (
                  <div key={i} className="flex gap-4 flex-row-reverse">
                     <div className="w-8 h-8 rounded-full bg-[#0295E6] flex items-center justify-center text-white flex-shrink-0 mt-1"><FaUser size={12} /></div>
                     <div className="bg-[#0295E6]/10 border border-[#0295E6]/20 rounded-2xl rounded-tr-none p-4 max-w-[85%] text-white leading-relaxed shadow-sm">
                        <p>{reply.message}</p>
                        <div className="mt-2 flex items-center justify-end gap-2 text-[10px] text-blue-300/60">
                           <span>{formatDate(reply.repliedAt)}</span>
                           {reply.emailSent && <span>• Emailed</span>}
                        </div>
                     </div>
                  </div>
                ))}
              </div>

              {/* Reply Input Area */}
              <div className="p-4 border-t border-gray-800 bg-gray-900 z-10">
                <div className="relative">
                  <textarea
                    className="w-full bg-gray-950 border border-gray-800 rounded-xl pl-4 pr-12 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-[#0295E6] resize-none h-24 transition-all"
                    placeholder="Type your reply here..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                  />
                  <button 
                    onClick={handleSendReply}
                    disabled={!replyText.trim() || sendingReply}
                    className="absolute right-3 bottom-3 p-2 bg-[#0295E6] hover:bg-[#027ab5] text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                  >
                    {sendingReply ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <FaPaperPlane />}
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-2 ml-1 flex items-center gap-1">
                  <FaReply /> This will send an email notification to the customer.
                </p>
              </div>
            </>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-gray-500 bg-gray-950/50">
              <div className="w-20 h-20 bg-gray-900 rounded-full flex items-center justify-center mb-4 shadow-inner border border-gray-800">
                <FaEnvelope className="text-3xl opacity-20" />
              </div>
              <h3 className="text-lg font-bold text-gray-400">Select a Message</h3>
              <p className="text-sm">Choose from the list on the left to view details.</p>
            </div>
          )}
        </div>
      </div>

      <ConfirmationModal 
        isOpen={showDeleteModal} 
        onClose={() => setShowDeleteModal(false)} 
        onConfirm={handleDeleteConfirm}
        title="Delete Message" 
        message="This action cannot be undone." 
        type="danger" 
      />
    </div>
  );
}