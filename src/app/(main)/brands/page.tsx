"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronRight, Building2, Search, Package, Loader2 } from "lucide-react";
import { Brand, Product } from "@/types";
import { Input } from "@/components/ui/Input";

export default function BrandsPage() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [brandsRes, productsRes] = await Promise.all([
          fetch("/api/brands"),
          fetch("/api/products"),
        ]);
        const brandsData = await brandsRes.json();
        const productsData = await productsRes.json();
        setBrands(brandsData.brands || []);
        setProducts(productsData.products || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Filter active brands
  const activeBrands = brands.filter((brand) => brand.status === "active");

  // Filter by search query
  const filteredBrands = activeBrands.filter((brand) =>
    brand.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (brand.description?.toLowerCase() || "").includes(searchQuery.toLowerCase())
  );

  // Get product count for each brand
  const getProductCount = (brandId: string) => {
    return products.filter((p) => p.brandId === brandId && p.status === "active").length;
  };

  return (
    <div className="min-h-screen bg-[#1a1a1a]">
      {/* Breadcrumb */}
      <div className="bg-[#2a2a2a] border-b border-[#3a3a3a]">
        <div className="container mx-auto px-4 py-3">
          <nav className="flex items-center gap-2 text-sm">
            <Link href="/" className="text-[#B0B0B0] hover:text-white transition-colors">
              Home
            </Link>
            <ChevronRight className="w-4 h-4 text-[#808080]" />
            <span className="text-white">Brands</span>
          </nav>
        </div>
      </div>

      {/* Page Header */}
      <div className="bg-gradient-to-r from-[#2a2a2a] to-[#1a1a1a] border-b border-[#3a3a3a]">
        <div className="container mx-auto px-4 py-12">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-[#4A9EFF] to-[#FFA726] rounded-2xl flex items-center justify-center">
              <Building2 className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white">
                Shop by Brand
              </h1>
              <p className="text-[#B0B0B0] mt-1">
                Explore products from your favorite brands
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-[#4A9EFF]" />
          </div>
        ) : (
        <>
        {/* Search */}
        <div className="max-w-md mb-8">
          <Input
            placeholder="Search brands..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
          />
        </div>

        {/* Results Count */}
        <p className="text-[#B0B0B0] mb-6">
          Showing <span className="text-white font-medium">{filteredBrands.length}</span> brands
        </p>

        {filteredBrands.length === 0 ? (
          /* No Brands State */
          <div className="text-center py-16">
            <div className="w-20 h-20 mx-auto mb-4 bg-[#2a2a2a] rounded-full flex items-center justify-center">
              <Building2 className="w-10 h-10 text-[#808080]" />
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">
              No Brands Found
            </h2>
            <p className="text-[#B0B0B0] mb-6">
              {searchQuery
                ? `No brands matching "${searchQuery}"`
                : "No brands available at the moment"}
            </p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="text-[#4A9EFF] hover:underline"
              >
                Clear search
              </button>
            )}
          </div>
        ) : (
          /* Brands Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredBrands.map((brand) => {
              const productCount = getProductCount(brand.id);
              return (
                <Link
                  key={brand.id}
                  href={`/products?brand=${brand.slug}`}
                  className="group bg-[#2a2a2a] rounded-xl border border-[#3a3a3a] p-6 hover:border-[#4A9EFF] transition-all duration-300 hover:shadow-lg hover:shadow-[#4A9EFF]/10"
                >
                  {/* Brand Logo/Icon */}
                  <div className="w-20 h-20 mx-auto mb-4 bg-[#1a1a1a] rounded-xl flex items-center justify-center overflow-hidden group-hover:scale-105 transition-transform">
                    {brand.logoUrl ? (
                      <div className="w-16 h-16 flex items-center justify-center">
                        <span className="text-2xl font-bold text-[#4A9EFF]">
                          {brand.name.substring(0, 2).toUpperCase()}
                        </span>
                      </div>
                    ) : (
                      <Building2 className="w-10 h-10 text-[#4A9EFF]" />
                    )}
                  </div>

                  {/* Brand Info */}
                  <div className="text-center">
                    <h3 className="text-lg font-semibold text-white mb-1 group-hover:text-[#4A9EFF] transition-colors">
                      {brand.name}
                    </h3>
                    {brand.description && (
                      <p className="text-[#808080] text-sm mb-3 line-clamp-2">
                        {brand.description}
                      </p>
                    )}
                    <div className="flex items-center justify-center gap-2 text-[#B0B0B0] text-sm">
                      <Package className="w-4 h-4" />
                      <span>{productCount} products</span>
                    </div>
                  </div>

                  {/* View Products Button */}
                  <div className="mt-4 pt-4 border-t border-[#3a3a3a]">
                    <span className="flex items-center justify-center gap-2 text-[#4A9EFF] text-sm font-medium group-hover:gap-3 transition-all">
                      View Products
                      <ChevronRight className="w-4 h-4" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* Featured Brands Section */}
        {filteredBrands.length > 0 && !searchQuery && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-white mb-6">Why Shop by Brand?</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-[#2a2a2a] rounded-xl border border-[#3a3a3a] p-6">
                <div className="w-12 h-12 bg-[#4A9EFF]/10 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-[#4A9EFF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-white mb-2">Authentic Products</h3>
                <p className="text-[#808080] text-sm">
                  All products are sourced directly from authorized distributors ensuring 100% authenticity.
                </p>
              </div>
              <div className="bg-[#2a2a2a] rounded-xl border border-[#3a3a3a] p-6">
                <div className="w-12 h-12 bg-[#FFA726]/10 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-[#FFA726]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-white mb-2">Best Prices</h3>
                <p className="text-[#808080] text-sm">
                  Competitive pricing across all brands with regular deals and offers.
                </p>
              </div>
              <div className="bg-[#2a2a2a] rounded-xl border border-[#3a3a3a] p-6">
                <div className="w-12 h-12 bg-[#4CAF50]/10 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-[#4CAF50]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-white mb-2">Official Warranty</h3>
                <p className="text-[#808080] text-sm">
                  All products come with official brand warranty for your peace of mind.
                </p>
              </div>
            </div>
          </div>
        )}
        </>
        )}
      </div>
    </div>
  );
}
