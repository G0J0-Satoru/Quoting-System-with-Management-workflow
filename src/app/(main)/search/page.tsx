"use client";

import React, { Suspense, useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ChevronRight, Search as SearchIcon, Loader2 } from "lucide-react";
import { ProductCard } from "@/components/product/ProductCard";
import { Product, Brand } from "@/types";
import { Button } from "@/components/ui/Button";

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  
  const [products, setProducts] = useState<Product[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [productsRes, brandsRes] = await Promise.all([
          fetch("/api/products"),
          fetch("/api/brands")
        ]);
        
        if (productsRes.ok) {
          const data = await productsRes.json();
          setProducts(data.products || []);
        }
        if (brandsRes.ok) {
          const data = await brandsRes.json();
          setBrands(data.brands || []);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  const getBrandName = (brandId: string) => {
    return brands.find(b => b.id === brandId)?.name || '';
  };

  const searchResults = query
    ? products.filter(
        (p) =>
          p.status === "active" &&
          (p.name.toLowerCase().includes(query.toLowerCase()) ||
            (p.description?.toLowerCase() || "").includes(query.toLowerCase()) ||
            p.sku.toLowerCase().includes(query.toLowerCase()) ||
            (p.shortDescription?.toLowerCase() || "").includes(query.toLowerCase()))
      )
    : [];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-[#4A9EFF] animate-spin" />
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
            <span className="text-white">Search</span>
          </nav>
        </div>
      </div>

      {/* Page Header */}
      <div className="bg-gradient-to-r from-[#2a2a2a] to-[#1a1a1a] border-b border-[#3a3a3a]">
        <div className="container mx-auto px-4 py-8">
          {query ? (
            <>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                Search Results
              </h1>
              <p className="text-[#B0B0B0]">
                Found <span className="text-white font-medium">{searchResults.length}</span> results
                for &quot;<span className="text-[#4A9EFF]">{query}</span>&quot;
              </p>
            </>
          ) : (
            <>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                Search Products
              </h1>
              <p className="text-[#B0B0B0]">
                Use the search bar above to find products
              </p>
            </>
          )}
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {!query ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 mx-auto mb-4 bg-[#2a2a2a] rounded-full flex items-center justify-center">
              <SearchIcon className="w-10 h-10 text-[#808080]" />
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">
              Start Your Search
            </h2>
            <p className="text-[#B0B0B0] mb-6 max-w-md mx-auto">
              Enter a search term in the search bar above to find laptops, desktops,
              graphics cards, and more.
            </p>
            <Link href="/products">
              <Button variant="outline">Browse All Products</Button>
            </Link>
          </div>
        ) : searchResults.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 mx-auto mb-4 bg-[#2a2a2a] rounded-full flex items-center justify-center">
              <SearchIcon className="w-10 h-10 text-[#808080]" />
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">
              No Results Found
            </h2>
            <p className="text-[#B0B0B0] mb-6 max-w-md mx-auto">
              We couldn&apos;t find any products matching &quot;{query}&quot;. Try a different
              search term or browse our categories.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/products">
                <Button variant="outline">Browse All Products</Button>
              </Link>
              <Link href="/categories">
                <Button>View Categories</Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {searchResults.map((product) => (
              <ProductCard key={product.id} product={product} brandName={getBrandName(product.brandId)} />
            ))}
          </div>
        )}
      </div>

      {/* Search Suggestions */}
      {query && searchResults.length > 0 && (
        <div className="bg-[#2a2a2a] border-t border-[#3a3a3a]">
          <div className="container mx-auto px-4 py-8">
            <h3 className="text-lg font-semibold text-white mb-4">
              Popular Searches
            </h3>
            <div className="flex flex-wrap gap-2">
              {["Laptop", "Gaming PC", "RTX 4090", "DDR5 RAM", "SSD", "Monitor 4K"].map(
                (term) => (
                  <Link
                    key={term}
                    href={`/search?q=${encodeURIComponent(term)}`}
                    className="px-3 py-1.5 bg-[#1a1a1a] border border-[#3a3a3a] rounded-full text-sm text-[#B0B0B0] hover:text-white hover:border-[#4A9EFF] transition-colors"
                  >
                    {term}
                  </Link>
                )
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center">
          <div className="text-white">Loading...</div>
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  );
}
