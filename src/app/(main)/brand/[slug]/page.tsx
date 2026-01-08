"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ChevronRight, Building2, Loader2, Package } from "lucide-react";
import { ProductCard } from "@/components/product/ProductCard";
import { Button } from "@/components/ui/Button";
import { Product, Brand } from "@/types";

export default function BrandPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [brand, setBrand] = useState<Brand | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [allBrands, setAllBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch brand by slug
        const brandRes = await fetch(`/api/brands/${slug}`);
        if (!brandRes.ok) {
          setNotFound(true);
          setLoading(false);
          return;
        }
        const brandData = await brandRes.json();
        setBrand(brandData.brand);

        // Fetch all products and filter by brand
        const [productsRes, brandsRes] = await Promise.all([
          fetch("/api/products"),
          fetch("/api/brands"),
        ]);

        if (productsRes.ok) {
          const productsData = await productsRes.json();
          const brandProducts = (productsData.products || []).filter(
            (p: Product) => p.brandId === brandData.brand.id && p.status === "active"
          );
          setProducts(brandProducts);
        }

        if (brandsRes.ok) {
          const brandsData = await brandsRes.json();
          setAllBrands(brandsData.brands || []);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [slug]);

  const getBrandName = (brandId: string) => {
    return allBrands.find((b) => b.id === brandId)?.name || "";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-[#4A9EFF] animate-spin" />
      </div>
    );
  }

  if (notFound || !brand) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center">
        <div className="text-center">
          <Building2 className="w-16 h-16 text-[#808080] mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">Brand Not Found</h1>
          <p className="text-[#B0B0B0] mb-6">
            The brand you&apos;re looking for doesn&apos;t exist.
          </p>
          <Link href="/brands">
            <Button>Browse All Brands</Button>
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
            <Link
              href="/"
              className="text-[#B0B0B0] hover:text-white transition-colors"
            >
              Home
            </Link>
            <ChevronRight className="w-4 h-4 text-[#808080]" />
            <Link
              href="/brands"
              className="text-[#B0B0B0] hover:text-white transition-colors"
            >
              Brands
            </Link>
            <ChevronRight className="w-4 h-4 text-[#808080]" />
            <span className="text-white">{brand.name}</span>
          </nav>
        </div>
      </div>

      {/* Brand Header */}
      <div className="bg-gradient-to-r from-[#2a2a2a] to-[#1a1a1a] border-b border-[#3a3a3a]">
        <div className="container mx-auto px-4 py-12">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-gradient-to-br from-[#4A9EFF] to-[#FFA726] rounded-2xl flex items-center justify-center flex-shrink-0">
              <Building2 className="w-10 h-10 text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                {brand.name}
              </h1>
              {brand.description && (
                <p className="text-[#B0B0B0] max-w-2xl">{brand.description}</p>
              )}
              <p className="text-sm text-[#808080] mt-2">
                {products.length} {products.length === 1 ? "product" : "products"} available
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="container mx-auto px-4 py-12">
        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                brandName={getBrandName(product.brandId)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Package className="w-16 h-16 text-[#808080] mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-white mb-2">
              No Products Available
            </h2>
            <p className="text-[#B0B0B0] mb-6">
              There are currently no products from this brand.
            </p>
            <Link href="/products">
              <Button>Browse All Products</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
