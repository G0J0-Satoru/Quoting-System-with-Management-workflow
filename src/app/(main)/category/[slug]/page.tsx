"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ChevronRight, ChevronDown, SlidersHorizontal, Grid, List, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ProductCard } from "@/components/product/ProductCard";
import { Product, Category, Brand } from "@/types";

type SortOption = "popular" | "newest" | "price_asc" | "price_desc" | "name_asc";

export default function CategoryPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [category, setCategory] = useState<Category | null>(null);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<SortOption>("popular");
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 2000000]);
  const [inStockOnly, setInStockOnly] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const [categoriesRes, productsRes, brandsRes] = await Promise.all([
          fetch("/api/categories"),
          fetch("/api/products"),
          fetch("/api/brands")
        ]);
        
        if (categoriesRes.ok) {
          const categoriesData = await categoriesRes.json();
          const foundCategory = (categoriesData.categories || []).find((c: Category) => c.slug === slug);
          setCategory(foundCategory || null);
          
          if (foundCategory && productsRes.ok) {
            const productsData = await productsRes.json();
            const categoryProducts = (productsData.products || []).filter(
              (p: Product) => p.categoryId === foundCategory.id && p.status === "active"
            );
            setAllProducts(categoryProducts);
          }
        }
        
        if (brandsRes.ok) {
          const brandsData = await brandsRes.json();
          setBrands(brandsData.brands || []);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [slug]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let result = [...allProducts];

    // Filter by brand
    if (selectedBrands.length > 0) {
      result = result.filter((p) => selectedBrands.includes(p.brandId));
    }

    // Filter by price
    result = result.filter((p) => {
      const price = p.discountPrice || p.basePrice;
      return price >= priceRange[0] && price <= priceRange[1];
    });

    // Filter by stock
    if (inStockOnly) {
      result = result.filter((p) => p.stockQuantity > 0);
    }

    // Sort
    switch (sortBy) {
      case "newest":
        result.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
      case "price_asc":
        result.sort(
          (a, b) =>
            (a.discountPrice || a.basePrice) - (b.discountPrice || b.basePrice)
        );
        break;
      case "price_desc":
        result.sort(
          (a, b) =>
            (b.discountPrice || b.basePrice) - (a.discountPrice || a.basePrice)
        );
        break;
      case "name_asc":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        // popular - keep original order
        break;
    }

    return result;
  }, [allProducts, selectedBrands, priceRange, inStockOnly, sortBy]);

  const toggleBrand = (brandId: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brandId)
        ? prev.filter((id) => id !== brandId)
        : [...prev, brandId]
    );
  };

  const clearFilters = () => {
    setSelectedBrands([]);
    setPriceRange([0, 2000000]);
    setInStockOnly(false);
  };

  const hasActiveFilters = selectedBrands.length > 0 || inStockOnly || priceRange[0] > 0 || priceRange[1] < 2000000;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-[#4A9EFF] animate-spin" />
      </div>
    );
  }

  if (!category) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Category Not Found</h1>
          <p className="text-[#B0B0B0] mb-6">The category you&apos;re looking for doesn&apos;t exist.</p>
          <Link href="/categories">
            <Button>Browse Categories</Button>
          </Link>
        </div>
      </div>
    );
  }

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
            <Link href="/categories" className="text-[#B0B0B0] hover:text-white transition-colors">
              Categories
            </Link>
            <ChevronRight className="w-4 h-4 text-[#808080]" />
            <span className="text-white">{category.name}</span>
          </nav>
        </div>
      </div>

      {/* Category Header */}
      <div className="bg-gradient-to-r from-[#2a2a2a] to-[#1a1a1a] border-b border-[#3a3a3a]">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            {category.name}
          </h1>
          {category.description && (
            <p className="text-[#B0B0B0] max-w-2xl">{category.description}</p>
          )}
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters - Desktop */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24 space-y-6">
              {/* Filter Header */}
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-white">Filters</h2>
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="text-sm text-[#4A9EFF] hover:text-[#3a8eef] transition-colors"
                  >
                    Clear All
                  </button>
                )}
              </div>

              {/* Brand Filter */}
              <div className="bg-[#2a2a2a] rounded-xl border border-[#3a3a3a] p-4">
                <h3 className="font-medium text-white mb-3">Brand</h3>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {brands
                    .filter((b) => b.status === "active")
                    .map((brand) => (
                      <label
                        key={brand.id}
                        className="flex items-center gap-2 cursor-pointer group"
                      >
                        <input
                          type="checkbox"
                          checked={selectedBrands.includes(brand.id)}
                          onChange={() => toggleBrand(brand.id)}
                          className="w-4 h-4 rounded border-[#3a3a3a] bg-[#1a1a1a] text-[#4A9EFF] focus:ring-[#4A9EFF] focus:ring-offset-0"
                        />
                        <span className="text-[#B0B0B0] group-hover:text-white transition-colors">
                          {brand.name}
                        </span>
                      </label>
                    ))}
                </div>
              </div>

              {/* Price Range Filter */}
              <div className="bg-[#2a2a2a] rounded-xl border border-[#3a3a3a] p-4">
                <h3 className="font-medium text-white mb-3">Price Range</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      placeholder="Min"
                      value={priceRange[0] || ""}
                      onChange={(e) =>
                        setPriceRange([Number(e.target.value) || 0, priceRange[1]])
                      }
                      className="text-sm"
                    />
                    <span className="text-[#808080]">-</span>
                    <Input
                      type="number"
                      placeholder="Max"
                      value={priceRange[1] || ""}
                      onChange={(e) =>
                        setPriceRange([priceRange[0], Number(e.target.value) || 2000000])
                      }
                      className="text-sm"
                    />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setPriceRange([0, 100000])}
                      className="px-2 py-1 text-xs bg-[#1a1a1a] rounded text-[#B0B0B0] hover:text-white transition-colors"
                    >
                      Under 100K
                    </button>
                    <button
                      onClick={() => setPriceRange([100000, 500000])}
                      className="px-2 py-1 text-xs bg-[#1a1a1a] rounded text-[#B0B0B0] hover:text-white transition-colors"
                    >
                      100K - 500K
                    </button>
                    <button
                      onClick={() => setPriceRange([500000, 2000000])}
                      className="px-2 py-1 text-xs bg-[#1a1a1a] rounded text-[#B0B0B0] hover:text-white transition-colors"
                    >
                      500K+
                    </button>
                  </div>
                </div>
              </div>

              {/* Availability Filter */}
              <div className="bg-[#2a2a2a] rounded-xl border border-[#3a3a3a] p-4">
                <h3 className="font-medium text-white mb-3">Availability</h3>
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                    className="w-4 h-4 rounded border-[#3a3a3a] bg-[#1a1a1a] text-[#4A9EFF] focus:ring-[#4A9EFF] focus:ring-offset-0"
                  />
                  <span className="text-[#B0B0B0] group-hover:text-white transition-colors">
                    In Stock Only
                  </span>
                </label>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-6 border-b border-[#3a3a3a]">
              <div className="flex items-center gap-4">
                {/* Mobile Filter Toggle */}
                <Button
                  variant="outline"
                  size="sm"
                  className="lg:hidden"
                  leftIcon={<SlidersHorizontal className="w-4 h-4" />}
                  onClick={() => setShowFilters(true)}
                >
                  Filters
                  {hasActiveFilters && (
                    <span className="ml-1 w-5 h-5 bg-[#4A9EFF] text-white text-xs rounded-full flex items-center justify-center">
                      {selectedBrands.length + (inStockOnly ? 1 : 0)}
                    </span>
                  )}
                </Button>

                <p className="text-[#B0B0B0]">
                  <span className="text-white font-medium">{filteredProducts.length}</span> products
                </p>
              </div>

              <div className="flex items-center gap-4">
                {/* Sort Dropdown */}
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortOption)}
                    className="appearance-none bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg px-4 py-2 pr-10 text-white text-sm focus:outline-none focus:border-[#4A9EFF] cursor-pointer"
                  >
                    <option value="popular">Most Popular</option>
                    <option value="newest">Newest First</option>
                    <option value="price_asc">Price: Low to High</option>
                    <option value="price_desc">Price: High to Low</option>
                    <option value="name_asc">Name: A to Z</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#808080] pointer-events-none" />
                </div>

                {/* View Toggle */}
                <div className="hidden md:flex items-center bg-[#2a2a2a] rounded-lg border border-[#3a3a3a] p-1">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={cn(
                      "p-2 rounded transition-colors",
                      viewMode === "grid"
                        ? "bg-[#4A9EFF] text-white"
                        : "text-[#808080] hover:text-white"
                    )}
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={cn(
                      "p-2 rounded transition-colors",
                      viewMode === "list"
                        ? "bg-[#4A9EFF] text-white"
                        : "text-[#808080] hover:text-white"
                    )}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Active Filters */}
            {hasActiveFilters && (
              <div className="flex flex-wrap items-center gap-2 mb-6">
                <span className="text-[#808080] text-sm">Active filters:</span>
                {selectedBrands.map((brandId) => {
                  const brand = brands.find((b) => b.id === brandId);
                  return (
                    <button
                      key={brandId}
                      onClick={() => toggleBrand(brandId)}
                      className="flex items-center gap-1 px-2 py-1 bg-[#4A9EFF]/10 border border-[#4A9EFF]/30 rounded text-sm text-[#4A9EFF] hover:bg-[#4A9EFF]/20 transition-colors"
                    >
                      {brand?.name}
                      <X className="w-3 h-3" />
                    </button>
                  );
                })}
                {inStockOnly && (
                  <button
                    onClick={() => setInStockOnly(false)}
                    className="flex items-center gap-1 px-2 py-1 bg-[#4A9EFF]/10 border border-[#4A9EFF]/30 rounded text-sm text-[#4A9EFF] hover:bg-[#4A9EFF]/20 transition-colors"
                  >
                    In Stock
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            )}

            {/* Product Grid */}
            {filteredProducts.length > 0 ? (
              <div
                className={cn(
                  "grid gap-6",
                  viewMode === "grid"
                    ? "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3"
                    : "grid-cols-1"
                )}
              >
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="w-20 h-20 mx-auto mb-4 bg-[#2a2a2a] rounded-full flex items-center justify-center">
                  <SlidersHorizontal className="w-10 h-10 text-[#808080]" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">No products found</h3>
                <p className="text-[#B0B0B0] mb-4">Try adjusting your filters to find what you&apos;re looking for.</p>
                <Button variant="outline" onClick={clearFilters}>
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Modal */}
      {showFilters && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setShowFilters(false)} />
          <div className="absolute inset-y-0 right-0 w-full max-w-sm bg-[#1a1a1a] overflow-y-auto">
            <div className="sticky top-0 bg-[#1a1a1a] border-b border-[#3a3a3a] p-4 flex items-center justify-between">
              <h2 className="font-semibold text-white">Filters</h2>
              <button
                onClick={() => setShowFilters(false)}
                className="p-2 text-[#808080] hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 space-y-6">
              {/* Brand Filter */}
              <div>
                <h3 className="font-medium text-white mb-3">Brand</h3>
                <div className="space-y-2">
                  {brands
                    .filter((b) => b.status === "active")
                    .map((brand) => (
                      <label
                        key={brand.id}
                        className="flex items-center gap-2 cursor-pointer group"
                      >
                        <input
                          type="checkbox"
                          checked={selectedBrands.includes(brand.id)}
                          onChange={() => toggleBrand(brand.id)}
                          className="w-4 h-4 rounded border-[#3a3a3a] bg-[#2a2a2a] text-[#4A9EFF] focus:ring-[#4A9EFF]"
                        />
                        <span className="text-[#B0B0B0] group-hover:text-white transition-colors">
                          {brand.name}
                        </span>
                      </label>
                    ))}
                </div>
              </div>

              {/* Availability Filter */}
              <div>
                <h3 className="font-medium text-white mb-3">Availability</h3>
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                    className="w-4 h-4 rounded border-[#3a3a3a] bg-[#2a2a2a] text-[#4A9EFF] focus:ring-[#4A9EFF]"
                  />
                  <span className="text-[#B0B0B0] group-hover:text-white transition-colors">
                    In Stock Only
                  </span>
                </label>
              </div>
            </div>

            <div className="sticky bottom-0 bg-[#1a1a1a] border-t border-[#3a3a3a] p-4 flex gap-3">
              <Button variant="outline" className="flex-1" onClick={clearFilters}>
                Clear All
              </Button>
              <Button className="flex-1" onClick={() => setShowFilters(false)}>
                Apply ({filteredProducts.length})
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
