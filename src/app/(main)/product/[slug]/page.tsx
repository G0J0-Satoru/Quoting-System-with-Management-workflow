/** ============================================================================
 *  MAIN SITE - PRODUCT DETAIL PAGE
 *  ============================================================================
 *  Dynamic product page showing full product details with configuration options
 *  
 *  SECTIONS IN THIS FILE:
 *  - Data Fetching & State Management
 *  - Loading State
 *  - Not Found State
 *  - Breadcrumb Navigation
 *  - Main Product Grid:
 *    - Product Images Column (left)
 *      - Main Image Display
 *      - Thumbnail Strip
 *    - Product Info Column (right)
 *      - Brand Name
 *      - Product Title
 *      - SKU Display
 *      - Price Display (with discount)
 *      - Stock Status Badge
 *      - Short Description
 *      - Configuration Options (selectable buttons)
 *      - Quantity Selector
 *      - Action Buttons (Add to Cart, Add to Quotation)
 *      - Secondary Actions (Wishlist, Share)
 *      - Payment Methods
 *      - Trust Features (Delivery, Warranty, Returns, Authentic)
 *  - Tabs Section (Specifications, Description, Shipping & Returns)
 *  - Related Products Grid
 *  ============================================================================ */
"use client";

import React, { useState, useMemo, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { 
  ChevronRight, 
  ShoppingCart, 
  FileText, 
  Minus, 
  Plus, 
  Check,
  Truck,
  Shield,
  RotateCcw,
  Share2,
  Heart,
  Loader2
} from "lucide-react";
import { cn, formatPrice, calculateDiscount, getStockStatus } from "@/lib/utils";
import { useCart } from "@/context/CartContext";
import { useQuotation } from "@/context/QuotationContext";
import { showToast } from "@/components/ui/Toaster";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ProductCard } from "@/components/product/ProductCard";
import { Product, Category, Brand } from "@/types";

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [category, setCategory] = useState<Category | null>(null);
  const [brand, setBrand] = useState<Brand | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedConfig, setSelectedConfig] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState<"specs" | "description" | "shipping">("specs");

  const { addItem: addToCart } = useCart();
  const { addItem: addToQuotation } = useQuotation();

  const fetchProduct = useCallback(async () => {
    try {
      const response = await fetch(`/api/products/slug/${slug}`);
      if (!response.ok) {
        setProduct(null);
        setLoading(false);
        return;
      }
      const data = await response.json();
      setProduct(data.product);

      // Fetch category if product has categoryId
      if (data.product?.categoryId) {
        const catResponse = await fetch(`/api/categories/${data.product.categoryId}`);
        if (catResponse.ok) {
          const catData = await catResponse.json();
          setCategory(catData.category);
        }

        // Fetch related products from same category
        const productsResponse = await fetch("/api/products");
        if (productsResponse.ok) {
          const productsData = await productsResponse.json();
          const related = (productsData.products || [])
            .filter((p: Product) => p.categoryId === data.product.categoryId && p.id !== data.product.id)
            .slice(0, 4);
          setRelatedProducts(related);
        }
      }

      // Fetch brand if product has brandId
      if (data.product?.brandId) {
        const brandResponse = await fetch(`/api/brands/${data.product.brandId}`);
        if (brandResponse.ok) {
          const brandData = await brandResponse.json();
          setBrand(brandData.brand);
        }
      }
    } catch (error) {
      console.error("Error fetching product:", error);
      setProduct(null);
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  // Initialize default configurations
  useEffect(() => {
    if (product?.configurationOptions) {
      const defaults: Record<string, string> = {};
      product.configurationOptions.forEach((option) => {
        const defaultValue = option.options.find((o) => o.isDefault);
        if (defaultValue) {
          defaults[option.id] = defaultValue.id;
        }
      });
      setSelectedConfig(defaults);
    }
  }, [product]);

  // Calculate configuration price
  const configurationPrice = useMemo(() => {
    if (!product?.configurationOptions) return 0;
    return product.configurationOptions.reduce((total, option) => {
      const selectedOption = option.options.find(
        (o) => o.id === selectedConfig[option.id]
      );
      return total + (selectedOption?.priceModifier || 0);
    }, 0);
  }, [product, selectedConfig]);

  if (loading) {
    return (
      /* ========== START: MAIN SITE - PRODUCT DETAIL LOADING STATE ========== */
      <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#4A9EFF]" />
      </div>
      /* ========== END: MAIN SITE - PRODUCT DETAIL LOADING STATE ========== */
    );
  }

  if (!product) {
    return (
      /* ========== START: MAIN SITE - PRODUCT NOT FOUND STATE ========== */
      <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Product Not Found</h1>
          <p className="text-[#B0B0B0] mb-6">The product you&apos;re looking for doesn&apos;t exist.</p>
          <Link href="/products">
            <Button>Browse Products</Button>
          </Link>
        </div>
      </div>
      /* ========== END: MAIN SITE - PRODUCT NOT FOUND STATE ========== */
    );
  }

  const basePrice = Number(product.discountPrice) || Number(product.basePrice) || 0;
  const totalPrice = basePrice + configurationPrice;
  const discount = calculateDiscount(Number(product.basePrice) || 0, Number(product.discountPrice) || 0);
  const stockQty = Number(product.stockQuantity) || 0;
  const stockStatus = getStockStatus(stockQty, product.lowStockThreshold || 5);

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedConfig, configurationPrice);
    showToast("success", `${product.name} added to cart`);
  };

  const handleAddToQuotation = () => {
    addToQuotation(product, quantity, selectedConfig, configurationPrice);
    showToast("info", `${product.name} added to quotation`);
  };

  return (
    <div className="min-h-screen bg-[#1a1a1a]">
      {/* ========== START: MAIN SITE - PRODUCT DETAIL BREADCRUMB ========== */}
      <div className="bg-[#2a2a2a] border-b border-[#3a3a3a]">
        <div className="container mx-auto px-4 py-3">
          <nav className="flex items-center gap-2 text-sm">
            <Link href="/" className="text-[#B0B0B0] hover:text-white transition-colors">
              Home
            </Link>
            <ChevronRight className="w-4 h-4 text-[#808080]" />
            {category && (
              <>
                <Link
                  href={`/category/${category.slug}`}
                  className="text-[#B0B0B0] hover:text-white transition-colors"
                >
                  {category.name}
                </Link>
                <ChevronRight className="w-4 h-4 text-[#808080]" />
              </>
            )}
            <span className="text-white truncate">{product.name}</span>
          </nav>
        </div>
      </div>
      {/* ========== END: MAIN SITE - PRODUCT DETAIL BREADCRUMB ========== */}

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* ========== START: MAIN SITE - PRODUCT IMAGES COLUMN ========== */}
          <div>
            {/* --- START: Product Images - Main Image Display --- */}
            <div className="relative aspect-square bg-[#2a2a2a] rounded-xl border border-[#3a3a3a] overflow-hidden mb-4">
              {/* Discount Badge Overlay */}
              {discount > 0 && (
                <div className="absolute top-4 left-4 z-10">
                  <Badge variant="error">-{discount}%</Badge>
                </div>
              )}
              {product.images && product.images.length > 0 && product.images[selectedImage]?.url ? (
                <img
                  src={product.images[selectedImage].url}
                  alt={product.images[selectedImage].alt || product.name}
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              ) : (
                /* Placeholder when no image available */
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center p-8">
                    <div className="w-40 h-40 mx-auto bg-[#3a3a3a] rounded-xl flex items-center justify-center">
                      <svg
                        className="w-20 h-20 text-[#4A9EFF]"
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
                    <p className="text-[#808080] mt-4">{brand?.name}</p>
                  </div>
                </div>
              )}
            </div>
            {/* --- END: Product Images - Main Image Display --- */}

            {/* --- START: Product Images - Thumbnail Strip --- */}
            {product.images && product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto hide-scrollbar">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={cn(
                      "flex-shrink-0 w-20 h-20 bg-[#2a2a2a] rounded-lg border overflow-hidden transition-colors",
                      selectedImage === index
                        ? "border-[#4A9EFF]"
                        : "border-[#3a3a3a] hover:border-[#4a4a4a]"
                    )}
                  >
                    {image.url ? (
                      <img
                        src={image.url}
                        alt={image.alt || `${product.name} thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="w-10 h-10 bg-[#3a3a3a] rounded flex items-center justify-center">
                          <svg
                            className="w-5 h-5 text-[#4A9EFF]"
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
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}
            {/* --- END: Product Images - Thumbnail Strip --- */}
          </div>
          {/* ========== END: MAIN SITE - PRODUCT IMAGES COLUMN ========== */}

          {/* ========== START: MAIN SITE - PRODUCT INFO COLUMN ========== */}
          <div>
            {/* --- START: Product Info - Brand Name --- */}
            {brand && (
              <Link
                href={`/brand/${brand.slug}`}
                className="text-[#4A9EFF] text-sm font-medium uppercase tracking-wide hover:text-[#3a8eef] transition-colors"
              >
                {brand.name}
              </Link>
            )}
            {/* --- END: Product Info - Brand Name --- */}

            {/* --- START: Product Info - Title --- */}
            <h1 className="text-2xl md:text-3xl font-bold text-white mt-2 mb-3">
              {product.name}
            </h1>
            {/* --- END: Product Info - Title --- */}

            {/* --- START: Product Info - SKU --- */}
            <p className="text-[#808080] text-sm mb-4">SKU: {product.sku}</p>
            {/* --- END: Product Info - SKU --- */}

            {/* --- START: Product Info - Price Display --- */}
            <div className="flex items-baseline gap-3 mb-4">
              <span className="price-text text-3xl font-bold text-white">
                {formatPrice(totalPrice)}
              </span>
              {product.discountPrice && Number(product.discountPrice) > 0 && (
                <span className="price-text text-lg text-[#808080] line-through">
                  {formatPrice((Number(product.basePrice) || 0) + configurationPrice)}
                </span>
              )}
            </div>
            {/* --- END: Product Info - Price Display --- */}

            {/* --- START: Product Info - Stock Status Badge --- */}
            <div className="flex items-center gap-2 mb-6">
              <Badge
                variant={
                  stockStatus.status === "in_stock"
                    ? "success"
                    : stockStatus.status === "low_stock"
                    ? "warning"
                    : "error"
                }
              >
                {stockStatus.label}
              </Badge>
            </div>
            {/* --- END: Product Info - Stock Status Badge --- */}

            {/* --- START: Product Info - Short Description --- */}
            <p className="text-[#B0B0B0] mb-6">{product.shortDescription}</p>
            {/* --- END: Product Info - Short Description --- */}

            {/* --- START: Product Info - Configuration Options --- */}
            {product.configurationOptions && product.configurationOptions.length > 0 && (
              <div className="space-y-4 mb-6">
                {product.configurationOptions.map((option) => (
                  <div key={option.id}>
                    <label className="block text-white font-medium mb-2">
                      {option.name}
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {option.options.map((value) => (
                        <button
                          key={value.id}
                          onClick={() =>
                            setSelectedConfig((prev) => ({
                              ...prev,
                              [option.id]: value.id,
                            }))
                          }
                          className={cn(
                            "px-4 py-2 rounded-lg border text-sm transition-colors",
                            selectedConfig[option.id] === value.id
                              ? "bg-[#4A9EFF] border-[#4A9EFF] text-white"
                              : "bg-[#2a2a2a] border-[#3a3a3a] text-[#B0B0B0] hover:border-[#4A9EFF]"
                          )}
                        >
                          {value.label}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
            {/* --- END: Product Info - Configuration Options --- */}

            {/* --- START: Product Info - Quantity Selector --- */}
            <div className="mb-6">
              <label className="block text-white font-medium mb-2">Quantity</label>
              <div className="flex items-center gap-3">
                <div className="flex items-center bg-[#2a2a2a] rounded-lg border border-[#3a3a3a]">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="p-3 text-[#B0B0B0] hover:text-white transition-colors"
                    disabled={quantity <= 1}
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-12 text-center text-white font-medium">
                    {quantity}
                  </span>
                  <button
                    onClick={() =>
                      setQuantity((q) => Math.min(stockQty, q + 1))
                    }
                    className="p-3 text-[#B0B0B0] hover:text-white transition-colors"
                    disabled={quantity >= stockQty}
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <span className="text-[#808080] text-sm">
                  {stockQty} available
                </span>
              </div>
            </div>
            {/* --- END: Product Info - Quantity Selector --- */}

            {/* --- START: Product Info - Primary Action Buttons --- */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <Button
                onClick={handleAddToCart}
                disabled={stockStatus.status === "out_of_stock"}
                size="lg"
                className="flex-1"
                leftIcon={<ShoppingCart className="w-5 h-5" />}
              >
                Add to Cart
              </Button>
              <Button
                onClick={handleAddToQuotation}
                variant="secondary"
                size="lg"
                className="flex-1"
                leftIcon={<FileText className="w-5 h-5" />}
              >
                Add to Quotation
              </Button>
            </div>
            {/* --- END: Product Info - Primary Action Buttons --- */}

            {/* --- START: Product Info - Secondary Actions (Wishlist, Share) --- */}
            <div className="flex items-center gap-4 mb-8">
              <button className="flex items-center gap-2 text-[#B0B0B0] hover:text-white transition-colors">
                <Heart className="w-5 h-5" />
                <span className="text-sm">Add to Wishlist</span>
              </button>
              <button className="flex items-center gap-2 text-[#B0B0B0] hover:text-white transition-colors">
                <Share2 className="w-5 h-5" />
                <span className="text-sm">Share</span>
              </button>
            </div>
            {/* --- END: Product Info - Secondary Actions (Wishlist, Share) --- */}

            {/* --- START: Product Info - Payment Methods Card --- */}
            <div className="bg-[#2a2a2a] rounded-xl border border-[#3a3a3a] p-4 mb-6">
              <p className="text-white font-medium mb-3">Accepted Payment Methods</p>
              <div className="flex flex-wrap gap-2">
                {["Cash", "Bank Transfer", "Visa", "MasterCard", "Koko"].map(
                  (method) => (
                    <span
                      key={method}
                      className="px-3 py-1 bg-[#1a1a1a] rounded text-xs text-[#B0B0B0]"
                    >
                      {method}
                    </span>
                  )
                )}
              </div>
            </div>
            {/* --- END: Product Info - Payment Methods Card --- */}

            {/* --- START: Product Info - Trust Features Grid --- */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#2a2a2a] rounded-lg flex items-center justify-center">
                  <Truck className="w-5 h-5 text-[#4A9EFF]" />
                </div>
                <div>
                  <p className="text-white text-sm font-medium">Free Delivery</p>
                  <p className="text-[#808080] text-xs">Orders over LKR 50K</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#2a2a2a] rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-[#4A9EFF]" />
                </div>
                <div>
                  <p className="text-white text-sm font-medium">Warranty</p>
                  <p className="text-[#808080] text-xs">Official warranty</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#2a2a2a] rounded-lg flex items-center justify-center">
                  <RotateCcw className="w-5 h-5 text-[#4A9EFF]" />
                </div>
                <div>
                  <p className="text-white text-sm font-medium">Easy Returns</p>
                  <p className="text-[#808080] text-xs">7 day returns</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#2a2a2a] rounded-lg flex items-center justify-center">
                  <Check className="w-5 h-5 text-[#4A9EFF]" />
                </div>
                <div>
                  <p className="text-white text-sm font-medium">Authentic</p>
                  <p className="text-[#808080] text-xs">100% genuine</p>
                </div>
              </div>
            </div>
            {/* --- END: Product Info - Trust Features Grid --- */}
          </div>
          {/* ========== END: MAIN SITE - PRODUCT INFO COLUMN ========== */}
        </div>

        {/* ========== START: MAIN SITE - PRODUCT DETAIL TABS SECTION ========== */}
        <div className="mt-12">
          {/* --- START: Tabs - Tab Header Buttons --- */}
          <div className="flex border-b border-[#3a3a3a]">
            <button
              onClick={() => setActiveTab("specs")}
              className={cn(
                "px-6 py-3 font-medium transition-colors relative",
                activeTab === "specs"
                  ? "text-[#4A9EFF]"
                  : "text-[#B0B0B0] hover:text-white"
              )}
            >
              Specifications
              {activeTab === "specs" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#4A9EFF]" />
              )}
            </button>
            <button
              onClick={() => setActiveTab("description")}
              className={cn(
                "px-6 py-3 font-medium transition-colors relative",
                activeTab === "description"
                  ? "text-[#4A9EFF]"
                  : "text-[#B0B0B0] hover:text-white"
              )}
            >
              Description
              {activeTab === "description" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#4A9EFF]" />
              )}
            </button>
            <button
              onClick={() => setActiveTab("shipping")}
              className={cn(
                "px-6 py-3 font-medium transition-colors relative",
                activeTab === "shipping"
                  ? "text-[#4A9EFF]"
                  : "text-[#B0B0B0] hover:text-white"
              )}
            >
              Shipping & Returns
              {activeTab === "shipping" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#4A9EFF]" />
              )}
            </button>
          </div>
          {/* --- END: Tabs - Tab Header Buttons --- */}

          {/* --- START: Tabs - Tab Content Panels --- */}
          <div className="py-6">
            {/* --- START: Tab Content - Specifications Table --- */}
            {activeTab === "specs" && (
              <div className="bg-[#2a2a2a] rounded-xl border border-[#3a3a3a] overflow-hidden">
                <table className="w-full">
                  <tbody>
                    {Object.entries(product.specifications || {}).map(
                      ([key, value], index) => (
                        <tr
                          key={key}
                          className={index % 2 === 0 ? "bg-[#2a2a2a]" : "bg-[#252525]"}
                        >
                          <td className="px-4 py-3 text-[#B0B0B0] font-medium w-1/3">
                            {key}
                          </td>
                          <td className="px-4 py-3 text-white">{value as string}</td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            )}
            {/* --- END: Tab Content - Specifications Table --- */}

            {/* --- START: Tab Content - Full Description --- */}
            {activeTab === "description" && (
              <div className="bg-[#2a2a2a] rounded-xl border border-[#3a3a3a] p-6">
                <p className="text-[#B0B0B0] whitespace-pre-line">
                  {product.fullDescription}
                </p>
              </div>
            )}
            {/* --- END: Tab Content - Full Description --- */}

            {/* --- START: Tab Content - Shipping & Returns Info --- */}
            {activeTab === "shipping" && (
              <div className="bg-[#2a2a2a] rounded-xl border border-[#3a3a3a] p-6 space-y-4">
                <div>
                  <h4 className="text-white font-medium mb-2">Delivery Options</h4>
                  <ul className="text-[#B0B0B0] space-y-1 list-disc list-inside">
                    <li>Free delivery for orders over LKR 50,000</li>
                    <li>Standard delivery: 2-5 business days (LKR 500)</li>
                    <li>Express delivery: 1-2 business days (LKR 1,000)</li>
                    <li>Store pickup available at Colombo branch</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-white font-medium mb-2">Return Policy</h4>
                  <ul className="text-[#B0B0B0] space-y-1 list-disc list-inside">
                    <li>7-day return policy for unopened items</li>
                    <li>Items must be in original packaging</li>
                    <li>Defective items can be exchanged within warranty period</li>
                    <li>Contact customer service for return authorization</li>
                  </ul>
                </div>
              </div>
            )}
            {/* --- END: Tab Content - Shipping & Returns Info --- */}
          </div>
          {/* --- END: Tabs - Tab Content Panels --- */}
        </div>
        {/* ========== END: MAIN SITE - PRODUCT DETAIL TABS SECTION ========== */}

        {/* ========== START: MAIN SITE - RELATED PRODUCTS SECTION ========== */}
        {relatedProducts.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-white mb-6">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
            </div>
          </div>
        )}
        {/* ========== END: MAIN SITE - RELATED PRODUCTS SECTION ========== */}
      </div>
    </div>
  );
}
/* ============================================================================
   END OF FILE: MAIN SITE - PRODUCT DETAIL PAGE
   ============================================================================ */
