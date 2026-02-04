import Link from 'next/link';
import { FaWhatsapp, FaFacebook, FaInstagram, FaTwitter } from 'react-icons/fa';
import { contactInfo } from '@/data/contactInfo';

export default function Footer() {
  return (
    <footer className="bg-gray-900 border-t border-gray-800 mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Link href="/" className="text-2xl font-bold text-green-400 mb-4 inline-block">
              Steering<span className="text-white">Pro</span>
            </Link>
            <p className="text-gray-400 mt-4">Thank you for visiting our store. Premium steering wheels for every vehicle.</p>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-400 hover:text-green-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/categories" className="text-gray-400 hover:text-green-400 transition-colors">
                  Categories
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-gray-400 hover:text-green-400 transition-colors">
                  Products
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-green-400 transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Contact Us</h3>
            <ul className="space-y-2 text-gray-400">
              <li className="flex items-center gap-2">
                <FaWhatsapp className="text-green-400" />
                <a href={`https://wa.me/${contactInfo.whatsapp}`} className="hover:text-green-400 transition-colors">
                  WhatsApp
                </a>
              </li>
              <li>{contactInfo.phone}</li>
              <li>{contactInfo.email}</li>
              <li>{contactInfo.address}</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Follow Us</h3>
            <div className="flex space-x-4">
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

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} SteeringPro. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}