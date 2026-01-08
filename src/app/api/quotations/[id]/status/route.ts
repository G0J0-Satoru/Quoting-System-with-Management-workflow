import { NextRequest, NextResponse } from "next/server";
import { turso } from "@/lib/turso";

interface QuotationItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}

// Helper function to deduct stock for approved quotations
async function deductStockForQuotation(items: QuotationItem[]) {
  for (const item of items) {
    try {
      // Get current product stock
      const result = await turso.execute({
        sql: "SELECT id, stock FROM products WHERE id = ?",
        args: [item.productId],
      });

      if (result.rows.length > 0) {
        const currentStock = Number(result.rows[0].stock) || 0;
        const newStock = Math.max(0, currentStock - item.quantity);

        // Update the product stock
        await turso.execute({
          sql: "UPDATE products SET stock = ?, updatedAt = ? WHERE id = ?",
          args: [newStock, new Date().toISOString(), item.productId],
        });

        console.log(
          `Stock deducted for product ${item.productId}: ${currentStock} -> ${newStock}`
        );
      } else {
        console.log(`Product ${item.productId} not found in database, skipping stock deduction`);
      }
    } catch (error) {
      // Log the error but don't throw - allow the quotation approval to continue
      console.error(`Error deducting stock for product ${item.productId}:`, error);
    }
  }
}

// PUT update quotation status
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status } = body;

    const validStatuses = ["draft", "pending", "sent", "approved", "rejected"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: "Invalid status" },
        { status: 400 }
      );
    }

    // Get quotation from database
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

    const quotation = existing.rows[0];
    const previousStatus = quotation.status as string;
    const items: QuotationItem[] = quotation.items 
      ? JSON.parse(quotation.items as string) 
      : [];

    // If changing to approved from a non-approved status, deduct stock
    if (status === "approved" && previousStatus !== "approved") {
      try {
        await deductStockForQuotation(items);
      } catch (stockError) {
        console.error("Stock deduction failed, continuing with approval:", stockError);
      }
    }

    // Update the quotation status in database
    const now = new Date().toISOString();
    await turso.execute({
      sql: "UPDATE quotations SET status = ?, updatedAt = ? WHERE id = ?",
      args: [status, now, id],
    });

    // Get updated quotation
    const updated = await turso.execute({
      sql: "SELECT * FROM quotations WHERE id = ?",
      args: [id],
    });

    const updatedQuotation = updated.rows[0];
    const result = {
      id: updatedQuotation.id,
      quotationNumber: updatedQuotation.quotationNumber,
      customerName: updatedQuotation.customerName,
      customerEmail: updatedQuotation.customerEmail,
      customerPhone: updatedQuotation.customerPhone,
      companyName: updatedQuotation.companyName,
      items: updatedQuotation.items ? JSON.parse(updatedQuotation.items as string) : [],
      itemCount: updatedQuotation.itemCount,
      subtotal: updatedQuotation.subtotal,
      tax: updatedQuotation.tax,
      total: updatedQuotation.total,
      status: updatedQuotation.status,
      notes: updatedQuotation.notes,
      createdAt: updatedQuotation.createdAt,
      updatedAt: updatedQuotation.updatedAt,
      validUntil: updatedQuotation.validUntil,
    };

    return NextResponse.json({ quotation: result });
  } catch (error) {
    console.error("Error updating quotation status:", error);
    return NextResponse.json(
      { error: "Failed to update quotation status" },
      { status: 500 }
    );
  }
}
