import React, { useState, useEffect, useRef } from "react";
import {
  Search,
  ShoppingCart,
  User,
  ChevronDown,
  Globe,
  Menu,
  X,
} from "lucide-react";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);

  // Refs for outside click detection
  const langRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Close language dropdown if click outside
      if (langRef.current && !langRef.current.contains(event.target as Node)) {
        setIsLangOpen(false);
      }
      // Close mobile menu if click outside (except the menu button)
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target as Node) &&
        menuButtonRef.current &&
        !menuButtonRef.current.contains(event.target as Node)
      ) {
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Products", href: "/products" },
    {
      name: "Others",
      submenu: [
        { name: "Services", href: "/services" },
        { name: "FAQs", href: "/faq" },
        { name: "Dashboard", href: "/dashboard" },
      ],
    },
    { name: "About", href: "/about" },
  ];

  return (
    <>
      <header
        className={`fixed w-full z-50 transition-all duration-500 ${
          isScrolled
            ? "top-0 bg-white/80 backdrop-blur-md shadow-sm py-2"
            : "top-4 py-4"
        }`}
      >
        <div className="max-w-350 mx-auto px-4 sm:px-6">
          <nav className="flex items-center justify-between bg-white/90 backdrop-blur-sm rounded-2xl px-5 py-2.5 border border-teal-50 shadow-lg shadow-teal-100/20">
            {/* Logo */}
            <a href="/" className="shrink-0" aria-label="Home">
              <div className="text-2xl font-bold bg-linear-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
                Pharma<span className="text-gray-800">Care</span>
              </div>
            </a>

            {/* Desktop Navigation */}
            <ul className="hidden lg:flex items-center gap-1 xl:gap-2">
              {navLinks.map((link) => (
                <li key={link.name} className="relative group">
                  <a
                    href={link.href}
                    className="flex items-center gap-1 px-3 py-2 text-slate-600 font-medium hover:text-teal-600 transition-colors rounded-lg text-sm xl:text-base"
                  >
                    {link.name}
                    {link.submenu && (
                      <ChevronDown className="w-4 h-4 group-hover:rotate-180 transition-transform duration-200" />
                    )}
                  </a>

                  {/* Dropdown */}
                  {link.submenu && (
                    <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-teal-50 shadow-xl rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                      {link.submenu.map((sub) => (
                        <a
                          key={sub.name}
                          href={sub.href}
                          className="block px-4 py-2.5 text-sm text-slate-600 hover:bg-teal-50 hover:text-teal-700 first:rounded-t-xl last:rounded-b-xl transition-colors"
                        >
                          {sub.name}
                        </a>
                      ))}
                    </div>
                  )}
                </li>
              ))}
            </ul>

            {/* Right Section: Icons + Contact + Language */}
            <div className="flex items-center gap-2 lg:gap-4">
              {/* Icons */}
              <div className="flex items-center gap-3 text-slate-500 pr-3 border-r border-slate-200">
                <button
                  className="hover:text-teal-600 transition-colors p-1"
                  aria-label="Search"
                >
                  <Search size={20} />
                </button>
                <a
                  href="/cart"
                  className="relative hover:text-teal-600 transition-colors p-1"
                  aria-label="Shopping cart"
                >
                  <ShoppingCart size={20} />
                  <span className="absolute -top-1 -right-1 bg-teal-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold shadow-sm">
                    0
                  </span>
                </a>
                <a
                  href="/login"
                  className="hidden sm:block hover:text-teal-600 transition-colors p-1"
                  aria-label="User account"
                >
                  <User size={20} />
                </a>
              </div>

              {/* Contact & Language */}
              <div className="hidden md:flex items-center gap-3">
                <a
                  href="/contact"
                  className="bg-teal-600 text-white px-5 py-2 rounded-xl text-sm font-semibold hover:bg-teal-700 transition-all shadow-sm hover:shadow-md"
                >
                  Contact Us
                </a>
              </div>

              {/* Mobile Menu Button */}
              <button
                ref={menuButtonRef}
                className="lg:hidden p-2 text-slate-600 hover:text-teal-600 transition-colors"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Toggle menu"
                aria-expanded={isMobileMenuOpen}
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </nav>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile Sidebar */}
      <div
        ref={mobileMenuRef}
        className={`fixed top-0 right-0 h-full w-80 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out lg:hidden ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full pt-20 pb-6 px-6">
          <div className="flex-1 space-y-1">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="block py-3 text-lg font-medium text-slate-700 border-b border-slate-100 hover:text-teal-600 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.name}
              </a>
            ))}
          </div>
          <div className="mt-6 space-y-3">
            <a
              href="/contact"
              className="block w-full bg-teal-600 text-white text-center py-3 rounded-xl font-semibold hover:bg-teal-700 transition-colors shadow-sm"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Contact Us
            </a>
            <div className="flex items-center justify-center gap-4 pt-2">
              <a
                href="/login"
                className="text-slate-500 hover:text-teal-600 p-2"
              >
                <User size={20} />
              </a>
              <a
                href="/cart"
                className="text-slate-500 hover:text-teal-600 p-2 relative"
              >
                <ShoppingCart size={20} />
                <span className="absolute -top-1 -right-1 bg-teal-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                  0
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
