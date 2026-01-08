"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Save, Loader2, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { AdminShell } from "@/components/admin/AdminShell";
import { Button } from "@/components/ui/Button";
import { Category, Brand, Product, ProductImage } from "@/types";

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [notFound, setNotFound] = useState(false);
  const [images, setImages] = useState<ProductImage[]>([]);
  const [newImageUrl, setNewImageUrl] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    categoryId: "",
    brandId: "",
    basePrice: "",
    discountPrice: "",
    stockQuantity: "",
    shortDescription: "",
    description: "",
    specifications: {} as Record<string, string>,
    isFeatured: false,
    status: "active" as "active" | "inactive" | "out_of_stock",
  });

  const [newSpecKey, setNewSpecKey] = useState("");
  const [newSpecValue, setNewSpecValue] = useState("");

  // Fetch product data and categories/brands
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productRes, categoriesRes, brandsRes] = await Promise.all([
          fetch(`/api/products/${productId}`),
          fetch("/api/categories"),
          fetch("/api/brands"),
        ]);

        if (!productRes.ok) {
          setNotFound(true);
          setLoading(false);
          return;
        }

        const productData = await productRes.json();
        const categoriesData = await categoriesRes.json();
        const brandsData = await brandsRes.json();

        const product = productData.product as Product;
        
        setFormData({
          name: product.name || "",
          sku: product.sku || "",
          categoryId: product.categoryId || "",
          brandId: product.brandId || "",
          basePrice: (product.basePrice ?? 0).toString(),
          discountPrice: product.discountPrice?.toString() || "",
          stockQuantity: (product.stockQuantity ?? 0).toString(),
          shortDescription: product.shortDescription || "",
          description: product.description || "",
          specifications: product.specifications || {},
          isFeatured: product.isFeatured || false,
          status: product.status || "active",
        });

        // Load existing images
        setImages(product.images || []);

        setCategories(categoriesData.categories || []);
        setBrands(brandsData.brands || []);
      } catch (error) {
        console.error("Error fetching data:", error);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [productId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          basePrice: parseFloat(formData.basePrice),
          discountPrice: formData.discountPrice
            ? parseFloat(formData.discountPrice)
            : undefined,
          stockQuantity: parseInt(formData.stockQuantity),
          images: images.map((img, idx) => ({ ...img, order: idx })),
        }),
      });

      if (res.ok) {
        router.push("/admin/products");
      } else {
        const data = await res.json();
        alert(data.error || "Failed to update product");
      }
    } catch (error) {
      console.error("Error updating product:", error);
      alert("Failed to update product");
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const addSpecification = () => {
    if (newSpecKey.trim() && newSpecValue.trim()) {
      setFormData((prev) => ({
        ...prev,
        specifications: {
          ...prev.specifications,
          [newSpecKey.trim()]: newSpecValue.trim(),
        },
      }));
      setNewSpecKey("");
      setNewSpecValue("");
    }
  };

  const removeSpecification = (key: string) => {
    setFormData((prev) => {
      const newSpecs = { ...prev.specifications };
      delete newSpecs[key];
      return { ...prev, specifications: newSpecs };
    });
  };

  if (loading) {
    return (
      <AdminShell title="Edit Product" description="Loading product...">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-[#4A9EFF]" />
        </div>
      </AdminShell>
    );
  }

  if (notFound) {
    return (
      <AdminShell title="Product Not Found" description="">
        <div className="text-center py-12">
          <p className="text-[#808080] mb-4">
            The product you&apos;re looking for doesn&apos;t exist.
          </p>
          <Link href="/admin/products">
            <Button>Back to Products</Button>
          </Link>
        </div>
      </AdminShell>
    );
  }

  return (
    <AdminShell title="Edit Product" description="Update product information">
      <form onSubmit={handleSubmit}>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Link
            href="/admin/products"
            className="flex items-center gap-2 text-[#808080] hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Products
          </Link>
          <Button
            type="submit"
            disabled={saving}
            leftIcon={
              saving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )
            }
          >
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info */}
            <div className="bg-[#1a1a1a] rounded-xl border border-[#2a2a2a] p-6">
              <h2 className="text-lg font-semibold text-white mb-4">
                Basic Information
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#B0B0B0] mb-2">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Enter product name"
                    className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#4A9EFF]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#B0B0B0] mb-2">
                      SKU *
                    </label>
                    <input
                      type="text"
                      name="sku"
                      value={formData.sku}
                      onChange={handleChange}
                      required
                      placeholder="e.g., PROD-001"
                      className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg px-4 py-3 text-white font-mono focus:outline-none focus:border-[#4A9EFF]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#B0B0B0] mb-2">
                      Status
                    </label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      aria-label="Product status"
                      className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#4A9EFF]"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="out_of_stock">Out of Stock</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#B0B0B0] mb-2">
                    Short Description *
                  </label>
                  <input
                    type="text"
                    name="shortDescription"
                    value={formData.shortDescription}
                    onChange={handleChange}
                    required
                    placeholder="Brief product description"
                    className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#4A9EFF]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#B0B0B0] mb-2">
                    Full Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={5}
                    placeholder="Detailed product description"
                    className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#4A9EFF] resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Images */}
            <div className="bg-[#1a1a1a] rounded-xl border border-[#2a2a2a] p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Product Images</h2>
              <div className="space-y-4">
                {/* Add Image */}
                <div className="flex gap-3">
                  <input
                    type="url"
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    placeholder="Enter image URL (e.g., https://example.com/image.jpg)"
                    className="flex-1 px-4 py-2 bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg text-white placeholder-[#808080] focus:outline-none focus:border-[#4A9EFF]"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      if (newImageUrl.trim()) {
                        setImages([...images, { url: newImageUrl.trim(), isMain: images.length === 0, alt: formData.name || "Product image", order: images.length }]);
                        setNewImageUrl("");
                      }
                    }}
                    leftIcon={<Plus className="w-4 h-4" />}
                  >
                    Add
                  </Button>
                </div>

                {/* Image List */}
                {images.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {images.map((img, index) => (
                      <div key={index} className="relative group">
                        <div className="aspect-square rounded-lg overflow-hidden bg-[#0a0a0a] border border-[#2a2a2a]">
                          <img
                            src={img.url}
                            alt={img.alt}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect fill='%231a1a1a' width='100' height='100'/%3E%3Ctext fill='%23808080' x='50%25' y='50%25' text-anchor='middle' dy='.3em' font-size='12'%3EInvalid URL%3C/text%3E%3C/svg%3E";
                            }}
                          />
                        </div>
                        <div className="absolute top-2 right-2 flex gap-1">
                          <button
                            type="button"
                            onClick={() => setImages(images.filter((_, i) => i !== index))}
                            className="p-1 bg-red-500 rounded text-white opacity-0 group-hover:opacity-100 transition-opacity"
                            title="Remove image"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        {img.isMain && (
                          <span className="absolute bottom-2 left-2 px-2 py-1 bg-[#4A9EFF] text-white text-xs rounded">
                            Main
                          </span>
                        )}
                        {!img.isMain && (
                          <button
                            type="button"
                            onClick={() => setImages(images.map((im, i) => ({ ...im, isMain: i === index })))}
                            className="absolute bottom-2 left-2 px-2 py-1 bg-[#2a2a2a] text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            Set as Main
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                <p className="text-[#808080] text-sm">
                  Add product images by URL. The first image will be set as the main image by default.
                </p>
              </div>
            </div>

            {/* Specifications */}
            <div className="bg-[#1a1a1a] rounded-xl border border-[#2a2a2a] p-6">
              <h2 className="text-lg font-semibold text-white mb-4">
                Specifications
              </h2>

              {Object.keys(formData.specifications).length > 0 && (
                <div className="space-y-2 mb-4">
                  {Object.entries(formData.specifications).map(([key, value]) => (
                    <div
                      key={key}
                      className="flex items-center justify-between bg-[#0a0a0a] rounded-lg px-4 py-2"
                    >
                      <span className="text-[#B0B0B0]">
                        <span className="font-medium text-white">
                          {key}:
                        </span>{" "}
                        {value}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeSpecification(key)}
                        className="text-[#808080] hover:text-[#f44336]"
                        aria-label={`Remove ${key} specification`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex gap-2">
                <input
                  type="text"
                  value={newSpecKey}
                  onChange={(e) => setNewSpecKey(e.target.value)}
                  placeholder="Key (e.g., Processor)"
                  className="flex-1 bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-[#4A9EFF]"
                />
                <input
                  type="text"
                  value={newSpecValue}
                  onChange={(e) => setNewSpecValue(e.target.value)}
                  placeholder="Value (e.g., Intel i7)"
                  className="flex-1 bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-[#4A9EFF]"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addSpecification}
                  aria-label="Add specification"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Organization */}
            <div className="bg-[#1a1a1a] rounded-xl border border-[#2a2a2a] p-6">
              <h2 className="text-lg font-semibold text-white mb-4">
                Organization
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#B0B0B0] mb-2">
                    Category *
                  </label>
                  <select
                    name="categoryId"
                    value={formData.categoryId}
                    onChange={handleChange}
                    required
                    aria-label="Product category"
                    className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#4A9EFF]"
                  >
                    <option value="">Select Category</option>
                    {categories
                      .filter((c) => c.status === "active")
                      .map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#B0B0B0] mb-2">
                    Brand *
                  </label>
                  <select
                    name="brandId"
                    value={formData.brandId}
                    onChange={handleChange}
                    required
                    aria-label="Product brand"
                    className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#4A9EFF]"
                  >
                    <option value="">Select Brand</option>
                    {brands
                      .filter((b) => b.status === "active")
                      .map((brand) => (
                        <option key={brand.id} value={brand.id}>
                          {brand.name}
                        </option>
                      ))}
                  </select>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="isFeatured"
                    name="isFeatured"
                    checked={formData.isFeatured}
                    onChange={handleChange}
                    className="w-4 h-4 rounded border-[#2a2a2a] bg-[#0a0a0a] text-[#4A9EFF] focus:ring-[#4A9EFF]"
                  />
                  <label
                    htmlFor="isFeatured"
                    className="text-sm font-medium text-[#B0B0B0]"
                  >
                    Featured Product
                  </label>
                </div>
              </div>
            </div>

            {/* Pricing */}
            <div className="bg-[#1a1a1a] rounded-xl border border-[#2a2a2a] p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Pricing</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#B0B0B0] mb-2">
                    Base Price (LKR) *
                  </label>
                  <input
                    type="number"
                    name="basePrice"
                    value={formData.basePrice}
                    onChange={handleChange}
                    required
                    min="0"
                    step="0.01"
                    placeholder="Enter base price"
                    className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#4A9EFF]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#B0B0B0] mb-2">
                    Discount Price (LKR)
                  </label>
                  <input
                    type="number"
                    name="discountPrice"
                    value={formData.discountPrice}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    placeholder="Optional discount price"
                    className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#4A9EFF]"
                  />
                </div>
              </div>
            </div>

            {/* Inventory */}
            <div className="bg-[#1a1a1a] rounded-xl border border-[#2a2a2a] p-6">
              <h2 className="text-lg font-semibold text-white mb-4">
                Inventory
              </h2>
              <div>
                <label className="block text-sm font-medium text-[#B0B0B0] mb-2">
                  Stock Quantity *
                </label>
                <input
                  type="number"
                  name="stockQuantity"
                  value={formData.stockQuantity}
                  onChange={handleChange}
                  required
                  min="0"
                  placeholder="Enter stock quantity"
                  className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#4A9EFF]"
                />
              </div>
            </div>
          </div>
        </div>
      </form>
    </AdminShell>
  );
}
