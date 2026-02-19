import React from 'react';
import { Phone, ShoppingBag, Shield } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
      {/* Main hero card with subtle border-radius and shadow */}
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-emerald-100">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          
          {/* Left column: text content */}
          <div className="p-8 md:p-12 lg:p-16 space-y-6">
            {/* Small badge */}
            <div className="inline-flex items-center bg-emerald-50 text-emerald-700 px-4 py-2 rounded-full text-sm font-medium">
              <Shield className="w-4 h-4 mr-2" />
              Licensed & Trusted Since 1995
            </div>
            
            {/* Main headline */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 leading-tight">
              Your Health,{' '}
              <span className="text-emerald-600">Our Priority</span>
            </h1>
            
            {/* Subheadline */}
            <p className="text-lg md:text-xl text-gray-600 max-w-lg">
              Quality medications, expert care, and fast delivery – right to your doorstep. 
              Your well-being is our mission.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-full font-medium text-lg shadow-md transition-colors flex items-center justify-center">
                <ShoppingBag className="w-5 h-5 mr-2" />
                Shop Medicines
              </button>
              <button className="border-2 border-emerald-600 text-emerald-700 hover:bg-emerald-50 px-8 py-4 rounded-full font-medium text-lg transition-colors flex items-center justify-center">
                <Phone className="w-5 h-5 mr-2" />
                Consult a Pharmacist
              </button>
            </div>
            
            {/* Trust indicators */}
            <div className="flex items-center gap-6 text-sm text-gray-500 pt-4">
              <span>✓ 100% Authentic</span>
              <span>✓ Free Delivery</span>
              <span>✓ 24/7 Support</span>
            </div>
          </div>
          
          {/* Right column: image/illustration */}
          <div className="relative h-64 lg:h-full min-h-75 bg-linear-to-br from-emerald-50 to-white flex items-center justify-center p-8">
            {/* You can replace this with an actual image of a pharmacist or medicine */}
            <div className="relative w-full h-full flex items-center justify-center">
              {/* Abstract pharmacy illustration (simple SVG shapes) */}
              <svg className="w-full h-full max-w-md" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Background pill shape */}
                <circle cx="200" cy="200" r="160" fill="#D1FAE5" opacity="0.3" />
                {/* Medical cross */}
                <rect x="180" y="120" width="40" height="160" rx="8" fill="#10B981" />
                <rect x="120" y="180" width="160" height="40" rx="8" fill="#10B981" />
                {/* Small pills */}
                <circle cx="280" cy="260" r="20" fill="#FBBF24" />
                <circle cx="130" cy="300" r="16" fill="#F87171" />
                <circle cx="290" cy="130" r="24" fill="#60A5FA" />
                {/* Plus decorative elements */}
              </svg>
            </div>
            {/* Optional: real image (commented out) */}
            {/* <img src="/pharmacist.jpg" alt="Pharmacist" className="object-cover w-full h-full rounded-2xl" /> */}
          </div>
        </div>
      </div>
    </section>
  );
}