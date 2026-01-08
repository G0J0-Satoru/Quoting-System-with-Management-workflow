"use client";

/**
 * ============================================================================
 * MAIN SITE - HOME PAGE
 * ============================================================================
 * The main landing page for the customer-facing website.
 * Contains: Hero Section, Categories, Featured Products, Promotional Banner,
 *           New Arrivals, Brands Section
 * ============================================================================
 */

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, ChevronRight, Zap, Award, Truck, Shield, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ProductCard } from "@/components/product/ProductCard";
import { Product, Category, Brand } from "@/types";

// Category Icons mapping
const categoryIconMap: Record<string, React.ReactNode> = {
  laptops: (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
    </svg>
  ),
  desktops: (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  ),
  "graphics-cards": (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zm0 8a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zm12 0a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
    </svg>
  ),
  monitors: (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  ),
  processors: (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 3v2m6-2v2M9 19v2m6-2v2M3 9h2m14 0h2M3 15h2m14 0h2M9 9h6v6H9V9z" />
    </svg>
  ),
  apple: (
    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
    </svg>
  ),
  "gaming-consoles": (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
    </svg>
  ),
  "cctv-security": (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
  ),
};

export default function HomePage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [categoriesRes, brandsRes, productsRes] = await Promise.all([
          fetch("/api/categories"),
          fetch("/api/brands"),
          fetch("/api/products")
        ]);
        
        if (categoriesRes.ok) {
          const categoriesData = await categoriesRes.json();
          setCategories(categoriesData.categories || []);
        }
        if (brandsRes.ok) {
          const brandsData = await brandsRes.json();
          setBrands(brandsData.brands || []);
        }
        if (productsRes.ok) {
          const productsData = await productsRes.json();
          setProducts(productsData.products || []);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  // Filter featured and new products - only show products that are explicitly marked as featured
  const featuredProducts = products.filter(p => p.isFeatured === true && p.status === "active");
  const newProducts = products.filter(p => p.isNew && p.status === "active");
  // Only show featured products if there are any - don't show random products as "featured"
  const displayFeaturedProducts = featuredProducts;

  // Get real product count for a category
  const getProductCount = (categoryId: string) => {
    return products.filter(p => p.categoryId === categoryId && p.status === "active").length;
  };

  // Get brand name by ID
  const getBrandName = (brandId: string) => {
    return brands.find(b => b.id === brandId)?.name || '';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-[#4A9EFF] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* ========== START: MAIN SITE - HERO SECTION ========== */}
      <section className="relative bg-gradient-to-br from-[#1a1a1a] via-[#2a2a2a] to-[#1a1a1a] overflow-hidden">
        {/* --- START: Hero - Background Pattern --- */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%234A9EFF' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>
        {/* --- END: Hero - Background Pattern --- */}

        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* --- START: Hero - Content (Text & CTA Buttons) --- */}
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#4A9EFF]/10 rounded-full border border-[#4A9EFF]/20 mb-6">
                <Zap className="w-4 h-4 text-[#4A9EFF]" />
                <span className="text-[#4A9EFF] text-sm font-medium">New Arrivals Available</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                Premium Tech for
                <span className="text-[#4A9EFF]"> Every Need</span>
              </h1>
              <p className="text-lg text-[#B0B0B0] mb-8 max-w-xl">
                Discover the latest laptops, desktops, graphics cards, and accessories from top brands.
                Quality products with competitive prices and expert support.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/products">
                  <Button size="lg" rightIcon={<ArrowRight className="w-5 h-5" />}>
                    Shop Now
                  </Button>
                </Link>
                <Link href="/offers">
                  <Button variant="outline" size="lg">
                    View Offers
                  </Button>
                </Link>
              </div>

            </div>
            {/* --- END: Hero - Content (Text & CTA Buttons) --- */}

            {/* --- START: Hero - Visual/Image Section --- */}
            <div className="relative hidden lg:block">
              <div className="relative w-full aspect-square">
                {/* Glowing Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#4A9EFF]/20 to-[#FFA726]/20 rounded-full blur-3xl" />
                
                {/* Product Showcase */}
                <div className="relative z-10 w-full h-full flex items-center justify-center">
                  <div className="w-80 h-80 bg-[#2a2a2a] rounded-2xl border border-[#3a3a3a] flex items-center justify-center shadow-2xl">
                    <div className="text-center p-8">
                      <div className="w-32 h-32 mx-auto mb-4 bg-gradient-to-br from-[#4A9EFF] to-[#FFA726] rounded-2xl flex items-center justify-center">
                        <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <h3 className="text-white font-semibold text-lg">Latest Tech</h3>
                      <p className="text-[#808080] text-sm">Premium Selection</p>
                    </div>
                  </div>
                </div>

                {/* --- START: Hero - Floating Decorative Elements --- */}
                <div className="absolute top-10 right-10 w-16 h-16 bg-[#4A9EFF]/20 rounded-xl border border-[#4A9EFF]/30 flex items-center justify-center animate-bounce">
                  <Award className="w-8 h-8 text-[#4A9EFF]" />
                </div>
                <div className="absolute bottom-20 left-0 w-16 h-16 bg-[#FFA726]/20 rounded-xl border border-[#FFA726]/30 flex items-center justify-center animate-pulse">
                  <Truck className="w-8 h-8 text-[#FFA726]" />
                </div>
                {/* --- END: Hero - Floating Decorative Elements --- */}
              </div>
            </div>
            {/* --- END: Hero - Visual/Image Section --- */}
          </div>
        </div>
      </section>
      {/* ========== END: MAIN SITE - HERO SECTION ========== */}

      {/* ========== START: MAIN SITE - CATEGORIES SECTION ========== */}
      <section className="py-16 bg-[#1a1a1a]">
        <div className="container mx-auto px-4">
          {/* --- START: Categories - Section Header --- */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                Shop by Category
              </h2>
              <p className="text-[#B0B0B0]">Find exactly what you need</p>
            </div>
            <Link href="/categories">
              <Button variant="ghost" rightIcon={<ChevronRight className="w-4 h-4" />}>
                View All
              </Button>
            </Link>
          </div>
          {/* --- END: Categories - Section Header --- */}

          {/* --- START: Categories - Grid of Category Cards --- */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {categories.filter(c => c.status === "active").slice(0, 12).map((category) => (
              <Link
                key={category.id}
                href={`/category/${category.slug}`}
                className="group bg-[#2a2a2a] rounded-xl border border-[#3a3a3a] p-4 text-center hover:border-[#4A9EFF] hover:bg-[#2a2a2a]/80 transition-all duration-300"
              >
                <div className="w-16 h-16 mx-auto mb-3 bg-[#1a1a1a] rounded-lg flex items-center justify-center text-[#4A9EFF] group-hover:bg-[#4A9EFF] group-hover:text-white transition-colors">
                  {categoryIconMap[category.slug] || (
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 7v10c0 2 1 3 3 3h10c2 0 3-1 3-3V7c0-2-1-3-3-3H7c-2 0-3 1-3 3z" />
                    </svg>
                  )}
                </div>
                <h3 className="font-medium text-white text-sm group-hover:text-[#4A9EFF] transition-colors">
                  {category.name}
                </h3>
                <p className="text-xs text-[#808080] mt-1">
                  {getProductCount(category.id)} items
                </p>
              </Link>
            ))}
          </div>
          {/* --- END: Categories - Grid of Category Cards --- */}
        </div>
      </section>
      {/* ========== END: MAIN SITE - CATEGORIES SECTION ========== */}

      {/* ========== START: MAIN SITE - FEATURED PRODUCTS SECTION ========== */}
      <section className="py-16 bg-[#2a2a2a]">
        <div className="container mx-auto px-4">
          {/* --- START: Featured Products - Section Header --- */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                Featured Products
              </h2>
              <p className="text-[#B0B0B0]">Handpicked for you</p>
            </div>
            <Link href="/products">
              <Button variant="ghost" rightIcon={<ChevronRight className="w-4 h-4" />}>
                View All
              </Button>
            </Link>
          </div>
          {/* --- END: Featured Products - Section Header --- */}

          {/* --- START: Featured Products - Product Grid --- */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {displayFeaturedProducts.slice(0, 8).map((product) => (
              <ProductCard key={product.id} product={product} brandName={getBrandName(product.brandId)} />
            ))}
          </div>
          {/* --- END: Featured Products - Product Grid --- */}
        </div>
      </section>
      {/* ========== END: MAIN SITE - FEATURED PRODUCTS SECTION ========== */}

      {/* ========== START: MAIN SITE - PROMOTIONAL BANNER ========== */}
      <section className="py-16 bg-gradient-to-r from-[#4A9EFF] to-[#3a8eef]">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            {/* --- START: Promo Banner - Text Content --- */}
            <div className="text-center lg:text-left">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Special Offers This Week
              </h2>
              <p className="text-white/80 text-lg max-w-xl">
                Get up to 30% off on selected items. Limited time offer!
              </p>
            </div>
            {/* --- END: Promo Banner - Text Content --- */}
            {/* --- START: Promo Banner - CTA Button --- */}
            <Link href="/offers">
              <Button
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white hover:text-[#4A9EFF]"
                rightIcon={<ArrowRight className="w-5 h-5" />}
              >
                Shop Offers
              </Button>
            </Link>
            {/* --- END: Promo Banner - CTA Button --- */}
          </div>
        </div>
      </section>
      {/* ========== END: MAIN SITE - PROMOTIONAL BANNER ========== */}

      {/* ========== START: MAIN SITE - NEW ARRIVALS SECTION ========== */}
      <section className="py-16 bg-[#1a1a1a]">
        <div className="container mx-auto px-4">
          {/* --- START: New Arrivals - Section Header --- */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                New Arrivals
              </h2>
              <p className="text-[#B0B0B0]">Latest additions to our store</p>
            </div>
            <Link href="/products?sort=newest">
              <Button variant="ghost" rightIcon={<ChevronRight className="w-4 h-4" />}>
                View All
              </Button>
            </Link>
          </div>
          {/* --- END: New Arrivals - Section Header --- */}

          {/* --- START: New Arrivals - Product Grid --- */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {(newProducts.length > 0 ? newProducts : products.filter(p => p.status === "active")).slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} brandName={getBrandName(product.brandId)} />
            ))}
          </div>
          {/* --- END: New Arrivals - Product Grid --- */}
        </div>
      </section>
      {/* ========== END: MAIN SITE - NEW ARRIVALS SECTION ========== */}

      {/* ========== START: MAIN SITE - BRANDS SECTION ========== */}
      <section className="py-16 bg-[#2a2a2a]">
        <div className="container mx-auto px-4">
          {/* --- START: Brands - Section Header --- */}
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
              Shop by Brand
            </h2>
            <p className="text-[#B0B0B0]">We partner with the world&apos;s leading tech brands</p>
          </div>
          {/* --- END: Brands - Section Header --- */}

          {/* --- START: Brands - Brand Grid --- */}
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
            {brands.filter(b => b.status === "active").map((brand) => (
              <Link
                key={brand.id}
                href={`/brand/${brand.slug}`}
                className="group bg-[#1a1a1a] rounded-xl border border-[#3a3a3a] p-6 flex items-center justify-center hover:border-[#4A9EFF] transition-all duration-300 h-24"
              >
                <span className="text-[#B0B0B0] font-medium group-hover:text-white transition-colors">
                  {brand.name}
                </span>
              </Link>
            ))}
          </div>
          {/* --- END: Brands - Brand Grid --- */}
        </div>
      </section>
      {/* ========== END: MAIN SITE - BRANDS SECTION ========== */}
    </div>
  );
}
/* ============================================================================
   END OF FILE: MAIN SITE - HOME PAGE
   ============================================================================ */
