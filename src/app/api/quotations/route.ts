import { NextRequest, NextResponse } from "next/server";
import { turso } from "@/lib/turso";

interface QuotationItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}

interface Quotation {
  id: string;
  quotationNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  companyName?: string | null;
  items: QuotationItem[];
  itemCount: number;
  subtotal: number;
  tax: number;
  total: number;
  status: "draft" | "pending" | "sent" | "approved" | "rejected";
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
  validUntil: string;
}

// Helper to parse quotation from database row
function parseQuotation(row: Record<string, unknown>): Quotation {
  return {
    id: row.id as string,
    quotationNumber: row.quotationNumber as string,
    customerName: row.customerName as string,
    customerEmail: row.customerEmail as string,
    customerPhone: row.customerPhone as string,
    companyName: row.companyName as string | null,
    items: row.items ? JSON.parse(row.items as string) : [],
    itemCount: row.itemCount as number,
    subtotal: row.subtotal as number,
    tax: row.tax as number,
    total: row.total as number,
    status: row.status as Quotation["status"],
    notes: row.notes as string | null,
    createdAt: row.createdAt as string,
    updatedAt: row.updatedAt as string,
    validUntil: row.validUntil as string,
  };
}

function generateQuotationNumber(): string {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 1000000)
    .toString()
    .padStart(6, "0");
  return `QT-${year}-${random}`;
}

// GET all quotations
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    let sql = "SELECT * FROM quotations";
    const args: string[] = [];

    if (status) {
      sql += " WHERE status = ?";
      args.push(status);
    }

    sql += " ORDER BY createdAt DESC";

    const result = await turso.execute({ sql, args });
    const quotations = result.rows.map((row) =>
      parseQuotation(row as Record<string, unknown>)
    );

    return NextResponse.json({ quotations });
  } catch (error) {
    console.error("Error reading quotations:", error);
    return NextResponse.json(
      { error: "Failed to read quotations" },
      { status: 500 }
    );
  }
}

// POST create new quotation
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const now = new Date().toISOString();

    const newQuotation: Quotation = {
      id: `q_${Date.now()}`,
      quotationNumber: generateQuotationNumber(),
      customerName: body.customerName,
      customerEmail: body.customerEmail,
      customerPhone: body.customerPhone,
      companyName: body.companyName || null,
      items: body.items || [],
      itemCount: body.items?.length || 0,
      subtotal: body.subtotal || 0,
      tax: body.tax || 0,
      total: body.total || 0,
      status: "pending",
      notes: body.notes || null,
      createdAt: now,
      updatedAt: now,
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
    };

    await turso.execute({
      sql: `INSERT INTO quotations (
        id, quotationNumber, customerName, customerEmail, customerPhone,
        companyName, items, itemCount, subtotal, tax, total, status,
        notes, createdAt, updatedAt, validUntil
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        newQuotation.id,
        newQuotation.quotationNumber,
        newQuotation.customerName,
        newQuotation.customerEmail,
        newQuotation.customerPhone || null,
        newQuotation.companyName || null,
        JSON.stringify(newQuotation.items),
        newQuotation.itemCount,
        newQuotation.subtotal,
        newQuotation.tax,
        newQuotation.total,
        newQuotation.status,
        newQuotation.notes || null,
        newQuotation.createdAt,
        newQuotation.updatedAt,
        newQuotation.validUntil,
      ],
    });

    return NextResponse.json({ quotation: newQuotation }, { status: 201 });
  } catch (error) {
    console.error("Error creating quotation:", error);
    return NextResponse.json(
      { error: "Failed to create quotation" },
      { status: 500 }
    );
  }
}
