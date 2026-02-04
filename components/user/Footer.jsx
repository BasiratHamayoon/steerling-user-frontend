import { FaWhatsapp, FaFacebook, FaInstagram, FaTwitter } from 'react-icons/fa';
import { contactInfo } from '@/data/contactInfo';

export default function Footer() {
  return (
    <footer className="bg-gray-900/50 border-t border-gray-700/30 mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col items-center space-y-8 mb-8">
          {/* Logo and Thank You */}
          <div className="text-center">
            <div className="text-2xl font-bold mb-4">
              <span className="text-green-400">Steer</span>
              <span className="text-white">Flux</span>
            </div>
            <p className="text-gray-400">Thank you for visiting our store. Premium steering wheels for every vehicle.</p>
          </div>

          {/* Contact Information */}
          <div className="text-center">
            <div className="flex flex-col items-center space-y-2">
              <div className="flex items-center gap-2">
                <FaWhatsapp className="text-green-400" />
                <a href={`https://wa.me/${contactInfo.whatsapp}`} className="hover:text-green-400 transition-colors">
                  WhatsApp: {contactInfo.whatsapp}
                </a>
              </div>
              <p>Phone: {contactInfo.phone}</p>
              <p>Email: {contactInfo.email}</p>
              <p>{contactInfo.address}</p>
            </div>
          </div>

          {/* Social Media */}
          <div className="text-center">
            <div className="flex justify-center space-x-4">
              <a
                href={contactInfo.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-blue-500 transition-colors"
              >
                <FaFacebook className="text-2xl" />
              </a>
              <a
                href={contactInfo.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-pink-500 transition-colors"
              >
                <FaInstagram className="text-2xl" />
              </a>
              <a
                href={contactInfo.social.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-blue-400 transition-colors"
              >
                <FaTwitter className="text-2xl" />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-700/30 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} SteerFlux. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}