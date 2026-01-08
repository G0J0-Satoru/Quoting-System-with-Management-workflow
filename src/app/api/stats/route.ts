import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const DATA_FILE = path.join(process.cwd(), "data", "products.json");
const QUOTATIONS_FILE = path.join(process.cwd(), "data", "quotations.json");

interface Product {
  id: string;
}

interface Category {
  id: string;
  status: string;
}

interface Brand {
  id: string;
  status: string;
}

interface StoreData {
  products: Product[];
  categories: Category[];
  brands: Brand[];
}

interface QuotationsData {
  quotations: Array<{ status: string }>;
}

async function readProductsData(): Promise<StoreData> {
  try {
    const data = await fs.readFile(DATA_FILE, "utf-8");
    return JSON.parse(data);
  } catch {
    return { products: [], categories: [], brands: [] };
  }
}

async function readQuotations(): Promise<QuotationsData> {
  try {
    const data = await fs.readFile(QUOTATIONS_FILE, "utf-8");
    return JSON.parse(data);
  } catch {
    return { quotations: [] };
  }
}

export async function GET() {
  try {
    // Read fresh data directly from files (no caching)
    const data = await readProductsData();
    
    const productCount = data.products?.length || 0;
    const categoryCount = data.categories?.filter((c: Category) => c.status === "active").length || 0;
    const brandCount = data.brands?.filter((b: Brand) => b.status === "active").length || 0;
    
    // Get quotations count
    const quotationsData = await readQuotations();
    const quotationCount = quotationsData.quotations?.length || 0;
    const pendingQuotationCount = quotationsData.quotations?.filter((q) => q.status === "pending").length || 0;

    // Return with no-cache headers for real-time data
    return NextResponse.json(
      {
        products: productCount,
        categories: categoryCount,
        brands: brandCount,
        quotations: quotationCount,
        pendingQuotations: pendingQuotationCount,
      },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate",
          "Pragma": "no-cache",
          "Expires": "0",
        },
      }
    );
  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
