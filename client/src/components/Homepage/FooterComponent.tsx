import React from 'react';
// Make sure to install react-icons: npm install react-icons
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa';
import { MdLocalPhone, MdEmail, MdLocationOn } from 'react-icons/md';

export default function FooterComponent() {
  return (
    <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      {/* Main footer card with border-radius */}
      <div className="bg-linear-to-br from-white to-emerald-50 rounded-3xl shadow-2xl p-6 sm:p-8 md:p-12 border border-emerald-100">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          
          {/* Brand & About */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <span className="text-3xl font-bold text-emerald-700">Pharma</span>
              <span className="text-3xl font-light text-gray-600">Care</span>
            </div>
            <p className="text-gray-600 leading-relaxed">
              Your trusted partner for health and wellness. We provide quality medications and expert care.
            </p>
            {/* Simple medical cross decoration */}
            <div className="flex items-center space-x-1 text-emerald-600">
              <span className="text-lg">⚕️</span>
              <span className="text-sm font-medium">Since 1995</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b-2 border-emerald-200 pb-2 inline-block">
              Quick Links
            </h3>
            <ul className="space-y-2 text-gray-600">
              <li><a href="#" className="hover:text-emerald-600 transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-emerald-600 transition-colors">Our Services</a></li>
              <li><a href="#" className="hover:text-emerald-600 transition-colors">Medicines</a></li>
              <li><a href="#" className="hover:text-emerald-600 transition-colors">Health Blog</a></li>
              <li><a href="#" className="hover:text-emerald-600 transition-colors">FAQs</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b-2 border-emerald-200 pb-2 inline-block">
              Contact Us
            </h3>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-start space-x-3">
                <MdLocationOn className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
                <span className="wrap-break-word">123 Health Street, Wellness City, 12345</span>
              </li>
              <li className="flex items-center space-x-3">
                <MdLocalPhone className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center space-x-3">
                <MdEmail className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>hello@pharmacare.com</span>
              </li>
            </ul>
          </div>

          {/* Newsletter - refined for responsiveness */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b-2 border-emerald-200 pb-2 inline-block">
              Stay Updated
            </h3>
            <p className="text-gray-600 mb-3 text-sm">
              Subscribe to get health tips and offers.
            </p>
            <div className="flex flex-col sm:flex-row gap-2 w-full">
              <input
                type="email"
                placeholder="Your email"
                className="px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-400 w-full sm:flex-1"
              />
              <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded-full font-medium transition-colors shadow-md w-full sm:w-auto whitespace-nowrap">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Divider */}
        <hr className="my-8 border-emerald-200" />

        {/* Bottom row: copyright and social icons */}
        <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} PharmaCare. All rights reserved.
          </p>
          <div className="flex space-x-4">
            <a href="#" className="bg-emerald-100 p-2 rounded-full text-emerald-700 hover:bg-emerald-200 transition-colors">
              <FaFacebookF className="w-5 h-5" />
            </a>
            <a href="#" className="bg-emerald-100 p-2 rounded-full text-emerald-700 hover:bg-emerald-200 transition-colors">
              <FaTwitter className="w-5 h-5" />
            </a>
            <a href="#" className="bg-emerald-100 p-2 rounded-full text-emerald-700 hover:bg-emerald-200 transition-colors">
              <FaInstagram className="w-5 h-5" />
            </a>
            <a href="#" className="bg-emerald-100 p-2 rounded-full text-emerald-700 hover:bg-emerald-200 transition-colors">
              <FaLinkedinIn className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}