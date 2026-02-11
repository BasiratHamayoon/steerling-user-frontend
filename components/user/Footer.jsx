import { FaWhatsapp, FaFacebook, FaInstagram, FaTwitter } from 'react-icons/fa';
import { contactInfo } from '@/data/contactInfo';

export default function Footer() {
  return (
    <footer className="relative bg-gray-900 text-gray-300 mt-auto overflow-hidden">
      {/* Top Gradient Line for a glowing border effect */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#0295E6] to-transparent opacity-60"></div>

      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-8 items-start">
          
          {/* 1. Brand Section */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-4">
            <div className="text-4xl font-extrabold tracking-tight">
              <span className="text-[#0295E6]">Steer</span>
              <span className="text-white">Flux</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              Thank you for visiting our store. Premium steering wheels designed for every vehicle, crafted for perfection.
            </p>
          </div>

          {/* 2. Contact Information */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-4">
            <h3 className="text-white font-semibold text-lg tracking-wide border-b border-[#0295E6]/30 pb-2 mb-2">
              Contact Us
            </h3>
            
            <div className="space-y-3 text-sm">
              <a 
                href={`https://wa.me/${contactInfo.whatsapp}`} 
                className="flex items-center justify-center md:justify-start gap-3 group hover:text-white transition-all duration-300"
              >
                <div className="p-2 rounded-full bg-gray-800 group-hover:bg-[#0295E6]/20 transition-colors">
                  <FaWhatsapp className="text-[#0295E6] text-lg" />
                </div>
                <span>WhatsApp: {contactInfo.whatsapp}</span>
              </a>

              <div className="flex flex-col space-y-2 text-gray-400">
                <p className="hover:text-gray-200 transition-colors cursor-default">
                  <span className="font-medium text-gray-500">Phone:</span> {contactInfo.phone}
                </p>
                <p className="hover:text-gray-200 transition-colors cursor-default">
                  <span className="font-medium text-gray-500">Email:</span> {contactInfo.email}
                </p>
                <p className="hover:text-gray-200 transition-colors cursor-default">
                  <span className="font-medium text-gray-500">Address:</span> {contactInfo.address}
                </p>
              </div>
            </div>
          </div>

          {/* 3. Social Media */}
          <div className="flex flex-col items-center md:items-end space-y-6">
             <div className="text-center md:text-right">
                <h3 className="text-white font-semibold text-lg tracking-wide mb-4">
                  Follow Us
                </h3>
                <div className="flex space-x-4">
                  <SocialLink href={contactInfo.social.facebook} icon={<FaFacebook />} color="hover:text-blue-500 hover:bg-blue-500/10" />
                  <SocialLink href={contactInfo.social.instagram} icon={<FaInstagram />} color="hover:text-pink-500 hover:bg-pink-500/10" />
                  <SocialLink href={contactInfo.social.twitter} icon={<FaTwitter />} color="hover:text-blue-400 hover:bg-blue-400/10" />
                </div>
             </div>
          </div>

        </div>

        {/* Copyright Section */}
        <div className="mt-16 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} SteerFlux. All rights reserved.</p>
          <p className="mt-2 md:mt-0 opacity-75">Premium Quality Guaranteed</p>
        </div>
      </div>
    </footer>
  );
}

// Helper component for cleaner code and consistent styling
const SocialLink = ({ href, icon, color }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className={`p-3 bg-gray-800 rounded-lg text-gray-400 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg ${color}`}
  >
    <span className="text-xl">{icon}</span>
  </a>
);