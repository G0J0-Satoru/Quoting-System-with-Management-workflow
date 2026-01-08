// Product Types
export interface Product {
  id: string;
  sku: string;
  name: string;
  slug: string;
  categoryId: string;
  brandId: string;
  basePrice: number;
  discountPrice?: number;
  stockQuantity: number;
  lowStockThreshold: number;
  status: "active" | "inactive" | "out_of_stock";
  shortDescription: string;
  fullDescription: string;
  description?: string;
  specifications: Record<string, string>;
  images: ProductImage[];
  configurationOptions?: ConfigurationOption[];
  isFeatured?: boolean;
  isNew?: boolean;
  metaTitle?: string;
  metaDescription?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductImage {
  url: string;
  isMain: boolean;
  order: number;
  alt?: string;
}

export interface ConfigurationOption {
  id: string;
  name: string;
  type: "ram" | "storage" | "accessory" | "other";
  options: ConfigurationValue[];
}

export interface ConfigurationValue {
  id: string;
  label: string;
  priceModifier: number;
  isDefault?: boolean;
}

// Category Types
export interface Category {
  id: string;
  name: string;
  slug: string;
  parentId?: string;
  iconUrl?: string;
  description?: string;
  displayOrder: number;
  status: "active" | "inactive";
  productCount?: number;
  children?: Category[];
  createdAt: string;
  updatedAt: string;
}

// Brand Types
export interface Brand {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string;
  description?: string;
  websiteUrl?: string;
  status: "active" | "inactive";
  productCount?: number;
  createdAt: string;
  updatedAt: string;
}

// Cart Types
export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  selectedConfiguration?: Record<string, string>;
  configurationPrice: number;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  itemCount: number;
}

// Quotation Types
export interface QuotationItem {
  productId: string;
  productName: string;
  productSku: string;
  quantity: number;
  unitPrice: number;
  configuration?: Record<string, string>;
  configurationPrice: number;
  subtotal: number;
}

export interface Quotation {
  id: string;
  quotationNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerCompany?: string;
  companyName?: string;
  address?: string;
  items: QuotationItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  specialNotes?: string;
  notes?: string;
  status: "draft" | "pending" | "sent" | "approved" | "rejected";
  validUntil: string;
  createdAt: string;
  updatedAt: string;
}

// Filter Types
export interface ProductFilters {
  categoryId?: string;
  brandIds?: string[];
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  specifications?: Record<string, string[]>;
  search?: string;
  sortBy?: "price_asc" | "price_desc" | "newest" | "popular" | "name_asc" | "name_desc";
  page?: number;
  limit?: number;
}

// API Response Types
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Admin Types
export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: "super_admin" | "admin";
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

// Settings Types
export interface StoreSettings {
  storeName: string;
  storeLogo?: string;
  contactEmail: string;
  contactPhone: string;
  contactAddress: string;
  currency: string;
  timezone: string;
  operatingHours: string;
}

// Toast Types
export type ToastType = "success" | "error" | "warning" | "info";

export interface Toast {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}
