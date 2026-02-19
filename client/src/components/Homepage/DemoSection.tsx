import React from 'react';
import { TrendingUp, Package, BarChart3, ArrowRight } from 'lucide-react';

export default function DashboardShowcase() {
  const modules = [
    {
      name: 'Sales',
      description: 'Real‑time transaction tracking, returns, and discounts.',
      icon: TrendingUp,
      color: 'bg-blue-50 text-blue-600',
    },
    {
      name: 'Inventory',
      description: 'Stock levels, expiry alerts, and low‑stock notifications.',
      icon: Package,
      color: 'bg-teal-50 text-teal-600',
    },
    {
      name: 'Reports',
      description: 'Profit & loss, sales trends, and custom date ranges.',
      icon: BarChart3,
      color: 'bg-amber-50 text-amber-600',
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <div className="text-center max-w-3xl mx-auto mb-8 md:mb-10">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">
          Powerful Dashboard, Built for Pharmacies
        </h2>
        <p className="text-base text-gray-600">
          Get a complete overview of your pharmacy operations. Our POS dashboard puts the most important metrics at your fingertips.
        </p>
      </div>

      {/* Dashboard Mockup / Screenshot Preview */}
      <div className="relative mb-10">
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          {/* Top bar */}
          <div className="bg-white border-b border-gray-200 px-4 py-2 flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-400"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
              <div className="w-3 h-3 rounded-full bg-green-400"></div>
            </div>
            <div className="flex-1 text-center text-xs font-medium text-gray-500">Pharmacy POS · Dashboard</div>
            <div className="w-16"></div> {/* placeholder for balance */}
          </div>

          {/* Dashboard content preview */}
          <div className="p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Left column - Sales preview */}
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-semibold text-gray-700">Today's Sales</span>
                  <span className="text-xs text-teal-600 flex items-center">Live <span className="ml-1 w-2 h-2 bg-teal-500 rounded-full animate-pulse"></span></span>
                </div>
                <div className="flex items-end justify-between">
                  <div>
                    <span className="text-2xl font-bold text-gray-800">$2,845</span>
                    <span className="text-sm text-gray-500 ml-2">+12% vs yesterday</span>
                  </div>
                  <div className="flex gap-2">
                    <div className="w-16 h-8 bg-teal-100 rounded"></div>
                    <div className="w-16 h-8 bg-teal-200 rounded"></div>
                  </div>
                </div>
                {/* Mini bar chart simulation */}
                <div className="mt-3 flex items-end gap-1 h-12">
                  <div className="w-8 bg-teal-300 rounded-t" style={{height:'24px'}}></div>
                  <div className="w-8 bg-teal-400 rounded-t" style={{height:'32px'}}></div>
                  <div className="w-8 bg-teal-500 rounded-t" style={{height:'48px'}}></div>
                  <div className="w-8 bg-teal-400 rounded-t" style={{height:'36px'}}></div>
                  <div className="w-8 bg-teal-300 rounded-t" style={{height:'20px'}}></div>
                </div>
              </div>

              {/* Inventory preview */}
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-semibold text-gray-700">Low Stock Alerts</span>
                  <span className="text-xs text-amber-600">2 items</span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Aspirin 100mg</span>
                    <span className="text-amber-600">12 left</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Amoxicillin 500mg</span>
                    <span className="text-amber-600">8 left</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right column - Reports preview */}
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <span className="text-sm font-semibold text-gray-700 block mb-3">Quick Reports</span>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center justify-between">
                  <span>Monthly revenue</span>
                  <span className="font-medium">$42.5k</span>
                </li>
                <li className="flex items-center justify-between">
                  <span>Avg. transaction</span>
                  <span className="font-medium">$67</span>
                </li>
                <li className="flex items-center justify-between">
                  <span>Top product</span>
                  <span className="font-medium">Ibuprofen</span>
                </li>
              </ul>
              <button className="mt-4 w-full py-2 text-xs text-teal-600 border border-teal-200 rounded-lg hover:bg-teal-50 flex items-center justify-center gap-1">
                View full reports <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>

        {/* Floating badge to indicate screenshot/demo */}
        <div className="absolute -top-2 -right-2 bg-white rounded-full px-3 py-1 text-xs font-medium shadow-md border border-gray-200 flex items-center gap-1">
          <span className="w-2 h-2 bg-green-400 rounded-full"></span> Live Preview
        </div>
      </div>

      {/* Highlighted Modules */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {modules.map((module) => {
          const Icon = module.icon;
          return (
            <div key={module.name} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-start gap-3">
              <div className={`p-2 rounded-lg ${module.color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 text-sm">{module.name}</h3>
                <p className="text-xs text-gray-600 mt-1">{module.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}