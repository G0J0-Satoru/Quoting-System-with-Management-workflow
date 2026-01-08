/** ============================================================================
 *  ADMIN SITE - PRODUCTS PAGE
 *  ============================================================================
 *  Admin page for managing product catalog with CRUD operations
 *  
 *  SECTIONS IN THIS FILE:
 *  - Loading State
 *  - Actions Bar (Search, Category Filter, Add Product button)
 *  - Products Table (Product info, SKU, Category, Brand, Price, Stock, Status, Actions)
 *  - Empty State
 *  - Pagination Controls
 *  ============================================================================ */
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  Package,
  Loader2,
} from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { formatPrice } from "@/lib/utils";
import { Product, Category, Brand } from "@/types";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, categoriesRes, brandsRes] = await Promise.all([
          fetch("/api/products"),
          fetch("/api/categories"),
          fetch("/api/brands"),
        ]);
        
        const productsData = await productsRes.json();
        const categoriesData = await categoriesRes.json();
        const brandsData = await brandsRes.json();
        
        setProducts(productsData.products || []);
        setCategories(categoriesData.categories || []);
        setBrands(brandsData.brands || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Delete product
  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;
    
    setDeleting(id);
    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      if (res.ok) {
        setProducts(products.filter((p) => p.id !== id));
      } else {
        const data = await res.json();
        alert(data.error || "Failed to delete product");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Failed to delete product");
    } finally {
      setDeleting(null);
    }
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      !searchQuery ||
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      !selectedCategory || product.categoryId === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryName = (categoryId: string) => {
    return categories.find((c) => c.id === categoryId)?.name || "Unknown";
  };

  const getBrandName = (brandId: string) => {
    return brands.find((b) => b.id === brandId)?.name || "Unknown";
  };

  if (loading) {
    return (
      <AdminShell title="Products" description="Manage your product catalog">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-[#4A9EFF]" />
        </div>
      </AdminShell>
    );
  }

  return (
    <AdminShell
      title="Products"
      description="Manage your product catalog"
    >
      {/* ========== START: ADMIN SITE - PRODUCTS ACTIONS BAR ========== */}
      {/* Search input, category filter dropdown, and Add Product button */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        {/* --- START: Products - Search Input --- */}
        <div className="flex-1 flex items-center bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 py-2">
          <Search className="w-5 h-5 text-[#808080]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products..."
            className="flex-1 bg-transparent border-none outline-none text-white placeholder-[#808080] text-sm ml-2"
          />
        </div>
        {/* --- END: Products - Search Input --- */}
        {/* --- START: Products - Category Filter --- */}
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          aria-label="Filter by category"
          className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#4A9EFF]"
        >
          <option value="">All Categories</option>
          {categories
            .filter((c) => c.status === "active")
            .map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
        </select>
        {/* --- END: Products - Category Filter --- */}
        {/* --- START: Products - Add Product Button --- */}
        <Link href="/admin/products/new">
          <Button leftIcon={<Plus className="w-4 h-4" />}>Add Product</Button>
        </Link>
        {/* --- END: Products - Add Product Button --- */}
      </div>
      {/* ========== END: ADMIN SITE - PRODUCTS ACTIONS BAR ========== */}

      {/* ========== START: ADMIN SITE - PRODUCTS TABLE ========== */}
      <div className="bg-[#1a1a1a] rounded-xl border border-[#2a2a2a] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            {/* --- START: Products Table - Header Row --- */}
            <thead>
              <tr className="border-b border-[#2a2a2a]">
                <th className="text-left p-4 text-sm font-medium text-[#808080]">
                  Product
                </th>
                <th className="text-left p-4 text-sm font-medium text-[#808080]">
                  SKU
                </th>
                <th className="text-left p-4 text-sm font-medium text-[#808080]">
                  Category
                </th>
                <th className="text-left p-4 text-sm font-medium text-[#808080]">
                  Brand
                </th>
                <th className="text-left p-4 text-sm font-medium text-[#808080]">
                  Price
                </th>
                <th className="text-left p-4 text-sm font-medium text-[#808080]">
                  Stock
                </th>
                <th className="text-left p-4 text-sm font-medium text-[#808080]">
                  Status
                </th>
                <th className="text-right p-4 text-sm font-medium text-[#808080]">
                  Actions
                </th>
              </tr>
            </thead>
            {/* --- END: Products Table - Header Row --- */}
            {/* --- START: Products Table - Body Rows --- */}
            <tbody>
              {filteredProducts.map((product) => (
                <tr
                  key={product.id}
                  className="border-b border-[#2a2a2a] hover:bg-[#2a2a2a]/50 transition-colors"
                >
                  {/* --- START: Product Row - Product Info Cell --- */}
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-[#2a2a2a] rounded-lg flex items-center justify-center flex-shrink-0">
                        <Package className="w-6 h-6 text-[#808080]" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-white truncate max-w-[200px]">
                          {product.name}
                        </p>
                        <p className="text-sm text-[#808080] truncate max-w-[200px]">
                          {product.shortDescription}
                        </p>
                      </div>
                    </div>
                  </td>
                  {/* --- END: Product Row - Product Info Cell --- */}
                  <td className="p-4 text-[#B0B0B0] font-mono text-sm">
                    {product.sku}
                  </td>
                  <td className="p-4 text-[#B0B0B0]">
                    {getCategoryName(product.categoryId)}
                  </td>
                  <td className="p-4 text-[#B0B0B0]">
                    {getBrandName(product.brandId)}
                  </td>
                  {/* --- START: Product Row - Price Cell --- */}
                  <td className="p-4">
                    <div>
                      <p className="text-white font-medium price-text">
                        {formatPrice(product.discountPrice || product.basePrice)}
                      </p>
                      {product.discountPrice && (
                        <p className="text-sm text-[#808080] line-through price-text">
                          {formatPrice(product.basePrice)}
                        </p>
                      )}
                    </div>
                  </td>
                  {/* --- END: Product Row - Price Cell --- */}
                  {/* --- START: Product Row - Stock Cell --- */}
                  <td className="p-4">
                    <span
                      className={`${
                        product.stockQuantity > 10
                          ? "text-[#4caf50]"
                          : product.stockQuantity > 0
                          ? "text-[#FFA726]"
                          : "text-[#f44336]"
                      }`}
                    >
                      {product.stockQuantity}
                    </span>
                  </td>
                  {/* --- END: Product Row - Stock Cell --- */}
                  <td className="p-4">
                    <Badge
                      variant={product.status === "active" ? "success" : "default"}
                      size="sm"
                    >
                      {product.status}
                    </Badge>
                  </td>
                  {/* --- START: Product Row - Actions Cell --- */}
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/product/${product.slug}`}
                        target="_blank"
                        className="p-2 text-[#808080] hover:text-white transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      <Link
                        href={`/admin/products/${product.id}`}
                        className="p-2 text-[#808080] hover:text-[#4A9EFF] transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDelete(product.id, product.name)}
                        disabled={deleting === product.id}
                        className="p-2 text-[#808080] hover:text-[#f44336] transition-colors disabled:opacity-50"
                      >
                        {deleting === product.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </td>
                  {/* --- END: Product Row - Actions Cell --- */}
                </tr>
              ))}
            </tbody>
            {/* --- END: Products Table - Body Rows --- */}
          </table>
        </div>

        {/* --- START: Products Table - Empty State --- */}
        {filteredProducts.length === 0 && (
          <div className="p-8 text-center">
            <Package className="w-12 h-12 text-[#808080] mx-auto mb-3" />
            <p className="text-[#808080]">No products found</p>
          </div>
        )}
        {/* --- END: Products Table - Empty State --- */}
      </div>
      {/* ========== END: ADMIN SITE - PRODUCTS TABLE ========== */}

      {/* ========== START: ADMIN SITE - PRODUCTS PAGINATION ========== */}
      <div className="flex items-center justify-between mt-6">
        <p className="text-sm text-[#808080]">
          Showing {filteredProducts.length} of {products.length} products
        </p>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" disabled>
            Previous
          </Button>
          <Button variant="outline" size="sm" disabled>
            Next
          </Button>
        </div>
      </div>
      {/* ========== END: ADMIN SITE - PRODUCTS PAGINATION ========== */}
    </AdminShell>
  );
}
/* ============================================================================
   END OF FILE: ADMIN SITE - PRODUCTS PAGE
   ============================================================================ */
