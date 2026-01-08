/** ============================================================================
 *  MAIN SITE - CREATE QUOTATION PAGE
 *  ============================================================================
 *  Form page for customers to submit a quotation request with their details
 *  
 *  SECTIONS IN THIS FILE:
 *  - Form Validation & Submit Handlers
 *  - Empty State (no items to quote)
 *  - Breadcrumb Navigation
 *  - Page Header
 *  - Main Form Grid:
 *    - Customer Information Form (left column)
 *      - Name, Company, Email, Phone, Address inputs
 *    - Additional Notes Section
 *    - Quotation Items Preview
 *    - Order Summary Sidebar (right column - sticky)
 *      - Subtotal, VAT, Total
 *      - Submit Button
 *      - Validity Note
 *  ============================================================================ */
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronRight, FileText, User, Building2, Mail, Phone, MapPin, MessageSquare } from "lucide-react";
import { formatPrice, generateQuotationNumber } from "@/lib/utils";
import { useQuotation } from "@/context/QuotationContext";
import { useToast } from "@/context/ToastContext";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import type { Quotation } from "@/types";

export default function CreateQuotationPage() {
  const router = useRouter();
  const { state, saveQuotation, getSubtotal, clearItems } = useQuotation();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    companyName: "",
    address: "",
    notes: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const subtotal = getSubtotal();
  const vatRate = 0.12; // 12% VAT
  const vatAmount = subtotal * vatRate;
  const total = subtotal + vatAmount;

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.customerName.trim()) {
      newErrors.customerName = "Name is required";
    }

    if (!formData.customerEmail.trim()) {
      newErrors.customerEmail = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.customerEmail)) {
      newErrors.customerEmail = "Invalid email address";
    }

    if (!formData.customerPhone.trim()) {
      newErrors.customerPhone = "Phone number is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    if (state.items.length === 0) {
      showToast("Please add items to your quotation first", "error");
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare items for API - items are QuotationItem type with productId, productName, etc.
      const quotationItems = state.items.map((item) => ({
        productId: item.productId,
        productName: item.productName,
        quantity: item.quantity,
        price: item.unitPrice,
      }));

      // Send to API
      const response = await fetch("/api/quotations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: formData.customerName,
          customerEmail: formData.customerEmail,
          customerPhone: formData.customerPhone,
          companyName: formData.companyName || undefined,
          items: quotationItems,
          subtotal,
          tax: vatAmount,
          total,
          notes: formData.notes || undefined,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create quotation");
      }

      const data = await response.json();
      
      // Also save locally
      const quotation: Quotation = {
        ...data.quotation,
        items: [...state.items],
      };

      saveQuotation(quotation);
      clearItems();
      showToast("Quotation submitted successfully!", "success");
      router.push("/quotation");
    } catch (error) {
      console.error("Error creating quotation:", error);
      showToast("Failed to create quotation. Please try again.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (state.items.length === 0) {
    return (
      <div className="min-h-screen bg-[#1a1a1a]">
        {/* ========== START: MAIN SITE - CREATE QUOTATION EMPTY STATE BREADCRUMB ========== */}
        <div className="bg-[#2a2a2a] border-b border-[#3a3a3a]">
          <div className="container mx-auto px-4 py-3">
            <nav className="flex items-center gap-2 text-sm">
              <Link href="/" className="text-[#B0B0B0] hover:text-white transition-colors">
                Home
              </Link>
              <ChevronRight className="w-4 h-4 text-[#808080]" />
              <Link href="/quotation" className="text-[#B0B0B0] hover:text-white transition-colors">
                Quotations
              </Link>
              <ChevronRight className="w-4 h-4 text-[#808080]" />
              <span className="text-white">Create</span>
            </nav>
          </div>
        </div>
        {/* ========== END: MAIN SITE - CREATE QUOTATION EMPTY STATE BREADCRUMB ========== */}

        {/* ========== START: MAIN SITE - NO ITEMS EMPTY STATE ========== */}
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-20 h-20 mx-auto mb-6 bg-[#2a2a2a] rounded-full flex items-center justify-center">
              <FileText className="w-10 h-10 text-[#808080]" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">No Items to Quote</h2>
            <p className="text-[#B0B0B0] mb-6">
              Add products to your quotation before generating a quote request.
            </p>
            <Link href="/products">
              <Button>Browse Products</Button>
            </Link>
          </div>
        </div>
        {/* ========== END: MAIN SITE - NO ITEMS EMPTY STATE ========== */}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1a1a1a]">
      {/* ========== START: MAIN SITE - CREATE QUOTATION BREADCRUMB ========== */}
      <div className="bg-[#2a2a2a] border-b border-[#3a3a3a]">
        <div className="container mx-auto px-4 py-3">
          <nav className="flex items-center gap-2 text-sm">
            <Link href="/" className="text-[#B0B0B0] hover:text-white transition-colors">
              Home
            </Link>
            <ChevronRight className="w-4 h-4 text-[#808080]" />
            <Link href="/quotation" className="text-[#B0B0B0] hover:text-white transition-colors">
              Quotations
            </Link>
            <ChevronRight className="w-4 h-4 text-[#808080]" />
            <span className="text-white">Create</span>
          </nav>
        </div>
      </div>
      {/* ========== END: MAIN SITE - CREATE QUOTATION BREADCRUMB ========== */}

      <div className="container mx-auto px-4 py-8">
        {/* ========== START: MAIN SITE - CREATE QUOTATION PAGE HEADER ========== */}
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-8">
          Create Quotation Request
        </h1>
        {/* ========== END: MAIN SITE - CREATE QUOTATION PAGE HEADER ========== */}

        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-3 gap-8">
            {/* ========== START: MAIN SITE - QUOTATION FORM LEFT COLUMN ========== */}
            <div className="lg:col-span-2 space-y-6">
              {/* --- START: Customer Information Form --- */}
              <div className="bg-[#2a2a2a] rounded-xl border border-[#3a3a3a] p-6">
                <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                  <User className="w-5 h-5 text-[#4A9EFF]" />
                  Customer Information
                </h2>

                <div className="grid sm:grid-cols-2 gap-4">
                  <Input
                    label="Full Name *"
                    name="customerName"
                    value={formData.customerName}
                    onChange={handleChange}
                    error={errors.customerName}
                    placeholder="John Doe"
                  />
                  <Input
                    label="Company Name"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    placeholder="Company Inc."
                    leftIcon={<Building2 className="w-4 h-4" />}
                  />
                  <Input
                    label="Email Address *"
                    type="email"
                    name="customerEmail"
                    value={formData.customerEmail}
                    onChange={handleChange}
                    error={errors.customerEmail}
                    placeholder="john@example.com"
                    leftIcon={<Mail className="w-4 h-4" />}
                  />
                  <Input
                    label="Phone Number *"
                    type="tel"
                    name="customerPhone"
                    value={formData.customerPhone}
                    onChange={handleChange}
                    error={errors.customerPhone}
                    placeholder="+63 912 345 6789"
                    leftIcon={<Phone className="w-4 h-4" />}
                  />
                </div>

                <div className="mt-4">
                  <Input
                    label="Address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Street, City, Province"
                    leftIcon={<MapPin className="w-4 h-4" />}
                  />
                </div>
              </div>
              {/* --- END: Customer Information Form --- */}

              {/* --- START: Additional Notes Section --- */}
              <div className="bg-[#2a2a2a] rounded-xl border border-[#3a3a3a] p-6">
                <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-[#4A9EFF]" />
                  Additional Notes
                </h2>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Any special requirements or questions..."
                  className="w-full bg-[#1a1a1a] border border-[#3a3a3a] rounded-lg px-4 py-3 text-white placeholder-[#808080] focus:outline-none focus:border-[#4A9EFF] resize-none"
                />
              </div>
              {/* --- END: Additional Notes Section --- */}

              {/* --- START: Quotation Items Preview --- */}
              <div className="bg-[#2a2a2a] rounded-xl border border-[#3a3a3a] overflow-hidden">
                <div className="p-4 border-b border-[#3a3a3a]">
                  <h2 className="font-semibold text-white">
                    Quotation Items ({state.items.length})
                  </h2>
                </div>
                <div className="divide-y divide-[#3a3a3a]">
                  {state.items.map((item) => (
                    <div key={item.productId} className="p-4 flex items-center justify-between">
                      <div>
                        <p className="font-medium text-white">{item.productName}</p>
                        <p className="text-sm text-[#808080]">
                          Qty: {item.quantity} × {formatPrice(item.unitPrice + item.configurationPrice)}
                        </p>
                      </div>
                      <p className="font-medium text-white price-text">
                        {formatPrice(item.subtotal)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
              {/* --- END: Quotation Items Preview --- */}
            </div>
            {/* ========== END: MAIN SITE - QUOTATION FORM LEFT COLUMN ========== */}

            {/* ========== START: MAIN SITE - QUOTATION SUMMARY SIDEBAR ========== */}
            {/* Right column: Sticky summary with totals and submit button */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                {/* --- START: Summary Card --- */}
                <div className="bg-[#2a2a2a] rounded-xl border border-[#3a3a3a] overflow-hidden">
                  <div className="p-4 border-b border-[#3a3a3a]">
                    <h2 className="font-semibold text-white">Quotation Summary</h2>
                  </div>
                  {/* --- START: Summary - Line Items --- */}
                  <div className="p-4 space-y-3">
                    <div className="flex justify-between text-[#B0B0B0]">
                      <span>Subtotal</span>
                      <span className="price-text">{formatPrice(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-[#B0B0B0]">
                      <span>VAT (12%)</span>
                      <span className="price-text">{formatPrice(vatAmount)}</span>
                    </div>
                    <div className="pt-3 border-t border-[#3a3a3a] flex justify-between">
                      <span className="font-semibold text-white">Total</span>
                      <span className="font-bold text-lg text-[#4A9EFF] price-text">
                        {formatPrice(total)}
                      </span>
                    </div>
                  </div>
                  {/* --- END: Summary - Line Items --- */}
                  {/* --- START: Summary - Action Buttons --- */}
                  <div className="p-4 border-t border-[#3a3a3a] space-y-3">
                    <Button
                      type="submit"
                      className="w-full"
                      isLoading={isSubmitting}
                    >
                      Submit Quotation Request
                    </Button>
                    <Link href="/quotation">
                      <Button variant="ghost" className="w-full">
                        Cancel
                      </Button>
                    </Link>
                  </div>
                  {/* --- END: Summary - Action Buttons --- */}
                </div>
                {/* --- END: Summary Card --- */}

                {/* --- START: Validity Note Card --- */}
                <div className="mt-4 p-4 bg-[#2a2a2a] rounded-xl border border-[#3a3a3a]">
                  <p className="text-sm text-[#B0B0B0]">
                    <strong className="text-white">Note:</strong> This quotation is valid for 30 days. 
                    Our team will review your request and get back to you within 24-48 hours.
                  </p>
                </div>
                {/* --- END: Validity Note Card --- */}
              </div>
            </div>
            {/* ========== END: MAIN SITE - QUOTATION SUMMARY SIDEBAR ========== */}
          </div>
        </form>
      </div>
    </div>
  );
}
/* ============================================================================
   END OF FILE: MAIN SITE - CREATE QUOTATION PAGE
   ============================================================================ */
