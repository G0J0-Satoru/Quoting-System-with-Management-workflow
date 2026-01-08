"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import Link from "next/link";
import { AdminShell } from "@/components/admin/AdminShell";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function EditCategoryPage() {
  const router = useRouter();
  const params = useParams();
  const categoryId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    displayOrder: "1",
    status: "active" as "active" | "inactive",
  });

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const res = await fetch(`/api/categories/${categoryId}`);
        if (!res.ok) {
          setNotFound(true);
          return;
        }
        const data = await res.json();
        const category = data.category;
        
        setFormData({
          name: category.name || "",
          description: category.description || "",
          displayOrder: category.displayOrder?.toString() || "1",
          status: category.status || "active",
        });
      } catch (error) {
        console.error("Error fetching category:", error);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
  }, [categoryId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch(`/api/categories/${categoryId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          displayOrder: parseInt(formData.displayOrder) || 1,
        }),
      });

      if (res.ok) {
        router.push("/admin/categories");
      } else {
        const data = await res.json();
        alert(data.error || "Failed to update category");
      }
    } catch (error) {
      console.error("Error updating category:", error);
      alert("Failed to update category");
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  if (loading) {
    return (
      <AdminShell title="Edit Category" description="Loading...">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-[#4A9EFF]" />
        </div>
      </AdminShell>
    );
  }

  if (notFound) {
    return (
      <AdminShell title="Category Not Found" description="">
        <div className="text-center py-12">
          <p className="text-[#808080] mb-4">The category you&apos;re looking for doesn&apos;t exist.</p>
          <Link href="/admin/categories">
            <Button>Back to Categories</Button>
          </Link>
        </div>
      </AdminShell>
    );
  }

  return (
    <AdminShell title="Edit Category" description="Update category information">
      <div className="mb-6">
        <Link href="/admin/categories">
          <Button variant="outline" leftIcon={<ArrowLeft className="w-4 h-4" />}>
            Back
          </Button>
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="max-w-2xl">
        <div className="bg-[#1a1a1a] rounded-xl border border-[#2a2a2a] p-6 space-y-4">
          <Input
            label="Category Name *"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter category name"
            required
          />

          <div>
            <label className="block text-sm font-medium text-[#B0B0B0] mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              placeholder="Enter category description"
              className="w-full px-4 py-2 bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg text-white placeholder-[#808080] focus:outline-none focus:border-[#4A9EFF] resize-none"
            />
          </div>

          <Input
            label="Display Order"
            name="displayOrder"
            type="number"
            min={1}
            value={formData.displayOrder}
            onChange={handleChange}
            placeholder="1"
          />

          <div>
            <label className="block text-sm font-medium text-[#B0B0B0] mb-1">
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              aria-label="Category status"
              className="w-full px-4 py-2 bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg text-white focus:outline-none focus:border-[#4A9EFF]"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <Link href="/admin/categories">
              <Button variant="outline" type="button">Cancel</Button>
            </Link>
            <Button
              type="submit"
              disabled={saving}
              leftIcon={saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            >
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </form>
    </AdminShell>
  );
}
