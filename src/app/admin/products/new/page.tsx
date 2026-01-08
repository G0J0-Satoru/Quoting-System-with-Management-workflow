"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Loader2, Plus, Trash2 } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { showToast } from "@/components/ui/Toaster";

interface Category {
  id: string;
  name: string;
}

interface Brand {
  id: string;
  name: string;
}

interface Specification {
  key: string;
  value: string;
}

interface ProductImage {
  url: string;
  isMain: boolean;
  alt: string;
}

export default function NewProductPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [specifications, setSpecifications] = useState<Specification[]>([
    { key: "", value: "" }
  ]);
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
    lowStockThreshold: "5",
    status: "active",
    shortDescription: "",
    description: "",
    tags: "",
    isFeatured: false,
  });

  useEffect(() => {
    // Fetch categories and brands
    const fetchData = async () => {
      try {
        const [catRes, brandRes] = await Promise.all([
          fetch("/api/categories"),
          fetch("/api/brands"),
        ]);
        const catsData = await catRes.json();
        const brndsData = await brandRes.json();
        setCategories(catsData.categories || []);
        setBrands(brndsData.brands || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const addSpecification = () => {
    setSpecifications([...specifications, { key: "", value: "" }]);
  };

  const removeSpecification = (index: number) => {
    setSpecifications(specifications.filter((_, i) => i !== index));
  };

  const updateSpecification = (index: number, field: "key" | "value", value: string) => {
    const updated = [...specifications];
    updated[index][field] = value;
    setSpecifications(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Convert specifications array to object
      const specs: Record<string, string> = {};
      specifications.forEach((spec) => {
        if (spec.key.trim() && spec.value.trim()) {
          specs[spec.key.trim()] = spec.value.trim();
        }
      });

      const productData = {
        name: formData.name,
        sku: formData.sku,
        categoryId: formData.categoryId,
        brandId: formData.brandId,
        basePrice: parseFloat(formData.basePrice) || 0,
        discountPrice: formData.discountPrice ? parseFloat(formData.discountPrice) : null,
        stockQuantity: parseInt(formData.stockQuantity) || 0,
        lowStockThreshold: parseInt(formData.lowStockThreshold) || 5,
        status: formData.status,
        shortDescription: formData.shortDescription,
        description: formData.description,
        specifications: specs,
        tags: formData.tags.split(",").map((t) => t.trim()).filter(Boolean),
        isFeatured: formData.isFeatured,
        images: images.map((img, idx) => ({ ...img, order: idx })),
      };

      const response = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        throw new Error("Failed to create product");
      }

      showToast("success", "Product created successfully!");
      router.push("/admin/products");
    } catch (error) {
      console.error("Error creating product:", error);
      showToast("error", "Failed to create product");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AdminShell
      title="Add New Product"
      description="Create a new product listing"
    >
      <div className="mb-6">
        <Link href="/admin/products">
          <Button variant="outline" leftIcon={<ArrowLeft className="w-4 h-4" />}>
            Back
          </Button>
        </Link>
      </div>
      <form onSubmit={handleSubmit} className="max-w-4xl">
        <div className="space-y-6">
          {/* Basic Information */}
          <div className="bg-[#2a2a2a] rounded-xl border border-[#3a3a3a] p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Basic Information</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <Input
                label="Product Name *"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter product name"
                required
              />
              <Input
                label="SKU *"
                name="sku"
                value={formData.sku}
                onChange={handleChange}
                placeholder="e.g., PROD-001"
                required
              />
              <div>
                <label className="block text-sm font-medium text-[#B0B0B0] mb-1">
                  Category *
                </label>
                <select
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleChange}
                  required
                  aria-label="Product category"
                  className="w-full px-4 py-2 bg-[#1a1a1a] border border-[#3a3a3a] rounded-lg text-white focus:outline-none focus:border-[#4A9EFF]"
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#B0B0B0] mb-1">
                  Brand *
                </label>
                <select
                  name="brandId"
                  value={formData.brandId}
                  onChange={handleChange}
                  required
                  aria-label="Product brand"
                  className="w-full px-4 py-2 bg-[#1a1a1a] border border-[#3a3a3a] rounded-lg text-white focus:outline-none focus:border-[#4A9EFF]"
                >
                  <option value="">Select Brand</option>
                  {brands.map((brand) => (
                    <option key={brand.id} value={brand.id}>
                      {brand.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Pricing & Stock */}
          <div className="bg-[#2a2a2a] rounded-xl border border-[#3a3a3a] p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Pricing & Stock</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Input
                label="Base Price (LKR) *"
                name="basePrice"
                type="number"
                value={formData.basePrice}
                onChange={handleChange}
                placeholder="0.00"
                required
              />
              <Input
                label="Discount Price (LKR)"
                name="discountPrice"
                type="number"
                value={formData.discountPrice}
                onChange={handleChange}
                placeholder="Leave empty if no discount"
              />
              <Input
                label="Stock Quantity *"
                name="stockQuantity"
                type="number"
                value={formData.stockQuantity}
                onChange={handleChange}
                placeholder="0"
                required
              />
              <Input
                label="Low Stock Threshold"
                name="lowStockThreshold"
                type="number"
                value={formData.lowStockThreshold}
                onChange={handleChange}
                placeholder="5"
              />
            </div>
          </div>

          {/* Images */}
          <div className="bg-[#2a2a2a] rounded-xl border border-[#3a3a3a] p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Product Images</h2>
            <div className="space-y-4">
              {/* Add Image */}
              <div className="flex gap-3">
                <input
                  type="url"
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  placeholder="Enter image URL (e.g., https://example.com/image.jpg)"
                  className="flex-1 px-4 py-2 bg-[#1a1a1a] border border-[#3a3a3a] rounded-lg text-white placeholder-[#808080] focus:outline-none focus:border-[#4A9EFF]"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    if (newImageUrl.trim()) {
                      setImages([...images, { url: newImageUrl.trim(), isMain: images.length === 0, alt: formData.name || "Product image" }]);
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
                      <div className="aspect-square rounded-lg overflow-hidden bg-[#1a1a1a] border border-[#3a3a3a]">
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
                          className="absolute bottom-2 left-2 px-2 py-1 bg-[#3a3a3a] text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity"
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

          {/* Description */}
          <div className="bg-[#2a2a2a] rounded-xl border border-[#3a3a3a] p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Description</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#B0B0B0] mb-1">
                  Short Description
                </label>
                <textarea
                  name="shortDescription"
                  value={formData.shortDescription}
                  onChange={handleChange}
                  rows={2}
                  className="w-full px-4 py-2 bg-[#1a1a1a] border border-[#3a3a3a] rounded-lg text-white placeholder-[#808080] focus:outline-none focus:border-[#4A9EFF] resize-none"
                  placeholder="Brief product description (shown in product cards)"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#B0B0B0] mb-1">
                  Full Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-2 bg-[#1a1a1a] border border-[#3a3a3a] rounded-lg text-white placeholder-[#808080] focus:outline-none focus:border-[#4A9EFF] resize-none"
                  placeholder="Detailed product description"
                />
              </div>
            </div>
          </div>

          {/* Specifications */}
          <div className="bg-[#2a2a2a] rounded-xl border border-[#3a3a3a] p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">Specifications</h2>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addSpecification}
                leftIcon={<Plus className="w-4 h-4" />}
              >
                Add Spec
              </Button>
            </div>
            <div className="space-y-3">
              {specifications.map((spec, index) => (
                <div key={index} className="flex gap-3 items-start">
                  <input
                    type="text"
                    value={spec.key}
                    onChange={(e) => updateSpecification(index, "key", e.target.value)}
                    placeholder="Specification name (e.g., Processor)"
                    className="flex-1 px-4 py-2 bg-[#1a1a1a] border border-[#3a3a3a] rounded-lg text-white placeholder-[#808080] focus:outline-none focus:border-[#4A9EFF]"
                  />
                  <input
                    type="text"
                    value={spec.value}
                    onChange={(e) => updateSpecification(index, "value", e.target.value)}
                    placeholder="Value (e.g., Intel Core i7)"
                    className="flex-1 px-4 py-2 bg-[#1a1a1a] border border-[#3a3a3a] rounded-lg text-white placeholder-[#808080] focus:outline-none focus:border-[#4A9EFF]"
                  />
                  {specifications.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeSpecification(index)}
                      className="p-2 text-[#808080] hover:text-[#f44336] transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
            <p className="text-[#808080] text-sm mt-3">
              Add product specifications like processor, memory, storage, etc.
            </p>
          </div>

          {/* Additional Options */}
          <div className="bg-[#2a2a2a] rounded-xl border border-[#3a3a3a] p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Additional Options</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#B0B0B0] mb-1">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  aria-label="Product status"
                  className="w-full px-4 py-2 bg-[#1a1a1a] border border-[#3a3a3a] rounded-lg text-white focus:outline-none focus:border-[#4A9EFF]"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="out_of_stock">Out of Stock</option>
                </select>
              </div>
              <Input
                label="Tags (comma separated)"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                placeholder="gaming, laptop, rtx"
              />
            </div>
            <div className="mt-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="isFeatured"
                  checked={formData.isFeatured}
                  onChange={handleChange}
                  className="w-4 h-4 rounded border-[#3a3a3a] bg-[#1a1a1a] text-[#4A9EFF] focus:ring-[#4A9EFF]"
                />
                <span className="text-white">Featured Product</span>
              </label>
              <p className="text-[#808080] text-sm mt-1 ml-6">
                Featured products appear on the homepage
              </p>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-4">
            <Link href="/admin/products">
              <Button variant="outline" type="button">
                Cancel
              </Button>
            </Link>
            <Button
              type="submit"
              disabled={isLoading}
              leftIcon={isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            >
              {isLoading ? "Creating..." : "Create Product"}
            </Button>
          </div>
        </div>
      </form>
    </AdminShell>
  );
}
