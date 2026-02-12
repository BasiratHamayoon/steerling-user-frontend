'use client';

import { motion } from 'framer-motion';
import { FaShieldAlt, FaCogs, FaShippingFast, FaCheckCircle } from 'react-icons/fa';
import Image from 'next/image';

const features = [
  { icon: <FaShieldAlt />, title: "Premium Quality", text: "Crafted with carbon fiber & Alcantara." },
  { icon: <FaCogs />, title: "Custom Fit", text: "Designed for perfect compatibility." },
  { icon: <FaShippingFast />, title: "Fast Delivery", text: "Worldwide shipping available." },
];

export default function AboutSection() {
  return (
    <section className="relative py-24 bg-gray-900 overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-[#0295E6]/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-purple-500/5 blur-[120px] rounded-full" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left: Image Composition */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="relative h-[500px] w-full rounded-3xl overflow-hidden shadow-2xl border border-gray-700">
              <Image 
                src="/about.jpg" // Ensure this image exists in your public folder or change path
                alt="SteerFlux Craftsmanship"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-transparent to-transparent" />
              
              {/* Floating Badge */}
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="absolute bottom-8 left-8 bg-gray-900/80 backdrop-blur-md p-4 rounded-xl border border-gray-600 flex items-center gap-4 shadow-xl"
              >
                <div className="text-4xl font-bold text-[#0295E6]">100%</div>
                <div>
                  <p className="text-white font-bold leading-tight">Satisfaction</p>
                  <p className="text-gray-400 text-xs">Guaranteed Quality</p>
                </div>
              </motion.div>
            </div>
            
            {/* Decorative Element */}
            <div className="absolute -z-10 top-10 -left-10 w-full h-full border-2 border-[#0295E6]/20 rounded-3xl" />
          </motion.div>

          {/* Right: Text Content */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h4 className="text-[#0295E6] font-bold uppercase tracking-widest text-sm mb-2">About SteerFlux</h4>
            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6 leading-tight">
              Redefining the <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0295E6] to-[#0077b6]">Driving Experience</span>
            </h2>
            
            <p className="text-gray-400 text-lg mb-8 leading-relaxed">
              At <span className="text-white font-semibold">SteerFlux</span>, we don't just sell steering wheels; we engineer connections between driver and machine. 
              Our passion lies in creating ergonomic masterpieces that combine luxury materials like Italian Alcantara and forged carbon fiber with precision engineering.
            </p>

            {/* Feature List */}
            <div className="space-y-4 mb-8">
              {['Hand-stitched Leather', 'Real Carbon Fiber', 'Ergonomic Grip Design'].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <FaCheckCircle className="text-[#0295E6]" />
                  <span className="text-gray-300 font-medium">{item}</span>
                </div>
              ))}
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {features.map((feature, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ y: -5 }}
                  className="p-4 bg-gray-800/50 rounded-xl border border-gray-700/50 hover:border-[#0295E6]/30 transition-colors"
                >
                  <div className="text-2xl text-[#0295E6] mb-2">{feature.icon}</div>
                  <h3 className="text-white font-bold text-sm mb-1">{feature.title}</h3>
                  <p className="text-gray-500 text-xs">{feature.text}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}