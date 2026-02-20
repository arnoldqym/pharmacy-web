import { Phone, ShoppingBag, Shield, CheckCircle } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="relative w-full px-4 sm:px-6 lg:px-8 pt-20 pb-10 lg:pt-24 lg:pb-16">
      <div className="max-w-360 mx-auto bg-white rounded-[2.5rem] shadow-2xl shadow-emerald-900/5 overflow-hidden border border-emerald-50 relative">
        
        {/* MOBILE BACKGROUND - Kept as is (80% width) */}
        <div className="absolute inset-0 z-0 lg:hidden overflow-hidden pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] opacity-40 blur-sm">
             <Illustration />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 items-center relative z-10">
          
          {/* Content Column */}
          <div className="p-8 md:p-12 lg:p-20 flex flex-col justify-center space-y-6 text-center lg:text-left items-center lg:items-start">
            <div className="inline-flex items-center bg-emerald-50/80 backdrop-blur-md text-emerald-700 px-4 py-1.5 rounded-full text-sm font-medium border border-emerald-100">
              <Shield className="w-4 h-4 mr-2" />
              Licensed & Trusted Since 1995
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-gray-900 tracking-tight leading-[1.1]">
              Your Health, <br className="hidden md:block" />
              <span className="text-emerald-600">Our Priority</span>
            </h1>
            
            <p className="text-lg text-gray-700 max-w-lg leading-relaxed font-medium">
              Quality medications, expert care, and fast delivery – right to your doorstep. 
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-2 w-full sm:w-auto">
              <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-10 py-4 rounded-full font-bold text-lg shadow-xl shadow-emerald-200 transition-all hover:-translate-y-1 flex items-center justify-center">
                <ShoppingBag className="w-5 h-5 mr-2" />
                Shop Medicines
              </button>
              <button className="border-2 border-emerald-200 text-emerald-800 hover:border-emerald-600 hover:bg-emerald-50 bg-white/60 backdrop-blur-md px-10 py-4 rounded-full font-bold text-lg transition-all flex items-center justify-center">
                <Phone className="w-5 h-5 mr-2" />
                Consult Pharmacist
              </button>
            </div>
            
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-x-8 gap-y-3 text-sm font-bold text-gray-500 pt-8">
              <span className="flex items-center gap-2"><CheckCircle className="w-5 h-5 text-emerald-500" /> 100% Authentic</span>
              <span className="flex items-center gap-2"><CheckCircle className="w-5 h-5 text-emerald-500" /> Free Delivery</span>
              <span className="flex items-center gap-2"><CheckCircle className="w-5 h-5 text-emerald-500" /> 24/7 Support</span>
            </div>
          </div>
          
          {/* Desktop Column - INCREASED SIZE HERE */}
          <div className="hidden lg:flex relative p-16 items-center justify-center">
            <div className="absolute inset-0 bg-radial-gradient from-emerald-50/50 to-transparent opacity-60" />
            {/* max-w-md (448px) on desktop, scaling up to max-w-lg (512px) on extra large screens */}
            <div className="relative w-full max-w-md xl:max-w-lg">
              <Illustration />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

function Illustration() {
  return (
    <svg className="w-full h-auto drop-shadow-2xl" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="200" cy="200" r="160" fill="#10B981" opacity="0.08" />
      <rect x="180" y="120" width="40" height="160" rx="8" fill="#10B981" />
      <rect x="120" y="180" width="160" height="40" rx="8" fill="#10B981" />
      <circle cx="280" cy="260" r="20" fill="#FBBF24" className="animate-bounce" style={{ animationDuration: '3s' }} />
      <circle cx="130" cy="300" r="16" fill="#F87171" className="animate-bounce" style={{ animationDuration: '4s' }} />
      <circle cx="290" cy="130" r="24" fill="#60A5FA" className="animate-pulse" />
    </svg>
  );
}