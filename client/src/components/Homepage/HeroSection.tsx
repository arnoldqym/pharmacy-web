import React from 'react';
import { Phone, ShoppingBag, Shield, CheckCircle } from 'lucide-react';

export default function HeroSection() {
  return (
    /* Spacing: Using pt-20 to pt-24 to keep it tight to the nav without touching it */
    <section className="relative w-full px-4 sm:px-6 lg:px-8 pt-20 pb-10 lg:pt-24 lg:pb-16">
      
      {/* Hero Card Width: max-w-[90rem] for that wide desktop look */}
      <div className="max-w-[90rem] mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border border-emerald-100">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 items-stretch">
          
          {/* Left column: Reduced spacing for a tighter desktop feel */}
          <div className="p-8 md:p-12 lg:p-14 flex flex-col justify-center space-y-5">
            
            <div className="inline-flex items-center self-start bg-emerald-50 text-emerald-700 px-4 py-1.5 rounded-full text-sm font-medium">
              <Shield className="w-4 h-4 mr-2" />
              Licensed & Trusted Since 1995
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight leading-[1.1]">
              Your Health,{' '}
              <span className="text-emerald-600">Our Priority</span>
            </h1>
            
            <p className="text-lg text-gray-600 max-w-xl leading-relaxed">
              Quality medications, expert care, and fast delivery – right to your doorstep. 
              Your well-being is our mission.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-full font-bold text-lg shadow-lg shadow-emerald-100 transition-all hover:scale-[1.02] flex items-center justify-center">
                <ShoppingBag className="w-5 h-5 mr-2" />
                Shop Medicines
              </button>
              <button className="border-2 border-emerald-600 text-emerald-700 hover:bg-emerald-50 px-8 py-4 rounded-full font-bold text-lg transition-all flex items-center justify-center">
                <Phone className="w-5 h-5 mr-2" />
                Consult Pharmacist
              </button>
            </div>
            
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm font-semibold text-gray-400 pt-4 border-t border-gray-50">
              <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-emerald-500" /> 100% Authentic</span>
              <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-emerald-500" /> Free Delivery</span>
              <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-emerald-500" /> 24/7 Support</span>
            </div>
          </div>
          
          {/* Right column: Illustration with RESTORED ANIMATIONS */}
          <div className="relative min-h-[350px] lg:min-h-full bg-gradient-to-br from-emerald-50 to-white flex items-center justify-center p-8 overflow-hidden">
            <div className="relative w-full h-full flex items-center justify-center">
              <svg className="w-full h-full max-w-sm drop-shadow-xl" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Background pill shape */}
                <circle cx="200" cy="200" r="160" fill="#D1FAE5" opacity="0.4" />
                
                {/* Medical cross */}
                <rect x="180" y="120" width="40" height="160" rx="8" fill="#10B981" />
                <rect x="120" y="180" width="160" height="40" rx="8" fill="#10B981" />
                
                {/* RESTORED ANIMATED ELEMENTS */}
                <circle cx="280" cy="260" r="20" fill="#FBBF24" className="animate-bounce" style={{ animationDuration: '3s' }} />
                <circle cx="130" cy="300" r="16" fill="#F87171" className="animate-bounce" style={{ animationDuration: '4s' }} />
                <circle cx="290" cy="130" r="24" fill="#60A5FA" className="animate-pulse" />
              </svg>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}