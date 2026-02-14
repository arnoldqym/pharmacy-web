import React, { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Package,
  Pill,
  ClipboardList,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { NavLink } from "react-router-dom";

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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsSidebarOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex h-screen bg-gray-50 font-sans overflow-hidden">
      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/40 backdrop-blur-sm transition-opacity md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-white/90 backdrop-blur-xl border-r border-gray-200/80 shadow-2xl shadow-gray-400/10 flex flex-col transform transition-all duration-300 ease-out md:relative md:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between h-20 px-6 border-b border-gray-200/60">
          <div className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
            Pharma<span className="text-gray-800">Care</span>
          </div>
          <button
            className="md:hidden p-1 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
            onClick={() => setIsSidebarOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 py-6 px-4 space-y-1.5 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
          {/* Overview Link */}
          <NavLink to="/dashboard/stats" className="block">
            {({ isActive }) => (
              <div
                className={`flex items-center space-x-3 py-2.5 px-4 rounded-xl font-medium transition-all duration-200 group ${
                  isActive
                    ? "bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-700 shadow-sm"
                    : "text-gray-600 hover:bg-gray-100/80 hover:text-gray-900"
                }`}
              >
                <LayoutDashboard
                  size={20}
                  className={`transition-transform group-hover:scale-110 ${
                    isActive ? "text-emerald-600" : "text-gray-500"
                  }`}
                />
                <span>Overview</span>
              </div>
            )}
          </NavLink>

          {/* Inventory Link */}
          <NavLink to="/dashboard/inventory" className="block">
            {({ isActive }) => (
              <div
                className={`flex items-center space-x-3 py-2.5 px-4 rounded-xl font-medium transition-all duration-200 group ${
                  isActive
                    ? "bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-700 shadow-sm"
                    : "text-gray-600 hover:bg-gray-100/80 hover:text-gray-900"
                }`}
              >
                <Package
                  size={20}
                  className={`transition-transform group-hover:scale-110 ${
                    isActive ? "text-emerald-600" : "text-gray-500"
                  }`}
                />
                <span>Inventory</span>
              </div>
            )}
          </NavLink>

          {/* Prescriptions Link */}
          <NavLink to="/dashboard/prescription" className="block">
            {({ isActive }) => (
              <div
                className={`flex items-center space-x-3 py-2.5 px-4 rounded-xl font-medium transition-all duration-200 group ${
                  isActive
                    ? "bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-700 shadow-sm"
                    : "text-gray-600 hover:bg-gray-100/80 hover:text-gray-900"
                }`}
              >
                <Pill
                  size={20}
                  className={`transition-transform group-hover:scale-110 ${
                    isActive ? "text-emerald-600" : "text-gray-500"
                  }`}
                />
                <span>Prescriptions</span>
              </div>
            )}
          </NavLink>

          {/* Orders Link */}
          <NavLink to="/dashboard/orders" className="block">
            {({ isActive }) => (
              <div
                className={`flex items-center space-x-3 py-2.5 px-4 rounded-xl font-medium transition-all duration-200 group ${
                  isActive
                    ? "bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-700 shadow-sm"
                    : "text-gray-600 hover:bg-gray-100/80 hover:text-gray-900"
                }`}
              >
                <ClipboardList
                  size={20}
                  className={`transition-transform group-hover:scale-110 ${
                    isActive ? "text-emerald-600" : "text-gray-500"
                  }`}
                />
                <span>Orders</span>
              </div>
            )}
          </NavLink>
        </nav>

        <div className="p-4 text-xs text-center text-gray-400 border-t border-gray-200/60">
          v2.0 · modern care
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 bg-gray-50">
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8 bg-white/80 backdrop-blur-md border-b border-gray-200/80 shadow-sm">
          <div className="flex items-center min-w-0 flex-1">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden p-2 mr-2 -ml-2 text-gray-600 rounded-lg hover:bg-gray-100 hover:text-emerald-600 transition-colors"
              aria-label="Open sidebar"
            >
              <Menu size={20} />
            </button>
            <h1 className="text-lg font-semibold text-gray-800 truncate sm:text-xl bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              {title}
            </h1>
          </div>

          <div className="flex items-center gap-3 ml-4 flex-shrink-0">
            <button
              onClick={onLogout}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-emerald-600 to-teal-500 rounded-xl hover:from-emerald-700 hover:to-teal-600 shadow-md shadow-emerald-200 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
            >
              <LogOut size={16} className="mr-2" />
              <span className="hidden sm:inline">Logout</span>
              <span className="sm:hidden">Exit</span>
            </button>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-6 overflow-auto bg-gray-50">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;
