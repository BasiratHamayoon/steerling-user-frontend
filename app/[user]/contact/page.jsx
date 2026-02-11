'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPaperPlane, FaUser, FaEnvelope, FaPhone, FaCommentAlt, FaCheckCircle, FaExclamationTriangle, FaWhatsapp, FaMapMarkerAlt } from 'react-icons/fa';
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

  // --- Validation Logic ---
  const validateForm = () => {
    const newErrors = {};
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
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
    setSubmitStatus(null);
    
    if (!validateForm()) return;

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
        setTimeout(() => setSubmitStatus(null), 8000);
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
    setFormData({ ...formData, [name]: value });
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    if (submitStatus) setSubmitStatus(null);
  };

  // --- Animation Variants ---
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 py-16 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-[#0295E6]/10 blur-[120px] rounded-full pointer-events-none -z-10" />

      <div className="container mx-auto px-4 lg:px-8">
        
        {/* Header */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4 tracking-tight text-white">
            Get in <span className="text-[#0295E6]">Touch</span>
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Have questions about custom builds or compatibility? We are here to help you upgrade your driving experience.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 max-w-6xl mx-auto items-start">
          
          {/* --- Left Column: Contact Info & CTA --- */}
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="space-y-8"
          >
            <motion.div variants={fadeInUp}>
                <h3 className="text-2xl font-bold text-white mb-6">Contact Information</h3>
                <div className="space-y-4">
                    {/* Phone Card */}
                    <a href="tel:+1234567890" className="flex items-center gap-4 p-5 rounded-2xl bg-gray-900/50 border border-gray-800 hover:border-[#0295E6]/50 hover:bg-gray-900 transition-all duration-300 group">
                        <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center text-[#0295E6] group-hover:scale-110 transition-transform">
                            <FaPhone />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Phone</p>
                            <p className="text-white font-medium group-hover:text-[#0295E6] transition-colors">+1 (234) 567-890</p>
                        </div>
                    </a>

                    {/* Email Card */}
                    <a href="mailto:info@steerflux.com" className="flex items-center gap-4 p-5 rounded-2xl bg-gray-900/50 border border-gray-800 hover:border-[#0295E6]/50 hover:bg-gray-900 transition-all duration-300 group">
                        <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
                            <FaEnvelope />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Email</p>
                            <p className="text-white font-medium group-hover:text-purple-400 transition-colors">info@steerflux.com</p>
                        </div>
                    </a>

                    {/* Location Card */}
                    <div className="flex items-center gap-4 p-5 rounded-2xl bg-gray-900/50 border border-gray-800 group cursor-default">
                        <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center text-green-400">
                            <FaMapMarkerAlt />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Location</p>
                            <p className="text-white font-medium">New York, USA</p>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* WhatsApp CTA */}
            <motion.div variants={fadeInUp} className="pt-6 border-t border-gray-800">
                <h4 className="text-white font-semibold mb-3">Need a faster response?</h4>
                <a
                  href="https://wa.me/1234567890?text=Hello, I have a question about your products."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-3 w-full bg-[#25D366] hover:bg-[#20bd5a] text-white py-4 rounded-xl font-bold transition-all duration-300 hover:shadow-lg hover:shadow-green-500/20 transform hover:-translate-y-1"
                >
                  <FaWhatsapp className="text-2xl" />
                  <span>Chat on WhatsApp</span>
                </a>
            </motion.div>
          </motion.div>

          {/* --- Right Column: Contact Form --- */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-gray-900 border border-gray-800 p-8 rounded-3xl shadow-2xl relative overflow-hidden"
          >
             {/* Form Decorative Glow */}
             <div className="absolute top-0 right-0 w-64 h-64 bg-[#0295E6]/5 blur-[80px] rounded-full pointer-events-none" />

            <h2 className="text-2xl font-bold text-white mb-6 relative z-10">Send us a Message</h2>

            {/* Feedback Messages */}
            <AnimatePresence>
              {submitStatus && (
                <motion.div
                  initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                  animate={{ opacity: 1, height: 'auto', marginBottom: 24 }}
                  exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                  className={`rounded-xl p-4 flex items-start gap-3 ${
                    submitStatus === 'success' ? 'bg-green-500/10 border border-green-500/20 text-green-400' : 'bg-red-500/10 border border-red-500/20 text-red-400'
                  }`}
                >
                  {submitStatus === 'success' ? <FaCheckCircle className="mt-1 text-lg" /> : <FaExclamationTriangle className="mt-1 text-lg" />}
                  <div>
                     <h4 className="font-bold text-sm">{submitStatus === 'success' ? 'Message Sent!' : 'Error Sending'}</h4>
                     <p className="text-xs opacity-90">{submitStatus === 'success' ? 'We will get back to you shortly.' : 'Please try again later or use WhatsApp.'}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
              {/* Name & Phone Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="group">
                  <label className="block text-xs text-gray-500 uppercase font-bold mb-2 ml-1">Name</label>
                  <div className="relative">
                    <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#0295E6] transition-colors" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="John Doe"
                      className="w-full bg-gray-950 border border-gray-800 rounded-xl py-3.5 pl-11 pr-4 text-white placeholder-gray-600 focus:outline-none focus:border-[#0295E6] focus:ring-1 focus:ring-[#0295E6] transition-all"
                    />
                  </div>
                </div>

                <div className="group">
                  <label className="block text-xs text-gray-500 uppercase font-bold mb-2 ml-1">Phone</label>
                  <div className="relative">
                    <FaPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#0295E6] transition-colors" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="(Optional)"
                      className="w-full bg-gray-950 border border-gray-800 rounded-xl py-3.5 pl-11 pr-4 text-white placeholder-gray-600 focus:outline-none focus:border-[#0295E6] focus:ring-1 focus:ring-[#0295E6] transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Email */}
              <div className="group">
                <label className="block text-xs text-gray-500 uppercase font-bold mb-2 ml-1">Email Address <span className="text-red-500">*</span></label>
                <div className="relative">
                  <FaEnvelope className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${errors.email ? 'text-red-500' : 'text-gray-500 group-focus-within:text-[#0295E6]'}`} />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                    className={`w-full bg-gray-950 border rounded-xl py-3.5 pl-11 pr-4 text-white placeholder-gray-600 focus:outline-none focus:ring-1 transition-all ${
                        errors.email ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500' : 'border-gray-800 focus:border-[#0295E6] focus:ring-[#0295E6]'
                    }`}
                  />
                </div>
                {errors.email && <p className="text-red-400 text-xs mt-1 ml-1">{errors.email}</p>}
              </div>

              {/* Message */}
              <div className="group">
                <label className="block text-xs text-gray-500 uppercase font-bold mb-2 ml-1">Message <span className="text-red-500">*</span></label>
                <div className="relative">
                  <FaCommentAlt className={`absolute left-4 top-5 transition-colors ${errors.message ? 'text-red-500' : 'text-gray-500 group-focus-within:text-[#0295E6]'}`} />
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows="5"
                    placeholder="How can we help you?"
                    className={`w-full bg-gray-950 border rounded-xl py-3.5 pl-11 pr-4 text-white placeholder-gray-600 focus:outline-none focus:ring-1 resize-none transition-all ${
                        errors.message ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500' : 'border-gray-800 focus:border-[#0295E6] focus:ring-[#0295E6]'
                    }`}
                  />
                </div>
                <div className="flex justify-between mt-1 ml-1">
                    {errors.message ? <p className="text-red-400 text-xs">{errors.message}</p> : <span></span>}
                    <span className={`text-xs ${formData.message.length > 4000 ? 'text-yellow-500' : 'text-gray-600'}`}>{formData.message.length}/5000</span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-[#0295E6] to-[#0077b6] hover:from-[#0284c6] hover:to-[#00669c] text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-900/20 hover:shadow-blue-900/40 transform transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
              >
                {isSubmitting ? (
                   <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Sending...</span>
                   </>
                ) : (
                   <>
                    <FaPaperPlane />
                    <span>Send Message</span>
                   </>
                )}
              </button>
            </form>
          </motion.div>

        </div>
      </div>
    </div>
  );
}