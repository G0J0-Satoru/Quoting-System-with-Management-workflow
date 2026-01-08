import { NextResponse } from "next/server";
import { turso } from "@/lib/turso";

// Default store settings
const defaultSettings = {
  storeName: "Computer World",
  storeEmail: "info@computerworld.lk",
  storePhone: "+94 11 234 5678",
  storeAddress: "123 Technology Street, Colombo 03, Sri Lanka",
  vatRate: "12",
  quotationValidity: "30",
  storeHours: "Mon - Sat: 9:00 AM - 7:00 PM, Sunday: 10:00 AM - 5:00 PM",
};

export async function GET() {
  try {
    const result = await turso.execute("SELECT * FROM settings WHERE id = 1");
    
    if (result.rows.length > 0) {
      const row = result.rows[0];
      return NextResponse.json({
        storeName: row.storeName || defaultSettings.storeName,
        storeEmail: row.storeEmail || defaultSettings.storeEmail,
        storePhone: row.storePhone || defaultSettings.storePhone,
        storeAddress: row.storeAddress || defaultSettings.storeAddress,
        vatRate: row.vatRate || defaultSettings.vatRate,
        quotationValidity: row.quotationValidity || defaultSettings.quotationValidity,
        storeHours: row.storeHours || defaultSettings.storeHours,
      });
    }
    
    return NextResponse.json(defaultSettings);
  } catch (error) {
    console.error("Error fetching settings:", error);
    return NextResponse.json(defaultSettings);
  }
}

export async function PUT(request: Request) {
  try {
    const settings = await request.json();
    
    // Merge with defaults to ensure all fields exist
    const mergedSettings = { ...defaultSettings, ...settings };
    
    // Use INSERT OR REPLACE to handle both insert and update
    await turso.execute({
      sql: `INSERT OR REPLACE INTO settings (id, storeName, storeEmail, storePhone, storeAddress, vatRate, quotationValidity, storeHours)
            VALUES (1, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        mergedSettings.storeName,
        mergedSettings.storeEmail,
        mergedSettings.storePhone,
        mergedSettings.storeAddress,
        mergedSettings.vatRate,
        mergedSettings.quotationValidity,
        mergedSettings.storeHours,
      ],
    });

    return NextResponse.json({ success: true, settings: mergedSettings });
  } catch (error) {
    console.error("Error saving settings:", error);
    return NextResponse.json(
      { error: "Failed to save settings" },
      { status: 500 }
    );
  }
}
