"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronRight, Tag, Percent, Clock, Gift, Loader2 } from "lucide-react";
import { ProductCard } from "@/components/product/ProductCard";
import { Product } from "@/types";
import { Button } from "@/components/ui/Button";

export default function OffersPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch("/api/products");
        if (res.ok) {
          const data = await res.json();
          setProducts(data.products || []);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchProducts();
  }, []);

  // Filter products that have a discount (discountPrice is set)
  const offersProducts = products.filter(
    (p) => p.status === "active" && p.discountPrice && p.discountPrice < p.basePrice
  );

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
            <span className="text-white">Special Offers</span>
          </nav>
        </div>
      </div>

      {/* Page Header */}
      <div className="bg-gradient-to-r from-[#4A9EFF]/20 to-[#FFA726]/20 border-b border-[#3a3a3a]">
        <div className="container mx-auto px-4 py-12">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-[#4A9EFF] to-[#FFA726] rounded-2xl flex items-center justify-center">
              <Percent className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white">
                Special Offers
              </h1>
              <p className="text-[#B0B0B0] mt-1">
                Grab the best deals on top tech products
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {offersProducts.length === 0 ? (
          /* No Offers State */
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 bg-[#2a2a2a] rounded-full flex items-center justify-center">
              <Gift className="w-12 h-12 text-[#808080]" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">
              No Offers as of now
            </h2>
            <p className="text-[#B0B0B0] mb-8 max-w-md mx-auto">
              We don&apos;t have any special offers at the moment. Check back soon for
              exciting deals on the latest tech products!
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/products">
                <Button size="lg">
                  Browse All Products
                </Button>
              </Link>
              <Link href="/">
                <Button variant="outline" size="lg">
                  Back to Home
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* Offers Info Banner */}
            <div className="bg-gradient-to-r from-[#4A9EFF]/10 to-[#FFA726]/10 rounded-xl border border-[#3a3a3a] p-6 mb-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <Clock className="w-8 h-8 text-[#FFA726]" />
                  <div>
                    <h3 className="font-semibold text-white">Limited Time Offers!</h3>
                    <p className="text-[#B0B0B0] text-sm">
                      {offersProducts.length} products on sale. Don&apos;t miss out!
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-[#4CAF50]">
                  <Tag className="w-5 h-5" />
                  <span className="font-medium">Save up to 30% off!</span>
                </div>
              </div>
            </div>

            {/* Results Count */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-[#B0B0B0]">
                Showing <span className="text-white font-medium">{offersProducts.length}</span> offers
              </p>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {offersProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
