"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Search, Edit, Trash2, Building2, Loader2 } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Brand } from "@/types";

export default function AdminBrandsPage() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    try {
      const res = await fetch("/api/brands");
      const data = await res.json();
      setBrands(data.brands || []);
    } catch (error) {
      console.error("Error fetching brands:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;
    
    setDeleting(id);
    try {
      const res = await fetch(`/api/brands/${id}`, { method: "DELETE" });
      const data = await res.json();
      
      if (res.ok) {
        setBrands(brands.filter((b) => b.id !== id));
      } else {
        alert(data.error || "Failed to delete brand");
      }
    } catch (error) {
      console.error("Error deleting brand:", error);
      alert("Failed to delete brand");
    } finally {
      setDeleting(null);
    }
  };

  const filteredBrands = brands.filter(
    (brand) =>
      !searchQuery ||
      brand.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <AdminShell title="Brands" description="Manage product brands">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-[#4A9EFF]" />
        </div>
      </AdminShell>
    );
  }

  return (
    <AdminShell
      title="Brands"
      description="Manage product brands"
    >
      {/* Actions Bar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1 flex items-center bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 py-2">
          <Search className="w-5 h-5 text-[#808080]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search brands..."
            className="flex-1 bg-transparent border-none outline-none text-white placeholder-[#808080] text-sm ml-2"
          />
        </div>
        <Link href="/admin/brands/new">
          <Button leftIcon={<Plus className="w-4 h-4" />}>Add Brand</Button>
        </Link>
      </div>

      {/* Brands Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredBrands.map((brand) => (
          <div
            key={brand.id}
            className="bg-[#1a1a1a] rounded-xl border border-[#2a2a2a] p-5 hover:border-[#4A9EFF]/50 transition-colors"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-[#FFA726]/10 rounded-lg flex items-center justify-center">
                <Building2 className="w-6 h-6 text-[#FFA726]" />
              </div>
              <Badge
                variant={brand.status === "active" ? "success" : "default"}
                size="sm"
              >
                {brand.status}
              </Badge>
            </div>
            <h3 className="font-semibold text-white mb-1">{brand.name}</h3>
            <p className="text-sm text-[#808080] mb-4 line-clamp-2">
              {brand.description || "No description"}
            </p>
            {brand.websiteUrl && (
              <a
                href={brand.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-[#4A9EFF] hover:underline block mb-4 truncate"
              >
                {brand.websiteUrl}
              </a>
            )}
            <div className="flex items-center gap-2">
              <Link href={`/admin/brands/${brand.id}`} className="flex-1">
                <Button variant="outline" size="sm" className="w-full">
                  <Edit className="w-4 h-4 mr-1" />
                  Edit
                </Button>
              </Link>
              <button
                type="button"
                onClick={() => handleDelete(brand.id, brand.name)}
                disabled={deleting === brand.id}
                className="p-2 text-[#808080] hover:text-[#f44336] transition-colors border border-[#2a2a2a] rounded-lg disabled:opacity-50"
              >
                {deleting === brand.id ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredBrands.length === 0 && (
        <div className="bg-[#1a1a1a] rounded-xl border border-[#2a2a2a] p-8 text-center">
          <Building2 className="w-12 h-12 text-[#808080] mx-auto mb-3" />
          <p className="text-[#808080]">No brands found</p>
        </div>
      )}
    </AdminShell>
  );
}
