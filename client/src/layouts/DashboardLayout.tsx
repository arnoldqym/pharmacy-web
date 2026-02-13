import React, { useState } from "react";

// 1. Define TypeScript Props
interface DashboardLayoutProps {
  children: React.ReactNode;
  onLogout: () => void;
  title?: string;
}

function DashboardLayout({
  children,
  onLogout,
  title = "Dashboard",
}: DashboardLayoutProps) {
  // 2. State for mobile sidebar toggle
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50 font-sans overflow-hidden">
      {/* Mobile Backdrop Overlay - closes sidebar when clicking outside */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black bg-opacity-50 transition-opacity md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-green-900 text-white flex flex-col shadow-lg transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-6 border-b border-green-800">
          <div className="text-2xl font-bold tracking-wide">
            Pharma<span className="text-green-400">Care</span>
          </div>
          {/* Close button for mobile only */}
          <button
            className="md:hidden text-gray-300 hover:text-white focus:outline-none"
            onClick={() => setIsSidebarOpen(false)}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {/* Active Link */}
          <a
            href="#"
            className="block py-2.5 px-4 bg-green-800 rounded-lg font-medium transition-colors"
          >
            Overview
          </a>
          {/* Inactive Links */}
          <a
            href="#"
            className="block py-2.5 px-4 hover:bg-green-800 rounded-lg transition-colors text-gray-300 hover:text-white"
          >
            Inventory
          </a>
          <a
            href="#"
            className="block py-2.5 px-4 hover:bg-green-800 rounded-lg transition-colors text-gray-300 hover:text-white"
          >
            Prescriptions
          </a>
          <a
            href="#"
            className="block py-2.5 px-4 hover:bg-green-800 rounded-lg transition-colors text-gray-300 hover:text-white"
          >
            Orders
          </a>
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="flex items-center justify-between p-4 bg-white border-b border-gray-200 shadow-sm">
          <div className="flex items-center">
            {/* Hamburger Menu Button (Mobile Only) */}
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="mr-4 text-gray-600 hover:text-green-900 focus:outline-none md:hidden"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
            <h1 className="text-xl font-semibold text-black truncate">
              {title}
            </h1>
          </div>

          <button
            onClick={onLogout}
            className="px-5 py-2 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors shadow-sm whitespace-nowrap"
          >
            Logout
          </button>
        </header>

        {/* Dynamic Page Content */}
        <main className="flex-1 p-4 md:p-6 overflow-auto bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;
