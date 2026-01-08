"use client";

/**
 * ============================================================================
 * MAIN SITE - ROOT LAYOUT
 * ============================================================================
 * This layout wraps all pages in the customer-facing Main Site.
 * Structure: Header → Main Content → Footer
 * ============================================================================
 */

import React from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      {/* ========== START: MAIN SITE - HEADER ========== */}
      <Header />
      {/* ========== END: MAIN SITE - HEADER ========== */}

      {/* ========== START: MAIN SITE - PAGE CONTENT AREA ========== */}
      <main className="flex-1">
        {children}
      </main>
      {/* ========== END: MAIN SITE - PAGE CONTENT AREA ========== */}

      {/* ========== START: MAIN SITE - FOOTER ========== */}
      <Footer />
      {/* ========== END: MAIN SITE - FOOTER ========== */}
    </div>
  );
}
/* ============================================================================
   END OF FILE: MAIN SITE - ROOT LAYOUT
   ============================================================================ */
