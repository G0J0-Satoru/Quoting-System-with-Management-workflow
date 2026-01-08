"use client";

/**
 * ============================================================================
 * MAIN SITE - PRODUCT CARD COMPONENT
 * ============================================================================
 * Reusable product card used in product listings throughout the Main Site.
 * Contains: Image Container, Badges, Product Info, Price, Stock Status, Action Buttons
 * ============================================================================
 */

import React from "react";
import Link from "next/link";
import { ShoppingCart, FileText, Eye } from "lucide-react";
import { Product, Brand } from "@/types";
import { cn, formatPrice, calculateDiscount, getStockStatus } from "@/lib/utils";
import { useCart } from "@/context/CartContext";
import { useQuotation } from "@/context/QuotationContext";
import { showToast } from "@/components/ui/Toaster";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

interface ProductCardProps {
  product: Product;
  brand?: Brand;
  brandName?: string;
  className?: string;
}

export function ProductCard({ product, brand, brandName, className }: ProductCardProps) {
  const { addItem: addToCart } = useCart();
  const { addItem: addToQuotation } = useQuotation();

  const displayBrandName = brand?.name || brandName;
  const basePrice = Number(product.basePrice) || 0;
  const discountPrice = product.discountPrice ? Number(product.discountPrice) : null;
  const price = discountPrice || basePrice;
  const discount = calculateDiscount(basePrice, discountPrice || 0);
  const stockQty = Number(product.stockQuantity) || 0;
  const stockStatus = getStockStatus(stockQty, product.lowStockThreshold || 5);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1, undefined, 0);
    showToast("success", `${product.name} added to cart`);
  };

  const handleAddToQuotation = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToQuotation(product, 1, undefined, 0);
    showToast("info", `${product.name} added to quotation`);
  };

  // Get main image or first image
  const mainImage = product.images?.find(img => img.isMain) || product.images?.[0];

  return (
    <div
      className={cn(
        "group bg-[#2a2a2a] rounded-xl border border-[#3a3a3a] overflow-hidden transition-all duration-300 hover:border-[#4a4a4a] hover:shadow-xl hover:-translate-y-1",
        className
      )}
    >
      <Link href={`/product/${product.slug}`}>
        {/* ========== START: PRODUCT CARD - IMAGE CONTAINER ========== */}
        <div className="relative aspect-[4/3] bg-[#1a1a1a] overflow-hidden">
          {mainImage?.url ? (
            <img
              src={mainImage.url}
              alt={mainImage.alt || product.name}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              onError={(e) => {
                // Hide the image on error and show placeholder
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          ) : null}
          {/* Placeholder shown if no image or as fallback */}
          <div className={cn(
            "absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a]",
            mainImage?.url && "opacity-0"
          )}>
            <div className="text-center p-4">
              <div className="w-20 h-20 mx-auto mb-2 bg-[#3a3a3a] rounded-lg flex items-center justify-center">
                <svg
                  className="w-10 h-10 text-[#4A9EFF]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <span className="text-[#808080] text-xs">{displayBrandName || "Product"}</span>
            </div>
          </div>

          {/* --- START: Product Card - Discount Badge --- */}
          {discount > 0 && (
            <div className="absolute top-3 left-3">
              <Badge variant="error" size="sm">
                -{discount}%
              </Badge>
            </div>
          )}
          {/* --- END: Product Card - Discount Badge --- */}

          {/* --- START: Product Card - Stock Status Badge --- */}
          {stockStatus.status !== "in_stock" && (
            <div className="absolute top-3 right-3">
              <Badge
                variant={stockStatus.status === "low_stock" ? "warning" : "error"}
                size="sm"
              >
                {stockStatus.label}
              </Badge>
            </div>
          )}
          {/* --- END: Product Card - Stock Status Badge --- */}

          {/* --- START: Product Card - Quick View Hover Overlay --- */}
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <div className="flex items-center gap-2">
              <button
                className="p-3 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-colors"
                title="Quick View"
              >
                <Eye className="w-5 h-5" />
              </button>
            </div>
          </div>
          {/* --- END: Product Card - Quick View Hover Overlay --- */}
        </div>
        {/* ========== END: PRODUCT CARD - IMAGE CONTAINER ========== */}

        {/* ========== START: PRODUCT CARD - CONTENT SECTION ========== */}
        <div className="p-4">
          {/* --- START: Product Card - Brand Name --- */}
          {displayBrandName && (
            <p className="text-[#4A9EFF] text-xs font-medium mb-1 uppercase tracking-wide">
              {displayBrandName}
            </p>
          )}
          {/* --- END: Product Card - Brand Name --- */}

          {/* --- START: Product Card - Product Title --- */}
          <h3 className="font-medium text-white line-clamp-2 mb-2 group-hover:text-[#4A9EFF] transition-colors min-h-[48px]">
            {product.name}
          </h3>
          {/* --- END: Product Card - Product Title --- */}

          {/* --- START: Product Card - SKU Display --- */}
          <p className="text-[#808080] text-xs mb-2">SKU: {product.sku}</p>
          {/* --- END: Product Card - SKU Display --- */}

          {/* --- START: Product Card - Price Display Section --- */}
          <div className="flex items-baseline gap-2 mb-3">
            <span className="price-text text-xl font-bold text-white">
              {formatPrice(price)}
            </span>
            {discountPrice && discountPrice > 0 && (
              <span className="price-text text-sm text-[#808080] line-through">
                {formatPrice(basePrice)}
              </span>
            )}
          </div>
          {/* --- END: Product Card - Price Display Section --- */}

          {/* --- START: Product Card - Stock Status Text --- */}
          <p className={cn("text-sm mb-4", stockStatus.color)}>
            {stockStatus.label}
          </p>
          {/* --- END: Product Card - Stock Status Text --- */}
        </div>
        {/* ========== END: PRODUCT CARD - CONTENT SECTION ========== */}
      </Link>

      {/* ========== START: PRODUCT CARD - ACTION BUTTONS ========== */}
      <div className="px-4 pb-4 flex gap-2">
        {/* --- START: Add to Cart Button --- */}
        <Button
          onClick={handleAddToCart}
          disabled={stockStatus.status === "out_of_stock"}
          className="flex-1"
          size="sm"
          leftIcon={<ShoppingCart className="w-4 h-4" />}
        >
          Add to Cart
        </Button>
        {/* --- END: Add to Cart Button --- */}
        {/* --- START: Add to Quotation Button --- */}
        <Button
          onClick={handleAddToQuotation}
          variant="secondary"
          size="sm"
          title="Add to Quotation"
        >
          <FileText className="w-4 h-4" />
        </Button>
        {/* --- END: Add to Quotation Button --- */}
      </div>
      {/* ========== END: PRODUCT CARD - ACTION BUTTONS ========== */}
    </div>
  );
}
/* ============================================================================
   END OF FILE: MAIN SITE - PRODUCT CARD COMPONENT
   ============================================================================ */
