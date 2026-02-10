'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaEnvelope, FaUser, FaClock, FaCheck, FaReply, FaTrash } from 'react-icons/fa';
import { useAppContext } from '@/context/AppContext';
import ConfirmationModal from '@/components/admin/ConfirmationModal';

export default function AdminMessagesPage() {
  const {
    messages,
    messagesLoading,
    messagesPagination,
    unreadMessagesCount,
    fetchMessages,
    fetchMessageById,
    replyToMessage,
    updateMessageStatus,
    deleteMessage
  } = useAppContext();

  const [localMessages, setLocalMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [sendingReply, setSendingReply] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [messageToDelete, setMessageToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Load messages on component mount
  useEffect(() => {
    loadMessages();
  }, [currentPage]);

  const loadMessages = async () => {
    await fetchMessages({
      page: currentPage,
      limit: 20,
      sortBy: 'createdAt',
      sortOrder: 'desc'
    });
  };

  // Update local messages when context messages change
  useEffect(() => {
    if (messages && messages.length > 0) {
      setLocalMessages(messages);
      if (!selectedMessage && messages.length > 0) {
        setSelectedMessage(messages[0]);
      }
    } else {
      setLocalMessages([]);
      setSelectedMessage(null);
    }
  }, [messages]);

  const handleSelectMessage = async (message) => {
    setSelectedMessage(message);
    
    // Mark as read if unread
    if (message.status === 'unread') {
      try {
        await updateMessageStatus(message._id, 'read');
        // Update local state
        setLocalMessages(prev => prev.map(msg => 
          msg._id === message._id ? { ...msg, status: 'read' } : msg
        ));
      } catch (error) {
        console.error('Error marking as read:', error);
      }
    }
  };

  const handleMarkAsReplied = async () => {
    if (!selectedMessage) return;
    
    try {
      await updateMessageStatus(selectedMessage._id, 'replied');
      setLocalMessages(prev => prev.map(msg => 
        msg._id === selectedMessage._id ? { ...msg, status: 'replied' } : msg
      ));
      setSelectedMessage(prev => prev ? { ...prev, status: 'replied' } : null);
    } catch (error) {
      console.error('Error marking as replied:', error);
    }
  };

  const handleDeleteClick = (message) => {
    setMessageToDelete(message);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (messageToDelete) {
      try {
        await deleteMessage(messageToDelete._id);
        setShowDeleteModal(false);
        setMessageToDelete(null);
        
        // Remove from local messages
        setLocalMessages(prev => prev.filter(msg => msg._id !== messageToDelete._id));
        
        // If the deleted message was selected, select another one
        if (selectedMessage && selectedMessage._id === messageToDelete._id) {
          const remainingMessages = localMessages.filter(msg => msg._id !== messageToDelete._id);
          setSelectedMessage(remainingMessages.length > 0 ? remainingMessages[0] : null);
        }
      } catch (error) {
        console.error('Error deleting message:', error);
      }
    }
  };

  const handleSendReply = async () => {
    if (!replyText.trim() || !selectedMessage) return;
    
    try {
      setSendingReply(true);
      const response = await replyToMessage(selectedMessage._id, {
        reply: replyText,
        sendEmail: true
      });
      
      if (response.success) {
        // Update the selected message with the reply
        if (response.data) {
          setSelectedMessage(response.data);
          setLocalMessages(prev => prev.map(msg => 
            msg._id === selectedMessage._id ? response.data : msg
          ));
        }
        
        setReplyText('');
        // Mark as replied after sending reply
        handleMarkAsReplied();
      }
    } catch (error) {
      console.error('Error sending reply:', error);
    } finally {
      setSendingReply(false);
    }
  };

  // Format date to match your UI
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).replace(',', '').replace(/\//g, '-');
  };

  // Get time ago for display
  const getTimeAgo = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      if (diffInHours < 1) {
        const minutes = Math.floor(diffInHours * 60);
        return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
      }
      return `${Math.floor(diffInHours)} hour${Math.floor(diffInHours) !== 1 ? 's' : ''} ago`;
    }
    return formatDate(dateString);
  };

  // Show loading state
  if (messagesLoading && localMessages.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Customer Messages</h1>
          <p className="text-gray-400">Manage and respond to customer inquiries</p>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-gray-600 border-t-[#0295E6] rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-400">Loading messages...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Customer Messages</h1>
        <p className="text-gray-400">Manage and respond to customer inquiries</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Messages List */}
        <div className="lg:col-span-1">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/30">
            <div className="p-4 border-b border-gray-700/30">
              <h2 className="font-semibold flex items-center gap-2">
                <FaEnvelope />
                All Messages ({messagesPagination?.total || localMessages.length})
                {unreadMessagesCount > 0 && (
                  <span className="ml-2 bg-red-500 text-white text-xs rounded-full px-2 py-1">
                    {unreadMessagesCount} unread
                  </span>
                )}
              </h2>
            </div>
            <div className="max-h-[600px] overflow-y-auto">
              {localMessages.length === 0 ? (
                <div className="p-8 text-center">
                  <FaEnvelope className="text-4xl text-gray-500 mx-auto mb-4" />
                  <p className="text-gray-400">No messages found</p>
                </div>
              ) : (
                localMessages.map((message) => (
                  <motion.div
                    key={message._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    onClick={() => handleSelectMessage(message)}
                    className={`p-4 border-b border-gray-700/30 cursor-pointer transition-all hover:bg-gray-700/20 ${
                      selectedMessage?._id === message._id ? 'bg-gradient-to-r from-[#0295E6]/10 to-[#02b3e6]/5' : ''
                    } ${message.status === 'unread' ? 'border-l-4 border-[#0295E6]' : ''}`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold">{message.name || 'Anonymous'}</h3>
                        <p className="text-sm text-gray-400">{message.email}</p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        message.status === 'unread' ? 'bg-blue-900/30 text-blue-300' :
                        message.status === 'replied' ? 'bg-green-900/30 text-green-300' :
                        'bg-gray-700/50 text-gray-400'
                      }`}>
                        {message.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-300 line-clamp-2 mb-2">
                      {message.message}
                    </p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <FaClock />
                        {getTimeAgo(message.createdAt)}
                      </div>
                      {message.status === 'unread' && (
                        <span className="w-2 h-2 bg-[#0295E6] rounded-full animate-pulse" />
                      )}
                      {message.replies && message.replies.length > 0 && (
                        <span className="text-blue-400 flex items-center gap-1">
                          <FaReply className="text-xs" />
                          {message.replies.length}
                        </span>
                      )}
                    </div>
                  </motion.div>
                ))
              )}
            </div>
            
            {/* Pagination */}
            {messagesPagination && messagesPagination.totalPages > 1 && (
              <div className="p-4 border-t border-gray-700/30 flex items-center justify-center gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1 || messagesLoading}
                  className={`px-3 py-2 rounded-lg transition-colors ${
                    currentPage === 1
                      ? 'bg-gray-800/30 text-gray-500 cursor-not-allowed'
                      : 'bg-gray-800 hover:bg-gray-700'
                  }`}
                >
                  Previous
                </button>
                <span className="text-sm text-gray-400">
                  Page {currentPage} of {messagesPagination.totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(messagesPagination.totalPages, prev + 1))}
                  disabled={currentPage === messagesPagination.totalPages || messagesLoading}
                  className={`px-3 py-2 rounded-lg transition-colors ${
                    currentPage === messagesPagination.totalPages
                      ? 'bg-gray-800/30 text-gray-500 cursor-not-allowed'
                      : 'bg-gray-800 hover:bg-gray-700'
                  }`}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Message Details */}
        <div className="lg:col-span-2">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/30 h-full">
            {selectedMessage ? (
              <div className="h-full flex flex-col">
                <div className="p-6 border-b border-gray-700/30">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-12 h-12 bg-gradient-to-br from-[#0295E6] to-[#02b3e6] rounded-full flex items-center justify-center">
                          <FaUser className="text-xl text-white" />
                        </div>
                        <div>
                          <h2 className="text-xl font-bold">{selectedMessage.name || 'Anonymous'}</h2>
                          <p className="text-gray-400">{selectedMessage.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-400">
                        {selectedMessage.phone && (
                          <span>Phone: {selectedMessage.phone}</span>
                        )}
                        <span>Date: {formatDate(selectedMessage.createdAt)}</span>
                        {selectedMessage.readAt && (
                          <span>Read: {getTimeAgo(selectedMessage.readAt)}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleMarkAsReplied}
                        className="p-2 hover:bg-blue-900/30 rounded-lg transition-colors"
                        title="Mark as replied"
                      >
                        <FaCheck className="text-blue-400" />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(selectedMessage)}
                        className="p-2 hover:bg-red-900/30 rounded-lg transition-colors"
                        title="Delete message"
                      >
                        <FaTrash className="text-red-400" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex-1 p-6 overflow-y-auto">
                  {/* Original Message */}
                  <div className="mb-8">
                    <h3 className="font-semibold mb-2 flex items-center gap-2">
                      <FaEnvelope />
                      Message Content
                    </h3>
                    <div className="p-4 bg-gray-900/50 rounded-xl">
                      <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                        {selectedMessage.message}
                      </p>
                    </div>
                  </div>

                  {/* Replies Section */}
                  {selectedMessage.replies && selectedMessage.replies.length > 0 && (
                    <div className="mb-8">
                      <h3 className="font-semibold mb-4 flex items-center gap-2">
                        <FaReply />
                        Previous Replies ({selectedMessage.replies.length})
                      </h3>
                      <div className="space-y-4">
                        {selectedMessage.replies.map((reply, index) => (
                          <div key={index} className="bg-blue-900/10 border border-blue-500/20 rounded-xl p-4">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
                                  <FaUser className="text-blue-400 text-sm" />
                                </div>
                                <span className="font-medium">
                                  {reply.repliedBy?.name || 'Admin'}
                                </span>
                              </div>
                              <span className="text-xs text-gray-400">
                                {getTimeAgo(reply.repliedAt)}
                              </span>
                            </div>
                            <p className="text-gray-300 whitespace-pre-wrap">{reply.message}</p>
                            {reply.emailSent && (
                              <div className="mt-2 text-xs text-green-400">
                                ✓ Email sent to customer
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Reply Form */}
                  <div>
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                      <FaReply />
                      Reply to Customer
                    </h3>
                    <textarea
                      className="w-full h-32 px-4 py-3 bg-gray-800/50 rounded-xl border border-gray-700 focus:border-[#0295E6] focus:outline-none focus:ring-2 focus:ring-[#0295E6]/30 mb-4"
                      placeholder="Type your reply here..."
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      disabled={sendingReply}
                    />
                    <div className="flex justify-end">
                      <button
                        onClick={handleSendReply}
                        disabled={!replyText.trim() || sendingReply}
                        className="flex items-center gap-2 bg-gradient-to-r from-[#0295E6] to-[#02b3e6] hover:from-[#0284c6] hover:to-[#0295E6] text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                      >
                        {sendingReply ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Sending...
                          </>
                        ) : (
                          <>
                            <FaReply />
                            Send Reply via Email
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center p-8">
                <div className="text-center">
                  <FaEnvelope className="text-4xl text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400">Select a message to view details</p>
                  {localMessages.length === 0 && (
                    <p className="text-sm text-gray-500 mt-1">
                      No messages in your inbox
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Confirmation Modal for Delete */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setMessageToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
        title="Delete Message"
        message={`Are you sure you want to delete this message from "${messageToDelete?.name}"? This action cannot be undone.`}
        type="danger"
      />
    </div>
  );
}