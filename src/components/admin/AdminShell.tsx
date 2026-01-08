"use client";

/**
 * ============================================================================
 * ADMIN SITE - ADMIN SHELL COMPONENT
 * ============================================================================
 * The main layout wrapper for all Admin Site pages.
 * Contains: Sidebar (Logo, Navigation, User Info), Header, Main Content Area
 * ============================================================================
 */

import React, { useState, ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  FolderTree,
  Building2,
  FileText,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Monitor,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAdminAuth } from "@/context/AdminAuthContext";

interface AdminShellProps {
  children: ReactNode;
  title: string;
  description?: string;
}

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/categories", label: "Categories", icon: FolderTree },
  { href: "/admin/brands", label: "Brands", icon: Building2 },
  { href: "/admin/quotations", label: "Quotations", icon: FileText },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function AdminShell({ children, title, description }: AdminShellProps) {
  const pathname = usePathname();
  const { user, logout, isLoading } = useAdminAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#4A9EFF]"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* ========== START: ADMIN SITE - SIDEBAR ========== */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-[#1a1a1a] border-r border-[#2a2a2a] transform transition-transform duration-300 lg:translate-x-0 lg:static",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* --- START: Admin Sidebar - Logo Section --- */}
          <div className="p-4 border-b border-[#2a2a2a]">
            <Link href="/admin/dashboard" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[#4A9EFF] to-[#3a8eef] rounded-lg flex items-center justify-center">
                <Monitor className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-white">Computer World</h1>
                <p className="text-xs text-[#808080]">Admin Portal</p>
              </div>
            </Link>
          </div>
          {/* --- END: Admin Sidebar - Logo Section --- */}

          {/* --- START: Admin Sidebar - Navigation Menu --- */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors",
                    isActive
                      ? "bg-[#4A9EFF] text-white"
                      : "text-[#B0B0B0] hover:bg-[#2a2a2a] hover:text-white"
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
          {/* --- END: Admin Sidebar - Navigation Menu --- */}

          {/* --- START: Admin Sidebar - User Info & Logout --- */}
          <div className="p-4 border-t border-[#2a2a2a]">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-[#4A9EFF] rounded-full flex items-center justify-center text-white font-medium">
                {user.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-white truncate">{user.name}</p>
                <p className="text-xs text-[#808080] truncate">{user.email}</p>
              </div>
            </div>
            <button
              onClick={logout}
              className="w-full flex items-center gap-2 px-3 py-2 text-[#808080] hover:text-white hover:bg-[#2a2a2a] rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
          {/* --- END: Admin Sidebar - User Info & Logout --- */}
        </div>
      </aside>
      {/* ========== END: ADMIN SITE - SIDEBAR ========== */}

      {/* --- START: Admin - Mobile Sidebar Overlay --- */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      {/* --- END: Admin - Mobile Sidebar Overlay --- */}

      {/* ========== START: ADMIN SITE - MAIN CONTENT WRAPPER ========== */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* --- START: Admin Header Bar --- */}
        <header className="h-16 bg-[#1a1a1a] border-b border-[#2a2a2a] flex items-center justify-between px-4 lg:px-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 text-[#808080] hover:text-white lg:hidden"
            >
              <Menu className="w-5 h-5" />
            </button>
            
            {/* --- START: Admin Header - Breadcrumb --- */}
            <div className="hidden sm:flex items-center gap-2 text-sm">
              <Link href="/admin/dashboard" className="text-[#808080] hover:text-white">
                Admin
              </Link>
              <ChevronRight className="w-4 h-4 text-[#808080]" />
              <span className="text-white">{title}</span>
            </div>
            {/* --- END: Admin Header - Breadcrumb --- */}
          </div>

          <div className="flex items-center gap-3">
            {/* --- START: Admin Header - Mobile User Avatar --- */}
            <div className="w-8 h-8 bg-[#4A9EFF] rounded-full flex items-center justify-center text-white font-medium lg:hidden">
              {user.name.charAt(0)}
            </div>
            {/* --- END: Admin Header - Mobile User Avatar --- */}
          </div>
        </header>
        {/* --- END: Admin Header Bar --- */}

        {/* --- START: Admin Main Page Content Area --- */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {/* --- START: Admin Page Title Section --- */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-white">{title}</h1>
            {description && <p className="text-[#808080] mt-1">{description}</p>}
          </div>
          {/* --- END: Admin Page Title Section --- */}
          {children}
        </main>
        {/* --- END: Admin Main Page Content Area --- */}
      </div>
      {/* ========== END: ADMIN SITE - MAIN CONTENT WRAPPER ========== */}
    </div>
  );
}
/* ============================================================================
   END OF FILE: ADMIN SITE - ADMIN SHELL COMPONENT
   ============================================================================ */
