"use client";

import React, { useState } from "react";
import { Save, Store, Bell, Shield, Palette, Loader2 } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useToast } from "@/context/ToastContext";
import { useStoreSettings, StoreSettings } from "@/context/StoreSettingsContext";

export default function AdminSettingsPage() {
  const { showToast } = useToast();
  const { settings, loading: settingsLoading, updateSettings } = useStoreSettings();
  const [isLoading, setIsLoading] = useState(false);
  const [localSettings, setLocalSettings] = useState<StoreSettings | null>(null);

  // Use local settings if available, otherwise use context settings
  const storeSettings = localSettings || settings;

  const handleChange = (field: keyof StoreSettings, value: string) => {
    setLocalSettings((prev) => ({
      ...(prev || settings),
      [field]: value,
    }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    const settingsToSave = localSettings || settings;
    const success = await updateSettings(settingsToSave);
    if (success) {
      showToast("Settings saved successfully", "success");
      setLocalSettings(null); // Reset local state after save
    } else {
      showToast("Failed to save settings", "error");
    }
    setIsLoading(false);
  };

  if (settingsLoading) {
    return (
      <AdminShell title="Settings" description="Configure your store settings">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-[#4A9EFF]" />
        </div>
      </AdminShell>
    );
  }

  return (
    <AdminShell
      title="Settings"
      description="Configure your store settings"
    >
      <div className="max-w-3xl space-y-6">
        {/* Store Information */}
        <div className="bg-[#1a1a1a] rounded-xl border border-[#2a2a2a] overflow-hidden">
          <div className="p-4 border-b border-[#2a2a2a] flex items-center gap-3">
            <Store className="w-5 h-5 text-[#4A9EFF]" />
            <h2 className="font-semibold text-white">Store Information</h2>
          </div>
          <div className="p-6 space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <Input
                label="Store Name"
                value={storeSettings.storeName}
                onChange={(e) => handleChange("storeName", e.target.value)}
              />
              <Input
                label="Email Address"
                type="email"
                value={storeSettings.storeEmail}
                onChange={(e) => handleChange("storeEmail", e.target.value)}
              />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <Input
                label="Phone Number"
                value={storeSettings.storePhone}
                onChange={(e) => handleChange("storePhone", e.target.value)}
              />
              <Input
                label="VAT Rate (%)"
                type="number"
                value={storeSettings.vatRate}
                onChange={(e) => handleChange("vatRate", e.target.value)}
              />
            </div>
            <Input
              label="Store Address"
              value={storeSettings.storeAddress}
              onChange={(e) => handleChange("storeAddress", e.target.value)}
            />
            <Input
              label="Store Hours"
              value={storeSettings.storeHours}
              onChange={(e) => handleChange("storeHours", e.target.value)}
              helpText="e.g., Mon - Sat: 9:00 AM - 7:00 PM, Sunday: 10:00 AM - 5:00 PM"
            />
          </div>
        </div>

        {/* Quotation Settings */}
        <div className="bg-[#1a1a1a] rounded-xl border border-[#2a2a2a] overflow-hidden">
          <div className="p-4 border-b border-[#2a2a2a] flex items-center gap-3">
            <Shield className="w-5 h-5 text-[#FFA726]" />
            <h2 className="font-semibold text-white">Quotation Settings</h2>
          </div>
          <div className="p-6 space-y-4">
            <Input
              label="Quotation Validity (Days)"
              type="number"
              value={storeSettings.quotationValidity}
              onChange={(e) => handleChange("quotationValidity", e.target.value)}
              helpText="Number of days a quotation remains valid"
            />
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-[#1a1a1a] rounded-xl border border-[#2a2a2a] overflow-hidden">
          <div className="p-4 border-b border-[#2a2a2a] flex items-center gap-3">
            <Bell className="w-5 h-5 text-[#4caf50]" />
            <h2 className="font-semibold text-white">Notifications</h2>
          </div>
          <div className="p-6 space-y-4">
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-[#B0B0B0]">New quotation notifications</span>
              <input
                type="checkbox"
                defaultChecked
                className="w-5 h-5 rounded border-[#3a3a3a] bg-[#2a2a2a] text-[#4A9EFF] focus:ring-[#4A9EFF]"
              />
            </label>
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-[#B0B0B0]">Low stock alerts</span>
              <input
                type="checkbox"
                defaultChecked
                className="w-5 h-5 rounded border-[#3a3a3a] bg-[#2a2a2a] text-[#4A9EFF] focus:ring-[#4A9EFF]"
              />
            </label>
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-[#B0B0B0]">Daily summary email</span>
              <input
                type="checkbox"
                className="w-5 h-5 rounded border-[#3a3a3a] bg-[#2a2a2a] text-[#4A9EFF] focus:ring-[#4A9EFF]"
              />
            </label>
          </div>
        </div>

        {/* Theme */}
        <div className="bg-[#1a1a1a] rounded-xl border border-[#2a2a2a] overflow-hidden">
          <div className="p-4 border-b border-[#2a2a2a] flex items-center gap-3">
            <Palette className="w-5 h-5 text-[#9c27b0]" />
            <h2 className="font-semibold text-white">Theme</h2>
          </div>
          <div className="p-6">
            <div className="flex gap-4">
              <button className="flex-1 p-4 bg-[#1a1a1a] border-2 border-[#4A9EFF] rounded-xl text-center">
                <div className="w-full h-8 bg-[#1a1a1a] rounded mb-2 border border-[#3a3a3a]"></div>
                <span className="text-sm text-white">Dark</span>
              </button>
              <button className="flex-1 p-4 bg-[#2a2a2a] border border-[#3a3a3a] rounded-xl text-center opacity-50 cursor-not-allowed">
                <div className="w-full h-8 bg-white rounded mb-2"></div>
                <span className="text-sm text-[#808080]">Light (Coming Soon)</span>
              </button>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button
            onClick={handleSave}
            isLoading={isLoading}
            leftIcon={<Save className="w-4 h-4" />}
          >
            Save Settings
          </Button>
        </div>
      </div>
    </AdminShell>
  );
}
