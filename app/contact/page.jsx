'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaWhatsapp, FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import { contactInfo } from '@/data/contactInfo';

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
          <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
          <p className="text-gray-400">Get in touch for inquiries and orders</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <motion.form
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              onSubmit={handleSubmit}
              className="bg-gray-800 p-8 rounded-xl"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block mb-2">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-gray-900 rounded-lg border border-gray-700 focus:border-green-500 focus:outline-none"
                    placeholder="Your Name"
                  />
                </div>
                <div>
                  <label className="block mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-gray-900 rounded-lg border border-gray-700 focus:border-green-500 focus:outline-none"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="block mb-2">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-gray-900 rounded-lg border border-gray-700 focus:border-green-500 focus:outline-none"
                  placeholder="+1234567890"
                />
              </div>

              <div className="mb-6">
                <label className="block mb-2">Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="5"
                  className="w-full px-4 py-3 bg-gray-900 rounded-lg border border-gray-700 focus:border-green-500 focus:outline-none"
                  placeholder="Your message..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary px-8 py-3 text-lg font-semibold"
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
            </motion.form>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="bg-gray-800 p-6 rounded-xl">
              <h3 className="font-semibold text-lg mb-6">Contact Information</h3>
              
              <div className="space-y-6">
                <a
                  href={`https://wa.me/${contactInfo.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 bg-gray-900 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <div className="bg-green-600 p-3 rounded-full">
                    <FaWhatsapp />
                  </div>
                  <div>
                    <p className="font-medium">WhatsApp</p>
                    <p className="text-gray-400">{contactInfo.whatsapp}</p>
                  </div>
                </a>

                <div className="flex items-center gap-4 p-4 bg-gray-900 rounded-lg">
                  <div className="bg-blue-600 p-3 rounded-full">
                    <FaPhone />
                  </div>
                  <div>
                    <p className="font-medium">Phone</p>
                    <p className="text-gray-400">{contactInfo.phone}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-gray-900 rounded-lg">
                  <div className="bg-red-600 p-3 rounded-full">
                    <FaEnvelope />
                  </div>
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-gray-400">{contactInfo.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-gray-900 rounded-lg">
                  <div className="bg-purple-600 p-3 rounded-full">
                    <FaMapMarkerAlt />
                  </div>
                  <div>
                    <p className="font-medium">Address</p>
                    <p className="text-gray-400">{contactInfo.address}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-800 p-6 rounded-xl">
              <h3 className="font-semibold text-lg mb-4">Business Hours</h3>
              <ul className="space-y-2 text-gray-400">
                <li className="flex justify-between">
                  <span>Monday - Friday</span>
                  <span>9:00 AM - 7:00 PM</span>
                </li>
                <li className="flex justify-between">
                  <span>Saturday</span>
                  <span>10:00 AM - 6:00 PM</span>
                </li>
                <li className="flex justify-between">
                  <span>Sunday</span>
                  <span>11:00 AM - 5:00 PM</span>
                </li>
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}