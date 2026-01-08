"use client";

/**
 * ============================================================================
 * MAIN SITE - CART PAGE
 * ============================================================================
 * Shopping cart page where customers can view/modify items before checkout.
 * Contains: Breadcrumb, Cart Items List, Quantity Controls, Order Summary
 * ============================================================================
 */

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShoppingCart, Trash2, Minus, Plus, ChevronRight, ArrowLeft } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/context/CartContext";
import { useQuotation } from "@/context/QuotationContext";
import { Button } from "@/components/ui/Button";

export default function CartPage() {
  const router = useRouter();
  const { cart, removeItem, updateQuantity, clearCart } = useCart();
  const { addItemsFromCart, clearItems } = useQuotation();

  const handleProceedToQuotation = () => {
    // Clear existing quotation items and add cart items
    clearItems();
    addItemsFromCart(cart.items);
    router.push("/quotation/create");
  };

  if (cart.items.length === 0) {
    return (
      /* ========== START: MAIN SITE - EMPTY CART STATE ========== */
      <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 mx-auto mb-6 bg-[#2a2a2a] rounded-full flex items-center justify-center">
            <ShoppingCart className="w-12 h-12 text-[#808080]" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-3">Your Cart is Empty</h1>
          <p className="text-[#B0B0B0] mb-6 max-w-md mx-auto">
            Looks like you haven&apos;t added any items to your cart yet. Start shopping to fill it up!
          </p>
          <Link href="/products">
            <Button size="lg">
              Start Shopping
            </Button>
          </Link>
        </div>
      </div>
      /* ========== END: MAIN SITE - EMPTY CART STATE ========== */
    );
  }

  return (
    <div className="min-h-screen bg-[#1a1a1a]">
      {/* ========== START: MAIN SITE - CART BREADCRUMB ========== */}
      <div className="bg-[#2a2a2a] border-b border-[#3a3a3a]">
        <div className="container mx-auto px-4 py-3">
          <nav className="flex items-center gap-2 text-sm">
            <Link href="/" className="text-[#B0B0B0] hover:text-white transition-colors">
              Home
            </Link>
            <ChevronRight className="w-4 h-4 text-[#808080]" />
            <span className="text-white">Shopping Cart</span>
          </nav>
        </div>
      </div>
      {/* ========== END: MAIN SITE - CART BREADCRUMB ========== */}

      <div className="container mx-auto px-4 py-8">
        {/* --- START: Cart Page Header with Clear Cart Button --- */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-white">
            Shopping Cart ({cart.items.length} {cart.items.length === 1 ? "product" : "products"})
          </h1>
          <Button
            variant="ghost"
            size="sm"
            onClick={clearCart}
            className="text-[#f44336] hover:text-[#f44336] hover:bg-[#f44336]/10"
          >
            Clear Cart
          </Button>
        </div>
        {/* --- END: Cart Page Header with Clear Cart Button --- */}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* ========== START: MAIN SITE - CART ITEMS LIST ========== */}
          <div className="lg:col-span-2 space-y-4">
            {cart.items.map((item) => {
              const price = Number(item.product.discountPrice) || Number(item.product.basePrice) || 0;
              const configPrice = Number(item.configurationPrice) || 0;
              const qty = Number(item.quantity) || 0;
              const itemTotal = (price + configPrice) * qty;
              const stockQty = Number(item.product.stockQuantity) || 0;

              return (
                /* --- START: Individual Cart Item Card --- */
                <div
                  key={item.id}
                  className="bg-[#2a2a2a] rounded-xl border border-[#3a3a3a] p-4 md:p-6"
                >
                  <div className="flex flex-col md:flex-row gap-4">
                    {/* --- START: Cart Item - Product Image --- */}
                    <div className="w-full md:w-32 h-32 bg-[#1a1a1a] rounded-lg flex items-center justify-center flex-shrink-0">
                      <div className="w-16 h-16 bg-[#3a3a3a] rounded flex items-center justify-center">
                        <svg
                          className="w-8 h-8 text-[#4A9EFF]"
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
                    {/* --- END: Cart Item - Product Image --- */}

                    {/* --- START: Cart Item - Product Info Section --- */}
                    <div className="flex-1">
                      <Link
                        href={`/product/${item.product.slug}`}
                        className="text-white font-medium hover:text-[#4A9EFF] transition-colors"
                      >
                        {item.product.name}
                      </Link>
                      <p className="text-[#808080] text-sm mt-1">
                        SKU: {item.product.sku}
                      </p>

                      {/* --- START: Cart Item - Configuration Display --- */}
                      {item.selectedConfiguration && Object.keys(item.selectedConfiguration).length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {Object.entries(item.selectedConfiguration).map(([key, value]) => {
                            const configOption = item.product.configurationOptions?.find(
                              (opt) => opt.id === key
                            );
                            const selectedValue = configOption?.options.find(
                              (opt) => opt.id === value
                            );
                            return (
                              <span
                                key={key}
                                className="text-xs px-2 py-1 bg-[#1a1a1a] rounded text-[#B0B0B0]"
                              >
                                {configOption?.name}: {selectedValue?.label}
                              </span>
                            );
                          })}
                        </div>
                      )}
                      {/* --- END: Cart Item - Configuration Display --- */}

                      <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-4 gap-4">
                        {/* --- START: Cart Item - Unit Price Display --- */}
                        <div>
                          <span className="price-text text-lg font-bold text-white">
                            {formatPrice(price + configPrice)}
                          </span>
                          {item.product.discountPrice && Number(item.product.discountPrice) > 0 && (
                            <span className="price-text text-sm text-[#808080] line-through ml-2">
                              {formatPrice((Number(item.product.basePrice) || 0) + configPrice)}
                            </span>
                          )}
                        </div>
                        {/* --- END: Cart Item - Unit Price Display --- */}

                        {/* --- START: Cart Item - Quantity Controls Section --- */}
                        <div className="flex items-center gap-4">
                          <div className="flex items-center bg-[#1a1a1a] rounded-lg border border-[#3a3a3a]">
                            <button
                              onClick={() =>
                                updateQuantity(item.id, qty - 1)
                              }
                              className="p-2 text-[#B0B0B0] hover:text-white transition-colors"
                              disabled={qty <= 1}
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="w-10 text-center text-white font-medium">
                              {qty}
                            </span>
                            <button
                              onClick={() =>
                                updateQuantity(item.id, qty + 1)
                              }
                              className="p-2 text-[#B0B0B0] hover:text-white transition-colors"
                              disabled={qty >= stockQty}
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="p-2 text-[#808080] hover:text-[#f44336] transition-colors"
                            title="Remove item"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                        {/* --- END: Cart Item - Quantity Controls Section --- */}
                      </div>
                    </div>
                    {/* --- END: Cart Item - Product Info Section --- */}

                    {/* --- START: Cart Item - Line Item Total --- */}
                    <div className="text-right md:ml-4">
                      <p className="text-[#808080] text-sm">Subtotal</p>
                      <p className="price-text text-xl font-bold text-white">
                        {formatPrice(itemTotal)}
                      </p>
                    </div>
                    {/* --- END: Cart Item - Line Item Total --- */}
                  </div>
                </div>
                /* --- END: Individual Cart Item Card --- */
              );
            })}
          </div>
          {/* ========== END: MAIN SITE - CART ITEMS LIST ========== */}

          {/* ========== START: MAIN SITE - CART ORDER SUMMARY SIDEBAR ========== */}
          <div className="lg:col-span-1">
            <div className="bg-[#2a2a2a] rounded-xl border border-[#3a3a3a] p-6 sticky top-24">
              <h2 className="text-xl font-bold text-white mb-6">Order Summary</h2>

              {/* --- START: Order Summary - Line Items --- */}
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-[#B0B0B0]">
                  <span>Products ({cart.items.length})</span>
                  <span className="text-white">{cart.itemCount} {cart.itemCount === 1 ? "unit" : "units"}</span>
                </div>
                <div className="flex justify-between text-[#B0B0B0]">
                  <span>Subtotal</span>
                  <span className="text-white price-text">{formatPrice(cart.subtotal)}</span>
                </div>
                <div className="flex justify-between text-[#B0B0B0]">
                  <span>Shipping</span>
                  <span className="text-white">Calculated at checkout</span>
                </div>
              </div>
              {/* --- END: Order Summary - Line Items --- */}

              {/* --- START: Order Summary - Total --- */}
              <div className="border-t border-[#3a3a3a] pt-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-lg font-bold text-white">Total</span>
                  <span className="text-lg font-bold text-white price-text">
                    {formatPrice(cart.subtotal)}
                  </span>
                </div>
              </div>
              {/* --- END: Order Summary - Total --- */}

              {/* --- START: Order Summary - Action Buttons --- */}
              <div className="space-y-3">
                <Button className="w-full" size="lg" onClick={handleProceedToQuotation}>
                  Proceed to Quotation
                </Button>
                <Link href="/products" className="block">
                  <Button
                    variant="outline"
                    className="w-full"
                    leftIcon={<ArrowLeft className="w-4 h-4" />}
                  >
                    Continue Shopping
                  </Button>
                </Link>
              </div>
              {/* --- END: Order Summary - Action Buttons --- */}


            </div>
          </div>
          {/* ========== END: MAIN SITE - CART ORDER SUMMARY SIDEBAR ========== */}
        </div>
      </div>
    </div>
  );
}
/* ============================================================================
   END OF FILE: MAIN SITE - CART PAGE
   ============================================================================ */
