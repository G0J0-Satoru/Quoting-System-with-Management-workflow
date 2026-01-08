"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

export interface StoreSettings {
  storeName: string;
  storeEmail: string;
  storePhone: string;
  storeAddress: string;
  vatRate: string;
  quotationValidity: string;
  storeHours: string;
}

interface StoreSettingsContextType {
  settings: StoreSettings;
  loading: boolean;
  updateSettings: (newSettings: StoreSettings) => Promise<boolean>;
  refreshSettings: () => Promise<void>;
}

const defaultSettings: StoreSettings = {
  storeName: "Computer World",
  storeEmail: "info@computerworld.lk",
  storePhone: "+94 11 234 5678",
  storeAddress: "123 Technology Street, Colombo 03, Sri Lanka",
  vatRate: "12",
  quotationValidity: "30",
  storeHours: "Mon - Sat: 9:00 AM - 7:00 PM, Sunday: 10:00 AM - 5:00 PM",
};

const StoreSettingsContext = createContext<StoreSettingsContextType | undefined>(undefined);

export function StoreSettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<StoreSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);

  const refreshSettings = useCallback(async () => {
    try {
      const response = await fetch("/api/settings");
      if (response.ok) {
        const data = await response.json();
        setSettings(data);
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshSettings();
  }, [refreshSettings]);

  const updateSettings = async (newSettings: StoreSettings): Promise<boolean> => {
    try {
      const response = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newSettings),
      });
      
      if (response.ok) {
        setSettings(newSettings);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error updating settings:", error);
      return false;
    }
  };

  return (
    <StoreSettingsContext.Provider value={{ settings, loading, updateSettings, refreshSettings }}>
      {children}
    </StoreSettingsContext.Provider>
  );
}

export function useStoreSettings() {
  const context = useContext(StoreSettingsContext);
  if (context === undefined) {
    throw new Error("useStoreSettings must be used within a StoreSettingsProvider");
  }
  return context;
}
