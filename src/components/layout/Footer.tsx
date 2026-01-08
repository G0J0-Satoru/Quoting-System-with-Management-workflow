/**
 * ============================================================================
 * MAIN SITE - FOOTER COMPONENT
 * ============================================================================
 * This is the footer for the customer-facing website.
 * Contains: Company Info, Quick Links, Categories, Social, Payment Methods, Bottom Bar
 * ============================================================================
 */

"use client";

import React from "react";
import Link from "next/link";
import {
  Facebook,
  Instagram,
  Youtube,
  Mail,
  Phone,
  MapPin,
  Clock,
} from "lucide-react";
import { categories, brands } from "@/data/products";
import { useStoreSettings } from "@/context/StoreSettingsContext";

export function Footer() {
  const currentYear = new Date().getFullYear();
  const { settings } = useStoreSettings();

  return (
    <footer className="bg-[#1a1a1a] border-t border-[#3a3a3a]">
      {/* ========== START: MAIN SITE - MAIN FOOTER CONTENT ========== */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* --- START: Footer Section - Company Info --- */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-[#4A9EFF] to-[#FFA726] rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">
                  {settings.storeName || "ComputerWorld"}
                </h2>
              </div>
            </div>
            <p className="text-[#B0B0B0] mb-6 max-w-md">
              Your trusted destination for premium computer hardware and technology products.
              We offer the best brands with competitive prices and expert support since 2010.
            </p>
            {/* --- START: Company Contact Details --- */}
            <div className="space-y-3">
              <div className="flex items-start gap-3 text-[#B0B0B0]">
                <MapPin className="w-5 h-5 text-[#4A9EFF] flex-shrink-0 mt-0.5" />
                <span>{settings.storeAddress}</span>
              </div>
              <div className="flex items-center gap-3 text-[#B0B0B0]">
                <Phone className="w-5 h-5 text-[#4A9EFF]" />
                <a href={`tel:${settings.storePhone.replace(/\s+/g, "")}`} className="hover:text-white transition-colors">
                  {settings.storePhone}
                </a>
              </div>
              <div className="flex items-center gap-3 text-[#B0B0B0]">
                <Mail className="w-5 h-5 text-[#4A9EFF]" />
                <a href={`mailto:${settings.storeEmail}`} className="hover:text-white transition-colors">
                  {settings.storeEmail}
                </a>
              </div>
              <div className="flex items-start gap-3 text-[#B0B0B0]">
                <Clock className="w-5 h-5 text-[#4A9EFF] flex-shrink-0 mt-0.5" />
                <div>
                  <p>{settings.storeHours.split(",")[0]}</p>
                  <p>{settings.storeHours.split(",")[1]?.trim() || ""}</p>
                </div>
              </div>
            </div>
            {/* --- END: Company Contact Details --- */}
          </div>
          {/* --- END: Footer Section - Company Info --- */}

          {/* --- START: Footer Section - Quick Links --- */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/about"
                  className="text-[#B0B0B0] hover:text-white transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-[#B0B0B0] hover:text-white transition-colors"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  href="/products"
                  className="text-[#B0B0B0] hover:text-white transition-colors"
                >
                  All Products
                </Link>
              </li>
              <li>
                <Link
                  href="/offers"
                  className="text-[#B0B0B0] hover:text-white transition-colors"
                >
                  Special Offers
                </Link>
              </li>
              <li>
                <Link
                  href="/brands"
                  className="text-[#B0B0B0] hover:text-white transition-colors"
                >
                  Brands
                </Link>
              </li>
            </ul>
          </div>
          {/* --- END: Footer Section - Quick Links --- */}

          {/* --- START: Footer Section - Categories List --- */}
          <div>
            <h3 className="text-white font-semibold mb-4">Categories</h3>
            <ul className="space-y-2">
              {categories.slice(0, 6).map((category) => (
                <li key={category.id}>
                  <Link
                    href={`/category/${category.slug}`}
                    className="text-[#B0B0B0] hover:text-white transition-colors"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/categories"
                  className="text-[#4A9EFF] hover:text-[#3a8eef] transition-colors"
                >
                  View All →
                </Link>
              </li>
            </ul>
          </div>
          {/* --- END: Footer Section - Categories List --- */}

          {/* --- START: Footer Section - Social Links --- */}
          <div>
            <h3 className="text-white font-semibold mb-4">Follow Us</h3>
            <div className="flex gap-3">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-[#2a2a2a] rounded-lg flex items-center justify-center text-[#B0B0B0] hover:bg-[#4A9EFF] hover:text-white transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-[#2a2a2a] rounded-lg flex items-center justify-center text-[#B0B0B0] hover:bg-[#4A9EFF] hover:text-white transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-[#2a2a2a] rounded-lg flex items-center justify-center text-[#B0B0B0] hover:bg-[#4A9EFF] hover:text-white transition-colors"
              >
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>
          {/* --- END: Footer Section - Social Links --- */}
        </div>
      </div>
      {/* ========== END: MAIN SITE - MAIN FOOTER CONTENT ========== */}

      {/* ========== START: MAIN SITE - PAYMENT METHODS & BRANDS BAR ========== */}
      <div className="border-t border-[#3a3a3a]">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* --- START: Payment Methods List --- */}
            <div className="flex items-center gap-4 flex-wrap justify-center">
              <span className="text-[#808080] text-sm">We Accept:</span>
              <div className="flex items-center gap-3">
                {["Visa", "MasterCard", "AMEX", "Bank Transfer", "Cash"].map(
                  (method) => (
                    <div
                      key={method}
                      className="px-3 py-1 bg-[#2a2a2a] rounded text-xs text-[#B0B0B0]"
                    >
                      {method}
                    </div>
                  )
                )}
              </div>
            </div>
            {/* --- END: Payment Methods List --- */}
            {/* --- START: Top Brands Links --- */}
            <div className="flex items-center gap-4 flex-wrap justify-center">
              <span className="text-[#808080] text-sm">Top Brands:</span>
              <div className="flex items-center gap-2">
                {brands.slice(0, 5).map((brand) => (
                  <Link
                    key={brand.id}
                    href={`/brand/${brand.slug}`}
                    className="text-[#B0B0B0] hover:text-white text-xs transition-colors"
                  >
                    {brand.name}
                  </Link>
                ))}
              </div>
            </div>
            {/* --- END: Top Brands Links --- */}
          </div>
        </div>
      </div>
      {/* ========== END: MAIN SITE - PAYMENT METHODS & BRANDS BAR ========== */}

      {/* ========== START: MAIN SITE - FOOTER BOTTOM BAR (Copyright & Legal) ========== */}
      <div className="border-t border-[#3a3a3a]">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-[#808080]">
            {/* --- START: Copyright Notice --- */}
            <p>© {currentYear} ComputerWorld. All rights reserved.</p>
            {/* --- END: Copyright Notice --- */}
            {/* --- START: Legal Links --- */}
            <div className="flex items-center gap-4">
              <Link href="/privacy-policy" className="hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-white transition-colors">
                Terms & Conditions
              </Link>
              <Link href="/warranty" className="hover:text-white transition-colors">
                Warranty Information
              </Link>
            </div>
            {/* --- END: Legal Links --- */}
          </div>
        </div>
      </div>
      {/* ========== END: MAIN SITE - FOOTER BOTTOM BAR ========== */}
    </footer>
  );
}
/* ============================================================================
   END OF FILE: MAIN SITE - FOOTER COMPONENT
   ============================================================================ */
