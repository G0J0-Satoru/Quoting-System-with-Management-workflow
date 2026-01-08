import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-LK", {
    style: "currency",
    currency: "LKR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(price);
}

export function formatPriceShort(price: number): string {
  if (price >= 1000000) {
    return `LKR ${(price / 1000000).toFixed(1)}M`;
  }
  if (price >= 1000) {
    return `LKR ${(price / 1000).toFixed(0)}K`;
  }
  return formatPrice(price);
}

export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function generateQuotationNumber(): string {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, "0");
  return `QT-${year}${month}-${random}`;
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + "...";
}

export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout | null = null;

  return (...args: Parameters<T>) => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), wait);
  };
}

export function getStockStatus(quantity: number, threshold: number = 5): {
  status: "in_stock" | "low_stock" | "out_of_stock";
  label: string;
  color: string;
} {
  if (quantity <= 0) {
    return { status: "out_of_stock", label: "Out of Stock", color: "text-error" };
  }
  if (quantity <= threshold) {
    return { status: "low_stock", label: `Only ${quantity} left`, color: "text-warning" };
  }
  return { status: "in_stock", label: "In Stock", color: "text-success" };
}

export function calculateDiscount(originalPrice: number, discountPrice: number): number {
  if (!discountPrice || discountPrice >= originalPrice) return 0;
  return Math.round(((originalPrice - discountPrice) / originalPrice) * 100);
}
