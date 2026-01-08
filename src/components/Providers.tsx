"use client";

import React, { ReactNode } from "react";
import { CartProvider } from "@/context/CartContext";
import { QuotationProvider } from "@/context/QuotationContext";
import { ToastProvider } from "@/context/ToastContext";
import { StoreSettingsProvider } from "@/context/StoreSettingsContext";
import { Toaster } from "@/components/ui/Toaster";

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <StoreSettingsProvider>
      <CartProvider>
        <QuotationProvider>
          <ToastProvider>
            {children}
            <Toaster />
          </ToastProvider>
        </QuotationProvider>
      </CartProvider>
    </StoreSettingsProvider>
  );
}
