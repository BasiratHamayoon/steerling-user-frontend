'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPaperPlane, FaUser, FaEnvelope, FaPhone, FaComment, FaCheck, FaExclamationCircle } from 'react-icons/fa';
import { useAppContext } from '@/context/AppContext';

export default function ContactPage() {
  const { sendMessage } = useAppContext();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success' | 'error' | null
  const [errors, setErrors] = useState({});

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    // Email is required
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    // Message is required
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Reset status
    setSubmitStatus(null);
    
    // Validate
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      const result = await sendMessage({
        name: formData.name.trim() || undefined,
        email: formData.email.trim(),
        phone: formData.phone.trim() || undefined,
        message: formData.message.trim()
      });

      if (result.success) {
        setSubmitStatus('success');
        setFormData({ name: '', email: '', phone: '', message: '' });
        
        // Reset success message after 10 seconds
        setTimeout(() => {
          setSubmitStatus(null);
        }, 10000);
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }

    // Clear status when user modifies form
    if (submitStatus) {
      setSubmitStatus(null);
    }
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
          {/* Success Message */}
          <AnimatePresence>
            {submitStatus === 'success' && (
              <motion.div
                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                className="mb-6 p-6 bg-green-900/20 border border-green-500/30 rounded-2xl"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <FaCheck className="text-2xl text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-green-400">Message Sent Successfully!</h3>
                    <p className="text-gray-400 text-sm">
                      Thank you for contacting us. We'll get back to you within 24 hours.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {submitStatus === 'error' && (
              <motion.div
                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                className="mb-6 p-6 bg-red-900/20 border border-red-500/30 rounded-2xl"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <FaExclamationCircle className="text-2xl text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-red-400">Failed to Send Message</h3>
                    <p className="text-gray-400 text-sm">
                      Something went wrong. Please try again or contact us directly.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.form
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name Field */}
              <div className="relative group">
                <div className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-green-400 transition-colors">
                  <FaUser />
                </div>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="input-field pl-12"
                  placeholder="Your Name (optional)"
                />
                <motion.div
                  className="absolute bottom-0 left-0 h-0.5 bg-green-500 scale-x-0 group-focus-within:scale-x-100 transition-transform duration-300"
                  style={{ width: '100%' }}
                />
              </div>

              {/* Email Field */}
              <div className="relative group">
                <div className={`absolute left-4 top-3.5 transition-colors ${
                  errors.email ? 'text-red-400' : 'text-gray-400 group-focus-within:text-green-400'
                }`}>
                  <FaEnvelope />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`input-field pl-12 ${
                    errors.email ? 'border-red-500 focus:border-red-500' : ''
                  }`}
                  placeholder="your@email.com *"
                />
                <motion.div
                  className={`absolute bottom-0 left-0 h-0.5 scale-x-0 group-focus-within:scale-x-100 transition-transform duration-300 ${
                    errors.email ? 'bg-red-500' : 'bg-green-500'
                  }`}
                  style={{ width: '100%' }}
                />
                {errors.email && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-400 text-sm mt-1 ml-1"
                  >
                    {errors.email}
                  </motion.p>
                )}
              </div>
            </div>

            {/* Phone Field */}
            <div className="relative group">
              <div className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-green-400 transition-colors">
                <FaPhone />
              </div>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="input-field pl-12"
                placeholder="+1234567890 (optional)"
              />
              <motion.div
                className="absolute bottom-0 left-0 h-0.5 bg-green-500 scale-x-0 group-focus-within:scale-x-100 transition-transform duration-300"
                style={{ width: '100%' }}
              />
            </div>

            {/* Message Field */}
            <div className="relative group">
              <div className={`absolute left-4 top-3.5 transition-colors ${
                errors.message ? 'text-red-400' : 'text-gray-400 group-focus-within:text-green-400'
              }`}>
                <FaComment />
              </div>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows="6"
                className={`input-field pl-12 resize-none ${
                  errors.message ? 'border-red-500 focus:border-red-500' : ''
                }`}
                placeholder="Your message... *"
              />
              <motion.div
                className={`absolute bottom-0 left-0 h-0.5 scale-x-0 group-focus-within:scale-x-100 transition-transform duration-300 ${
                  errors.message ? 'bg-red-500' : 'bg-green-500'
                }`}
                style={{ width: '100%' }}
              />
              <div className="flex justify-between mt-1 ml-1">
                {errors.message ? (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-400 text-sm"
                  >
                    {errors.message}
                  </motion.p>
                ) : (
                  <span></span>
                )}
                <span className={`text-sm ${
                  formData.message.length > 4900 ? 'text-yellow-400' : 'text-gray-500'
                }`}>
                  {formData.message.length}/5000
                </span>
              </div>
            </div>

            {/* Required Fields Note */}
            <p className="text-gray-500 text-sm">
              <span className="text-red-400">*</span> Required fields
            </p>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
              whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
              className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-green-600 disabled:hover:to-emerald-600"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle 
                      className="opacity-25" 
                      cx="12" 
                      cy="12" 
                      r="10" 
                      stroke="currentColor" 
                      strokeWidth="4"
                      fill="none"
                    />
                    <path 
                      className="opacity-75" 
                      fill="currentColor" 
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Sending...
                </>
              ) : (
                <>
                  <FaPaperPlane />
                  Send Message
                </>
              )}
            </motion.button>
          </motion.form>

          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-12 p-6 bg-gradient-to-br from-gray-900/50 to-gray-800/50 rounded-2xl border border-gray-700/30"
          >
            <h3 className="text-xl font-semibold mb-4 text-center">Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <a 
                href="tel:+1234567890"
                className="p-4 bg-gray-800/30 rounded-xl hover:bg-gray-800/50 transition-colors group"
              >
                <div className="w-12 h-12 mx-auto mb-3 bg-green-600/20 rounded-full flex items-center justify-center group-hover:bg-green-600/30 transition-colors">
                  <FaPhone className="text-green-400" />
                </div>
                <p className="font-medium">Phone</p>
                <p className="text-gray-400 group-hover:text-green-400 transition-colors">+1234567890</p>
              </a>
              
              <a 
                href="mailto:info@steerflux.com"
                className="p-4 bg-gray-800/30 rounded-xl hover:bg-gray-800/50 transition-colors group"
              >
                <div className="w-12 h-12 mx-auto mb-3 bg-blue-600/20 rounded-full flex items-center justify-center group-hover:bg-blue-600/30 transition-colors">
                  <FaEnvelope className="text-blue-400" />
                </div>
                <p className="font-medium">Email</p>
                <p className="text-gray-400 group-hover:text-blue-400 transition-colors">info@steerflux.com</p>
              </a>
              
              <div className="p-4 bg-gray-800/30 rounded-xl">
                <div className="w-12 h-12 mx-auto mb-3 bg-purple-600/20 rounded-full flex items-center justify-center">
                  <FaComment className="text-purple-400" />
                </div>
                <p className="font-medium">Response Time</p>
                <p className="text-gray-400">Within 24 hours</p>
              </div>
            </div>
          </motion.div>

          {/* WhatsApp Option */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-6 text-center"
          >
            <p className="text-gray-500 mb-3">Need immediate assistance?</p>
            <a
              href="https://wa.me/1234567890?text=Hello, I have a question about your steering wheels."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 rounded-xl font-semibold transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Chat on WhatsApp
            </a>
          </motion.div>
        </div>
      </div>
    </div>
  );
} 