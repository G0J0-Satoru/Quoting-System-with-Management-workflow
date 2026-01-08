"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Search, Edit, Trash2, FolderTree, Loader2 } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Category } from "@/types";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/categories");
      const data = await res.json();
      setCategories(data.categories || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;
    
    setDeleting(id);
    try {
      const res = await fetch(`/api/categories/${id}`, { method: "DELETE" });
      const data = await res.json();
      
      if (res.ok) {
        setCategories(categories.filter((c) => c.id !== id));
      } else {
        alert(data.error || "Failed to delete category");
      }
    } catch (error) {
      console.error("Error deleting category:", error);
      alert("Failed to delete category");
    } finally {
      setDeleting(null);
    }
  };

  const filteredCategories = categories.filter(
    (category) =>
      !searchQuery ||
      category.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <AdminShell title="Categories" description="Manage product categories">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-[#4A9EFF]" />
        </div>
      </AdminShell>
    );
  }

  return (
    <AdminShell
      title="Categories"
      description="Manage product categories"
    >
      {/* Actions Bar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1 flex items-center bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 py-2">
          <Search className="w-5 h-5 text-[#808080]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search categories..."
            className="flex-1 bg-transparent border-none outline-none text-white placeholder-[#808080] text-sm ml-2"
          />
        </div>
        <Link href="/admin/categories/new">
          <Button leftIcon={<Plus className="w-4 h-4" />}>Add Category</Button>
        </Link>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredCategories.map((category) => (
          <div
            key={category.id}
            className="bg-[#1a1a1a] rounded-xl border border-[#2a2a2a] p-5 hover:border-[#4A9EFF]/50 transition-colors"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-[#4A9EFF]/10 rounded-lg flex items-center justify-center">
                <FolderTree className="w-6 h-6 text-[#4A9EFF]" />
              </div>
              <Badge
                variant={category.status === "active" ? "success" : "default"}
                size="sm"
              >
                {category.status}
              </Badge>
            </div>
            <h3 className="font-semibold text-white mb-1">{category.name}</h3>
            <p className="text-sm text-[#808080] mb-4 line-clamp-2">
              {category.description || "No description"}
            </p>
            <div className="flex items-center gap-2">
              <Link href={`/admin/categories/${category.id}`} className="flex-1">
                <Button variant="outline" size="sm" className="w-full">
                  <Edit className="w-4 h-4 mr-1" />
                  Edit
                </Button>
              </Link>
              <button
                type="button"
                onClick={() => handleDelete(category.id, category.name)}
                disabled={deleting === category.id}
                className="p-2 text-[#808080] hover:text-[#f44336] transition-colors border border-[#2a2a2a] rounded-lg disabled:opacity-50"
              >
                {deleting === category.id ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredCategories.length === 0 && (
        <div className="bg-[#1a1a1a] rounded-xl border border-[#2a2a2a] p-8 text-center">
          <FolderTree className="w-12 h-12 text-[#808080] mx-auto mb-3" />
          <p className="text-[#808080]">No categories found</p>
        </div>
      )}
    </AdminShell>
  );
}
