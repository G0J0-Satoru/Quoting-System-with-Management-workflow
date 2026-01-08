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

// GET single quotation
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const result = await turso.execute({
      sql: "SELECT * FROM quotations WHERE id = ?",
      args: [id],
    });

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: "Quotation not found" },
        { status: 404 }
      );
    }

    const quotation = parseQuotation(result.rows[0] as Record<string, unknown>);
    return NextResponse.json({ quotation });
  } catch (error) {
    console.error("Error reading quotation:", error);
    return NextResponse.json(
      { error: "Failed to read quotation" },
      { status: 500 }
    );
  }
}

// PUT update quotation (including status changes)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Check if quotation exists
    const existing = await turso.execute({
      sql: "SELECT * FROM quotations WHERE id = ?",
      args: [id],
    });

    if (existing.rows.length === 0) {
      return NextResponse.json(
        { error: "Quotation not found" },
        { status: 404 }
      );
    }

    const currentQuotation = existing.rows[0] as Record<string, unknown>;
    const updatedAt = new Date().toISOString();

    await turso.execute({
      sql: `UPDATE quotations SET
        customerName = ?,
        customerEmail = ?,
        customerPhone = ?,
        companyName = ?,
        items = ?,
        itemCount = ?,
        subtotal = ?,
        tax = ?,
        total = ?,
        status = ?,
        notes = ?,
        updatedAt = ?,
        validUntil = ?
        WHERE id = ?`,
      args: [
        body.customerName !== undefined ? body.customerName : currentQuotation.customerName,
        body.customerEmail !== undefined ? body.customerEmail : currentQuotation.customerEmail,
        body.customerPhone !== undefined ? body.customerPhone : currentQuotation.customerPhone,
        body.companyName !== undefined ? body.companyName : currentQuotation.companyName,
        body.items !== undefined ? JSON.stringify(body.items) : currentQuotation.items,
        body.itemCount !== undefined ? body.itemCount : currentQuotation.itemCount,
        body.subtotal !== undefined ? body.subtotal : currentQuotation.subtotal,
        body.tax !== undefined ? body.tax : currentQuotation.tax,
        body.total !== undefined ? body.total : currentQuotation.total,
        body.status !== undefined ? body.status : currentQuotation.status,
        body.notes !== undefined ? body.notes : currentQuotation.notes,
        updatedAt,
        body.validUntil !== undefined ? body.validUntil : currentQuotation.validUntil,
        id,
      ],
    });

    // Fetch updated quotation
    const updated = await turso.execute({
      sql: "SELECT * FROM quotations WHERE id = ?",
      args: [id],
    });

    const quotation = parseQuotation(updated.rows[0] as Record<string, unknown>);
    return NextResponse.json({ quotation });
  } catch (error) {
    console.error("Error updating quotation:", error);
    return NextResponse.json(
      { error: "Failed to update quotation" },
      { status: 500 }
    );
  }
}

// DELETE quotation
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Check if quotation exists
    const existing = await turso.execute({
      sql: "SELECT * FROM quotations WHERE id = ?",
      args: [id],
    });

    if (existing.rows.length === 0) {
      return NextResponse.json(
        { error: "Quotation not found" },
        { status: 404 }
      );
    }

    await turso.execute({
      sql: "DELETE FROM quotations WHERE id = ?",
      args: [id],
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting quotation:", error);
    return NextResponse.json(
      { error: "Failed to delete quotation" },
      { status: 500 }
    );
  }
}
