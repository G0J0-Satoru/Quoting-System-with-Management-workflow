/** ============================================================================
 *  ADMIN SITE - DASHBOARD PAGE
 *  ============================================================================
 *  Overview page for admin portal showing stats and quick actions
 *  
 *  SECTIONS IN THIS FILE:
 *  - Stats Grid (Products, Categories, Brands, Quotations counts)
 *  - Quick Actions Grid (Add Product, Add Category, Add Brand, View Quotations)
 *  ============================================================================ */
"use client";

import React, { useState, useEffect } from "react";
import {
  Package,
  FolderTree,
  Building2,
  FileText,
  ArrowUpRight,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { AdminShell } from "@/components/admin/AdminShell";

interface Stats {
  products: number;
  categories: number;
  brands: number;
  quotations: number;
  pendingQuotations: number;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/stats");
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      label: "Total Products",
      value: stats?.products ?? 0,
      icon: Package,
      href: "/admin/products",
      color: "#4A9EFF",
    },
    {
      label: "Categories",
      value: stats?.categories ?? 0,
      icon: FolderTree,
      href: "/admin/categories",
      color: "#FFA726",
    },
    {
      label: "Brands",
      value: stats?.brands ?? 0,
      icon: Building2,
      href: "/admin/brands",
      color: "#4caf50",
    },
    {
      label: "Quotations",
      value: stats?.quotations ?? 0,
      subValue: stats?.pendingQuotations ? `${stats.pendingQuotations} pending` : undefined,
      icon: FileText,
      href: "/admin/quotations",
      color: "#9c27b0",
    },
  ];

  return (
    <AdminShell title="Dashboard" description="Welcome back! Here's an overview of your store.">
      {/* ========== START: ADMIN SITE - STATS GRID ========== */}
      {/* Dashboard statistics cards showing counts for Products, Categories, Brands, Quotations */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="bg-[#1a1a1a] rounded-xl border border-[#2a2a2a] p-5 hover:border-[#4A9EFF] transition-colors group"
          >
            {/* --- START: Stat Card - Icon --- */}
            <div className="flex items-start justify-between mb-4">
              <div 
                className="w-12 h-12 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: `${stat.color}15` }}
              >
                <stat.icon className="w-6 h-6" style={{ color: stat.color }} />
              </div>
            </div>
            {/* --- END: Stat Card - Icon --- */}
            {/* --- START: Stat Card - Value and Label --- */}
            {loading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin text-[#808080]" />
                <span className="text-[#808080]">Loading...</span>
              </div>
            ) : (
              <>
                <h3 className="text-2xl font-bold text-white mb-1">{stat.value}</h3>
                <p className="text-[#808080] text-sm flex items-center gap-1">
                  {stat.label}
                  <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </p>
                {stat.subValue && (
                  <p className="text-xs text-[#FFA726] mt-1">{stat.subValue}</p>
                )}
              </>
            )}
            {/* --- END: Stat Card - Value and Label --- */}
          </Link>
        ))}
      </div>
      {/* ========== END: ADMIN SITE - STATS GRID ========== */}

      {/* ========== START: ADMIN SITE - QUICK ACTIONS GRID ========== */}
      {/* Shortcut buttons to common admin tasks */}
      <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* --- START: Quick Action - Add Product --- */}
        <Link
          href="/admin/products/new"
          className="p-4 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl hover:border-[#4A9EFF] transition-colors text-center"
        >
          <Package className="w-8 h-8 text-[#4A9EFF] mx-auto mb-2" />
          <p className="font-medium text-white">Add Product</p>
        </Link>
        {/* --- END: Quick Action - Add Product --- */}
        {/* --- START: Quick Action - Add Category --- */}
        <Link
          href="/admin/categories/new"
          className="p-4 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl hover:border-[#4A9EFF] transition-colors text-center"
        >
          <FolderTree className="w-8 h-8 text-[#FFA726] mx-auto mb-2" />
          <p className="font-medium text-white">Add Category</p>
        </Link>
        {/* --- END: Quick Action - Add Category --- */}
        {/* --- START: Quick Action - Add Brand --- */}
        <Link
          href="/admin/brands/new"
          className="p-4 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl hover:border-[#4A9EFF] transition-colors text-center"
        >
          <Building2 className="w-8 h-8 text-[#4caf50] mx-auto mb-2" />
          <p className="font-medium text-white">Add Brand</p>
        </Link>
        {/* --- END: Quick Action - Add Brand --- */}
        {/* --- START: Quick Action - View Quotations --- */}
        <Link
          href="/admin/quotations"
          className="p-4 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl hover:border-[#4A9EFF] transition-colors text-center"
        >
          <FileText className="w-8 h-8 text-[#9c27b0] mx-auto mb-2" />
          <p className="font-medium text-white">View Quotations</p>
        </Link>
        {/* --- END: Quick Action - View Quotations --- */}
      </div>
      {/* ========== END: ADMIN SITE - QUICK ACTIONS GRID ========== */}
    </AdminShell>
  );
}
/* ============================================================================
   END OF FILE: ADMIN SITE - DASHBOARD PAGE
   ============================================================================ */
