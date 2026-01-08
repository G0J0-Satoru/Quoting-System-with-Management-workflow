"use client";

import React, { useState, useEffect } from "react";
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { ToastType } from "@/types";

interface ToastItem {
  id: string;
  type: ToastType;
  message: string;
}

// Simple toast store using events
const toastListeners: Set<(toast: ToastItem) => void> = new Set();

export function showToast(type: ToastType, message: string) {
  const toast: ToastItem = {
    id: `toast-${Date.now()}`,
    type,
    message,
  };
  toastListeners.forEach((listener) => listener(toast));
}

export function Toaster() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    const listener = (toast: ToastItem) => {
      setToasts((prev) => [...prev, toast]);

      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== toast.id));
      }, 4000);
    };

    toastListeners.add(listener);
    return () => {
      toastListeners.delete(listener);
    };
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-[#4CAF50]" />,
    error: <AlertCircle className="w-5 h-5 text-[#f44336]" />,
    warning: <AlertTriangle className="w-5 h-5 text-[#FF9800]" />,
    info: <Info className="w-5 h-5 text-[#4A9EFF]" />,
  };

  const backgrounds = {
    success: "bg-[#4CAF50]/10 border-[#4CAF50]/30",
    error: "bg-[#f44336]/10 border-[#f44336]/30",
    warning: "bg-[#FF9800]/10 border-[#FF9800]/30",
    info: "bg-[#4A9EFF]/10 border-[#4A9EFF]/30",
  };

  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={cn(
            "flex items-center gap-3 px-4 py-3 rounded-lg border shadow-lg backdrop-blur-sm",
            "min-w-[300px] max-w-[400px]",
            "animate-[slideInRight_0.3s_ease-out]",
            backgrounds[toast.type]
          )}
        >
          {icons[toast.type]}
          <p className="flex-1 text-sm text-white">{toast.message}</p>
          <button
            onClick={() => removeToast(toast.id)}
            className="text-[#808080] hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
