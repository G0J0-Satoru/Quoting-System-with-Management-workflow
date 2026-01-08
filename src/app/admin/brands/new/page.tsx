"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import Link from "next/link";
import { AdminShell } from "@/components/admin/AdminShell";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function NewBrandPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    websiteUrl: "",
    status: "active" as "active" | "inactive",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch("/api/brands", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        router.push("/admin/brands");
      } else {
        const data = await res.json();
        alert(data.error || "Failed to create brand");
      }
    } catch (error) {
      console.error("Error creating brand:", error);
      alert("Failed to create brand");
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

  return (
    <AdminShell title="Add New Brand" description="Create a new product brand">
      <div className="mb-6">
        <Link href="/admin/brands">
          <Button variant="outline" leftIcon={<ArrowLeft className="w-4 h-4" />}>
            Back
          </Button>
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="max-w-2xl">
        <div className="bg-[#1a1a1a] rounded-xl border border-[#2a2a2a] p-6 space-y-4">
          <Input
            label="Brand Name *"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter brand name"
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
              placeholder="Enter brand description"
              className="w-full px-4 py-2 bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg text-white placeholder-[#808080] focus:outline-none focus:border-[#4A9EFF] resize-none"
            />
          </div>

          <Input
            label="Website URL"
            name="websiteUrl"
            type="url"
            value={formData.websiteUrl}
            onChange={handleChange}
            placeholder="https://example.com"
          />

          <div>
            <label className="block text-sm font-medium text-[#B0B0B0] mb-1">
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              aria-label="Brand status"
              className="w-full px-4 py-2 bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg text-white focus:outline-none focus:border-[#4A9EFF]"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <Link href="/admin/brands">
              <Button variant="outline" type="button">Cancel</Button>
            </Link>
            <Button
              type="submit"
              disabled={saving}
              leftIcon={saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            >
              {saving ? "Creating..." : "Create Brand"}
            </Button>
          </div>
        </div>
      </form>
    </AdminShell>
  );
}
