/** ============================================================================
 *  ADMIN SITE - QUOTATIONS PAGE
 *  ============================================================================
 *  Admin page for managing customer quotation requests
 *  
 *  SECTIONS IN THIS FILE:
 *  - Loading State
 *  - Status Stats Cards (Pending, Sent, Approved, Draft counts)
 *  - Search and Filter Bar
 *  - Quotations Table (Number, Customer, Items, Total, Status, Date, Actions)
 *  - Empty State
 *  - Quotation Details Modal (Customer Info, Items, Totals, Notes, Approval Actions)
 *  ============================================================================ */
"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Search,
  Eye,
  FileText,
  X,
  Trash2,
  Loader2,
} from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { Badge } from "@/components/ui/Badge";
import { formatPrice } from "@/lib/utils";
import { useToast } from "@/context/ToastContext";

interface QuotationItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}

interface Quotation {
  id: string;
  quotationNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  companyName?: string;
  items: QuotationItem[];
  itemCount: number;
  subtotal: number;
  tax: number;
  total: number;
  status: "pending" | "approved" | "rejected";
  notes?: string;
  createdAt: string;
  updatedAt: string;
  validUntil: string;
}

type QuotationStatus = "pending" | "approved" | "rejected";

export default function AdminQuotationsPage() {
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<QuotationStatus | "">("pending");
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [selectedQuotation, setSelectedQuotation] = useState<Quotation | null>(null);
  const { showToast } = useToast();

  const fetchQuotations = useCallback(async () => {
    try {
      const response = await fetch("/api/quotations");
      const data = await response.json();
      setQuotations(data.quotations || []);
    } catch (error) {
      console.error("Error fetching quotations:", error);
      showToast("Failed to load quotations", "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchQuotations();
  }, [fetchQuotations]);

  const handleStatusChange = async (id: string, newStatus: QuotationStatus) => {
    setActionLoading(id);
    try {
      const response = await fetch(`/api/quotations/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error("Failed to update status");
      }

      const statusLabels: Record<QuotationStatus, string> = {
        pending: "Pending",
        approved: "Approved",
        rejected: "Rejected",
      };

      showToast(`Quotation marked as ${statusLabels[newStatus]}`, "success");
      fetchQuotations();
    } catch (error) {
      console.error("Error updating quotation status:", error);
      showToast("Failed to update quotation status", "error");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this quotation?")) {
      return;
    }

    setActionLoading(id);
    try {
      const response = await fetch(`/api/quotations/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete quotation");
      }

      showToast("Quotation deleted successfully", "success");
      fetchQuotations();
    } catch (error) {
      console.error("Error deleting quotation:", error);
      showToast("Failed to delete quotation", "error");
    } finally {
      setActionLoading(null);
    }
  };

  const filteredQuotations = quotations.filter((quotation) => {
    const matchesSearch =
      !searchQuery ||
      quotation.quotationNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      quotation.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      quotation.customerEmail.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = !statusFilter || quotation.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: "default" | "info" | "success" | "warning" | "error"; label: string }> = {
      pending: { variant: "warning", label: "Pending" },
      approved: { variant: "success", label: "Approved" },
      rejected: { variant: "error", label: "Rejected" },
    };
    return variants[status] || { variant: "default", label: status };
  };

  const statusCounts = {
    pending: quotations.filter((q) => q.status === "pending").length,
    approved: quotations.filter((q) => q.status === "approved").length,
    rejected: quotations.filter((q) => q.status === "rejected").length,
  };

  if (loading) {
    return (
      <AdminShell title="Quotations" description="Manage customer quotation requests">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-[#4A9EFF]" />
        </div>
      </AdminShell>
    );
  }

  return (
    <AdminShell
      title="Quotations"
      description="Manage customer quotation requests"
    >
      {/* ========== START: ADMIN SITE - QUOTATIONS STATUS STATS ========== */}
      {/* Clickable status filter cards showing counts for each status */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {(["pending", "approved", "rejected"] as const).map((status) => {
          const badge = getStatusBadge(status);
          return (
            <button
              key={status}
              type="button"
              onClick={() => setStatusFilter(statusFilter === status ? "" : status)}
              className={`p-4 bg-[#1a1a1a] rounded-xl border transition-colors ${
                statusFilter === status
                  ? "border-[#4A9EFF]"
                  : "border-[#2a2a2a] hover:border-[#3a3a3a]"
              }`}
            >
              <p className="text-2xl font-bold text-white">{statusCounts[status]}</p>
              <p className="text-sm text-[#808080] capitalize">{badge.label}</p>
            </button>
          );
        })}
      </div>
      {/* ========== END: ADMIN SITE - QUOTATIONS STATUS STATS ========== */}

      {/* ========== START: ADMIN SITE - QUOTATIONS SEARCH & FILTERS ========== */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        {/* --- START: Quotations - Search Input --- */}
        <div className="flex-1 flex items-center bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 py-2">
          <Search className="w-5 h-5 text-[#808080]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search quotations..."
            className="flex-1 bg-transparent border-none outline-none text-white placeholder-[#808080] text-sm ml-2"
          />
        </div>
        {/* --- END: Quotations - Search Input --- */}
        {/* --- START: Quotations - Status Filter Dropdown --- */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as QuotationStatus | "")}
          aria-label="Filter by status"
          className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#4A9EFF]"
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
        {/* --- END: Quotations - Status Filter Dropdown --- */}
      </div>
      {/* ========== END: ADMIN SITE - QUOTATIONS SEARCH & FILTERS ========== */}

      {/* ========== START: ADMIN SITE - QUOTATIONS TABLE ========== */}
      <div className="bg-[#1a1a1a] rounded-xl border border-[#2a2a2a] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            {/* --- START: Quotations Table - Header Row --- */}
            <thead>
              <tr className="border-b border-[#2a2a2a]">
                <th className="text-left p-4 text-sm font-medium text-[#808080]">
                  Quotation
                </th>
                <th className="text-left p-4 text-sm font-medium text-[#808080]">
                  Customer
                </th>
                <th className="text-left p-4 text-sm font-medium text-[#808080]">
                  Items
                </th>
                <th className="text-left p-4 text-sm font-medium text-[#808080]">
                  Total
                </th>
                <th className="text-left p-4 text-sm font-medium text-[#808080]">
                  Status
                </th>
                <th className="text-left p-4 text-sm font-medium text-[#808080]">
                  Date
                </th>
                <th className="text-right p-4 text-sm font-medium text-[#808080]">
                  Actions
                </th>
              </tr>
            </thead>
            {/* --- END: Quotations Table - Header Row --- */}
            {/* --- START: Quotations Table - Body Rows --- */}
            <tbody>
              {filteredQuotations.map((quotation) => {
                const badge = getStatusBadge(quotation.status);
                const isLoading = actionLoading === quotation.id;
                return (
                  <tr
                    key={quotation.id}
                    className="border-b border-[#2a2a2a] hover:bg-[#2a2a2a]/50 transition-colors"
                  >
                    <td className="p-4">
                      <p className="font-medium text-white">
                        {quotation.quotationNumber}
                      </p>
                    </td>
                    {/* --- START: Quotation Row - Customer Info Cell --- */}
                    <td className="p-4">
                      <p className="text-white">{quotation.customerName}</p>
                      <p className="text-sm text-[#808080]">
                        {quotation.customerEmail}
                      </p>
                    </td>
                    {/* --- END: Quotation Row - Customer Info Cell --- */}
                    <td className="p-4 text-[#B0B0B0]">{quotation.itemCount}</td>
                    <td className="p-4 text-white font-medium price-text">
                      {formatPrice(quotation.total)}
                    </td>
                    <td className="p-4">
                      <Badge variant={badge.variant} size="sm">
                        {badge.label}
                      </Badge>
                    </td>
                    <td className="p-4 text-[#808080]">
                      {new Date(quotation.createdAt).toLocaleDateString()}
                    </td>
                    {/* --- START: Quotation Row - Actions Cell --- */}
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-2">
                        {isLoading ? (
                          <Loader2 className="w-4 h-4 animate-spin text-[#4A9EFF]" />
                        ) : (
                          <>
                            <button
                              type="button"
                              onClick={() => setSelectedQuotation(quotation)}
                              className="p-2 text-[#808080] hover:text-white transition-colors"
                              title="View Details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            {quotation.status === "pending" && (
                              <>
                                <button
                                  type="button"
                                  onClick={() => handleStatusChange(quotation.id, "approved")}
                                  className="p-2 text-[#808080] hover:text-[#4CAF50] transition-colors"
                                  title="Approve Quotation"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                  </svg>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleStatusChange(quotation.id, "rejected")}
                                  className="p-2 text-[#808080] hover:text-[#f44336] transition-colors"
                                  title="Reject Quotation"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                </button>
                              </>
                            )}
                            <button
                              type="button"
                              onClick={() => handleDelete(quotation.id)}
                              className="p-2 text-[#808080] hover:text-[#f44336] transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                    {/* --- END: Quotation Row - Actions Cell --- */}
                  </tr>
                );
              })}
            </tbody>
            {/* --- END: Quotations Table - Body Rows --- */}
          </table>
        </div>

        {/* --- START: Quotations Table - Empty State --- */}
        {filteredQuotations.length === 0 && (
          <div className="p-8 text-center">
            <FileText className="w-12 h-12 text-[#808080] mx-auto mb-3" />
            <p className="text-[#808080]">
              {quotations.length === 0
                ? "No quotations yet. Quotations will appear here when customers request them."
                : "No quotations found matching your search."}
            </p>
          </div>
        )}
        {/* --- END: Quotations Table - Empty State --- */}
      </div>
      {/* ========== END: ADMIN SITE - QUOTATIONS TABLE ========== */}

      {/* ========== START: ADMIN SITE - QUOTATION DETAILS MODAL ========== */}
      {selectedQuotation && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1a1a1a] rounded-xl border border-[#2a2a2a] max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            {/* --- START: Modal - Header --- */}
            <div className="p-6 border-b border-[#2a2a2a] flex justify-between items-start">
              <div>
                <h2 className="text-xl font-semibold text-white">
                  {selectedQuotation.quotationNumber}
                </h2>
                <p className="text-sm text-[#808080]">
                  Created: {new Date(selectedQuotation.createdAt).toLocaleDateString()}
                </p>
              </div>
              <button
                onClick={() => setSelectedQuotation(null)}
                className="p-2 text-[#808080] hover:text-white transition-colors"
                title="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            {/* --- END: Modal - Header --- */}

            <div className="p-6 space-y-6">
              {/* --- START: Modal - Customer Information --- */}
              <div>
                <h3 className="text-sm font-medium text-[#808080] mb-2">Customer Information</h3>
                <div className="bg-[#0a0a0a] rounded-lg p-4 space-y-2">
                  <p className="text-white">{selectedQuotation.customerName}</p>
                  <p className="text-[#B0B0B0]">{selectedQuotation.customerEmail}</p>
                  <p className="text-[#B0B0B0]">{selectedQuotation.customerPhone}</p>
                  {selectedQuotation.companyName && (
                    <p className="text-[#B0B0B0]">{selectedQuotation.companyName}</p>
                  )}
                </div>
              </div>
              {/* --- END: Modal - Customer Information --- */}

              {/* --- START: Modal - Quotation Items Table --- */}
              <div>
                <h3 className="text-sm font-medium text-[#808080] mb-2">Items</h3>
                <div className="bg-[#0a0a0a] rounded-lg overflow-hidden">
                  {selectedQuotation.items && selectedQuotation.items.length > 0 ? (
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-[#2a2a2a]">
                          <th className="text-left p-3 text-sm text-[#808080]">Product</th>
                          <th className="text-center p-3 text-sm text-[#808080]">Qty</th>
                          <th className="text-right p-3 text-sm text-[#808080]">Price</th>
                          <th className="text-right p-3 text-sm text-[#808080]">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedQuotation.items.map((item, index) => (
                          <tr key={index} className="border-b border-[#2a2a2a] last:border-0">
                            <td className="p-3 text-white">{item.productName}</td>
                            <td className="p-3 text-center text-[#B0B0B0]">{item.quantity}</td>
                            <td className="p-3 text-right text-[#B0B0B0]">{formatPrice(item.price)}</td>
                            <td className="p-3 text-right text-white">{formatPrice(item.price * item.quantity)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <p className="p-4 text-[#808080] text-center">No items in this quotation</p>
                  )}
                </div>
              </div>
              {/* --- END: Modal - Quotation Items Table --- */}

              {/* --- START: Modal - Quotation Totals --- */}
              <div className="bg-[#0a0a0a] rounded-lg p-4">
                <div className="flex justify-between text-[#B0B0B0] mb-2">
                  <span>Subtotal</span>
                  <span>{formatPrice(selectedQuotation.subtotal)}</span>
                </div>
                <div className="flex justify-between text-[#B0B0B0] mb-2">
                  <span>Tax (12%)</span>
                  <span>{formatPrice(selectedQuotation.tax)}</span>
                </div>
                <div className="flex justify-between text-white font-semibold text-lg pt-2 border-t border-[#2a2a2a]">
                  <span>Total</span>
                  <span>{formatPrice(selectedQuotation.total)}</span>
                </div>
              </div>
              {/* --- END: Modal - Quotation Totals --- */}

              {/* --- START: Modal - Customer Notes --- */}
              {selectedQuotation.notes && (
                <div>
                  <h3 className="text-sm font-medium text-[#808080] mb-2">Notes</h3>
                  <div className="bg-[#0a0a0a] rounded-lg p-4">
                    <p className="text-[#B0B0B0]">{selectedQuotation.notes}</p>
                  </div>
                </div>
              )}
              {/* --- END: Modal - Customer Notes --- */}

              {/* --- START: Modal - Action Buttons --- */}
              <div className="flex gap-3 pt-4">
                {selectedQuotation.status === "pending" && (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        handleStatusChange(selectedQuotation.id, "approved");
                        setSelectedQuotation(null);
                      }}
                      className="flex-1 px-4 py-2 bg-[#4CAF50] text-white rounded-lg hover:bg-[#43a047] transition-colors"
                    >
                      Approve Quotation
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        handleStatusChange(selectedQuotation.id, "rejected");
                        setSelectedQuotation(null);
                      }}
                      className="flex-1 px-4 py-2 bg-[#f44336] text-white rounded-lg hover:bg-[#d32f2f] transition-colors"
                    >
                      Reject Quotation
                    </button>
                  </>
                )}
                <button
                  type="button"
                  onClick={() => setSelectedQuotation(null)}
                  className="flex-1 px-4 py-2 bg-[#2a2a2a] text-white rounded-lg hover:bg-[#3a3a3a] transition-colors"
                >
                  Close
                </button>
              </div>
              {/* --- END: Modal - Action Buttons --- */}
            </div>
          </div>
        </div>
      )}
      {/* ========== END: ADMIN SITE - QUOTATION DETAILS MODAL ========== */}
    </AdminShell>
  );
}
/* ============================================================================
   END OF FILE: ADMIN SITE - QUOTATIONS PAGE
   ============================================================================ */
