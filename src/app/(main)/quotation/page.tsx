/** ============================================================================
 *  MAIN SITE - QUOTATION PAGE
 *  ============================================================================
 *  Customer page to view current quotation items
 *  
 *  SECTIONS IN THIS FILE:
 *  - Breadcrumb Navigation
 *  - Page Header
 *  - Current Quotation Items
 *    - Empty State
 *    - Items List
 *    - Subtotal Bar
 *  ============================================================================ */
"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight, FileText } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { useQuotation } from "@/context/QuotationContext";
import { Button } from "@/components/ui/Button";

export default function QuotationPage() {
  const { state, removeItem, getItemCount, getSubtotal } = useQuotation();

  const itemCount = getItemCount();
  const subtotal = getSubtotal();

  return (
    <div className="min-h-screen bg-[#1a1a1a]">
      {/* ========== START: MAIN SITE - QUOTATION PAGE BREADCRUMB ========== */}
      <div className="bg-[#2a2a2a] border-b border-[#3a3a3a]">
        <div className="container mx-auto px-4 py-3">
          <nav className="flex items-center gap-2 text-sm">
            <Link href="/" className="text-[#B0B0B0] hover:text-white transition-colors">
              Home
            </Link>
            <ChevronRight className="w-4 h-4 text-[#808080]" />
            <span className="text-white">Quotations</span>
          </nav>
        </div>
      </div>
      {/* ========== END: MAIN SITE - QUOTATION PAGE BREADCRUMB ========== */}

      <div className="container mx-auto px-4 py-8">
        {/* ========== START: MAIN SITE - QUOTATION PAGE HEADER ========== */}
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-8">Quotations</h1>
        {/* ========== END: MAIN SITE - QUOTATION PAGE HEADER ========== */}

        <div className="max-w-4xl">
          {/* ========== START: MAIN SITE - CURRENT QUOTATION ITEMS ========== */}
          {/* Quotation items list */}
          <div>
            <div className="bg-[#2a2a2a] rounded-xl border border-[#3a3a3a] overflow-hidden">
              {/* --- START: Current Quotation - Header Bar --- */}
              <div className="p-4 border-b border-[#3a3a3a] flex items-center justify-between">
                <h2 className="font-semibold text-white">
                  Current Quotation Items ({itemCount})
                </h2>
                {itemCount > 0 && (
                  <Link href="/quotation/create">
                    <Button size="sm">
                      Generate Quotation
                    </Button>
                  </Link>
                )}
              </div>
              {/* --- END: Current Quotation - Header Bar --- */}

              {/* --- START: Current Quotation - Empty State --- */}
              {state.items.length === 0 ? (
                <div className="p-8 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-[#1a1a1a] rounded-full flex items-center justify-center">
                    <FileText className="w-8 h-8 text-[#808080]" />
                  </div>
                  <p className="text-[#B0B0B0] mb-4">
                    No items in your quotation yet
                  </p>
                  <Link href="/products">
                    <Button variant="outline" size="sm">
                      Browse Products
                    </Button>
                  </Link>
                </div>
              ) : (
              /* --- END: Current Quotation - Empty State --- */
              /* --- START: Current Quotation - Items List --- */
                <div className="divide-y divide-[#3a3a3a]">
                  {state.items.map((item) => (
                    <div
                      key={item.productId}
                      className="p-4 flex items-center gap-4"
                    >
                      {/* --- START: Quotation Item - Product Image --- */}
                      <div className="w-16 h-16 bg-[#1a1a1a] rounded-lg flex items-center justify-center flex-shrink-0">
                        <div className="w-8 h-8 bg-[#3a3a3a] rounded flex items-center justify-center">
                          <svg
                            className="w-4 h-4 text-[#4A9EFF]"
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
                      {/* --- END: Quotation Item - Product Image --- */}
                      {/* --- START: Quotation Item - Product Info --- */}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-white truncate">
                          {item.productName}
                        </p>
                        <p className="text-sm text-[#808080]">
                          SKU: {item.productSku}
                        </p>
                        <p className="text-sm text-[#B0B0B0]">
                          Qty: {item.quantity} × {formatPrice(item.unitPrice + item.configurationPrice)}
                        </p>
                      </div>
                      {/* --- END: Quotation Item - Product Info --- */}
                      {/* --- START: Quotation Item - Price & Remove --- */}
                      <div className="text-right">
                        <p className="font-medium text-white price-text">
                          {formatPrice(item.subtotal)}
                        </p>
                        <button
                          onClick={() => removeItem(item.productId)}
                          className="text-sm text-[#808080] hover:text-[#f44336] transition-colors"
                        >
                          Remove
                        </button>
                      </div>
                      {/* --- END: Quotation Item - Price & Remove --- */}
                    </div>
                  ))}
                </div>
              )}
              {/* --- END: Current Quotation - Items List --- */}

              {/* --- START: Current Quotation - Subtotal Bar --- */}
              {state.items.length > 0 && (
                <div className="p-4 border-t border-[#3a3a3a] bg-[#252525]">
                  <div className="flex justify-between text-lg">
                    <span className="font-medium text-white">Subtotal</span>
                    <span className="font-bold text-white price-text">
                      {formatPrice(subtotal)}
                    </span>
                  </div>
                </div>
              )}
              {/* --- END: Current Quotation - Subtotal Bar --- */}
            </div>
          </div>
          {/* ========== END: MAIN SITE - CURRENT QUOTATION ITEMS ========== */}
        </div>
      </div>
    </div>
  );
}
/* ============================================================================
   END OF FILE: MAIN SITE - QUOTATION PAGE
   ============================================================================ */
