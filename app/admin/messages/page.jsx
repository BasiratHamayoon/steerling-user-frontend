'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaEnvelope, FaUser, FaClock, FaCheck, FaReply, FaTrash } from 'react-icons/fa';

const initialMessages = [
  { 
    id: 1, 
    name: 'John Doe', 
    email: 'john@example.com', 
    phone: '+1234567890',
    message: 'Hello, I am interested in the Pro Racer GT steering wheel. Do you offer installation services?',
    date: '2024-01-15 14:30',
    status: 'unread',
    read: false 
  },
  { 
    id: 2, 
    name: 'Jane Smith', 
    email: 'jane@example.com', 
    phone: '+1234567891',
    message: 'I would like to know if the Luxury Elite comes in different colors?',
    date: '2024-01-15 10:15',
    status: 'read',
    read: true 
  },
  { 
    id: 3, 
    name: 'Robert Johnson', 
    email: 'robert@example.com', 
    phone: '+1234567892',
    message: 'Can you provide bulk pricing for 10+ units of the Sports Carbon?',
    date: '2024-01-14 16:45',
    status: 'read',
    read: true 
  },
  { 
    id: 4, 
    name: 'Emily Davis', 
    email: 'emily@example.com', 
    phone: '+1234567893',
    message: 'Do you ship internationally? I am from Canada.',
    date: '2024-01-14 09:20',
    status: 'replied',
    read: true 
  },
  { 
    id: 5, 
    name: 'Michael Brown', 
    email: 'michael@example.com', 
    phone: '+1234567894',
    message: 'I need a custom steering wheel for my vintage car. Can you help?',
    date: '2024-01-13 11:30',
    status: 'replied',
    read: true 
  },
];

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState(initialMessages);
  const [selectedMessage, setSelectedMessage] = useState(initialMessages[0]);
  const [replyText, setReplyText] = useState('');

  const handleMarkAsRead = (id) => {
    setMessages(messages.map(msg =>
      msg.id === id ? { ...msg, status: 'read', read: true } : msg
    ));
    if (selectedMessage.id === id) {
      setSelectedMessage({...selectedMessage, status: 'read', read: true});
    }
  };

  const handleMarkAsReplied = (id) => {
    setMessages(messages.map(msg =>
      msg.id === id ? { ...msg, status: 'replied' } : msg
    ));
    if (selectedMessage.id === id) {
      setSelectedMessage({...selectedMessage, status: 'replied'});
    }
    alert('Marked as replied!');
  };

  const handleDeleteMessage = (id) => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      setMessages(messages.filter(msg => msg.id !== id));
      if (selectedMessage.id === id) {
        setSelectedMessage(messages.find(msg => msg.id !== id) || messages[1]);
      }
    }
  };

  const handleSendReply = () => {
    if (!replyText.trim()) return;
    
    // In a real app, this would send an email
    console.log('Sending reply to:', selectedMessage.email);
    console.log('Reply:', replyText);
    
    setReplyText('');
    handleMarkAsReplied(selectedMessage.id);
    alert('Reply sent successfully!');
  };

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
                All Messages ({messages.length})
              </h2>
            </div>
            <div className="max-h-[600px] overflow-y-auto">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  onClick={() => {
                    setSelectedMessage(message);
                    if (!message.read) handleMarkAsRead(message.id);
                  }}
                  className={`p-4 border-b border-gray-700/30 cursor-pointer transition-all hover:bg-gray-700/20 ${
                    selectedMessage.id === message.id ? 'bg-gradient-to-r from-[#0295E6]/10 to-[#02b3e6]/5' : ''
                  } ${!message.read ? 'border-l-4 border-[#0295E6]' : ''}`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold">{message.name}</h3>
                      <p className="text-sm text-gray-400">{message.email}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      message.status === 'unread' ? 'bg-blue-900/30 text-blue-300' :
                      message.status === 'replied' ? 'bg-blue-900/30 text-blue-300' :
                      'bg-gray-700/50 text-gray-400'
                    }`}>
                      {message.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-300 line-clamp-2 mb-2">{message.message}</p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <FaClock />
                      {message.date}
                    </div>
                    {!message.read && (
                      <span className="w-2 h-2 bg-[#0295E6] rounded-full animate-pulse" />
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
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
                          <h2 className="text-xl font-bold">{selectedMessage.name}</h2>
                          <p className="text-gray-400">{selectedMessage.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-400">
                        <span>Phone: {selectedMessage.phone}</span>
                        <span>Date: {selectedMessage.date}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleMarkAsReplied(selectedMessage.id)}
                        className="p-2 hover:bg-blue-900/30 rounded-lg transition-colors"
                        title="Mark as replied"
                      >
                        <FaCheck className="text-blue-400" />
                      </button>
                      <button
                        onClick={() => handleDeleteMessage(selectedMessage.id)}
                        className="p-2 hover:bg-red-900/30 rounded-lg transition-colors"
                        title="Delete message"
                      >
                        <FaTrash className="text-red-400" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex-1 p-6 overflow-y-auto">
                  <div className="mb-8">
                    <h3 className="font-semibold mb-2 flex items-center gap-2">
                      <FaEnvelope />
                      Message Content
                    </h3>
                    <div className="p-4 bg-gray-900/50 rounded-xl">
                      <p className="text-gray-300 leading-relaxed">{selectedMessage.message}</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                      <FaReply />
                      Reply to Customer
                    </h3>
                    <textarea
                      className="w-full h-32 px-4 py-3 bg-gray-800/50 rounded-xl border border-gray-700 focus:border-[#0295E6] focus:outline-none mb-4"
                      placeholder="Type your reply here..."
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                    />
                    <div className="flex justify-end">
                      <button
                        onClick={handleSendReply}
                        className="flex items-center gap-2 bg-gradient-to-r from-[#0295E6] to-[#02b3e6] hover:from-[#0284c6] hover:to-[#0295E6] text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105"
                      >
                        <FaReply />
                        Send Reply via Email
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
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}