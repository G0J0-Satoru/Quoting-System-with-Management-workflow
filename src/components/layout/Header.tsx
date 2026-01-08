"use client";

/**
 * ============================================================================
 * MAIN SITE - HEADER COMPONENT
 * ============================================================================
 * This is the main navigation header for the customer-facing website.
 * Contains: Top Bar, Logo, Search Bar, Action Icons, Navigation Bar, Mobile Menu
 * ============================================================================
 */

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  ShoppingCart,
  FileText,
  User,
  Menu,
  X,
  ChevronDown,
  Phone,
  Laptop,
  Monitor,
  Cpu,
  HardDrive,
  Smartphone,
  Gamepad2,
  Shield,
  Camera,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useCart } from "@/context/CartContext";
import { useQuotation } from "@/context/QuotationContext";
import { useStoreSettings } from "@/context/StoreSettingsContext";
import { categories } from "@/data/products";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

const categoryIcons: Record<string, React.ReactNode> = {
  laptops: <Laptop className="w-5 h-5" />,
  desktops: <HardDrive className="w-5 h-5" />,
  "graphics-cards": <Monitor className="w-5 h-5" />,
  processors: <Cpu className="w-5 h-5" />,
  monitors: <Monitor className="w-5 h-5" />,
  apple: <Smartphone className="w-5 h-5" />,
  "gaming-consoles": <Gamepad2 className="w-5 h-5" />,
  "cctv-security": <Camera className="w-5 h-5" />,
  software: <Shield className="w-5 h-5" />,
};

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);
  const categoriesRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const { cart } = useCart();
  const { getItemCount } = useQuotation();
  const { settings } = useStoreSettings();
  const quotationCount = getItemCount();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (categoriesRef.current && !categoriesRef.current.contains(event.target as Node)) {
        setIsCategoriesOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setShowSearchResults(false);
    }
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-all duration-300",
        isScrolled
          ? "bg-[#1a1a1a]/95 backdrop-blur-md shadow-lg"
          : "bg-[#1a1a1a]"
      )}
    >
      {/* ========== START: MAIN SITE - TOP BAR (Contact Info & Links) ========== */}
      <div className="border-b border-[#3a3a3a]">
        <div className="container mx-auto px-4 py-2">
          <div className="flex items-center justify-between text-sm">
            {/* --- START: Top Bar - Phone Number --- */}
            <div className="flex items-center gap-2 text-[#B0B0B0]">
              <Phone className="w-4 h-4 text-[#4A9EFF]" />
              <span className="hidden sm:inline">Call us:</span>
              <a href={`tel:${settings.storePhone.replace(/\s+/g, "")}`} className="text-white hover:text-[#4A9EFF] transition-colors">
                {settings.storePhone}
              </a>
            </div>
            {/* --- END: Top Bar - Phone Number --- */}
            {/* --- START: Top Bar - Quick Links --- */}
            <div className="flex items-center gap-4">
              <Link
                href="/contact"
                className="text-[#B0B0B0] hover:text-white transition-colors"
              >
                Contact
              </Link>
            </div>
            {/* --- END: Top Bar - Quick Links --- */}
          </div>
        </div>
      </div>
      {/* ========== END: MAIN SITE - TOP BAR ========== */}

      {/* ========== START: MAIN SITE - MAIN HEADER (Logo, Search, Actions) ========== */}
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 lg:h-20 gap-4">
          {/* --- START: Header - Logo Section --- */}
          <Link href="/" className="flex-shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-[#4A9EFF] to-[#FFA726] rounded-lg flex items-center justify-center">
                <Monitor className="w-6 h-6 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-white leading-tight">
                  {settings.storeName || "ComputerWorld"}
                </h1>
                <p className="text-[10px] text-[#808080] leading-none">
                  Premium Tech Store
                </p>
              </div>
            </div>
          </Link>
          {/* --- END: Header - Logo Section --- */}

          {/* --- START: Header - Search Bar (Desktop) --- */}
          <form
            onSubmit={handleSearch}
            className="hidden md:flex flex-1 max-w-xl mx-4"
          >
            <div className="relative w-full">
              <Input
                type="text"
                placeholder="Search for products, brands, categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setShowSearchResults(true)}
                onBlur={() => setTimeout(() => setShowSearchResults(false), 200)}
                leftIcon={<Search className="w-5 h-5" />}
                className="pr-24"
              />
              <Button
                type="submit"
                size="sm"
                className="absolute right-1 top-1/2 -translate-y-1/2"
              >
                Search
              </Button>
            </div>
          </form>
          {/* --- END: Header - Search Bar (Desktop) --- */}

          {/* --- START: Header - Action Icons (Search Mobile, Quotation, Cart, User, Menu) --- */}
          <div className="flex items-center gap-2 lg:gap-4">
            {/* Search Button - Mobile */}
            <button
              className="md:hidden p-2 text-[#B0B0B0] hover:text-white transition-colors"
              onClick={() => {/* Open mobile search */}}
            >
              <Search className="w-6 h-6" />
            </button>

            {/* --- START: Header Action - Quotation Icon with Badge --- */}
            <Link
              href="/quotation"
              className="relative p-2 text-[#B0B0B0] hover:text-white transition-colors"
              title="Quotation"
            >
              <FileText className="w-6 h-6" />
              {quotationCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#FFA726] text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {quotationCount > 9 ? "9+" : quotationCount}
                </span>
              )}
            </Link>
            {/* --- END: Header Action - Quotation Icon with Badge --- */}

            {/* --- START: Header Action - Cart Icon with Badge --- */}
            <Link
              href="/cart"
              className="relative p-2 text-[#B0B0B0] hover:text-white transition-colors"
              title="Cart"
            >
              <ShoppingCart className="w-6 h-6" />
              {cart.itemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#4A9EFF] text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {cart.itemCount > 9 ? "9+" : cart.itemCount}
                </span>
              )}
            </Link>
            {/* --- END: Header Action - Cart Icon with Badge --- */}

            {/* --- END: Header Action - Cart Icon with Badge --- */}

            {/* --- START: Header Action - User Login Link --- */}
            <Link
              href="/login"
              className="hidden sm:flex items-center gap-2 p-2 text-[#B0B0B0] hover:text-white transition-colors"
            >
              <User className="w-6 h-6" />
              <span className="hidden lg:inline text-sm">Login</span>
            </Link>
            {/* --- END: Header Action - User Login Link --- */}

            {/* --- START: Header Action - Mobile Menu Toggle Button --- */}
            <button
              className="lg:hidden p-2 text-[#B0B0B0] hover:text-white transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
            {/* --- END: Header Action - Mobile Menu Toggle Button --- */}
          </div>
          {/* --- END: Header - Action Icons --- */}
        </div>
      </div>
      {/* ========== END: MAIN SITE - MAIN HEADER ========== */}

      {/* ========== START: MAIN SITE - DESKTOP NAVIGATION BAR ========== */}
      <nav className="hidden lg:block border-t border-[#3a3a3a]">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-8 h-12">
            {/* --- START: Navigation - Categories Dropdown --- */}
            <div ref={categoriesRef} className="relative">
              <button
                onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg transition-colors",
                  isCategoriesOpen
                    ? "bg-[#4A9EFF] text-white"
                    : "bg-[#2a2a2a] text-white hover:bg-[#3a3a3a]"
                )}
              >
                <Menu className="w-5 h-5" />
                <span className="font-medium">Categories</span>
                <ChevronDown
                  className={cn(
                    "w-4 h-4 transition-transform",
                    isCategoriesOpen && "rotate-180"
                  )}
                />
              </button>

              {/* --- START: Categories Mega Menu Dropdown --- */}
              {isCategoriesOpen && (
                <div className="absolute top-full left-0 mt-2 w-[600px] bg-[#2a2a2a] rounded-lg shadow-xl border border-[#3a3a3a] p-6 z-50">
                  <div className="grid grid-cols-3 gap-4">
                    {categories.filter(c => c.status === "active").map((category) => (
                      <Link
                        key={category.id}
                        href={`/category/${category.slug}`}
                        onClick={() => setIsCategoriesOpen(false)}
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-[#3a3a3a] transition-colors group"
                      >
                        <div className="w-10 h-10 bg-[#1a1a1a] rounded-lg flex items-center justify-center text-[#4A9EFF] group-hover:bg-[#4A9EFF] group-hover:text-white transition-colors">
                          {categoryIcons[category.slug] || <HardDrive className="w-5 h-5" />}
                        </div>
                        <div>
                          <p className="font-medium text-white">{category.name}</p>
                          <p className="text-xs text-[#808080]">
                            {category.productCount} products
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                  <div className="mt-4 pt-4 border-t border-[#3a3a3a]">
                    <Link
                      href="/categories"
                      onClick={() => setIsCategoriesOpen(false)}
                      className="text-[#4A9EFF] hover:text-[#3a8eef] text-sm font-medium"
                    >
                      View All Categories →
                    </Link>
                  </div>
                </div>
              )}
              {/* --- END: Categories Mega Menu Dropdown --- */}
            </div>
            {/* --- END: Navigation - Categories Dropdown --- */}

            {/* --- START: Navigation - Desktop Nav Links --- */}
            <Link
              href="/products"
              className="text-[#B0B0B0] hover:text-white transition-colors font-medium"
            >
              All Products
            </Link>
            <Link
              href="/brands"
              className="text-[#B0B0B0] hover:text-white transition-colors font-medium"
            >
              Brands
            </Link>
            <Link
              href="/offers"
              className="text-[#FFA726] hover:text-[#ef9716] transition-colors font-medium"
            >
              Special Offers
            </Link>
            <Link
              href="/about"
              className="text-[#B0B0B0] hover:text-white transition-colors font-medium"
            >
              About Us
            </Link>
            {/* --- END: Navigation - Desktop Nav Links --- */}
          </div>
        </div>
      </nav>
      {/* ========== END: MAIN SITE - DESKTOP NAVIGATION BAR ========== */}

      {/* ========== START: MAIN SITE - MOBILE MENU ========== */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-[#3a3a3a]">
          <div className="container mx-auto px-4 py-4">
            {/* --- START: Mobile Menu - Search Form --- */}
            <form onSubmit={handleSearch} className="mb-4">
              <Input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                leftIcon={<Search className="w-5 h-5" />}
              />
            </form>
            {/* --- END: Mobile Menu - Search Form --- */}

            {/* --- START: Mobile Menu - Navigation Links --- */}
            <nav className="space-y-1">
              <Link
                href="/products"
                className="block px-4 py-3 text-white hover:bg-[#2a2a2a] rounded-lg transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                All Products
              </Link>
              <Link
                href="/categories"
                className="block px-4 py-3 text-white hover:bg-[#2a2a2a] rounded-lg transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Categories
              </Link>
              <Link
                href="/brands"
                className="block px-4 py-3 text-white hover:bg-[#2a2a2a] rounded-lg transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Brands
              </Link>
              <Link
                href="/offers"
                className="block px-4 py-3 text-[#FFA726] hover:bg-[#2a2a2a] rounded-lg transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Special Offers
              </Link>
              <Link
                href="/about"
                className="block px-4 py-3 text-white hover:bg-[#2a2a2a] rounded-lg transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                About Us
              </Link>
              <Link
                href="/contact"
                className="block px-4 py-3 text-white hover:bg-[#2a2a2a] rounded-lg transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Contact
              </Link>
              <Link
                href="/login"
                className="block px-4 py-3 text-white hover:bg-[#2a2a2a] rounded-lg transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Login / Register
              </Link>
            </nav>
            {/* --- END: Mobile Menu - Navigation Links --- */}
          </div>
        </div>
      )}
      {/* ========== END: MAIN SITE - MOBILE MENU ========== */}
    </header>
  );
}
{/* ============================================================================
   END OF FILE: MAIN SITE - HEADER COMPONENT
   ============================================================================ */}
