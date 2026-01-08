"use client";

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from "react";
import { Quotation, QuotationItem, Product, CartItem } from "@/types";
import { generateQuotationNumber } from "@/lib/utils";

interface QuotationState {
  items: QuotationItem[];
  quotations: Quotation[];
  currentQuotation: Quotation | null;
}

type QuotationAction =
  | { type: "ADD_ITEM"; payload: { product: Product; quantity: number; configuration?: Record<string, string>; configurationPrice: number } }
  | { type: "REMOVE_ITEM"; payload: string }
  | { type: "UPDATE_QUANTITY"; payload: { productId: string; quantity: number } }
  | { type: "CLEAR_ITEMS" }
  | { type: "SAVE_QUOTATION"; payload: Omit<Quotation, "id" | "quotationNumber" | "items" | "subtotal" | "tax" | "total" | "createdAt" | "updatedAt"> }
  | { type: "LOAD_QUOTATIONS"; payload: Quotation[] }
  | { type: "SET_CURRENT_QUOTATION"; payload: Quotation | null }
  | { type: "DELETE_QUOTATION"; payload: string }
  | { type: "LOAD_ITEMS"; payload: QuotationItem[] }
  | { type: "SET_ITEMS"; payload: QuotationItem[] };

const initialState: QuotationState = {
  items: [],
  quotations: [],
  currentQuotation: null,
};

function quotationReducer(state: QuotationState, action: QuotationAction): QuotationState {
  switch (action.type) {
    case "ADD_ITEM": {
      const { product, quantity, configuration, configurationPrice } = action.payload;
      const existingItemIndex = state.items.findIndex(
        (item) =>
          item.productId === product.id &&
          JSON.stringify(item.configuration) === JSON.stringify(configuration)
      );

      const unitPrice = product.discountPrice || product.basePrice;

      if (existingItemIndex > -1) {
        return {
          ...state,
          items: state.items.map((item, index) =>
            index === existingItemIndex
              ? {
                  ...item,
                  quantity: item.quantity + quantity,
                  subtotal: (item.quantity + quantity) * (unitPrice + configurationPrice),
                }
              : item
          ),
        };
      }

      const newItem: QuotationItem = {
        productId: product.id,
        productName: product.name,
        productSku: product.sku,
        quantity,
        unitPrice,
        configuration,
        configurationPrice,
        subtotal: quantity * (unitPrice + configurationPrice),
      };

      return {
        ...state,
        items: [...state.items, newItem],
      };
    }

    case "REMOVE_ITEM":
      return {
        ...state,
        items: state.items.filter((item) => item.productId !== action.payload),
      };

    case "UPDATE_QUANTITY": {
      const { productId, quantity } = action.payload;
      if (quantity <= 0) {
        return {
          ...state,
          items: state.items.filter((item) => item.productId !== productId),
        };
      }

      return {
        ...state,
        items: state.items.map((item) =>
          item.productId === productId
            ? {
                ...item,
                quantity,
                subtotal: quantity * (item.unitPrice + item.configurationPrice),
              }
            : item
        ),
      };
    }

    case "CLEAR_ITEMS":
      return { ...state, items: [] };

    case "SAVE_QUOTATION": {
      const subtotal = state.items.reduce((sum, item) => sum + item.subtotal, 0);
      const tax = 0; // Can be calculated based on business rules
      const total = subtotal + tax;

      const validUntil = new Date();
      validUntil.setDate(validUntil.getDate() + 30);

      const newQuotation: Quotation = {
        id: `quot-${Date.now()}`,
        quotationNumber: generateQuotationNumber(),
        ...action.payload,
        items: [...state.items],
        subtotal,
        tax,
        total,
        validUntil: validUntil.toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      return {
        ...state,
        quotations: [...state.quotations, newQuotation],
        items: [],
        currentQuotation: newQuotation,
      };
    }

    case "LOAD_QUOTATIONS":
      return { ...state, quotations: action.payload };

    case "SET_CURRENT_QUOTATION":
      return { ...state, currentQuotation: action.payload };

    case "DELETE_QUOTATION":
      return {
        ...state,
        quotations: state.quotations.filter((q) => q.id !== action.payload),
      };

    case "LOAD_ITEMS":
      return { ...state, items: action.payload };

    case "SET_ITEMS":
      return { ...state, items: action.payload };

    default:
      return state;
  }
}

interface QuotationContextType {
  state: QuotationState;
  addItem: (product: Product, quantity?: number, configuration?: Record<string, string>, configurationPrice?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  addItemsFromCart: (cartItems: CartItem[]) => void;
  clearItems: () => void;
  saveQuotation: (customerInfo: Omit<Quotation, "id" | "quotationNumber" | "items" | "subtotal" | "tax" | "total" | "createdAt" | "updatedAt">) => void;
  setCurrentQuotation: (quotation: Quotation | null) => void;
  deleteQuotation: (id: string) => void;
  getItemCount: () => number;
  getSubtotal: () => number;
}

const QuotationContext = createContext<QuotationContextType | undefined>(undefined);

export function QuotationProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(quotationReducer, initialState);

  // Load from localStorage on mount
  useEffect(() => {
    const savedItems = localStorage.getItem("quotationItems");
    const savedQuotations = localStorage.getItem("quotations");

    if (savedItems) {
      try {
        dispatch({ type: "LOAD_ITEMS", payload: JSON.parse(savedItems) });
      } catch (error) {
        console.error("Failed to load quotation items:", error);
      }
    }

    if (savedQuotations) {
      try {
        dispatch({ type: "LOAD_QUOTATIONS", payload: JSON.parse(savedQuotations) });
      } catch (error) {
        console.error("Failed to load quotations:", error);
      }
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("quotationItems", JSON.stringify(state.items));
  }, [state.items]);

  useEffect(() => {
    localStorage.setItem("quotations", JSON.stringify(state.quotations));
  }, [state.quotations]);

  const addItem = (
    product: Product,
    quantity: number = 1,
    configuration?: Record<string, string>,
    configurationPrice: number = 0
  ) => {
    dispatch({
      type: "ADD_ITEM",
      payload: { product, quantity, configuration, configurationPrice },
    });
  };

  const removeItem = (productId: string) => {
    dispatch({ type: "REMOVE_ITEM", payload: productId });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    dispatch({ type: "UPDATE_QUANTITY", payload: { productId, quantity } });
  };

  const clearItems = () => {
    dispatch({ type: "CLEAR_ITEMS" });
  };

  const saveQuotation = (
    customerInfo: Omit<Quotation, "id" | "quotationNumber" | "items" | "subtotal" | "tax" | "total" | "createdAt" | "updatedAt">
  ) => {
    dispatch({ type: "SAVE_QUOTATION", payload: customerInfo });
  };

  const setCurrentQuotation = (quotation: Quotation | null) => {
    dispatch({ type: "SET_CURRENT_QUOTATION", payload: quotation });
  };

  const deleteQuotation = (id: string) => {
    dispatch({ type: "DELETE_QUOTATION", payload: id });
  };

  const getItemCount = () => state.items.reduce((count, item) => count + item.quantity, 0);

  const getSubtotal = () => state.items.reduce((sum, item) => sum + item.subtotal, 0);

  const addItemsFromCart = (cartItems: CartItem[]) => {
    const quotationItems: QuotationItem[] = cartItems.map((item) => {
      const unitPrice = item.product.discountPrice || item.product.basePrice;
      return {
        productId: item.product.id,
        productName: item.product.name,
        productSku: item.product.sku,
        quantity: item.quantity,
        unitPrice,
        configuration: item.selectedConfiguration,
        configurationPrice: item.configurationPrice,
        subtotal: item.quantity * (unitPrice + item.configurationPrice),
      };
    });
    dispatch({ type: "SET_ITEMS", payload: quotationItems });
  };

  return (
    <QuotationContext.Provider
      value={{
        state,
        addItem,
        removeItem,
        updateQuantity,
        clearItems,
        saveQuotation,
        setCurrentQuotation,
        deleteQuotation,
        getItemCount,
        getSubtotal,
        addItemsFromCart,
      }}
    >
      {children}
    </QuotationContext.Provider>
  );
}

export function useQuotation() {
  const context = useContext(QuotationContext);
  if (context === undefined) {
    throw new Error("useQuotation must be used within a QuotationProvider");
  }
  return context;
}
