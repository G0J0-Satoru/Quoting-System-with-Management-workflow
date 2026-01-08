"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ChevronRight, Download, ArrowLeft } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { useQuotation } from "@/context/QuotationContext";
import { Button } from "@/components/ui/Button";

export default function QuotationViewPage() {
  const params = useParams();
  const router = useRouter();
  const { state } = useQuotation();

  const quotation = useMemo(() => {
    const id = params.id as string;
    return state.quotations.find((q) => q.id === id) || null;
  }, [params.id, state.quotations]);

  const handleDownloadPDF = () => {
    if (!quotation) return;

    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Quotation ${quotation?.quotationNumber}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: Arial, sans-serif; padding: 40px; color: #333; }
            .header { text-align: center; margin-bottom: 40px; border-bottom: 2px solid #4A9EFF; padding-bottom: 20px; }
            .header h1 { color: #1a1a1a; font-size: 28px; margin-bottom: 5px; }
            .header p { color: #666; }
            .quote-info { display: flex; justify-content: space-between; margin-bottom: 30px; }
            .quote-info div { flex: 1; }
            .quote-info h3 { color: #4A9EFF; font-size: 14px; margin-bottom: 10px; text-transform: uppercase; }
            .quote-info p { font-size: 14px; margin-bottom: 5px; }
            .items-table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
            .items-table th { background: #4A9EFF; color: white; padding: 12px; text-align: left; font-size: 12px; text-transform: uppercase; }
            .items-table td { padding: 12px; border-bottom: 1px solid #eee; font-size: 14px; }
            .items-table tr:nth-child(even) { background: #f9f9f9; }
            .totals { text-align: right; margin-top: 20px; }
            .totals p { font-size: 14px; margin-bottom: 8px; }
            .totals .total { font-size: 20px; font-weight: bold; color: #4A9EFF; }
            .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; text-align: center; color: #666; font-size: 12px; }
            .validity { background: #f0f7ff; padding: 15px; border-radius: 8px; margin-top: 20px; }
            .validity p { font-size: 13px; color: #555; }
            @media print { body { padding: 20px; } }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>COMPUTER WORLD</h1>
            <p>Your Trusted Technology Partner</p>
          </div>
          
          <div class="quote-info">
            <div>
              <h3>Quotation Details</h3>
              <p><strong>Quote #:</strong> ${quotation?.quotationNumber}</p>
              <p><strong>Date:</strong> ${quotation ? new Date(quotation.createdAt).toLocaleDateString() : ""}</p>
              <p><strong>Valid Until:</strong> ${quotation ? new Date(quotation.validUntil).toLocaleDateString() : ""}</p>
            </div>
            <div>
              <h3>Customer Information</h3>
              <p><strong>Name:</strong> ${quotation?.customerName}</p>
              <p><strong>Email:</strong> ${quotation?.customerEmail}</p>
              <p><strong>Phone:</strong> ${quotation?.customerPhone}</p>
              ${quotation?.companyName ? `<p><strong>Company:</strong> ${quotation.companyName}</p>` : ""}
              ${quotation?.address ? `<p><strong>Address:</strong> ${quotation.address}</p>` : ""}
            </div>
          </div>

          <table class="items-table">
            <thead>
              <tr>
                <th>Item</th>
                <th>SKU</th>
                <th>Qty</th>
                <th>Unit Price</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              ${quotation?.items.map((item) => `
                <tr>
                  <td>${item.productName}</td>
                  <td>${item.productSku}</td>
                  <td>${item.quantity}</td>
                  <td>LKR ${(item.unitPrice + item.configurationPrice).toLocaleString()}</td>
                  <td>LKR ${item.subtotal.toLocaleString()}</td>
                </tr>
              `).join("")}
            </tbody>
          </table>

          <div class="totals">
            <p>Subtotal: LKR ${quotation?.subtotal.toLocaleString()}</p>
            <p>VAT (12%): LKR ${quotation?.tax.toLocaleString()}</p>
            ${quotation?.discount ? `<p>Discount: -LKR ${quotation.discount.toLocaleString()}</p>` : ""}
            <p class="total">Total: LKR ${quotation?.total.toLocaleString()}</p>
          </div>

          <div class="validity">
            <p><strong>Terms & Conditions:</strong></p>
            <p>• This quotation is valid for 30 days from the date of issue.</p>
            <p>• Prices are subject to change without prior notice after validity period.</p>
            <p>• Payment terms: 50% advance, balance on delivery.</p>
            <p>• Delivery within 3-5 business days after order confirmation.</p>
          </div>

          ${quotation?.notes ? `<div class="validity"><p><strong>Notes:</strong> ${quotation.notes}</p></div>` : ""}

          <div class="footer">
            <p>Computer World | 123 Tech Street, Colombo 03 | Tel: +94 11 234 5678</p>
            <p>Email: sales@computerworld.lk | www.computerworld.lk</p>
          </div>
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();
    
    // Wait for content to load then print
    setTimeout(() => {
      printWindow.print();
    }, 500);
  };

  if (!quotation) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#B0B0B0] mb-4">Quotation not found</p>
          <Link href="/quotation">
            <Button>Back to Quotations</Button>
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
            <Link href="/quotation" className="text-[#B0B0B0] hover:text-white transition-colors">
              Quotations
            </Link>
            <ChevronRight className="w-4 h-4 text-[#808080]" />
            <span className="text-white">{quotation.quotationNumber}</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="p-2 text-[#B0B0B0] hover:text-white transition-colors"
              title="Go back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-white">{quotation.quotationNumber}</h1>
              <p className="text-[#808080] text-sm">
                Created on {new Date(quotation.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button onClick={handleDownloadPDF} leftIcon={<Download className="w-4 h-4" />}>
              Download PDF
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Customer Info Card */}
            <div className="bg-[#2a2a2a] rounded-xl border border-[#3a3a3a] p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Customer Information</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-[#808080] text-sm">Name</p>
                  <p className="text-white">{quotation.customerName}</p>
                </div>
                <div>
                  <p className="text-[#808080] text-sm">Email</p>
                  <p className="text-white">{quotation.customerEmail}</p>
                </div>
                <div>
                  <p className="text-[#808080] text-sm">Phone</p>
                  <p className="text-white">{quotation.customerPhone}</p>
                </div>
                {quotation.companyName && (
                  <div>
                    <p className="text-[#808080] text-sm">Company</p>
                    <p className="text-white">{quotation.companyName}</p>
                  </div>
                )}
                {quotation.address && (
                  <div className="sm:col-span-2">
                    <p className="text-[#808080] text-sm">Address</p>
                    <p className="text-white">{quotation.address}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Items Card */}
            <div className="bg-[#2a2a2a] rounded-xl border border-[#3a3a3a] overflow-hidden">
              <div className="p-4 border-b border-[#3a3a3a]">
                <h2 className="font-semibold text-white">Quoted Items</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-[#252525]">
                    <tr>
                      <th className="text-left p-4 text-[#808080] text-sm font-medium">Item</th>
                      <th className="text-left p-4 text-[#808080] text-sm font-medium">SKU</th>
                      <th className="text-center p-4 text-[#808080] text-sm font-medium">Qty</th>
                      <th className="text-right p-4 text-[#808080] text-sm font-medium">Unit Price</th>
                      <th className="text-right p-4 text-[#808080] text-sm font-medium">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#3a3a3a]">
                    {quotation.items.map((item, index) => (
                      <tr key={index}>
                        <td className="p-4">
                          <p className="text-white">{item.productName}</p>
                          {item.configuration && Object.keys(item.configuration).length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1">
                              {Object.entries(item.configuration).map(([key, value]) => (
                                <span key={key} className="text-xs px-2 py-0.5 bg-[#1a1a1a] rounded text-[#B0B0B0]">
                                  {value}
                                </span>
                              ))}
                            </div>
                          )}
                        </td>
                        <td className="p-4 text-[#B0B0B0]">{item.productSku}</td>
                        <td className="p-4 text-center text-white">{item.quantity}</td>
                        <td className="p-4 text-right text-white price-text">
                          {formatPrice(item.unitPrice + item.configurationPrice)}
                        </td>
                        <td className="p-4 text-right text-white font-medium price-text">
                          {formatPrice(item.subtotal)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Notes */}
            {quotation.notes && (
              <div className="bg-[#2a2a2a] rounded-xl border border-[#3a3a3a] p-6">
                <h2 className="text-lg font-semibold text-white mb-2">Notes</h2>
                <p className="text-[#B0B0B0]">{quotation.notes}</p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Validity Card */}
            <div className="bg-[#2a2a2a] rounded-xl border border-[#3a3a3a] p-6">
              <h2 className="font-semibold text-white mb-4">Quotation Details</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-[#808080]">Valid Until</span>
                  <span className="text-white">{new Date(quotation.validUntil).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#808080]">Created</span>
                  <span className="text-white">{new Date(quotation.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            {/* Summary Card */}
            <div className="bg-[#2a2a2a] rounded-xl border border-[#3a3a3a] p-6">
              <h2 className="font-semibold text-white mb-4">Summary</h2>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-[#808080]">Subtotal</span>
                  <span className="text-white price-text">{formatPrice(quotation.subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#808080]">VAT (12%)</span>
                  <span className="text-white price-text">{formatPrice(quotation.tax)}</span>
                </div>
                {quotation.discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-[#808080]">Discount</span>
                    <span className="text-[#4CAF50] price-text">-{formatPrice(quotation.discount)}</span>
                  </div>
                )}
                <div className="pt-3 border-t border-[#3a3a3a]">
                  <div className="flex justify-between">
                    <span className="font-medium text-white">Total</span>
                    <span className="text-xl font-bold text-[#4A9EFF] price-text">
                      {formatPrice(quotation.total)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions Card */}
            <div className="bg-[#2a2a2a] rounded-xl border border-[#3a3a3a] p-6">
              <h2 className="font-semibold text-white mb-4">Actions</h2>
              <div className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleDownloadPDF}
                  leftIcon={<Download className="w-4 h-4" />}
                >
                  Download PDF
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
