'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaPaperPlane, FaUser, FaEnvelope, FaPhone, FaComment } from 'react-icons/fa';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    setTimeout(() => {
      alert('Thank you for your message! We will contact you soon.');
      setFormData({ name: '', email: '', phone: '', message: '' });
      setIsSubmitting(false);
    }, 1000);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Get in Touch</h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Have questions about our steering wheels? We're here to help! Send us a message and we'll respond as soon as possible.
          </p>
        </motion.div>

        <div className="max-w-2xl mx-auto">
          <motion.form
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative group">
                <div className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-[#0295E6] transition-colors">
                  <FaUser />
                </div>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 pl-12 bg-gray-800/50 rounded-xl border border-gray-700 focus:border-[#0295E6] focus:outline-none focus:ring-2 focus:ring-[#0295E6]/30"
                  placeholder="Your Name"
                />
                <motion.div
                  className="absolute bottom-0 left-0 h-0.5 bg-[#0295E6] scale-x-0 group-focus-within:scale-x-100 transition-transform duration-300"
                  style={{ width: '100%' }}
                />
              </div>

              <div className="relative group">
                <div className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-[#0295E6] transition-colors">
                  <FaEnvelope />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 pl-12 bg-gray-800/50 rounded-xl border border-gray-700 focus:border-[#0295E6] focus:outline-none focus:ring-2 focus:ring-[#0295E6]/30"
                  placeholder="your@email.com"
                />
                <motion.div
                  className="absolute bottom-0 left-0 h-0.5 bg-[#0295E6] scale-x-0 group-focus-within:scale-x-100 transition-transform duration-300"
                  style={{ width: '100%' }}
                />
              </div>
            </div>

            <div className="relative group">
              <div className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-[#0295E6] transition-colors">
                <FaPhone />
              </div>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 pl-12 bg-gray-800/50 rounded-xl border border-gray-700 focus:border-[#0295E6] focus:outline-none focus:ring-2 focus:ring-[#0295E6]/30"
                placeholder="+1234567890"
              />
              <motion.div
                className="absolute bottom-0 left-0 h-0.5 bg-[#0295E6] scale-x-0 group-focus-within:scale-x-100 transition-transform duration-300"
                style={{ width: '100%' }}
              />
            </div>

            <div className="relative group">
              <div className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-[#0295E6] transition-colors">
                <FaComment />
              </div>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows="6"
                className="w-full px-4 py-3 pl-12 bg-gray-800/50 rounded-xl border border-gray-700 focus:border-[#0295E6] focus:outline-none focus:ring-2 focus:ring-[#0295E6]/30 resize-none"
                placeholder="Your message..."
              />
              <motion.div
                className="absolute bottom-0 left-0 h-0.5 bg-[#0295E6] scale-x-0 group-focus-within:scale-x-100 transition-transform duration-300"
                style={{ width: '100%' }}
              />
            </div>

            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-[#0295E6] to-[#0275c6] hover:from-[#0284d6] hover:to-[#0265b6] text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FaPaperPlane className={isSubmitting ? 'animate-pulse' : ''} />
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </motion.button>
          </motion.form>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-12 p-6 bg-gradient-to-br from-gray-900/50 to-gray-800/50 rounded-2xl border border-gray-700/30"
          >
            <h3 className="text-xl font-semibold mb-4 text-center">Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div className="p-4 bg-gray-800/30 rounded-xl">
                <div className="w-12 h-12 mx-auto mb-3 bg-[#0295E6]/20 rounded-full flex items-center justify-center">
                  <FaPhone className="text-[#0295E6]" />
                </div>
                <p className="font-medium">Phone</p>
                <p className="text-gray-400">+1234567890</p>
              </div>
              <div className="p-4 bg-gray-800/30 rounded-xl">
                <div className="w-12 h-12 mx-auto mb-3 bg-[#0295E6]/20 rounded-full flex items-center justify-center">
                  <FaEnvelope className="text-[#0295E6]" />
                </div>
                <p className="font-medium">Email</p>
                <p className="text-gray-400">info@steerflux.com</p>
              </div>
              <div className="p-4 bg-gray-800/30 rounded-xl">
                <div className="w-12 h-12 mx-auto mb-3 bg-[#0295E6]/20 rounded-full flex items-center justify-center">
                  <FaComment className="text-[#0295E6]" />
                </div>
                <p className="font-medium">Response Time</p>
                <p className="text-gray-400">Within 24 hours</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}