import React, { useState } from "react";
import { LayoutDashboard, Package, Pill, ClipboardList } from "lucide-react";

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
          className="fixed inset-0 z-20 bg-black opacity-40 transition-opacity md:hidden"
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
            className="flex items-center space-x-3 py-2.5 px-4 bg-green-800 rounded-lg font-medium transition-colors"
          >
            <LayoutDashboard size={20} />
            <span>Overview</span>
          </a>

          {/* Inactive Links */}
          <a
            href="#"
            className="flex items-center space-x-3 py-2.5 px-4 hover:bg-green-800 rounded-lg transition-colors text-gray-300 hover:text-white"
          >
            <Package size={20} />
            <span>Inventory</span>
          </a>

          <a
            href="#"
            className="flex items-center space-x-3 py-2.5 px-4 hover:bg-green-800 rounded-lg transition-colors text-gray-300 hover:text-white"
          >
            <Pill size={20} />
            <span>Prescriptions</span>
          </a>

          <a
            href="#"
            className="flex items-center space-x-3 py-2.5 px-4 hover:bg-green-800 rounded-lg transition-colors text-gray-300 hover:text-white"
          >
            <ClipboardList size={20} />
            <span>Orders</span>
          </a>
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between bg-white px-4 shadow-sm border-b border-gray-200 sm:px-6 lg:px-8">
          {/* Left Side: Menu + Title */}
          <div className="flex items-center min-w-0 flex-1">
            {/* Hamburger Menu Button (Mobile Only) */}
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="inline-flex items-center justify-center p-2 mr-2 -ml-2 text-gray-600 rounded-md hover:bg-gray-100 hover:text-green-900 focus:outline-none md:hidden"
            >
              <span className="sr-only">Open sidebar</span>
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

            {/* Responsive Title */}
            <h1 className="text-lg font-bold text-gray-900 truncate sm:text-xl">
              {title}
            </h1>
          </div>

          {/* Right Side: Actions */}
          <div className="flex items-center ml-4 flex-shrink-0">
            <button
              onClick={onLogout}
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-black rounded-lg hover:bg-gray-800 transition-all shadow-sm whitespace-nowrap sm:px-5"
            >
              {/* Optional: Icon for mobile if button text is too long */}
              <span className="hidden sm:inline">Logout</span>
              <span className="sm:hidden">Exit</span>
            </button>
          </div>
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
